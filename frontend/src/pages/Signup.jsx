import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Signup({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPw) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="sidebar-logo-icon" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>SB</div>
            <h1>Skill Bridge</h1>
            <p>AI-Powered Skill to Industry Gap Detector</p>
          </div>
          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-icon">🎯</span>
              <div>
                <strong>Personalized Gap Analysis</strong>
                <p>AI analyzes your skills vs industry requirements</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">📚</span>
              <div>
                <strong>Custom Learning Roadmap</strong>
                <p>Step-by-step path from beginner to job-ready</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon">💼</span>
              <div>
                <strong>Career Ready in Weeks</strong>
                <p>Resume builder, mock interviews & job matching</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h2>Create Account</h2>
            <p>Start your journey to becoming job-ready</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input-wrapper">
                  <HiOutlineUser className="auth-input-icon" />
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma" required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Email Address</label>
                <div className="auth-input-wrapper">
                  <HiOutlineEnvelope className="auth-input-icon" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <HiOutlineLockClosed className="auth-input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters" required
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label>Confirm Password</label>
                <div className="auth-input-wrapper">
                  <HiOutlineLockClosed className="auth-input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'} value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Re-enter your password" required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
