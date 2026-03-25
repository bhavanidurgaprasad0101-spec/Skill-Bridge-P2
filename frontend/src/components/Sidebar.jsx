import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentCheck,
  HiOutlineMap,
  HiOutlineBookOpen,
  HiOutlineRocketLaunch,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineChartBarSquare,
  HiOutlineArrowRightOnRectangle,
  HiOutlineSparkles,
  HiOutlineTrophy,
} from 'react-icons/hi2';

const navItems = [
  { section: 'Main' },
  { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/ai-assistant', icon: HiOutlineChatBubbleLeftRight, label: 'AI Assistant' },
  { path: '/gap-report', icon: HiOutlineSparkles, label: 'Gap Report' },
  { section: 'Career' },
  { path: '/career-selection', icon: HiOutlineBriefcase, label: 'Career Selection' },
  { path: '/career-trainer', icon: HiOutlineTrophy, label: 'Career Trainer' },
  { path: '/skills-assessment', icon: HiOutlineAcademicCap, label: 'Skills Assessment' },
  { path: '/skill-test', icon: HiOutlineClipboardDocumentCheck, label: 'Skill Evaluation' },
  { section: 'Learning' },
  { path: '/roadmap', icon: HiOutlineMap, label: 'Learning Roadmap' },
  { path: '/courses', icon: HiOutlineBookOpen, label: 'Courses' },
  { path: '/projects', icon: HiOutlineRocketLaunch, label: 'Mini Projects' },
  { section: 'Career Ready' },
  { path: '/resume-builder', icon: HiOutlineDocumentText, label: 'Resume Builder' },
  { path: '/mock-interview', icon: HiOutlineUserGroup, label: 'Mock Interview' },
  { path: '/job-opportunities', icon: HiOutlineChartBarSquare, label: 'Job Opportunities' },
];

export default function Sidebar({ user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SB';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.jpg" alt="Logo" className="sidebar-logo-icon" style={{ padding: 0, objectFit: 'cover' }} />
        <div>
          <h2>Skill Bridge</h2>
          <span>Gap Detector Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="sidebar-section-label">{item.section}</div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon"><item.icon /></span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="sidebar-user-info" style={{ flex: 1 }}>
          <div className="sidebar-user-name">{user?.name || 'Student'}</div>
          <div className="sidebar-user-role">{user?.email || ''}</div>
        </div>
        <button
          onClick={onLogout}
          title="Logout"
          style={{
            color: '#9ca3af', background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: '1.1rem', padding: 4,
          }}
        >
          <HiOutlineArrowRightOnRectangle />
        </button>
      </div>
    </aside>
  );
}
