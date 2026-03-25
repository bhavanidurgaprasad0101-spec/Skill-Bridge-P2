import { useState } from 'react';
import {
  HiOutlineMicrophone,
  HiOutlineCodeBracket,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlinePlayCircle,
  HiOutlineLockClosed,
} from 'react-icons/hi2';

const initialRounds = [
  {
    id: 'technical',
    title: 'Technical Round',
    icon: HiOutlineMicrophone,
    description: 'Answer domain-specific questions about data analysis, tools, and concepts.',
    duration: '20 min',
    status: 'available', // Started as available
    questions: 10,
  },
  {
    id: 'coding',
    title: 'Coding Round',
    icon: HiOutlineCodeBracket,
    description: 'Solve coding challenges using Python and SQL in a timed environment.',
    duration: '30 min',
    status: 'locked',
    questions: 5,
  },
  {
    id: 'communication',
    title: 'Communication Round',
    icon: HiOutlineChatBubbleLeftRight,
    description: 'Present your project and explain your approach clearly and concisely.',
    duration: '15 min',
    status: 'locked',
    questions: 6,
  },
  {
    id: 'hr',
    title: 'HR Round',
    icon: HiOutlineUserGroup,
    description: 'Behavioral questions, salary expectations, and company culture fit.',
    duration: '15 min',
    status: 'locked',
    questions: 8,
  },
];

const sampleQuestions = [
  { q: "Tell me about yourself and why you're interested in data analysis.", type: 'Behavioral' },
  { q: 'What is the difference between INNER JOIN and LEFT JOIN? Give an example.', type: 'Technical' },
  { q: 'Write a Python function to find the top 5 customers by total purchase amount from a CSV file.', type: 'Coding' },
  { q: 'How would you handle missing data in a dataset? What approaches would you consider?', type: 'Technical' },
  { q: 'Describe a challenging project you worked on and how you overcame obstacles.', type: 'Behavioral' },
];

const statusConfig = {
  completed: { badge: 'green', label: '✓ Completed', icon: HiOutlineCheckCircle },
  available: { badge: 'blue', label: 'Start Now', icon: HiOutlinePlayCircle },
  locked: { badge: 'gray', label: 'Locked', icon: HiOutlineLockClosed },
  failed: { badge: 'pink', label: '✗ Failed', icon: HiOutlineXCircle },
};

export default function MockInterview() {
  const [roundsList, setRoundsList] = useState(initialRounds);
  const [activeRound, setActiveRound] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const startRound = (round) => {
    if (round.status === 'locked') return;
    setActiveRound(round);
    setCurrentQ(0);
    setUserAnswer('');
    setSubmitted(false);
  };

  const submitAnswer = () => {
    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (currentQ + 1 < sampleQuestions.length) {
      setCurrentQ(currentQ + 1);
      setUserAnswer('');
      setSubmitted(false);
    } else {
      // Complete current round and unlock next
      setRoundsList(prev => {
        const currentIdx = prev.findIndex(r => r.id === activeRound.id);
        const newRounds = [...prev];
        
        // Mark current as completed
        if (currentIdx !== -1) {
          newRounds[currentIdx].status = 'completed';
          newRounds[currentIdx].score = Math.floor(Math.random() * 20) + 80; // random mock score between 80-100
        }
        
        // Mark next as available (if exists)
        if (currentIdx + 1 < newRounds.length) {
          newRounds[currentIdx + 1].status = 'available';
        }
        
        return newRounds;
      });
      setActiveRound(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Mock Interview Simulation</h2>
        <p>Practice with AI-powered interviews simulating real industry rounds.</p>
      </div>

      {!activeRound ? (
        <>
          {/* Interview Rounds */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
            {roundsList.map((round) => {
              const cfg = statusConfig[round.status];
              return (
                <div
                  key={round.id}
                  className="card"
                  onClick={() => startRound(round)}
                  style={{
                    cursor: round.status !== 'locked' ? 'pointer' : 'default',
                    opacity: round.status === 'locked' ? 0.55 : 1,
                    textAlign: 'center',
                    padding: '28px 24px',
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: round.status === 'completed' ? 'rgba(6,214,160,0.1)' : round.status === 'available' ? 'rgba(67,97,238,0.1)' : '#f1f3f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', fontSize: '1.5rem',
                    color: round.status === 'completed' ? '#06d6a0' : round.status === 'available' ? '#4361ee' : '#9ca3af',
                  }}>
                    <round.icon />
                  </div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 600, marginBottom: 6 }}>{round.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 12 }}>{round.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
                    <span className="badge-tag gray">{round.questions} questions</span>
                    <span className="badge-tag gray">{round.duration}</span>
                  </div>
                  {round.score && (
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#06d6a0', marginBottom: 8 }}>{round.score}%</div>
                  )}
                  <span className={`badge-tag ${cfg.badge}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="card" style={{ background: 'rgba(67,97,238,0.04)', borderColor: 'rgba(67,97,238,0.15)' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>💡 Interview Tips</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { tip: 'Use the STAR method for behavioral questions (Situation, Task, Action, Result).' },
                { tip: 'For coding rounds, always explain your thought process before writing code.' },
                { tip: 'Practice explaining technical concepts in simple, non-jargon language.' },
                { tip: 'Research the company and prepare questions to ask the interviewer.' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.85rem', color: '#4b5563' }}>
                  <span style={{ color: '#4361ee', fontWeight: 700, flexShrink: 0 }}>•</span>
                  {t.tip}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Active Interview */
        <div className="card" style={{ maxWidth: 700 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 600 }}>{activeRound.title}</h3>
              <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                Question {currentQ + 1} of {sampleQuestions.length}
              </span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveRound(null)}>Exit</button>
          </div>

          <div className="progress-bar-track" style={{ marginBottom: 24 }}>
            <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / sampleQuestions.length) * 100}%` }}></div>
          </div>

          <span className={`badge-tag ${sampleQuestions[currentQ].type === 'Coding' ? 'blue' : sampleQuestions[currentQ].type === 'Technical' ? 'green' : 'orange'}`} style={{ marginBottom: 12, display: 'inline-flex' }}>
            {sampleQuestions[currentQ].type}
          </span>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, lineHeight: 1.6 }}>
            {sampleQuestions[currentQ].q}
          </h3>

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            rows={6}
            disabled={submitted}
            placeholder="Type your answer here..."
            style={{
              width: '100%', padding: '14px', borderRadius: 10, background: '#f1f3f9', fontSize: '0.88rem',
              color: '#1a1d2e', resize: 'vertical', marginBottom: 16,
            }}
          />

          {submitted && (
            <div style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(67,97,238,0.06)', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#4361ee', marginBottom: 6 }}>AI Feedback</div>
              <p style={{ fontSize: '0.84rem', color: '#6b7280' }}>
                Good answer! Consider adding more specific examples and quantifying your results where possible. Structure your response using the STAR method for better clarity.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {!submitted ? (
              <button className="btn btn-primary" onClick={submitAnswer} disabled={!userAnswer.trim()} style={{ opacity: !userAnswer.trim() ? 0.5 : 1 }}>
                Submit Answer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={nextQuestion}>
                {currentQ + 1 < sampleQuestions.length ? 'Next Question →' : 'Finish Interview'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
