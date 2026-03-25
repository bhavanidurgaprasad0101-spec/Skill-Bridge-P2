import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      // Check if profile/onboarding is done
      const profileRes = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const profileData = await profileRes.json();
      if (profileData.profile && profileData.profile.analysis) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
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
            <h2>Welcome Back</h2>
            <p>Sign in to continue your learning journey</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
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
                    placeholder="Enter your password" required
                  />
                  <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
