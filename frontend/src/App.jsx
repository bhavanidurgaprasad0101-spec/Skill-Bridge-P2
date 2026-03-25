import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import GapReport from './pages/GapReport';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import CareerSelection from './pages/CareerSelection';
import SkillsAssessment from './pages/SkillsAssessment';
import SkillTest from './pages/SkillTest';
import Roadmap from './pages/Roadmap';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Projects from './pages/Projects';
import ResumeBuilder from './pages/ResumeBuilder';
import MockInterview from './pages/MockInterview';
import JobOpportunities from './pages/JobOpportunities';
import CareerTrainer from './pages/CareerTrainer';

function PrivateRoute({ user, children }) {
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('analysisResult');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />

        {/* Onboarding (needs auth but no sidebar) */}
        <Route path="/onboarding" element={
          <PrivateRoute user={user}><Onboarding /></PrivateRoute>
        } />
        <Route path="/gap-report" element={
          <PrivateRoute user={user}><GapReport /></PrivateRoute>
        } />

        {/* Main app (needs auth + sidebar layout) */}
        <Route element={
          <PrivateRoute user={user}><Layout user={user} onLogout={handleLogout} /></PrivateRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/career-selection" element={<CareerSelection />} />
          <Route path="/skills-assessment" element={<SkillsAssessment />} />
          <Route path="/skill-test" element={<SkillTest />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/job-opportunities" element={<JobOpportunities />} />
          <Route path="/career-trainer" element={<CareerTrainer />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
}
