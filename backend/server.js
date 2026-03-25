import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import admin from 'firebase-admin';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge_secret';

// ---- Firebase Admin Setup ----
let db = null;
try {
  let serviceAccount = null;

  // Cloud Support: Check environment variable first (Base64 encoded JSON recommended)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii'));
  } 
  // Cloud Support: Raw JSON string
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } 
  // Local Dev Support: File
  else if (fs.existsSync('./firebase-service-account.json')) {
    serviceAccount = JSON.parse(fs.readFileSync('./firebase-service-account.json', 'utf8'));
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('✅ Firebase Admin SDK initialized successfully with Firestore');
  } else {
    console.warn('⚠️ WARNING: Firebase credentials not found!');
    console.warn('⚠️ Provide FIREBASE_SERVICE_ACCOUNT env var OR create firebase-service-account.json locally');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase:', error.message);
}

// Helper to check if DB is ready
const checkDb = (req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not configured. Please add firebase-service-account.json' });
  }
  next();
};

// ---- Gemini AI Setup ----
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// ---- Auth Middleware ----
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ===================== AUTH ROUTES =====================

// Register
app.post('/api/auth/register', checkDb, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if email exists
    const usersRef = db.collection('users');
    const q = await usersRef.where('email', '==', email).limit(1).get();
    if (!q.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const userDoc = usersRef.doc();
    const user = { id: userDoc.id, name, email, password: hashed, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    
    await userDoc.set(user);
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', checkDb, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usersRef = db.collection('users');
    const q = await usersRef.where('email', '==', email).limit(1).get();
    
    if (q.empty) return res.status(400).json({ error: 'Invalid credentials' });
    
    const user = q.docs[0].data();
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===================== ONBOARDING + GEMINI =====================

// Save onboarding profile and get Gemini gap analysis
app.post('/api/onboarding/analyze', [authMiddleware, checkDb], async (req, res) => {
  try {
    const {
      education,
      skills,
      certifications,
      technicalKnowledge,
      pastExperiences,
      interestedRole,
      knownSkillsForRole,
    } = req.body;

    // Build prompt for Gemini
    const prompt = `You are an expert career counselor and industry analyst. A user has provided their profile and wants to know the gap between their current skills and the requirements for their dream job role.

## User Profile:
- **Educational Background:** ${education}
- **Current Skills:** ${skills}
- **Certifications Completed:** ${certifications}
- **Technical Knowledge:** ${technicalKnowledge}
- **Past Experiences:** ${pastExperiences}
- **Interested Job Role:** ${interestedRole}
- **Skills Already Known Related to This Role:** ${knownSkillsForRole}

## Your Task:
Provide a comprehensive JSON response with the following structure (respond ONLY with valid JSON, no markdown):
{
  "gapAnalysisReport": {
    "overallReadiness": "<percentage 0-100>",
    "summary": "<2-3 sentence summary of where the user stands>",
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
    "keyGaps": ["<gap 1>", "<gap 2>", ...]
  },
  "requiredSkills": [
    {
      "skill": "<skill name>",
      "category": "<Technical/Soft/Tool>",
      "importance": "<Critical/Important/Nice to Have>",
      "userHasIt": <true/false>,
      "description": "<why this skill matters>"
    }
  ],
  "requiredCertifications": [
    {
      "name": "<certification name>",
      "provider": "<issuing organization>",
      "importance": "<Critical/Recommended/Optional>",
      "userHasIt": <true/false>
    }
  ],
  "recommendedCourses": [
    {
      "title": "<course title>",
      "platform": "<Coursera/Udemy/edX/etc>",
      "skill": "<which skill it addresses>",
      "level": "<Beginner/Intermediate/Advanced>",
      "estimatedDuration": "<e.g., 4 weeks>"
    }
  ],
  "learningRoadmap": [
    {
      "phase": <number>,
      "title": "<phase title>",
      "duration": "<estimated duration>",
      "items": ["<learning item 1>", "<learning item 2>"]
    }
  ],
  "jobMarketInsights": {
    "demandLevel": "<High/Medium/Low>",
    "averageSalary": "<salary range>",
    "topCompanies": ["<company 1>", "<company 2>"],
    "growthOutlook": "<description>"
  }
}

Be realistic, specific, and base your analysis on current real-world industry requirements for the "${interestedRole}" role. Include at least 8-10 required skills, 3-5 certifications, and 5-8 courses.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(responseText);
      }
    } catch (parseErr) {
      analysis = { rawResponse: responseText, parseError: true };
    }

    // Store the profile in Firestore
    const profileData = {
      userId: req.userId,
      education, skills, certifications, technicalKnowledge,
      pastExperiences, interestedRole, knownSkillsForRole,
      analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
      analysis: analysis
    };
    
    await db.collection('profiles').doc(req.userId).set(profileData, { merge: true });

    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Gemini/Firebase error:', err);
    res.status(500).json({ error: 'Failed to analyze profile or save to database.' });
  }
});

// Get user profile and analysis
app.get('/api/profile', [authMiddleware, checkDb], async (req, res) => {
  try {
    const doc = await db.collection('profiles').doc(req.userId).get();
    if (!doc.exists) {
      return res.json({ profile: null });
    }
    res.json({ profile: doc.data() });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Save skill self-assessment (after analysis)
app.post('/api/skills/assess', [authMiddleware, checkDb], async (req, res) => {
  try {
    const { skillAssessment } = req.body; // { skillName: true/false, ... }
    
    const docRef = db.collection('profiles').doc(req.userId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(400).json({ error: 'Complete onboarding first' });
    }
    
    await docRef.update({
      skillAssessment: skillAssessment,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Skill assessment error:', err);
    res.status(500).json({ error: 'Server error saving assessment' });
  }
});

// AI Chat endpoint
app.post('/api/chat', [authMiddleware, checkDb], async (req, res) => {
  try {
    const { message } = req.body;
    
    const doc = await db.collection('profiles').doc(req.userId).get();
    const profile = doc.exists ? doc.data() : null;
    
    const context = profile
      ? `The user is interested in becoming a ${profile.interestedRole}. Their background: ${profile.education}. Known skills: ${profile.skills}.`
      : 'The user has not completed their profile yet.';

    const prompt = `You are an AI career assistant for Skill Bridge platform. ${context}

User asks: "${message}"

Respond helpfully, concisely, and specifically about career guidance, skills, and learning paths. Keep response under 200 words.`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'AI chat failed' });
  }
});

// ===================== CAREER TRAINER =====================

// Generate AI roadmap based on target company/role and user profile
app.post('/api/career-trainer/generate', [authMiddleware, checkDb], async (req, res) => {
  try {
    const {
      targetCompany,
      targetRole,
      skillLevel,
      linkedInUrl,
      currentSkills,
      experience,
      education,
      certifications,
      projects,
    } = req.body;

    const prompt = `You are an expert career coach and technical hiring manager. A user wants to get a job as "${targetRole}" at "${targetCompany}".

## User Profile:
- **Current Skills:** ${currentSkills || 'Not specified'}
- **Experience:** ${experience || 'Not specified'}
- **Education:** ${education || 'Not specified'}
- **Certifications:** ${certifications || 'None'}
- **Projects:** ${projects || 'None'}
- **Skill Level:** ${skillLevel}
- **LinkedIn URL:** ${linkedInUrl || 'Not provided'}

## Your Task:
Generate a comprehensive career preparation plan. Respond ONLY with valid JSON (no markdown, no code blocks), structured exactly as:
{
  "skillGapAnalysis": {
    "overallReadiness": <number 0-100>,
    "summary": "<2-3 sentence assessment>",
    "skillsUserHas": ["<skill>", ...],
    "skillsToLearn": ["<skill>", ...],
    "missingCriticalSkills": ["<skill>", ...]
  },
  "roadmap": [
    {
      "phase": 1,
      "title": "Fundamentals",
      "duration": "<e.g. 2 weeks>",
      "description": "<brief description>",
      "courses": [{"name": "<name>", "platform": "<platform>", "url": "<optional url>", "duration": "<e.g. 10 hours>"}],
      "projects": [{"name": "<project name>", "description": "<what to build>"}],
      "practiceProblems": ["<problem/topic>"],
      "interviewQuestions": ["<question>"]
    },
    {
      "phase": 2,
      "title": "Core Technical Skills",
      "duration": "<duration>",
      "description": "<brief description>",
      "courses": [{"name": "<name>", "platform": "<platform>", "url": "", "duration": ""}],
      "projects": [{"name": "<name>", "description": "<desc>"}],
      "practiceProblems": ["<topic>"],
      "interviewQuestions": ["<question>"]
    },
    {
      "phase": 3,
      "title": "Advanced Topics",
      "duration": "<duration>",
      "description": "<brief description>",
      "courses": [{"name": "<name>", "platform": "<platform>", "url": "", "duration": ""}],
      "projects": [{"name": "<name>", "description": "<desc>"}],
      "practiceProblems": ["<topic>"],
      "interviewQuestions": ["<question>"]
    },
    {
      "phase": 4,
      "title": "${targetCompany}-Specific Interview Prep",
      "duration": "<duration>",
      "description": "<brief description>",
      "courses": [{"name": "<name>", "platform": "<platform>", "url": "", "duration": ""}],
      "projects": [{"name": "<name>", "description": "<desc>"}],
      "practiceProblems": ["<topic>"],
      "interviewQuestions": ["<real ${targetCompany} interview question>"]
    },
    {
      "phase": 5,
      "title": "Mock Interviews & Final Practice",
      "duration": "<duration>",
      "description": "<brief description>",
      "courses": [{"name": "<name>", "platform": "<platform>", "url": "", "duration": ""}],
      "projects": [{"name": "<name>", "description": "<desc>"}],
      "practiceProblems": ["<topic>"],
      "interviewQuestions": ["<behavioral/system design question>"]
    }
  ],
  "resumeTips": [
    "<specific resume improvement tip based on user's background and ${targetRole} at ${targetCompany}>"
  ],
  "totalTimeline": "<total estimated weeks/months to be job-ready>",
  "companyCulture": "<2-3 sentences on ${targetCompany}'s culture and what they look for>"
}

Be specific to ${targetCompany} and ${targetRole}. Include real course names from Coursera/Udemy/LeetCode/YouTube. Include at least 3-4 courses per phase, 2-3 projects per phase, 4-5 practice topics, 3-4 interview questions per phase. Make the advice actionable and realistic.`;

    // Retry up to 3 times for 429 rate-limit errors
    let responseText;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break; // success
      } catch (aiErr) {
        const is429 = aiErr?.status === 429 || aiErr?.message?.includes('429') || aiErr?.message?.includes('Too Many Requests');
        if (is429 && attempt < 3) {
          const waitMs = attempt * 30000; // 30s, 60s
          console.log(`⏳ Gemini 429 rate limit hit. Retrying in ${waitMs / 1000}s (attempt ${attempt}/3)...`);
          await new Promise(r => setTimeout(r, waitMs));
        } else if (is429) {
          return res.status(429).json({ error: 'The AI service is temporarily busy due to high demand. Please wait 1-2 minutes and try again.' });
        } else {
          throw aiErr;
        }
      }
    }

    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON. Please try again.' });
    }

    // Auto-save to Firestore
    await db.collection('careerTrainer').doc(req.userId).set({
      userId: req.userId,
      targetCompany,
      targetRole,
      skillLevel,
      linkedInUrl: linkedInUrl || '',
      currentSkills,
      experience,
      education,
      certifications,
      projects,
      analysis,
      progress: {},
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Career trainer generate error:', err);
    res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
});

// Get saved career trainer data
app.get('/api/career-trainer/progress', [authMiddleware, checkDb], async (req, res) => {
  try {
    const doc = await db.collection('careerTrainer').doc(req.userId).get();
    if (!doc.exists) return res.json({ data: null });
    res.json({ data: doc.data() });
  } catch (err) {
    console.error('Career trainer fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch career trainer data.' });
  }
});

// Update progress (checked items)
app.post('/api/career-trainer/progress', [authMiddleware, checkDb], async (req, res) => {
  try {
    const { progress } = req.body; // { 'phase1-course-0': true, 'phase2-project-1': true, ... }
    await db.collection('careerTrainer').doc(req.userId).update({
      progress,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Career trainer progress update error:', err);
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

// ===================== AI CAREER EXAM ROUTES =====================

const generateWithRetry = async (promptConfig, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(promptConfig);
      return result;
    } catch (aiErr) {
      const is429 = aiErr?.status === 429 || aiErr?.message?.includes('429') || aiErr?.message?.includes('Too Many Requests');
      if (is429 && attempt < maxRetries) {
        const waitMs = attempt * 5000; // wait 5s, 10s
        console.log(`⏳ Gemini 429 rate limit hit. Retrying in ${waitMs / 1000}s (attempt ${attempt}/${maxRetries})...`);
        await new Promise(r => setTimeout(r, waitMs));
      } else {
        throw aiErr;
      }
    }
  }
};

const parseAIResponse = (text) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse AI response manually', err);
    throw new Error('Invalid JSON structure from AI');
  }
};

const fallbackSkills = {
  categories: [
    {
      category: 'Core Fundamentals',
      skills: [
        { name: 'Problem Solving', description: 'Breaking down complex tasks' },
        { name: 'Communication', description: 'Writing and articulating ideas clearly' },
        { name: 'Version Control (Git)', description: 'Managing code history effectively' },
        { name: 'Agile Methodologies', description: 'Working in collaborative sprints' }
      ]
    },
    {
      category: 'Technical Knowledge',
      skills: [
        { name: 'Programming Basics', description: 'Understanding variables, loops, types' },
        { name: 'System Design', description: 'Basic architecture concepts' },
        { name: 'Database Fundamentals', description: 'Understanding SQL and NoSQL' },
        { name: 'API Integration', description: 'Connecting microservices' }
      ]
    }
  ]
};

const fallbackExam = {
  Easy: [
    { q: "Which tool is commonly used for version control?", options: ["Git", "Photoshop", "Excel", "Word"], answer: 0 },
    { q: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Apple Product Interface", "Automated Process Interaction"], answer: 0 },
    { q: "Which of the following is an agile framework?", options: ["Waterfall", "Scrum", "V-Model", "Spiral"], answer: 1 },
    { q: "What is the primary function of a database?", options: ["Design UI", "Store and retrieve data", "Compile code", "Run tests"], answer: 1 },
    { q: "What is a loop used for in programming?", options: ["Styling elements", "Repeating a block of code", "Creating variables", "Deleting files"], answer: 1 }
  ],
  Medium: [
    { q: "What does 'SOLID' stand for in software design?", options: ["Simple, Open, Logical, Independent, Direct", "Single Responsibility, Open-Closed, Liskov, Interface, Dependency", "Secure, Organized, Lightweight, Integrated, Dynamic", "Systematic, Optimized, Linked, Indexed, Distributed"], answer: 1 },
    { q: "Which HTTP method is typically used to create a new resource?", options: ["GET", "PUT", "POST", "DELETE"], answer: 2 },
    { q: "What is the purpose of a load balancer?", options: ["Compile code faster", "Distribute network traffic", "Encrypt data", "Format disks"], answer: 1 },
    { q: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Tree", "Graph"], answer: 1 },
    { q: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Code Inspection / Code Delivery", "Centralized Information / Centralized Data", "Compiled Instructions / Computed Data"], answer: 0 }
  ],
  Hard: [
    { q: "What is the time complexity of a binary search?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: 2 },
    { q: "Which pattern restricts the instantiation of a class to a single instance?", options: ["Factory", "Observer", "Singleton", "Decorator"], answer: 2 },
    { q: "What is a 'deadlock' in concurrent programming?", options: ["When a thread crashes", "When two or more threads wait indefinitely for each other", "When memory is exhausted", "When CPU usage hits 100%"], answer: 1 },
    { q: "In the context of databases, what does ACID stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Computation, Indexing, Data", "Automated, Centralized, Integrated, Distributed", "Always Complete In Database"], answer: 0 },
    { q: "What is the primary purpose of a reverse proxy?", options: ["Connect to databases directly", "Protect and distribute load to internal servers", "Compile JavaScript", "Render HTML"], answer: 1 }
  ]
};

const fallbackRoadmap = [
  {
    stage: 1,
    title: 'Core Fundamentals Recovery',
    status: 'in-progress',
    skills: [
      { name: 'Review Basic Concepts', status: 'in-progress', duration: '1 week' },
      { name: 'Practice Standard Algorithms', status: 'locked', duration: '2 weeks' },
      { name: 'Version Control Mastery', status: 'locked', duration: '1 week' }
    ]
  },
  {
    stage: 2,
    title: 'Intermediate Concepts',
    status: 'locked',
    skills: [
      { name: 'API Design & Integration', status: 'locked', duration: '2 weeks' },
      { name: 'Database Optimization', status: 'locked', duration: '2 weeks' },
      { name: 'System Architecture', status: 'locked', duration: '3 weeks' }
    ]
  },
  {
    stage: 3,
    title: 'Advanced Implementation',
    status: 'locked',
    skills: [
      { name: 'Design Patterns', status: 'locked', duration: '2 weeks' },
      { name: 'Concurrency & Scaling', status: 'locked', duration: '2 weeks' },
      { name: 'Security Best Practices', status: 'locked', duration: '1 week' }
    ]
  },
  {
    stage: 4,
    title: 'Industry Readiness',
    status: 'locked',
    skills: [
      { name: 'Mock Interviews', status: 'locked', duration: '2 weeks' },
      { name: 'Portfolio Development', status: 'locked', duration: 'Ongoing' },
      { name: 'Final Project', status: 'locked', duration: '3 weeks' }
    ]
  }
];

// Generate skills based on selected role
app.post('/api/skills/for-role', [authMiddleware, checkDb], async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const prompt = `You are a technical career expert. A user wants to pursue the role of "${role}".
Respond exactly with a JSON object representing 4 essential skill categories for this role, with 4 skills in each category.
Structure:
{
  "categories": [
    {
      "category": "Category Name",
      "skills": [
        { "name": "Skill 1", "description": "Short description" }
      ]
    }
  ]
}`;

    const result = await generateWithRetry({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const data = parseAIResponse(result.response.text());
    res.json({ success: true, categories: data.categories });
  } catch (err) {
    console.log('API rate limit reached. Using fallback skills data.');
    res.json({ success: true, categories: fallbackSkills.categories, isFallback: true });
  }
});

// Generate 3-level exam
app.post('/api/exam/generate', [authMiddleware, checkDb], async (req, res) => {
  try {
    const { role, knownSkills } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const skillsText = knownSkills && knownSkills.length > 0 ? knownSkills.join(', ') : 'None specified';
    const prompt = `You are an expert exam creator for the role of "${role}". The user claims to know the following skills: ${skillsText}.
Create a 3-level multiple choice test (Easy, Medium, Hard) to evaluate their knowledge, heavily focused on this role and their known skills. 5 questions per difficulty level.
Respond exactly with a JSON object.
Structure:
{
  "Easy": [
    { "q": "Question text?", "options": ["A", "B", "C", "D"], "answer": <index of correct option 0-3> }
  ],
  "Medium": [ ... ],
  "Hard": [ ... ]
}`;

    const result = await generateWithRetry({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const data = parseAIResponse(result.response.text());
    res.json({ success: true, exam: data });
  } catch (err) {
    console.log('API rate limit reached. Using fallback exam data.');
    res.json({ success: true, exam: fallbackExam, isFallback: true });
  }
});

// Generate personalized roadmap based on exam results
app.post('/api/roadmap/generate-from-exam', [authMiddleware, checkDb], async (req, res) => {
  try {
    const { role, examResults } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });
    
    const incorrectQs = (examResults || [])
      .filter(r => r.selected !== r.correct)
      .map(r => r.q);

    const weaknesses = incorrectQs.length > 0 ? incorrectQs.map(q => "- " + q).join('\\n') : "None detected!";

    const prompt = `You are a technical career mentor. The user wants to be a "${role}".
They took an assessment. They answered the following underlying concepts incorrectly:
${weaknesses}

Create a personalized 4-stage learning roadmap focused on addressing these specific weaknesses.
Respond exactly with a valid JSON array of stage objects.
Structure:
[
  {
    "stage": 1,
    "title": "Stage Title",
    "status": "in-progress",
    "skills": [
      { "name": "Topic to study", "status": "locked", "duration": "1 week" }
    ]
  }
]
Use "completed" for topics they already seem strong in, "in-progress" for the first weak topic, and "locked" for subsequent stages. Ensure exactly 4 stages, with exactly 3 skills per stage.`;

    const result = await generateWithRetry({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const data = parseAIResponse(result.response.text());
    res.json({ success: true, roadmap: data });
  } catch (err) {
    console.log('API rate limit reached. Using fallback roadmap data.');
    res.json({ success: true, roadmap: fallbackRoadmap, isFallback: true });
  }
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`\n🚀 Skill Bridge Backend running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints ready\n`);
  if (!db) {
    console.log(`⚠️  NOTE: Database is NOT connected. APIs will return 500 until firebase-service-account.json is added.`);
  }
});
