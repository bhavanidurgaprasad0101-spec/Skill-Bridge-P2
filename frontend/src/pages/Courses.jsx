import { useState } from 'react';
import { HiOutlinePlayCircle, HiOutlineCheckCircle, HiOutlineLockClosed, HiOutlineClock, HiOutlineVideoCamera, HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    id: 1, title: 'Python for Data Analysis', category: 'Programming',
    modules: 12, completed: 12, duration: '6 hours', status: 'completed',
    description: 'Learn Python basics, data types, functions, and data manipulation with hands-on exercises.',
  },
  {
    id: 2, title: 'SQL Fundamentals', category: 'Database',
    modules: 10, completed: 10, duration: '5 hours', status: 'completed',
    description: 'Master SQL queries, joins, aggregations, and subqueries for data analysis.',
  },
  {
    id: 3, title: 'Advanced Excel & Spreadsheets', category: 'Tools',
    modules: 8, completed: 8, duration: '4 hours', status: 'completed',
    description: 'Pivot tables, VLOOKUP, macros, and advanced formulas for business analysis.',
  },
  {
    id: 4, title: 'Pandas & NumPy Mastery', category: 'Data Science',
    modules: 14, completed: 10, duration: '7 hours', status: 'in-progress',
    description: 'Data manipulation, cleaning, and transformation using Python data libraries.',
  },
  {
    id: 5, title: 'Data Visualization with Matplotlib', category: 'Visualization',
    modules: 10, completed: 4, duration: '5 hours', status: 'in-progress',
    description: 'Create stunning charts, graphs, and visual representations of data.',
  },
  {
    id: 6, title: 'Statistics & Probability', category: 'Math',
    modules: 15, completed: 0, duration: '8 hours', status: 'not-started',
    description: 'Descriptive statistics, probability distributions, hypothesis testing, and more.',
  },
  {
    id: 7, title: 'Tableau Dashboard Design', category: 'Visualization',
    modules: 12, completed: 0, duration: '6 hours', status: 'locked',
    description: 'Build interactive business dashboards with Tableau.',
  },
  {
    id: 8, title: 'Machine Learning Basics', category: 'AI/ML',
    modules: 16, completed: 0, duration: '10 hours', status: 'locked',
    description: 'Introduction to supervised and unsupervised learning algorithms.',
  },
];

const statusConfig = {
  completed: { icon: HiOutlineCheckCircle, label: 'Completed', badge: 'green', color: '#06d6a0' },
  'in-progress': { icon: HiOutlinePlayCircle, label: 'In Progress', badge: 'blue', color: '#4361ee' },
  'not-started': { icon: HiOutlineClock, label: 'Not Started', badge: 'orange', color: '#f59e0b' },
  locked: { icon: HiOutlineLockClosed, label: 'Locked', badge: 'gray', color: '#9ca3af' },
};

export default function Courses() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const filtered = filter === 'all' ? courses : courses.filter((c) => c.status === filter);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Courses</h2>
        <p>Complete courses to master skills on your roadmap. Each course includes modules with hands-on exercises.</p>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineCheckCircle /></div>
          <div className="stat-info"><h3>3</h3><p>Completed</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlinePlayCircle /></div>
          <div className="stat-info"><h3>2</h3><p>In Progress</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineClock /></div>
          <div className="stat-info"><h3>1</h3><p>Not Started</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink"><HiOutlineLockClosed /></div>
          <div className="stat-info"><h3>2</h3><p>Locked</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="tab-nav" style={{ marginBottom: 24 }}>
        {['all', 'completed', 'in-progress', 'not-started', 'locked'].map((f) => (
          <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f === 'not-started' ? 'Not Started' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map((course) => {
          const cfg = statusConfig[course.status];
          const pct = course.modules > 0 ? Math.round((course.completed / course.modules) * 100) : 0;
          return (
            <div key={course.id} className="card" style={{ opacity: course.status === 'locked' ? 0.55 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span className="badge-tag gray">{course.category}</span>
                <span className={`badge-tag ${cfg.badge}`}>{cfg.label}</span>
              </div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 600, marginBottom: 6 }}>{course.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 14 }}>{course.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#9ca3af', marginBottom: 10 }}>
                <span>{course.modules} modules</span>
                <span>{course.duration}</span>
              </div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar-label">
                  <span>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className={`progress-bar-fill ${course.status === 'completed' ? 'green' : ''}`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
              {course.status === 'in-progress' && (
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ marginTop: 14, width: '100%' }}
                  onClick={() => navigate(`/course/${course.id}`, { state: { course } })}
                >
                  Continue Learning
                </button>
              )}
              {course.status === 'not-started' && (
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ marginTop: 14, width: '100%' }}
                  onClick={() => navigate(`/course/${course.id}`, { state: { course } })}
                >
                  Start Course
                </button>
              )}
              
              {/* Resources Section */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Free Resources:</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' full course')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm" 
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
                  >
                    <HiOutlineVideoCamera style={{ fontSize: '1rem' }} /> YouTube
                  </a>
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(course.title + ' free book tutorial filetype:pdf')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm" 
                    style={{ flex: 1, fontSize: '0.75rem', padding: '6px' }}
                  >
                    <HiOutlineDocumentArrowDown style={{ fontSize: '1rem' }} /> Get PDF
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
