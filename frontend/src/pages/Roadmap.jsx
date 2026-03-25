import { useState, useEffect } from 'react';
import { HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlinePlayCircle } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';

const statusIcon = {
  completed: <HiOutlineCheckCircle style={{ color: '#06d6a0', fontSize: '1.2rem' }} />,
  'in-progress': <HiOutlinePlayCircle style={{ color: '#4361ee', fontSize: '1.2rem' }} />,
  locked: <HiOutlineLockClosed style={{ color: '#9ca3af', fontSize: '1.2rem' }} />,
};

const statusColor = {
  completed: '#06d6a0',
  'in-progress': '#4361ee',
  locked: '#e5e7eb',
};

export default function Roadmap() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role = 'Software Developer', examResults = [] } = location.state || {};

  const [roadmapStages, setRoadmapStages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Generating a personalized roadmap to address your specific weaknesses.");

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setLoadingText("The AI is experiencing high traffic. Retrying securely in the background..."), 5000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const examResultsStr = JSON.stringify(examResults);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/roadmap/generate-from-exam`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify({ role, examResults })
        });
        const data = await res.json();
        if (data.success) {
          setRoadmapStages(data.roadmap);
        } else {
          setRoadmapStages([]);
        }
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
        setRoadmapStages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, examResultsStr]);

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner" style={{ margin: '0 auto 20px', width: 40, height: 40, border: '4px solid #f1f3f9', borderTopColor: '#06d6a0', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h3>Analyzing Your Exam Results...</h3>
        <p style={{ color: '#6b7280' }}>{loadingText}</p>
      </div>
    );
  }

  if (!roadmapStages || roadmapStages.length === 0) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#ef476f', marginBottom: 12 }}>AI is currently busy 🤖</h3>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>The AI failed to generate your roadmap due to high traffic limits. Please try again.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry Roadmap Generation</button>
      </div>
    );
  }

  const completedCount = roadmapStages.filter(s => s.status === 'completed').length;
  const inProgressCount = roadmapStages.filter(s => s.status === 'in-progress').length;
  const lockedCount = roadmapStages.filter(s => s.status === 'locked').length;

  const currentStage = roadmapStages.find(s => s.status === 'in-progress')?.stage || 1;
  const totalStages = roadmapStages.length || 1;
  const progressPercent = (completedCount / totalStages) * 100;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Your Personalized Learning Roadmap</h2>
        <p>A step-by-step path created by AI based on your recent skill evaluation. Complete each stage to master {role}.</p>
      </div>

      {/* Progress overview */}
      <div className="card" style={{ marginBottom: 28, padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Overall Progress: <strong style={{ color: '#1a1d2e' }}>Stage {currentStage} of {totalStages}</strong>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge-tag green">{completedCount} Completed</span>
            <span className="badge-tag blue">{inProgressCount} In Progress</span>
            <span className="badge-tag gray">{lockedCount} Locked</span>
          </div>
        </div>
        <div className="progress-bar-track" style={{ marginTop: 12 }}>
          <div className="progress-bar-fill green" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div style={{ position: 'relative', paddingLeft: 36 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 15, top: 0, bottom: 0, width: 3,
          background: 'linear-gradient(180deg, #06d6a0 30%, #4361ee 50%, #e5e7eb 55%)',
          borderRadius: 4,
        }}></div>

        {roadmapStages.map((stage, si) => (
          <div key={si} className="animate-fade-in-up" style={{ marginBottom: 32, position: 'relative', animationDelay: `${si * 0.15}s`, animationFillMode: 'both' }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute', left: -28, top: 4,
              width: 24, height: 24, borderRadius: '50%',
              background: statusColor[stage.status], border: '3px solid #fff',
              boxShadow: '0 0 0 3px ' + statusColor[stage.status],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: '#fff', fontWeight: 700,
              zIndex: 2,
            }}>
              {stage.stage}
            </div>

            {/* Stage Card */}
            <div className="card" style={{
              opacity: stage.status === 'locked' ? 0.6 : 1,
              borderColor: stage.status === 'in-progress' ? '#4361ee' : undefined,
              borderWidth: stage.status === 'in-progress' ? 2 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 600 }}>Stage {stage.stage}: {stage.title}</h3>
                </div>
                <span className={`badge-tag ${stage.status === 'completed' ? 'green' : stage.status === 'in-progress' ? 'blue' : 'gray'}`}>
                  {stage.status === 'completed' ? 'Completed' : stage.status === 'in-progress' ? 'In Progress' : 'Locked'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stage?.skills?.map((skill, ki) => (
                  <div key={ki} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 8, background: '#f8f9fc',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {statusIcon[skill.status]}
                      <span style={{
                        fontWeight: 500, fontSize: '0.88rem',
                        color: skill.status === 'locked' ? '#9ca3af' : '#1a1d2e',
                        textDecoration: skill.status === 'completed' ? 'line-through' : 'none',
                      }}>
                        {skill.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{skill.duration}</span>
                  </div>
                ))}
              </div>

              {stage.status === 'in-progress' && (
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/courses')}
                  >
                    Continue Learning
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate('/skill-test')}
                  >
                    Take Validation Test
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
