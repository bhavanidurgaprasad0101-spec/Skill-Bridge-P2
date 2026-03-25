import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineBookOpen, HiOutlineCodeBracket, HiOutlinePhoto } from 'react-icons/hi2';

// Helper to generate rich content for any course
const generateCourseTopics = (courseTitle) => {
  return [
    {
      id: 1,
      title: 'Introduction and Core Concepts',
      content: `Welcome to the first module of ${courseTitle}. In this section, we lay down the foundational principles you need to understand before diving into more complex areas. Grasping these core concepts is crucial for your success in the real world. We will explore the primary architecture, common use cases, and the basic terminology used by industry professionals.`,
      technicalExample: `// Example: Initializing the core component
function initializeSystem(config) {
  console.log("System initializing with:", config);
  if (!config.apiKey) {
    throw new Error("API Key is required");
  }
  return { status: "ready", uptime: 0 };
}

const sys = initializeSystem({ apiKey: "sk_test_123" });
console.log(sys.status); // "ready"`,
      visual: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Advanced Techniques & Implementation',
      content: `Now that you understand the basics, let's explore advanced implementation strategies. This topic focuses on optimizing performance, writing cleaner syntax, and applying industry-standard best practices to real-world scenarios. We'll look at how to handle asynchronous data streams and optimize memory usage.`,
      technicalExample: `// Example: Advanced Pattern with Async/Await
class DataProcessor {
  constructor(dataset) {
    this.dataset = dataset;
  }
  
  async processBatches() {
    const results = [];
    for (let i = 0; i < this.dataset.length; i += 100) {
      const batch = this.dataset.slice(i, i + 100);
      const processed = await this.transformAsync(batch);
      results.push(...processed);
    }
    return results;
  }

  async transformAsync(batch) {
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(batch.map(item => ({...item, active: true}))), 100));
  }
}`,
      visual: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'Real-world Case Studies & Debugging',
      content: `Learning theory is good, but applying it is better. Let's look at how these concepts are used in enterprise applications. Notice how error handling, logging, and scale are considered in these examples. Debugging complex systems requires a systematic approach to identifying bottlenecks.`,
      technicalExample: `// Example: Production-ready error handling
async function executeTransaction(payload) {
  try {
    const result = await DataProcessor.processBatch(payload);
    logger.info(\`Successfully processed \${result.length} records\`);
    return { success: true, data: result };
  } catch (error) {
    logger.error("Batch processing failed critically", { 
      error: error.message,
      stack: error.stack,
      payloadSize: payload.length 
    });
    
    // Alerting system trigger
    await alertAdminSystem({ severity: 'HIGH', service: 'BatchProcessor' });
    
    return { success: false, error: "Internal processing error" };
  }
}`,
      visual: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    }
  ];
};

export default function CourseDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const course = location.state?.course || { title: `Course ${id}`, description: 'Explore detailed topics for this course.' };
  const topics = generateCourseTopics(course.title);
  
  const [activeTopic, setActiveTopic] = useState(topics[0]);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        <HiOutlineArrowLeft /> Back to Courses
      </button>

      <div className="page-header" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.8rem' }}>{course.title}</h2>
        <p>{course.description}</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar Table of Contents */}
        <div className="card" style={{ width: '300px', flexShrink: 0, padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modules</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: activeTopic.id === t.id ? 'var(--color-primary-bg)' : 'transparent',
                  color: activeTopic.id === t.id ? 'var(--color-primary)' : 'var(--text-primary)',
                  fontWeight: activeTopic.id === t.id ? 600 : 500,
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  border: '1px solid',
                  borderColor: activeTopic.id === t.id ? 'var(--color-primary-bg)' : 'transparent',
                }}
              >
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  background: activeTopic.id === t.id ? 'var(--color-primary)' : 'var(--bg-input)', 
                  color: activeTopic.id === t.id ? '#fff' : 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 
                }}>
                  {t.id}
                </div>
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="card" style={{ flex: 1, padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span className="badge-tag blue">Module {activeTopic.id}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeTopic.title}</h2>
          </div>

          {/* Reading Content */}
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>
              <HiOutlineBookOpen style={{ color: 'var(--color-primary)' }} /> Reading Content
            </h4>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              {activeTopic.content}
            </p>
          </div>

          {/* Visual Example */}
          <div style={{ marginBottom: 32 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>
              <HiOutlinePhoto style={{ color: 'var(--color-secondary)' }} /> Visual Example
            </h4>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <img src={activeTopic.visual} alt={activeTopic.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Technical Example */}
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', marginBottom: 12, color: 'var(--text-primary)' }}>
              <HiOutlineCodeBracket style={{ color: 'var(--color-success)' }} /> Technical Example
            </h4>
            <div style={{ 
              background: '#0f1729', 
              borderRadius: '12px', 
              padding: '20px', 
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem', fontFamily: 'monospace', lineHeight: 1.6 }}>
                <code>{activeTopic.technicalExample}</code>
              </pre>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
            <button 
              className="btn btn-secondary" 
              disabled={activeTopic.id === 1}
              onClick={() => setActiveTopic(topics[activeTopic.id - 2])}
              style={{ opacity: activeTopic.id === 1 ? 0.5 : 1 }}
            >
              Previous Module
            </button>
            <button 
              className="btn btn-primary" 
              disabled={activeTopic.id === topics.length}
              onClick={() => setActiveTopic(topics[activeTopic.id])}
              style={{ opacity: activeTopic.id === topics.length ? 0.5 : 1 }}
            >
              Next Module
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
