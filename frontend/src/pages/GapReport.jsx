import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationTriangle,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

const importanceColors = { Critical: 'pink', Important: 'blue', 'Nice to Have': 'gray', Recommended: 'blue', Optional: 'gray' };

export default function GapReport() {
  const [analysis, setAnalysis] = useState(null);
  const [skillAssessment, setSkillAssessment] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('analysisResult');
    if (stored) {
      try {
        setAnalysis(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const toggleSkill = (skillName, val) => {
    setSkillAssessment(prev => ({ ...prev, [skillName]: val }));
  };

  const saveAssessment = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/skills/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skillAssessment }),
      });
      navigate('/');
    } catch {
      // fallback
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  if (!analysis) {
    return (
      <div className="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: 400, padding: 40 }}>
          <h2 style={{ marginBottom: 12 }}>No Analysis Found</h2>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>Please complete the onboarding questionnaire first.</p>
          <button className="btn btn-primary" onClick={() => navigate('/onboarding')}>Start Onboarding</button>
        </div>
      </div>
    );
  }

  const report = analysis.gapAnalysisReport || {};
  const skills = analysis.requiredSkills || [];
  const certs = analysis.requiredCertifications || [];
  const courses = analysis.recommendedCourses || [];
  const roadmap = analysis.learningRoadmap || [];
  const market = analysis.jobMarketInsights || {};

  const readiness = parseInt(report.overallReadiness) || 0;
  const assessedCount = Object.keys(skillAssessment).length;
  const knownCount = Object.values(skillAssessment).filter(Boolean).length;

  return (
    <div className="auth-page" style={{ background: '#f8f9fc', overflow: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 40, padding: '30px', background: 'linear-gradient(135deg, rgba(67,97,238,0.1), rgba(114,9,183,0.1))', borderRadius: 24, border: '1px solid rgba(67,97,238,0.2)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #4361ee, #7209b7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', color: '#fff', boxShadow: '0 8px 16px rgba(114,9,183,0.3)',
          }}>
            <HiOutlineSparkles />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12, background: '-webkit-linear-gradient(45deg, #4361ee, #7209b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Your AI Gap Analysis Report
          </h1>
          <p style={{ color: '#4b5563', maxWidth: 650, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>{report.summary}</p>
        </div>

        {/* Readiness + Market */}
        <div className="grid-2 animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="card" style={{ textAlign: 'center', borderTop: `4px solid ${readiness >= 70 ? '#06d6a0' : readiness >= 40 ? '#ffd166' : '#ef476f'}` }}>
            <div className="card-title" style={{ marginBottom: 20 }}>Overall Readiness Match</div>
            <div style={{
              width: 140, height: 140, borderRadius: '50%', margin: '0 auto 20px',
              background: `conic-gradient(${readiness >= 70 ? '#06d6a0' : readiness >= 40 ? '#ffd166' : '#ef476f'} ${readiness * 3.6}deg, #f1f3f9 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                width: 112, height: 112, borderRadius: '50%', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: readiness >= 70 ? '#06d6a0' : readiness >= 40 ? '#f59e0b' : '#ef476f' }}>{readiness}%</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Job Ready</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {(report.strengths || []).slice(0, 3).map((s, i) => <span key={i} className="badge-tag green">{s}</span>)}
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(to bottom right, #ffffff, #f8f9fc)' }}>
            <div className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: 8, background: 'rgba(67,97,238,0.1)', color: '#4361ee', borderRadius: 8 }}><HiOutlineBriefcase size={20} /></div>
              Job Market Insights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f1f3f9' }}>
                <span style={{ color: '#6b7280', fontWeight: 500 }}>Demand Level</span>
                <span className={`badge-tag ${market.demandLevel === 'High' ? 'green' : 'blue'}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>{market.demandLevel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f1f3f9' }}>
                <span style={{ color: '#6b7280', fontWeight: 500 }}>Average Salary</span>
                <strong style={{ fontSize: '1.05rem', color: '#1a1d2e' }}>{market.averageSalary}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #f1f3f9' }}>
                <span style={{ color: '#6b7280', fontWeight: 500 }}>Industry Growth</span>
                <span style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: 500 }}>{market.growthOutlook}</span>
              </div>
              <div style={{ background: '#f8f9fc', padding: 12, borderRadius: 8, marginTop: 4 }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top Hiring Companies</div>
                <div style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{(market.topCompanies || []).join(', ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Gaps */}
        <div className="grid-2 animate-fade-in-up" style={{ marginBottom: 32, animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="card" style={{ background: 'rgba(6,214,160,0.03)', borderColor: 'rgba(6,214,160,0.15)' }}>
            <div className="card-title" style={{ marginBottom: 16, color: '#06d6a0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: 6, background: 'rgba(6,214,160,0.15)', borderRadius: 8 }}><HiOutlineCheckCircle size={20} /></div>
              Your Key Strengths
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(report.strengths || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #f1f3f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <span style={{ color: '#06d6a0', fontWeight: 800, marginTop: 2 }}>✓</span> 
                  <span style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ background: 'rgba(239,71,111,0.03)', borderColor: 'rgba(239,71,111,0.15)' }}>
            <div className="card-title" style={{ marginBottom: 16, color: '#ef476f', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: 6, background: 'rgba(239,71,111,0.15)', borderRadius: 8 }}><HiOutlineExclamationTriangle size={20} /></div>
              Critical Gaps to Fill
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(report.keyGaps || []).map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', background: '#fff', borderRadius: 8, border: '1px solid #f1f3f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <span style={{ color: '#ef476f', fontWeight: 800, marginTop: 2 }}>!</span> 
                  <span style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.4 }}>{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Required Skills - Self Assessment Section */}
        <div className="card animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.3s', animationFillMode: 'both' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Required Skills — Self Assessment</div>
              <div className="card-subtitle">Mark which skills you already have. This helps us personalize your roadmap.</div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
              Assessed: <strong>{assessedCount}/{skills.length}</strong> · Known: <strong style={{ color: '#06d6a0' }}>{knownCount}</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {skills.map((skill, i) => {
              const assessed = skillAssessment[skill.skill];
              return (
                <div key={i} style={{
                  padding: '14px 18px', borderRadius: 10,
                  border: `2px solid ${assessed === true ? '#06d6a0' : assessed === false ? '#ef476f' : '#e5e7eb'}`,
                  background: assessed === true ? 'rgba(6,214,160,0.04)' : assessed === false ? 'rgba(239,71,111,0.04)' : '#fff',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{skill.skill}</div>
                    <span className={`badge-tag ${importanceColors[skill.importance] || 'gray'}`}>{skill.importance}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 4 }}>{skill.category}</div>
                  <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: 10 }}>{skill.description}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className={`btn btn-sm ${assessed === true ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => toggleSkill(skill.skill, true)}
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      <HiOutlineCheckCircle /> I Know This
                    </button>
                    <button
                      className={`btn btn-sm ${assessed === false ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => toggleSkill(skill.skill, false)}
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      <HiOutlineXCircle /> Not Yet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Required Certifications */}
        <div className="card animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="card-title" style={{ marginBottom: 16 }}>
            <HiOutlineAcademicCap style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Required Certifications
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {certs.map((cert, i) => (
              <div key={i} style={{ padding: '14px 18px', borderRadius: 10, background: '#f8f9fc', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 4 }}>{cert.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{cert.provider}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <span className={`badge-tag ${importanceColors[cert.importance] || 'blue'}`}>{cert.importance}</span>
                  <span className={`badge-tag ${cert.userHasIt ? 'green' : 'orange'}`}>
                    {cert.userHasIt ? '✓ Completed' : 'To Do'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="card animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="card-title" style={{ marginBottom: 16 }}>📚 Recommended Courses</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {courses.map((course, i) => (
              <div key={i} style={{ padding: '14px 18px', borderRadius: 10, background: '#f8f9fc', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{course.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 8 }}>
                  {course.platform} · {course.estimatedDuration}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge-tag blue">{course.skill}</span>
                  <span className="badge-tag gray">{course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Roadmap */}
        <div className="card animate-fade-in-up" style={{ marginBottom: 28, animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="card-title" style={{ marginBottom: 16 }}>
            <HiOutlineArrowTrendingUp style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Recommended Learning Roadmap
          </div>
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{
              position: 'absolute', left: 12, top: 0, bottom: 0, width: 3,
              background: 'linear-gradient(180deg, #4361ee, #7209b7, #06d6a0)',
              borderRadius: 4,
            }}></div>
            {roadmap.map((phase, i) => (
              <div key={i} style={{ marginBottom: 20, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: -26, top: 4,
                  width: 22, height: 22, borderRadius: '50%', background: '#4361ee',
                  border: '3px solid #fff', boxShadow: '0 0 0 3px #4361ee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: '#fff', fontWeight: 700,
                }}>
                  {phase.phase}
                </div>
                <div style={{ padding: '12px 18px', borderRadius: 10, background: '#f8f9fc', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <strong style={{ fontSize: '0.92rem' }}>{phase.title}</strong>
                    <span className="badge-tag gray">{phase.duration}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {(phase.items || []).map((item, j) => (
                      <div key={j} style={{ fontSize: '0.82rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#4361ee' }}>•</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <button className="btn btn-primary btn-lg" onClick={saveAssessment} disabled={saving}>
            {saving ? 'Saving...' : 'Continue to Dashboard'} <HiOutlineArrowRight />
          </button>
          <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 8 }}>
            Your skill assessment has been saved. You can always update it later.
          </p>
        </div>
      </div>
    </div>
  );
}
