import { useState, useRef } from 'react';
import { HiOutlineRocketLaunch, HiOutlineCheckCircle, HiOutlineClock, HiOutlineArrowUpTray, HiOutlineDocumentText } from 'react-icons/hi2';

const initialProjects = [
  {
    id: 1,
    title: 'Sales Dashboard Analysis',
    description: 'Build an interactive sales dashboard using Python and Tableau that visualizes key performance metrics from a retail dataset.',
    skills: ['Python', 'Pandas', 'Tableau', 'Data Cleaning'],
    difficulty: 'Intermediate',
    status: 'completed',
    grade: 'A',
    feedback: 'Excellent work! Clean code and insightful visualizations.',
  },
  {
    id: 2,
    title: 'Customer Segmentation using K-Means',
    description: 'Analyze customer data and segment them into groups using clustering algorithms. Present findings with visualizations.',
    skills: ['Python', 'Scikit-learn', 'Matplotlib', 'Statistics'],
    difficulty: 'Advanced',
    status: 'in-progress',
    progress: 65,
    deadline: 'Mar 20, 2026',
  },
  {
    id: 3,
    title: 'SQL Data Pipeline',
    description: 'Design and implement a data pipeline that extracts, transforms, and loads (ETL) data from multiple CSV sources into a database.',
    skills: ['SQL', 'Python', 'ETL', 'Database Design'],
    difficulty: 'Intermediate',
    status: 'not-started',
    deadline: 'Apr 5, 2026',
  },
  {
    id: 4,
    title: 'Predictive Model for Housing Prices',
    description: 'Build a machine learning model to predict housing prices based on features like location, size, and amenities.',
    skills: ['Python', 'ML', 'Feature Engineering', 'Data Viz'],
    difficulty: 'Advanced',
    status: 'locked',
  },
];

const startInstructions = {
  1: "To complete this project, you will need to download the provided Retail Dataset (CSV). Your goal is to load this data into Pandas, clean any missing values, and aggregate the total sales by region and product category. Finally, export the cleaned data and import it into Tableau to build an interactive dashboard with at least 3 distinct chart types (e.g., bar chart, line graph, pie chart).",
  2: "For this advanced project, load the Mall Customers dataset. You must perform exploratory data analysis (EDA) to understand the distributions. Use Scikit-learn's StandardScaler to normalize the features, then apply the K-Means algorithm to find the optimal number of clusters using the Elbow Method. Visualize the final clusters using Matplotlib or Seaborn.",
  3: "Your objective is to write a generic Python script using SQLAlchemy that connects to a local PostgreSQL or SQLite database. The script should read 3 distinct CSV files, transform the column names to snake_case, filter out invalid rows, and insert the remaining records into properly normalized database tables.",
  4: "This project requires you to predict continuous housing prices. Begin by encoding categorical variables (e.g., neighborhood, house style) and handling outliers in square footage. Train a Random Forest Regressor and a Gradient Boosting model. Compare their RMSE (Root Mean Squared Error) and feature importances, and submit your final Jupyter Notebook."
};

const diffColors = { Beginner: 'green', Intermediate: 'blue', Advanced: 'pink' };

export default function Projects() {
  const [projectList, setProjectList] = useState(initialProjects);
  const [expandedId, setExpandedId] = useState(null);
  const fileInputRef = useRef(null);
  const [submittingId, setSubmittingId] = useState(null);

  const handleStartProject = (id) => {
    setProjectList((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, status: 'in-progress', progress: 0 } : proj
      )
    );
    setExpandedId(id); // Expand to show instructions automatically
  };

  const triggerFileUpload = (id) => {
    setSubmittingId(id);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && submittingId) {
      // Simulate file upload delay
      setTimeout(() => {
        setProjectList((prev) =>
          prev.map((proj) =>
            proj.id === submittingId
              ? {
                  ...proj,
                  status: 'completed',
                  grade: 'A+',
                  feedback: `Successfully uploaded ${file.name}. Outstanding submission! Your implementation perfectly matches the industry requirements.`,
                }
              : proj
          )
        );
        setSubmittingId(null);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      }, 800);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Mini Projects</h2>
        <p>Apply your skills with real-world projects. Complete them to add to your resume.</p>
      </div>

      {/* Hidden File Input for Submissions */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept=".zip,.rar,.pdf,.ipynb,.py,.js"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {projectList.map((proj) => (
          <div key={proj.id} className="card" style={{
            opacity: proj.status === 'locked' ? 0.55 : 1,
            borderLeft: `4px solid ${proj.status === 'completed' ? '#06d6a0' : proj.status === 'in-progress' ? '#4361ee' : proj.status === 'not-started' ? '#f59e0b' : '#e5e7eb'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <HiOutlineRocketLaunch style={{ color: '#4361ee', fontSize: '1.2rem' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{proj.title}</h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#6b7280', marginBottom: 12 }}>{proj.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {proj.skills.map((s, i) => <span key={i} className="badge-tag gray">{s}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className={`badge-tag ${diffColors[proj.difficulty]}`}>{proj.difficulty}</span>
                <span className={`badge-tag ${proj.status === 'completed' ? 'green' : proj.status === 'in-progress' ? 'blue' : proj.status === 'not-started' ? 'orange' : 'gray'}`}>
                  {proj.status === 'completed' ? '✓ Completed' : proj.status === 'in-progress' ? '⟳ In Progress' : proj.status === 'not-started' ? 'Not Started' : '🔒 Locked'}
                </span>
              </div>
            </div>

            {proj.status === 'in-progress' && (
              <div style={{ marginTop: 8 }}>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-label">
                    <span>Progress</span>
                    <span>{proj.progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    <HiOutlineClock style={{ verticalAlign: 'middle' }} /> Deadline: {proj.deadline}
                  </span>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => triggerFileUpload(proj.id)}
                  >
                    <HiOutlineArrowUpTray /> Upload File
                  </button>
                </div>
                
                {/* Expanded Project Details/Instructions */}
                {expandedId === proj.id && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem', marginBottom: 10, color: 'var(--text-primary)' }}>
                      <HiOutlineDocumentText style={{ color: 'var(--color-primary)' }} /> Project Requirements & Instructions
                    </h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: 16, borderRadius: 8 }}>
                      {startInstructions[proj.id] || "Follow the standard project guidelines to complete this assignment."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {proj.status === 'completed' && (
              <div style={{ marginTop: 8, padding: '12px 16px', borderRadius: 8, background: 'rgba(6,214,160,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <HiOutlineCheckCircle style={{ color: '#06d6a0' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#06d6a0' }}>Grade: {proj.grade}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{proj.feedback}</p>
              </div>
            )}

            {proj.status === 'not-started' && (
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                  <HiOutlineClock style={{ verticalAlign: 'middle' }} /> Deadline: {proj.deadline}
                </span>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleStartProject(proj.id)}
                >
                  Start Project
                </button>
              </div>
            )}
            
            {/* Toggle Instructions button for completed/in-progress projects */}
            {proj.status !== 'locked' && proj.status !== 'not-started' && (
               <button 
                 onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
                 style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
               >
                 {expandedId === proj.id ? 'Hide Instructions' : 'View Instructions'}
               </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
