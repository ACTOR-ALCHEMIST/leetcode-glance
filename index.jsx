// LeetCode Glance for Übersicht
// by [Your Name or Username]
// Version 1.0.0

// --- ⚙️ CONFIGURATION ---
// Replace with your LeetCode username.
const LEETCODE_USERNAME = "YOUR_USERNAME_HERE";

// --- CORE LOGIC ---

// The command to fetch data using curl from a public LeetCode stats API.
export const command = `curl -s "https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}"`;

// Refresh frequency in milliseconds. 300000ms = 5 minutes.
export const refreshFrequency = 300000;

// --- 🎨 STYLING (CSS-in-JS) ---
export const className = `
  // --- POSITIONING ---
  // These lines center the widget on the screen.
  position: fixed; // Use fixed positioning for reliable centering
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // --- CONTAINER STYLES ---
  width: 320px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  color: #1d1d1f; // Default text color
  
  // Frosted glass effect
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  // Borders and shadows for depth
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  // Hover effect for interactivity
  &:hover {
    transform: translate(-50%, -52%); // Keep horizontal centering, move slightly up
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  // --- WIDGET SECTIONS ---

  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .leetcode-icon {
    width: 28px;
    height: 28px;
    background: #FFA116; // LeetCode's brand color
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: white;
    flex-shrink: 0;
  }

  .header-text { flex: 1; }
  .username { font-size: 18px; font-weight: 600; margin: 0; opacity: 0.95; }
  .subtitle { font-size: 13px; opacity: 0.8; margin: 2px 0 0 0; display: flex; justify-content: space-between; align-items: center; }

  .content { padding: 20px; }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .stat-card { background: rgba(0, 0, 0, 0.03); border-radius: 8px; padding: 12px; text-align: center; border: 1px solid rgba(0, 0, 0, 0.05); }
  .stat-number { font-size: 24px; font-weight: 700; margin: 0; }
  .stat-label { font-size: 12px; color: #86868b; margin: 2px 0 0 0; font-weight: 500; }
  
  .difficulty-section { margin-top: 16px; }
  .section-title { font-size: 14px; font-weight: 600; margin: 0 0 12px 0; }
  .difficulty-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
  .difficulty-item:last-child { border-bottom: none; }
  .difficulty-info { display: flex; align-items: center; gap: 8px; }
  .difficulty-dot { width: 8px; height: 8px; border-radius: 50%; }
  .difficulty-dot.easy { background: #00b8a3; }
  .difficulty-dot.medium { background: #ffc01e; }
  .difficulty-dot.hard { background: #ff375f; }
  .difficulty-name { font-size: 13px; font-weight: 500; }
  .difficulty-count { font-size: 14px; font-weight: 600; }
  
  .ranking { background: rgba(255, 255, 255, 0.2); border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; margin-left: 8px; }

  .error, .loading { color: #86868b; text-align: center; font-size: 13px; padding: 40px 20px; }
  .error { color: #ff3b30; }
`;

// --- RENDER FUNCTION ---
export const render = ({ output, error }) => {
  // Handle initial loading or command errors
  if (error) {
    return <div className="error">Error: Could not execute command.</div>;
  }
  if (!output) {
    return <div className="loading">Initializing and fetching data...</div>;
  }

  // Try to parse the data from the API
  let data;
  try {
    data = JSON.parse(output);
  } catch (e) {
    return <div className="error">Error: Could not parse API response. The API might be down or returning an error.</div>;
  }

  // Handle API-level errors (e.g., user not found)
  if (data.status !== "success") {
    const message = data.message || "Please check the username in the config.";
    return <div className="error">API Error for "{LEETCODE_USERNAME}":<br/>{message}</div>;
  }

  // If data is valid, render the main widget UI
  const { totalSolved, easySolved, mediumSolved, hardSolved, acceptanceRate, ranking } = data;

  return (
    <div>
      <div className="header">
        <div className="leetcode-icon">LC</div>
        <div className="header-text">
          <h1 className="username">{LEETCODE_USERNAME}</h1>
          <p className="subtitle">
            <span>LeetCode Stats</span>
            {ranking && ranking !== "N/A" && <span className="ranking">#{ranking.toLocaleString()}</span>}
          </p>
        </div>
      </div>
      
      <div className="content">
        <div className="stats-grid">
          <div className="stat-card">
            <h2 className="stat-number">{totalSolved}</h2>
            <p className="stat-label">Total Solved</p>
          </div>
          <div className="stat-card">
            <h2 className="stat-number">{acceptanceRate}%</h2>
            <p className="stat-label">Acceptance</p>
          </div>
        </div>

        <div className="difficulty-section">
          <h3 className="section-title">Solved by Difficulty</h3>
          <div className="difficulty-item">
            <div className="difficulty-info"><div className="difficulty-dot easy"></div><span className="difficulty-name">Easy</span></div>
            <span className="difficulty-count">{easySolved}</span>
          </div>
          <div className="difficulty-item">
            <div className="difficulty-info"><div className="difficulty-dot medium"></div><span className="difficulty-name">Medium</span></div>
            <span className="difficulty-count">{mediumSolved}</span>
          </div>
          <div className="difficulty-item">
            <div className="difficulty-info"><div className="difficulty-dot hard"></div><span className="difficulty-name">Hard</span></div>
            <span className="difficulty-count">{hardSolved}</span>
          </div>
        </div>
      </div>
    </div>
  );
};