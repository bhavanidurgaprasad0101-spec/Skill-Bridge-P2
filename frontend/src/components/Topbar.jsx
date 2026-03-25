import { useLocation } from 'react-router-dom';
import { HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const pageTitles = {
  '/': { title: 'Dashboard', sub: 'Welcome back, John! Here\'s your learning progress.' },
  '/ai-assistant': { title: 'AI Assistant', sub: 'Ask me anything about your career path.' },
  '/career-selection': { title: 'Career Selection', sub: 'Choose your dream career role.' },
  '/skills-assessment': { title: 'Skills Assessment', sub: 'Evaluate your current skill level.' },
  '/skill-test': { title: 'Skill Evaluation Test', sub: 'Test your knowledge with multi-level questions.' },
  '/roadmap': { title: 'Learning Roadmap', sub: 'Your personalized path to success.' },
  '/courses': { title: 'Courses', sub: 'Learn new skills with curated courses.' },
  '/projects': { title: 'Mini Projects', sub: 'Apply your skills with real-world projects.' },
  '/resume-builder': { title: 'Resume Builder', sub: 'Build a professional resume with your achievements.' },
  '/mock-interview': { title: 'Mock Interview', sub: 'Practice for your dream job interview.' },
  '/job-opportunities': { title: 'Job Opportunities', sub: 'Discover jobs matching your skills.' },
};

export default function Topbar() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'Skill Bridge', sub: '' };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{page.title}</h1>
        <p>{page.sub}</p>
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn">
          <HiOutlineMagnifyingGlass />
        </button>
        <button className="topbar-icon-btn">
          <HiOutlineBell />
          <span className="badge"></span>
        </button>
      </div>
    </header>
  );
}
