import {
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBuildingOffice2,
} from 'react-icons/hi2';

const jobs = [
  {
    id: 1, title: 'Junior Data Analyst', company: 'TechCorp India',
    location: 'Bengaluru, KA', type: 'Full-time', salary: '₹6L - ₹8L',
    match: 92, posted: '2 days ago',
    skills: ['Python', 'SQL', 'Tableau', 'Excel'],
    description: 'Analyze business data, create reports, and provide actionable insights to stakeholders.',
  },
  {
    id: 2, title: 'Data Analyst Intern', company: 'StartupXYZ',
    location: 'Remote', type: 'Internship', salary: '₹15K/mo',
    match: 88, posted: '3 days ago',
    skills: ['Python', 'SQL', 'Pandas', 'Data Viz'],
    description: 'Support the data team in building dashboards and analyzing customer behavior data.',
  },
  {
    id: 3, title: 'Business Intelligence Analyst', company: 'DataDriven India',
    location: 'Mumbai, MH', type: 'Full-time', salary: '₹8L - ₹12L',
    match: 78, posted: '5 days ago',
    skills: ['SQL', 'Power BI', 'Statistics', 'Python'],
    description: 'Design and maintain BI dashboards, perform ad-hoc analysis for executive team.',
  },
  {
    id: 4, title: 'Data Analytics Associate', company: 'FinanceHub',
    location: 'Gurugram, HR', type: 'Full-time', salary: '₹5L - ₹7L',
    match: 75, posted: '1 week ago',
    skills: ['Excel', 'SQL', 'Python', 'Tableau'],
    description: 'Work with finance team to analyze trading patterns and create automated reports.',
  },
  {
    id: 5, title: 'Marketing Data Analyst', company: 'AdVenture Media',
    location: 'Remote', type: 'Full-time', salary: '₹4L - ₹6L',
    match: 70, posted: '1 week ago',
    skills: ['SQL', 'Excel', 'Google Analytics', 'Python'],
    description: 'Analyze marketing campaigns, A/B tests, and customer acquisition data.',
  },
];

export default function JobOpportunities() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Job Opportunities</h2>
        <p>Discover jobs matching your skills. These are ranked by your profile compatibility score.</p>
      </div>

      {/* Summary */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Found <strong style={{ color: '#1a1d2e' }}>{jobs.length} jobs</strong> matching your Data Analyst profile
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge-tag green">High Match (3)</span>
          <span className="badge-tag blue">Good Match (2)</span>
        </div>
      </div>

      {/* Job List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {jobs.map((job) => (
          <div key={job.id} className="card" style={{ borderLeft: `4px solid ${job.match >= 80 ? '#06d6a0' : job.match >= 70 ? '#4361ee' : '#ffd166'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, background: '#f1f3f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', color: '#4361ee',
                  }}>
                    <HiOutlineBuildingOffice2 />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{job.title}</h3>
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{job.company}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: 12 }}>{job.description}</p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.8rem', color: '#6b7280', marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineMapPin /> {job.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineBriefcase /> {job.type}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineCurrencyDollar /> {job.salary}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineClock /> {job.posted}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {job.skills.map((s, i) => <span key={i} className="badge-tag gray">{s}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: `conic-gradient(${job.match >= 80 ? '#06d6a0' : '#4361ee'} ${job.match * 3.6}deg, #f1f3f9 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem', color: job.match >= 80 ? '#06d6a0' : '#4361ee',
                  }}>
                    {job.match}%
                  </div>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => window.open(`https://www.indeed.com/jobs?q=${encodeURIComponent(job.title)}`, '_blank')}
                >
                  Apply <HiOutlineArrowTopRightOnSquare />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
