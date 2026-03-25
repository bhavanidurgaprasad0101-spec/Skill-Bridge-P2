import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineChartBar,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlinePaintBrush,
  HiOutlineShieldCheck,
  HiOutlineCloud,
  HiOutlineDevicePhoneMobile,
  HiOutlineCircleStack,
} from 'react-icons/hi2';

const roles = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: HiOutlineChartBar,
    description: 'Analyze data to help businesses make informed decisions.',
    skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'],
    demand: 'High',
    salary: '$65K - $95K',
    color: '#4361ee',
  },
  {
    id: 'software-dev',
    title: 'Software Developer',
    icon: HiOutlineCodeBracket,
    description: 'Build web and mobile applications using modern technologies.',
    skills: ['JavaScript', 'React', 'Node.js', 'Git', 'APIs'],
    demand: 'Very High',
    salary: '$75K - $120K',
    color: '#06d6a0',
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    icon: HiOutlineCpuChip,
    description: 'Design and deploy machine learning models at scale.',
    skills: ['Python', 'TensorFlow', 'Math', 'MLOps', 'Data'],
    demand: 'High',
    salary: '$90K - $140K',
    color: '#7209b7',
  },
  {
    id: 'ui-designer',
    title: 'UI/UX Designer',
    icon: HiOutlinePaintBrush,
    description: 'Create beautiful and intuitive user interfaces.',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'CSS', 'Research'],
    demand: 'Medium',
    salary: '$60K - $100K',
    color: '#f72585',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    icon: HiOutlineShieldCheck,
    description: 'Protect systems and networks from digital threats.',
    skills: ['Networking', 'Linux', 'Security Tools', 'Cryptography', 'Python'],
    demand: 'Very High',
    salary: '$70K - $110K',
    color: '#ef476f',
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    icon: HiOutlineCloud,
    description: 'Build and manage cloud infrastructure solutions.',
    skills: ['AWS/GCP', 'Docker', 'Kubernetes', 'Terraform', 'Linux'],
    demand: 'High',
    salary: '$80K - $130K',
    color: '#118ab2',
  },
  {
    id: 'mobile-dev',
    title: 'Mobile Developer',
    icon: HiOutlineDevicePhoneMobile,
    description: 'Create native and cross-platform mobile applications.',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'APIs'],
    demand: 'High',
    salary: '$70K - $115K',
    color: '#ffd166',
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    icon: HiOutlineCircleStack,
    description: 'Build data pipelines and infrastructure for analytics.',
    skills: ['Python', 'SQL', 'Spark', 'Airflow', 'Cloud'],
    demand: 'High',
    salary: '$85K - $135K',
    color: '#06d6a0',
  },
];

export default function CareerSelection() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Choose Your Career Goal</h2>
        <p>Select the role you want to pursue. We'll create a personalized skill roadmap for you.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {roles.map((role) => (
          <div
            key={role.id}
            className="card"
            onClick={() => setSelected(role.id)}
            style={{
              cursor: 'pointer',
              borderColor: selected === role.id ? role.color : undefined,
              borderWidth: selected === role.id ? 2 : 1,
              background: selected === role.id ? `${role.color}08` : undefined,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div
                style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: `${role.color}15`, color: role.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                }}
              >
                <role.icon />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.02rem' }}>{role.title}</div>
                <span className={`badge-tag ${role.demand === 'Very High' ? 'green' : role.demand === 'High' ? 'blue' : 'orange'}`}>
                  {role.demand} Demand
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: 14 }}>{role.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {role.skills.map((s, i) => (
                <span key={i} className="badge-tag gray">{s}</span>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
              💰 Avg Salary: <strong style={{ color: '#1a1d2e' }}>{role.salary}</strong>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => {
            const roleData = roles.find(r => r.id === selected);
            navigate('/skills-assessment', { state: { role: roleData.title } });
          }}>
            Continue to Skills Assessment →
          </button>
        </div>
      )}
    </div>
  );
}
