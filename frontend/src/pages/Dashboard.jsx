import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineRocketLaunch,
  HiOutlineClipboardDocumentCheck,
  HiOutlineTrophy,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from 'recharts';

const skillData = [
  { name: 'Python', score: 85 },
  { name: 'SQL', score: 72 },
  { name: 'Excel', score: 90 },
  { name: 'Tableau', score: 60 },
  { name: 'Statistics', score: 55 },
  { name: 'ML Basics', score: 40 },
];

const courseProgress = [
  { name: 'Completed', value: 5, color: '#06d6a0' },
  { name: 'In Progress', value: 3, color: '#4361ee' },
  { name: 'Not Started', value: 4, color: '#e5e7eb' },
];

const readinessData = [{ name: 'Score', value: 72, fill: '#4361ee' }];

const recentActivities = [
  { icon: HiOutlineBookOpen, text: 'Completed "SQL Fundamentals" course', time: '2 hours ago', color: 'green' },
  { icon: HiOutlineClipboardDocumentCheck, text: 'Scored 85% on Python Assessment', time: '5 hours ago', color: 'blue' },
  { icon: HiOutlineRocketLaunch, text: 'Started Mini Project: Data Dashboard', time: '1 day ago', color: 'orange' },
  { icon: HiOutlineAcademicCap, text: 'Earned "SQL Expert" badge', time: '2 days ago', color: 'pink' },
];

const upcomingTasks = [
  { title: 'Complete Tableau Basics', type: 'Course', due: 'Due in 3 days', priority: 'orange' },
  { title: 'Statistics Assessment', type: 'Test', due: 'Due in 5 days', priority: 'blue' },
  { title: 'Data Cleaning Project', type: 'Project', due: 'Due in 1 week', priority: 'green' },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><HiOutlineAcademicCap /></div>
          <div className="stat-info">
            <h3>12</h3>
            <p>Skills Learned</p>
            <span className="stat-trend up">↑ 3 this week</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><HiOutlineBookOpen /></div>
          <div className="stat-info">
            <h3>5/12</h3>
            <p>Courses Completed</p>
            <span className="stat-trend up">↑ 42%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><HiOutlineClipboardDocumentCheck /></div>
          <div className="stat-info">
            <h3>78%</h3>
            <p>Avg Test Score</p>
            <span className="stat-trend up">↑ 5%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pink"><HiOutlineTrophy /></div>
          <div className="stat-info">
            <h3>72%</h3>
            <p>Job Readiness</p>
            <span className="stat-trend up">↑ 8%</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Skill Proficiency</div>
              <div className="card-subtitle">Your scores across key skills</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="score" fill="#4361ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Course Completion</div>
              <div className="card-subtitle">Overall progress overview</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={courseProgress} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {courseProgress.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {courseProgress.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }}></span>
                  <span style={{ color: '#6b7280' }}>{item.name}</span>
                  <span style={{ fontWeight: 600, marginLeft: 4 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-2">
        {/* Job Readiness Score */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Job Readiness Score</div>
              <div className="card-subtitle">How prepared you are for the industry</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width={200} height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={90} endAngle={-270} data={readinessData}>
                <RadialBar background clockWise dataKey="value" cornerRadius={12} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4361ee' }}>72%</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ready</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <span className="badge-tag green">Skills ✓</span>
            <span className="badge-tag blue">Projects ✓</span>
            <span className="badge-tag orange">Interview ⟳</span>
          </div>
        </div>

        {/* Recent Activity + Upcoming */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Activity</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem' }}>
                <div className={`stat-icon ${act.color}`} style={{ width: 36, height: 36, fontSize: '1rem' }}>
                  <act.icon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{act.text}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
            <div className="card-title" style={{ marginBottom: 12 }}>Upcoming Tasks</div>
            {upcomingTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < upcomingTasks.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{task.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{task.due}</div>
                </div>
                <span className={`badge-tag ${task.priority}`}>{task.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
