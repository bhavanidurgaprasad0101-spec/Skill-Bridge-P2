import { useState, useEffect, useRef } from 'react';
import { HiOutlineDocumentText, HiOutlinePlus, HiOutlineTrash, HiOutlineArrowDownTray } from 'react-icons/hi2';
import html2pdf from 'html2pdf.js';

const initialResume = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, KA',
  summary: 'Aspiring Data Analyst with strong proficiency in Python, SQL, and data visualization tools. Completed multiple industry-relevant projects including sales dashboard analysis and customer segmentation.',
  skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'Excel', 'Statistics', 'Data Visualization', 'Git', 'Jupyter'],
  education: [
    { degree: 'B.Sc. Computer Science', school: 'State University', year: '2022 - 2026' },
  ],
  projects: [
    { title: 'Sales Dashboard Analysis', description: 'Built an interactive dashboard using Python and Tableau to visualize retail KPIs. Cleaned and analyzed 50K+ records.', tech: 'Python, Pandas, Tableau' },
    { title: 'Customer Segmentation', description: 'Applied K-Means clustering on customer data to identify 4 key segments for targeted marketing.', tech: 'Python, Scikit-learn, Matplotlib' },
  ],
  certifications: ['Skill Bridge Data Analyst Certificate', 'Python for Data Science — Skill Bridge'],
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState(initialResume);
  const [newSkill, setNewSkill] = useState('');
  const resumeRef = useRef(null);

  useEffect(() => {
    // Attempt to load user data from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      const storedAnalysis = localStorage.getItem('analysisResult');
      
      let updatedResume = { ...initialResume };
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        updatedResume.name = user.name || updatedResume.name;
        updatedResume.email = user.email || updatedResume.email;
      }

      if (storedAnalysis) {
        const analysis = JSON.parse(storedAnalysis);
        if (analysis.profileData) {
          updatedResume.summary = `Aspiring ${analysis.profileData.dreamRole || 'Professional'} with a background in ${analysis.profileData.education || 'related fields'}.`;
          
          if (analysis.profileData.skills) {
             const knownSkills = analysis.profileData.skills.split(',').map(s => s.trim()).filter(s => s);
             if (knownSkills.length > 0) updatedResume.skills = knownSkills;
          }
          if (analysis.profileData.experience) {
              updatedResume.projects = [{ 
                  title: 'Past Experience', 
                  description: analysis.profileData.experience, 
                  tech: 'Various' 
              }];
          }
        }
      }
      
      setResume(updatedResume);
    } catch (e) {
      console.error("Error loading user data for resume:", e);
    }
  }, []);

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const addSkill = () => {
    if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
      setResume({ ...resume, skills: [...resume.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setResume({ ...resume, skills: resume.skills.filter((s) => s !== skill) });
  };

  const updateField = (field, value) => {
    setResume({ ...resume, [field]: value });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Resume Builder</h2>
          <p>Generate a professional resume with your completed projects and skills.</p>
        </div>
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          <HiOutlineArrowDownTray /> Download PDF
        </button>
      </div>

      <div className="grid-2">
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Personal Info */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Personal Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {['name', 'email', 'phone', 'location'].map((f) => (
                <div key={f}>
                  <label style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>{f}</label>
                  <input
                    value={resume[f]}
                    onChange={(e) => updateField(f, e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: '#f1f3f9', fontSize: '0.88rem', color: '#1a1d2e' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Professional Summary</div>
            <textarea
              value={resume.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: '#f1f3f9', fontSize: '0.88rem', color: '#1a1d2e', resize: 'vertical' }}
            />
          </div>

          {/* Skills */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Skills</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {resume.skills.map((s) => (
                <span key={s} className="badge-tag blue" style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>
                  {s} ✕
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill..."
                style={{ flex: 1, padding: '8px 14px', borderRadius: 8, background: '#f1f3f9', fontSize: '0.85rem', color: '#1a1d2e' }}
              />
              <button className="btn btn-primary btn-sm" onClick={addSkill}><HiOutlinePlus /></button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* This wrapper is the target for html2pdf */}
          <div ref={resumeRef} style={{ background: '#fff', width: '100%', height: '100%' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #4361ee, #7209b7)', padding: '28px 28px 20px', color: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{resume.name}</h2>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.82rem', marginTop: 8, opacity: 0.9 }}>
              <span>📧 {resume.email}</span>
              <span>📱 {resume.phone}</span>
              <span>📍 {resume.location}</span>
            </div>
          </div>
          <div style={{ padding: 28 }}>
            {/* Summary */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, color: '#4361ee', fontWeight: 700, marginBottom: 8 }}>
                Professional Summary
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#6b7280', lineHeight: 1.7 }}>{resume.summary}</p>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, color: '#4361ee', fontWeight: 700, marginBottom: 8 }}>
                Technical Skills
              </h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {resume.skills.map((s) => <span key={s} className="badge-tag gray">{s}</span>)}
              </div>
            </div>

            {/* Education */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, color: '#4361ee', fontWeight: 700, marginBottom: 8 }}>
                Education
              </h4>
              {resume.education.map((ed, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div><strong>{ed.degree}</strong> — {ed.school}</div>
                  <span style={{ color: '#9ca3af' }}>{ed.year}</span>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, color: '#4361ee', fontWeight: 700, marginBottom: 8 }}>
                Projects
              </h4>
              {resume.projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.title}</div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{p.description}</p>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Tech: {p.tech}</span>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: 1, color: '#4361ee', fontWeight: 700, marginBottom: 8 }}>
                Certifications
              </h4>
              {resume.certifications.map((c, i) => (
                <div key={i} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <HiOutlineDocumentText style={{ color: '#4361ee' }} /> {c}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
