import { useState } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi2';

const initialMessages = [
  {
    role: 'ai',
    text: "👋 Hello! I'm your AI Career Assistant. I can help you discover the right career path, identify skill gaps, and create a personalized learning roadmap.\n\nTry asking me things like:\n• What skills do I need to become a Data Analyst?\n• How do I start a career in Software Development?\n• What's the best way to learn Python?",
  },
];

const quickReplies = [
  'Skills for Data Analyst',
  'How to become a Full Stack Developer?',
  'Best Python learning resources',
  'Career roadmap for ML Engineer',
];

const aiResponses = {
  'Skills for Data Analyst': `Great choice! 📊 Here are the key skills you need for a **Data Analyst** role:\n\n**Technical Skills:**\n• SQL & Database Management\n• Python / R for Analysis\n• Data Visualization (Tableau, Power BI)\n• Excel (Advanced)\n• Statistics & Probability\n\n**Soft Skills:**\n• Problem Solving\n• Communication\n• Attention to Detail\n\nWould you like me to assess your current level in these skills? Head over to the **Skills Assessment** page to get started!`,
  'How to become a Full Stack Developer?': `Excellent goal! 💻 Here's a roadmap for becoming a **Full Stack Developer**:\n\n**Frontend:**\n• HTML, CSS, JavaScript\n• React.js or Vue.js\n• Responsive Design\n\n**Backend:**\n• Node.js / Python / Java\n• REST APIs & GraphQL\n• Authentication & Security\n\n**Database:**\n• SQL (PostgreSQL, MySQL)\n• NoSQL (MongoDB)\n\n**DevOps:**\n• Git & GitHub\n• Docker Basics\n• CI/CD\n\nReady to start? Go to **Career Selection** to set this as your goal!`,
  'Best Python learning resources': `🐍 Here are the best resources to learn Python:\n\n**Beginner:**\n• Python.org Official Tutorial\n• Automate the Boring Stuff\n• freeCodeCamp Python Course\n\n**Intermediate:**\n• Real Python Tutorials\n• Python Crash Course (Book)\n• LeetCode Easy Problems\n\n**Advanced:**\n• Fluent Python (Book)\n• Design Patterns in Python\n• Open Source Contributions\n\nI can create a personalized roadmap for you. Check out the **Learning Roadmap** section!`,
  'Career roadmap for ML Engineer': `🤖 Machine Learning Engineer is a high-demand role! Here's what you need:\n\n**Foundation:**\n• Python Programming\n• Linear Algebra & Calculus\n• Statistics & Probability\n\n**Core ML:**\n• Scikit-learn\n• Deep Learning (TensorFlow / PyTorch)\n• Natural Language Processing\n• Computer Vision\n\n**Engineering:**\n• MLOps & Model Deployment\n• Cloud Platforms (AWS/GCP)\n• Data Pipelines\n\nThis is an advanced path. Want me to assess your readiness? Visit **Skills Assessment**!`,
};

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    const aiReply = {
      role: 'ai',
      text: aiResponses[text] || `That's a great question! Based on my analysis, I'd recommend exploring the **Career Selection** page to set your career goal, and then take the **Skills Assessment** to identify your current level. I'll then generate a personalized learning roadmap for you! 🚀`,
    };
    setMessages((prev) => [...prev, userMsg, aiReply]);
    setInput('');
  };

  return (
    <div className="animate-fade-in">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role === 'ai' ? 'ai' : 'user'}`}>
              <div className="chat-avatar">{msg.role === 'ai' ? 'AI' : 'JD'}</div>
              <div className="chat-bubble" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        <div style={{ padding: '0 24px 8px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              className="btn btn-outline btn-sm"
              onClick={() => sendMessage(reply)}
            >
              {reply}
            </button>
          ))}
        </div>

        <div className="chat-input-wrapper">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your career..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          />
          <button className="chat-send-btn" onClick={() => sendMessage(input)}>
            <HiOutlinePaperAirplane />
          </button>
        </div>
      </div>
    </div>
  );
}
