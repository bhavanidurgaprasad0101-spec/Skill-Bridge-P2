import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi2';

const difficultyColors = { Easy: '#06d6a0', Medium: '#ffd166', Hard: '#ef476f' };

export default function SkillTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || 'Software Developer';
  const knownSkills = location.state?.knownSkills || [];

  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(`Creating Easy, Medium, and Hard tests for ${role}.`);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setLoadingText("The AI is experiencing high traffic. Retrying securely in the background..."), 5000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const [difficulty, setDifficulty] = useState('Easy');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/exam/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify({ role, knownSkills })
        });
        const data = await res.json();
        if (data.success) {
          setQuestions(data.exam);
        } else {
          setQuestions({ Easy: [], Medium: [], Hard: [] });
        }
      } catch (err) {
        console.error('Failed to fetch exam:', err);
        setQuestions({ Easy: [], Medium: [], Hard: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [role]); // only refetch if role changes

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner" style={{ margin: '0 auto 20px', width: 40, height: 40, border: '4px solid #f1f3f9', borderTopColor: '#ef476f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h3>Generating your Evaluation Exam...</h3>
        <p style={{ color: '#6b7280' }}>{loadingText}</p>
      </div>
    );
  }

  if (!questions || (!questions.Easy && !questions.Medium && !questions.Hard) || (questions.Easy?.length === 0 && questions.Medium?.length === 0 && questions.Hard?.length === 0)) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#ef476f', marginBottom: 12 }}>AI is currently busy 🤖</h3>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>The AI failed to generate your exam due to high traffic limits. Please try again.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry Exam Generation</button>
      </div>
    );
  }

  const qList = questions[difficulty] || [];
  const question = qList[current];

  const handleNext = () => {
    const newAnswers = [...answers, { 
      q: question.q, 
      selected, 
      correct: question.answer, 
      difficulty 
    }];
    if (current + 1 < qList.length) {
      setAnswers(newAnswers);
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setAnswers(newAnswers);
      setAllAnswers(prev => [...prev, ...newAnswers]);
      setFinished(true);
    }
  };

  const score = answers.filter((a) => a.selected === a.correct).length;

  const reset = (diff) => {
    setDifficulty(diff);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  const handleFinishAll = () => {
    navigate('/roadmap', { state: { role, examResults: allAnswers.length > 0 ? allAnswers : answers } });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Skill Evaluation Test: {role}</h2>
        <p>Test your proficiency with multi-level assessment questions based on your stated skills.</p>
      </div>

      {/* Difficulty Tabs */}
      <div className="tab-nav">
        {Object.keys(difficultyColors).map((d) => (
          <button key={d} className={`tab-btn ${difficulty === d && !finished ? 'active' : ''}`} onClick={() => reset(d)} disabled={loading || !questions[d] || questions[d].length === 0}>
            {d}
          </button>
        ))}
      </div>

      {!finished && qList.length > 0 ? (
        <div className="card" style={{ maxWidth: 700 }}>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge-tag" style={{ background: `${difficultyColors[difficulty]}18`, color: difficultyColors[difficulty] }}>
                {difficulty}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                Question {current + 1} of {qList.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#6b7280' }}>
              <HiOutlineClock /> No time limit
            </div>
          </div>

          <div className="progress-bar-track" style={{ marginBottom: 24 }}>
            <div className="progress-bar-fill" style={{ width: `${((current + 1) / qList.length) * 100}%` }}></div>
          </div>

          {/* Question */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, lineHeight: 1.5 }}>
            {question.q}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  padding: '14px 20px',
                  borderRadius: 10,
                  border: `2px solid ${selected === i ? '#4361ee' : '#e5e7eb'}`,
                  background: selected === i ? 'rgba(67,97,238,0.06)' : '#fff',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: selected === i ? 600 : 400,
                  color: selected === i ? '#4361ee' : '#1a1d2e',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '50%', marginRight: 12, fontSize: '0.78rem', fontWeight: 600,
                  background: selected === i ? '#4361ee' : '#f1f3f9',
                  color: selected === i ? '#fff' : '#6b7280',
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-primary" onClick={handleNext} disabled={selected === null}
              style={{ opacity: selected === null ? 0.5 : 1 }}>
              {current + 1 < qList.length ? 'Next Question →' : 'Submit Test'}
            </button>
          </div>
        </div>
      ) : finished ? (
        /* Results */
        <div className="card" style={{ maxWidth: 700, textAlign: 'center', padding: 40 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
            background: score >= qList.length * 0.7 ? 'rgba(6,214,160,0.12)' : 'rgba(255,209,102,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
          }}>
            {score >= qList.length * 0.7 ? '🎉' : '📚'}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
            {score >= qList.length * 0.7 ? 'Great Job!' : 'Keep Learning!'}
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: 20 }}>
            You scored <strong style={{ color: '#4361ee', fontSize: '1.2rem' }}>{score}/{qList.length}</strong> on the {difficulty} level test.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
            {answers.map((a, i) => (
              <div key={i} title={a.q} style={{
                width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: a.selected === a.correct ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.1)',
                color: a.selected === a.correct ? '#06d6a0' : '#ef476f', fontWeight: 600, fontSize: '0.85rem',
              }}>
                {a.selected === a.correct ? <HiOutlineCheckCircle /> : '✗'}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => reset(difficulty)}>Retry {difficulty}</button>
            {difficulty !== 'Hard' && (
              <button className="btn btn-primary" onClick={() => reset(difficulty === 'Easy' ? 'Medium' : 'Hard')}>
                Try {difficulty === 'Easy' ? 'Medium' : 'Hard'} Level
              </button>
            )}
            <button className="btn btn-primary" style={{ background: '#7209b7', borderColor: '#7209b7' }} onClick={handleFinishAll}>
              Generate Final AI Roadmap →
            </button>
          </div>
        </div>
      ) : (
        <p>No questions generated for this difficulty.</p>
      )}
    </div>
  );
}
