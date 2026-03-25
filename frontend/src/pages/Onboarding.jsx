import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineAcademicCap,
  HiOutlineCpuChip,
  HiOutlineBriefcase,
  HiOutlineDocumentCheck,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

const steps = [
  { id: 0, title: 'Educational Background', icon: HiOutlineAcademicCap, desc: 'Tell us about your education' },
  { id: 1, title: 'Current Skills', icon: HiOutlineCpuChip, desc: 'What skills do you already have?' },
  { id: 2, title: 'Certifications', icon: HiOutlineDocumentCheck, desc: 'Any certifications completed?' },
  { id: 3, title: 'Technical Knowledge', icon: HiOutlineCpuChip, desc: 'Your technical expertise level' },
  { id: 4, title: 'Past Experience', icon: HiOutlineBriefcase, desc: 'Work or project experience' },
  { id: 5, title: 'Dream Career Role', icon: HiOutlineRocketLaunch, desc: 'What role do you want?' },
  { id: 6, title: 'Known Skills for Role', icon: HiOutlineSparkles, desc: 'Skills you already have for this role' },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    education: '',
    skills: '',
    certifications: '',
    technicalKnowledge: '',
    pastExperiences: '',
    interestedRole: '',
    knownSkillsForRole: '',
  });

  const fields = [
    { key: 'education', label: 'Educational Background', placeholder: 'e.g., B.Sc. Computer Science from XYZ University (2022-2026), 12th Grade 92% in Science stream...', hint: 'Include your degree, institution, year, stream, and any relevant academic achievements.', rows: 4 },
    { key: 'skills', label: 'Current Skills', placeholder: 'e.g., Python (intermediate), HTML/CSS (beginner), Excel (advanced), basic data analysis, communication skills...', hint: 'List all skills you currently have with your proficiency level if possible.', rows: 4 },
    { key: 'certifications', label: 'Certifications Completed', placeholder: 'e.g., Google Data Analytics Certificate, Python for Everybody (Coursera), AWS Cloud Practitioner...', hint: 'List any online certifications, bootcamps, or professional courses you have completed. Write "None" if you haven\'t completed any.', rows: 3 },
    { key: 'technicalKnowledge', label: 'Technical Knowledge', placeholder: 'e.g., I know basic programming in Python, can write SQL queries, understand OOP concepts, familiar with Git...', hint: 'Describe your technical knowledge in detail — programming languages, frameworks, tools, concepts.', rows: 4 },
    { key: 'pastExperiences', label: 'Past Experience', placeholder: 'e.g., Internship at ABC Corp as data entry (3 months), freelance web projects, college hackathon winner...', hint: 'Include internships, part-time jobs, freelance work, college projects, or any relevant experience. Write "None" if you\'re a fresh graduate.', rows: 4 },
    { key: 'interestedRole', label: 'Dream Career Role', placeholder: 'e.g., Data Analyst, Full Stack Developer, Machine Learning Engineer, UI/UX Designer...', hint: 'What specific job role are you aiming for? Be as specific as possible.', rows: 2 },
    { key: 'knownSkillsForRole', label: 'Skills You Already Know for This Role', placeholder: 'e.g., For Data Analyst: I know Python basics, SQL queries, and Excel. I don\'t know Tableau, Statistics, or Machine Learning yet...', hint: 'Based on your interested role, list which related skills you already have and which you think you\'re missing.', rows: 4 },
  ];

  const currentField = fields[current];
  const progress = ((current + 1) / steps.length) * 100;

  const canProceed = form[currentField.key].trim().length > 10;

  const goNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    }
  };

  const goBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/onboarding/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      // Store analysis in localStorage for the report page
      localStorage.setItem('analysisResult', JSON.stringify(data.analysis));
      navigate('/gap-report');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Left - Progress */}
        <div className="onboarding-sidebar">
          <div className="sidebar-logo" style={{ paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <img src="/logo.jpg" alt="Logo" className="sidebar-logo-icon" style={{ padding: 0, objectFit: 'cover' }} />
            <div>
              <h2>Skill Bridge</h2>
              <span>Profile Setup</span>
            </div>
          </div>

          <div style={{ padding: '24px 0' }}>
            {steps.map((step, i) => (
              <div
                key={step.id}
                onClick={() => { if (i <= current) setCurrent(i); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                  borderRadius: 8, marginBottom: 4, cursor: i <= current ? 'pointer' : 'default',
                  background: i === current ? 'rgba(67,97,238,0.2)' : 'transparent',
                  opacity: i > current ? 0.4 : 1,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i < current ? '#06d6a0' : i === current ? '#4361ee' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', color: '#fff', fontWeight: 700, flexShrink: 0,
                }}>
                  {i < current ? <HiOutlineCheckCircle /> : i + 1}
                </div>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: i === current ? 600 : 400, color: '#fff' }}>{step.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div className="onboarding-main">
          {/* Progress bar */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Step {current + 1} of {steps.length}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4361ee' }}>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* Step Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(67,97,238,0.08)', color: '#4361ee',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
            }}>
              {(() => { const Icon = steps[current].icon; return <Icon />; })()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{currentField.label}</h2>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{currentField.hint}</p>
            </div>
          </div>

          {/* Input */}
          <div style={{ marginTop: 24 }}>
            <textarea
              value={form[currentField.key]}
              onChange={(e) => setForm({ ...form, [currentField.key]: e.target.value })}
              placeholder={currentField.placeholder}
              rows={currentField.rows || 4}
              style={{
                width: '100%', padding: '16px 18px', borderRadius: 12, background: '#f1f3f9',
                fontSize: '0.92rem', color: '#1a1d2e', resize: 'vertical', lineHeight: 1.7,
                border: '2px solid transparent', transition: 'all 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4361ee'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
              autoFocus
            />
            <div style={{ fontSize: '0.75rem', color: canProceed ? '#06d6a0' : '#9ca3af', marginTop: 8 }}>
              {canProceed ? '✓ Good enough to proceed' : 'Please provide a detailed response (at least 10 characters)'}
            </div>
          </div>

          {error && <div className="auth-error" style={{ marginTop: 16 }}>{error}</div>}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button
              className="btn btn-secondary"
              onClick={goBack}
              disabled={current === 0}
              style={{ opacity: current === 0 ? 0.4 : 1 }}
            >
              <HiOutlineArrowLeft /> Back
            </button>

            {current < steps.length - 1 ? (
              <button className="btn btn-primary" onClick={goNext} disabled={!canProceed} style={{ opacity: canProceed ? 1 : 0.5 }}>
                Continue <HiOutlineArrowRight />
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={!canProceed || loading} style={{ opacity: canProceed && !loading ? 1 : 0.5 }}>
                {loading ? (
                  <>
                    <span className="spinner"></span> AI is Analyzing...
                  </>
                ) : (
                  <>
                    <HiOutlineSparkles /> Analyze with AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
