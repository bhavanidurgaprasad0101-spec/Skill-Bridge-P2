import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineBuildingOffice2,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineLink,
  HiOutlineCpuChip,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBookOpen,
  HiOutlineRocketLaunch,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineDocumentText,
  HiOutlineTrophy,
  HiOutlineClock,
  HiOutlineLightBulb,
  HiOutlineArrowPath,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'TCS', 'Infosys', 'Wipro', 'Flipkart', 'Zomato', 'Paytm', 'Swiggy', 'Adobe', 'Salesforce', 'IBM', 'Accenture', 'Deloitte'];
const ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Machine Learning Engineer', 'Data Analyst', 'Cloud Architect', 'Cybersecurity Engineer', 'Mobile Developer', 'UI/UX Designer'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const PHASE_COLORS = [
  { bg: 'rgba(99,102,241,0.12)', border: '#6366f1', accent: '#818cf8', icon: '🧱' },
  { bg: 'rgba(16,185,129,0.12)', border: '#10b981', accent: '#34d399', icon: '⚙️' },
  { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b', accent: '#fbbf24', icon: '🚀' },
  { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', accent: '#f87171', icon: '🎯' },
  { bg: 'rgba(168,85,247,0.12)', border: '#a855f7', accent: '#c084fc', icon: '🏆' },
];

function ProgressRing({ pct, size = 80, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fill: '#fff', fontSize: size * 0.22, fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: 'center' }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function CareerTrainer() {
  const [step, setStep] = useState('form'); // 'form' | 'loading' | 'result'
  const [form, setForm] = useState({
    targetCompany: '', targetRole: '', skillLevel: 'Intermediate',
    linkedInUrl: '', currentSkills: '', experience: '', education: '',
    certifications: '', projects: '',
  });
  const [analysis, setAnalysis] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [progress, setProgress] = useState({});
  const [activePhase, setActivePhase] = useState(0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState({});

  const token = localStorage.getItem('token');

  // Load existing data on mount
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API}/api/career-trainer/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.data) {
          setSavedData(json.data);
          setAnalysis(json.data.analysis);
          setProgress(json.data.progress || {});
          setForm(f => ({
            ...f,
            targetCompany: json.data.targetCompany || '',
            targetRole: json.data.targetRole || '',
            skillLevel: json.data.skillLevel || 'Intermediate',
          }));
          setStep('result');
        }
      } catch { /* ignore */ }
    };
    load();
  }, [token]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.targetCompany || !form.targetRole) {
      setError('Please fill in Target Company and Target Role.');
      return;
    }
    setError('');
    setStep('loading');
    try {
      const res = await fetch(`${API}/api/career-trainer/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Generation failed');
      setAnalysis(json.analysis);
      setProgress({});
      setActivePhase(0);
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('form');
    }
  };

  const saveProgress = useCallback(async (newProgress) => {
    if (!token) return;
    setSaving(true);
    try {
      await fetch(`${API}/api/career-trainer/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ progress: newProgress }),
      });
    } catch { /* ignore */ }
    setSaving(false);
  }, [token]);

  const toggleCheck = (key) => {
    const updated = { ...progress, [key]: !progress[key] };
    setProgress(updated);
    saveProgress(updated);
  };

  const toggleSection = (key) => setExpandedSection(s => ({ ...s, [key]: !s[key] }));

  // Compute overall progress %
  const computeProgress = () => {
    if (!analysis?.roadmap) return 0;
    let total = 0, done = 0;
    analysis.roadmap.forEach((phase, pi) => {
      (phase.courses || []).forEach((_, i) => { total++; if (progress[`p${pi}-course-${i}`]) done++; });
      (phase.projects || []).forEach((_, i) => { total++; if (progress[`p${pi}-project-${i}`]) done++; });
      (phase.practiceProblems || []).forEach((_, i) => { total++; if (progress[`p${pi}-practice-${i}`]) done++; });
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  // Skill gap readiness
  const readiness = analysis?.skillGapAnalysis?.overallReadiness ?? 0;
  const overallPct = computeProgress();

  // ─── FORM ───────────────────────────────────────────────────────────
  if (step === 'form') return (
    <div className="ct-wrap">
      <div className="ct-header">
        <div className="ct-header-icon"><HiOutlineTrophy /></div>
        <div>
          <h1 className="ct-title">AI Career Preparation Trainer</h1>
          <p className="ct-subtitle">Get a personalized AI roadmap to land your dream job at your target company</p>
        </div>
      </div>

      {error && <div className="ct-error">{error}</div>}

      <form onSubmit={handleGenerate} className="ct-form-grid">
        {/* Target Info */}
        <div className="ct-card ct-form-section">
          <h2 className="ct-section-title"><HiOutlineBuildingOffice2 /> Target Position</h2>
          <div className="ct-field-row">
            <div className="ct-field">
              <label>Target Company *</label>
              <input list="companies" value={form.targetCompany}
                onChange={e => setForm(f => ({ ...f, targetCompany: e.target.value }))}
                placeholder="e.g. Google, Amazon, TCS…" className="ct-input" required />
              <datalist id="companies">{COMPANIES.map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="ct-field">
              <label>Target Job Role *</label>
              <input list="roles" value={form.targetRole}
                onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}
                placeholder="e.g. Software Engineer…" className="ct-input" required />
              <datalist id="roles">{ROLES.map(r => <option key={r} value={r} />)}</datalist>
            </div>
          </div>
          <div className="ct-field">
            <label>Current Skill Level</label>
            <div className="ct-level-btns">
              {LEVELS.map(l => (
                <button type="button" key={l}
                  className={`ct-level-btn ${form.skillLevel === l ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, skillLevel: l }))}>{l}</button>
              ))}
            </div>
          </div>
          <div className="ct-field">
            <label><HiOutlineLink /> LinkedIn Profile URL (optional)</label>
            <input value={form.linkedInUrl}
              onChange={e => setForm(f => ({ ...f, linkedInUrl: e.target.value }))}
              placeholder="https://linkedin.com/in/yourname" className="ct-input" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="ct-card ct-form-section">
          <h2 className="ct-section-title"><HiOutlineCpuChip /> Your Profile</h2>
          <p className="ct-hint">The more detail you provide, the better the AI can personalize your roadmap.</p>
          <div className="ct-field">
            <label>Current Skills</label>
            <textarea value={form.currentSkills}
              onChange={e => setForm(f => ({ ...f, currentSkills: e.target.value }))}
              placeholder="e.g. Python, JavaScript, SQL, Machine Learning basics, React…"
              className="ct-textarea" rows={3} />
          </div>
          <div className="ct-field-row">
            <div className="ct-field">
              <label><HiOutlineBriefcase /> Work Experience</label>
              <textarea value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                placeholder="e.g. 2 years at startup as web dev, 6 months internship at Infosys…"
                className="ct-textarea" rows={3} />
            </div>
            <div className="ct-field">
              <label><HiOutlineAcademicCap /> Education</label>
              <textarea value={form.education}
                onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                placeholder="e.g. B.Tech CSE from VIT (2024), CGPA 8.2…"
                className="ct-textarea" rows={3} />
            </div>
          </div>
          <div className="ct-field-row">
            <div className="ct-field">
              <label>Certifications</label>
              <textarea value={form.certifications}
                onChange={e => setForm(f => ({ ...f, certifications: e.target.value }))}
                placeholder="e.g. AWS Cloud Practitioner, Google Data Analytics Certificate…"
                className="ct-textarea" rows={2} />
            </div>
            <div className="ct-field">
              <label>Projects</label>
              <textarea value={form.projects}
                onChange={e => setForm(f => ({ ...f, projects: e.target.value }))}
                placeholder="e.g. E-commerce site with React & Node, ML model for price prediction…"
                className="ct-textarea" rows={2} />
            </div>
          </div>
        </div>

        <button type="submit" className="ct-generate-btn">
          <HiOutlineSparkles /> Generate My Personalized Roadmap
        </button>
      </form>
    </div>
  );

  // ─── LOADING ────────────────────────────────────────────────────────
  if (step === 'loading') return (
    <div className="ct-wrap ct-loading-wrap">
      <div className="ct-loading-card">
        <div className="ct-loading-spinner" />
        <h2>AI is crafting your roadmap…</h2>
        <p>Analyzing skill gaps for <strong>{form.targetRole}</strong> at <strong>{form.targetCompany}</strong></p>
        <div className="ct-loading-steps">
          {['Analyzing your profile', 'Identifying skill gaps', 'Generating 5-phase roadmap', 'Preparing interview questions'].map((s, i) => (
            <div key={i} className="ct-loading-step" style={{ animationDelay: `${i * 0.6}s` }}>
              <HiOutlineCheckCircle /> {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── RESULTS ────────────────────────────────────────────────────────
  if (step === 'result' && analysis) {
    const gap = analysis.skillGapAnalysis || {};
    const roadmap = analysis.roadmap || [];
    const resumeTips = analysis.resumeTips || [];

    return (
      <div className="ct-wrap">
        {/* Header */}
        <div className="ct-header ct-result-header">
          <div className="ct-header-icon"><HiOutlineTrophy /></div>
          <div style={{ flex: 1 }}>
            <h1 className="ct-title">
              {form.targetRole} @ <span style={{ color: '#818cf8' }}>{form.targetCompany}</span>
            </h1>
            <p className="ct-subtitle">{analysis.totalTimeline && `🗓️ Estimated prep time: ${analysis.totalTimeline}`}</p>
          </div>
          <button className="ct-restart-btn" onClick={() => { setStep('form'); setAnalysis(null); }}>
            <HiOutlineArrowPath /> New Plan
          </button>
        </div>

        {/* Progress Bar */}
        <div className="ct-card ct-progress-bar-card">
          <div className="ct-progress-header">
            <span>Overall Preparation Progress</span>
            <span className="ct-progress-pct">{overallPct}% complete {saving && <span style={{ fontSize: 12, opacity: 0.6 }}>saving…</span>}</span>
          </div>
          <div className="ct-progress-track">
            <div className="ct-progress-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="ct-phase-indicators">
            {roadmap.map((ph, i) => (
              <button key={i} className={`ct-phase-dot ${activePhase === i ? 'active' : ''}`}
                style={{ '--ph-color': PHASE_COLORS[i]?.accent }}
                onClick={() => setActivePhase(i)}>
                {PHASE_COLORS[i]?.icon} Phase {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Gap Dashboard */}
        <div className="ct-two-col">
          <div className="ct-card ct-gap-card">
            <h2 className="ct-section-title"><HiOutlineSparkles /> Skill Gap Analysis</h2>
            <div className="ct-gap-top">
              <ProgressRing pct={readiness} size={90} stroke={7} />
              <div>
                <div className="ct-readiness-label">Current Readiness</div>
                <p className="ct-gap-summary">{gap.summary}</p>
              </div>
            </div>
            <div className="ct-skills-grid">
              <div>
                <div className="ct-skills-header ct-have"><HiOutlineCheckCircle /> Skills You Have</div>
                <div className="ct-tags">
                  {(gap.skillsUserHas || []).map((s, i) => <span key={i} className="ct-tag ct-tag-green">{s}</span>)}
                </div>
              </div>
              <div>
                <div className="ct-skills-header ct-missing"><HiOutlineXCircle /> Skills to Learn</div>
                <div className="ct-tags">
                  {(gap.missingCriticalSkills || []).map((s, i) => <span key={i} className="ct-tag ct-tag-red">{s}</span>)}
                  {(gap.skillsToLearn || []).filter(s => !(gap.missingCriticalSkills || []).includes(s))
                    .map((s, i) => <span key={i} className="ct-tag ct-tag-yellow">{s}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Company Culture */}
          {analysis.companyCulture && (
            <div className="ct-card ct-culture-card">
              <h2 className="ct-section-title"><HiOutlineBuildingOffice2 /> {form.targetCompany} Culture</h2>
              <p className="ct-culture-text">{analysis.companyCulture}</p>
              {form.linkedInUrl && (
                <a href={form.linkedInUrl} target="_blank" rel="noreferrer" className="ct-linkedin-link">
                  <HiOutlineLink /> View Your LinkedIn Profile
                </a>
              )}
            </div>
          )}
        </div>

        {/* Phase Navigation + Detail */}
        <div className="ct-card ct-phase-container">
          <div className="ct-phase-tabs">
            {roadmap.map((ph, i) => (
              <button key={i} className={`ct-phase-tab ${activePhase === i ? 'active' : ''}`}
                style={{ '--ph-color': PHASE_COLORS[i]?.border }}
                onClick={() => setActivePhase(i)}>
                {PHASE_COLORS[i]?.icon} Phase {i + 1}: {ph.title}
              </button>
            ))}
          </div>

          {roadmap[activePhase] && (() => {
            const ph = roadmap[activePhase];
            const col = PHASE_COLORS[activePhase];
            const pi = activePhase;
            return (
              <div className="ct-phase-detail" style={{ '--ph-bg': col.bg, '--ph-border': col.border }}>
                <div className="ct-phase-meta">
                  <span className="ct-phase-icon">{col.icon}</span>
                  <div>
                    <h3 className="ct-phase-name">Phase {ph.phase}: {ph.title}</h3>
                    <p className="ct-phase-desc">{ph.description}</p>
                  </div>
                  <div className="ct-phase-duration"><HiOutlineClock /> {ph.duration}</div>
                </div>

                {/* Courses */}
                <div className="ct-subsection">
                  <button className="ct-subsection-toggle" onClick={() => toggleSection(`p${pi}-courses`)}>
                    <HiOutlineBookOpen /> Recommended Courses
                    <span className="ct-badge">{(ph.courses || []).length}</span>
                    <span className="ct-chevron">{expandedSection[`p${pi}-courses`] !== false ? '▲' : '▼'}</span>
                  </button>
                  {expandedSection[`p${pi}-courses`] !== false && (
                    <div className="ct-items-list">
                      {(ph.courses || []).map((c, i) => (
                        <label key={i} className="ct-item-row">
                          <input type="checkbox" checked={!!progress[`p${pi}-course-${i}`]}
                            onChange={() => toggleCheck(`p${pi}-course-${i}`)} />
                          <span className="ct-item-text">
                            <strong>{c.name}</strong>
                            <span className="ct-item-meta">{c.platform}{c.duration && ` · ${c.duration}`}</span>
                          </span>
                          {progress[`p${pi}-course-${i}`] && <span className="ct-done-badge">✓ Done</span>}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div className="ct-subsection">
                  <button className="ct-subsection-toggle" onClick={() => toggleSection(`p${pi}-projects`)}>
                    <HiOutlineRocketLaunch /> Projects to Build
                    <span className="ct-badge">{(ph.projects || []).length}</span>
                    <span className="ct-chevron">{expandedSection[`p${pi}-projects`] !== false ? '▲' : '▼'}</span>
                  </button>
                  {expandedSection[`p${pi}-projects`] !== false && (
                    <div className="ct-items-list">
                      {(ph.projects || []).map((p, i) => (
                        <label key={i} className="ct-item-row">
                          <input type="checkbox" checked={!!progress[`p${pi}-project-${i}`]}
                            onChange={() => toggleCheck(`p${pi}-project-${i}`)} />
                          <span className="ct-item-text">
                            <strong>{p.name}</strong>
                            <span className="ct-item-meta">{p.description}</span>
                          </span>
                          {progress[`p${pi}-project-${i}`] && <span className="ct-done-badge">✓ Done</span>}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Practice Problems */}
                <div className="ct-subsection">
                  <button className="ct-subsection-toggle" onClick={() => toggleSection(`p${pi}-practice`)}>
                    <HiOutlineClipboardDocumentList /> Practice Topics
                    <span className="ct-badge">{(ph.practiceProblems || []).length}</span>
                    <span className="ct-chevron">{expandedSection[`p${pi}-practice`] !== false ? '▲' : '▼'}</span>
                  </button>
                  {expandedSection[`p${pi}-practice`] !== false && (
                    <div className="ct-items-list">
                      {(ph.practiceProblems || []).map((pb, i) => (
                        <label key={i} className="ct-item-row">
                          <input type="checkbox" checked={!!progress[`p${pi}-practice-${i}`]}
                            onChange={() => toggleCheck(`p${pi}-practice-${i}`)} />
                          <span className="ct-item-text"><strong>{pb}</strong></span>
                          {progress[`p${pi}-practice-${i}`] && <span className="ct-done-badge">✓ Done</span>}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interview Questions */}
                <div className="ct-subsection">
                  <button className="ct-subsection-toggle" onClick={() => toggleSection(`p${pi}-iq`)}>
                    <HiOutlineChatBubbleBottomCenterText /> Interview Questions
                    <span className="ct-badge">{(ph.interviewQuestions || []).length}</span>
                    <span className="ct-chevron">{expandedSection[`p${pi}-iq`] !== false ? '▲' : '▼'}</span>
                  </button>
                  {expandedSection[`p${pi}-iq`] !== false && (
                    <div className="ct-items-list ct-iq-list">
                      {(ph.interviewQuestions || []).map((q, i) => (
                        <div key={i} className="ct-iq-item">
                          <span className="ct-iq-num">Q{i + 1}</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Resume Tips */}
        {resumeTips.length > 0 && (
          <div className="ct-card ct-resume-card">
            <h2 className="ct-section-title"><HiOutlineDocumentText /> Resume Improvement Tips</h2>
            <p className="ct-hint">AI-generated suggestions to tailor your resume for <strong>{form.targetRole}</strong> at <strong>{form.targetCompany}</strong></p>
            <ul className="ct-resume-tips">
              {resumeTips.map((tip, i) => (
                <li key={i} className="ct-resume-tip">
                  <span className="ct-tip-icon"><HiOutlineLightBulb /></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
}
