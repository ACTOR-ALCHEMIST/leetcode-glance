// LeetCode Stats Widget for Übersicht
// Fetches and displays LeetCode user statistics, including a submission calendar.

// --- CONFIGURATION ---
// Replace with your LeetCode username.
const LEETCODE_USERNAME = "jasperhu2001";

// --- CORE LOGIC ---

// The command to fetch data. It uses a third-party LeetCode stats API.
export const command = `curl -s "https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}"`;

// Refresh frequency (in milliseconds). 300000ms = 5 minutes.
export const refreshFrequency = 300000;

// --- STYLING (JSX-in-CSS) ---
export const className = `
  // --- POSITIONING ---
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // --- CONTAINER STYLES ---
  width: 340px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  
  // Frosted glass effect
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  // Borders and shadows for depth
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  // Hover effect for interactivity
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translate(-50%, -52%);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  // Header section
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
    background: #FFA116;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: white;
  }

  .header-text { flex: 1; }
  .username { font-size: 18px; font-weight: 600; margin: 0; opacity: 0.95; }
  .subtitle { font-size: 13px; opacity: 0.8; margin: 2px 0 0 0; display: flex; justify-content: space-between; align-items: center; }

  // Main content area
  .content { padding: 20px; }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }

  .stat-card { background: rgba(0, 0, 0, 0.03); border-radius: 8px; padding: 12px; text-align: center; border: 1px solid rgba(0, 0, 0, 0.05); }
  .stat-number { font-size: 24px; font-weight: 700; color: #1d1d1f; margin: 0; }
  .stat-label { font-size: 12px; color: #86868b; margin: 2px 0 0 0; font-weight: 500; }

  // Common section title
  .section-title { font-size: 14px; font-weight: 600; color: #1d1d1f; margin: 20px 0 12px 0; }

  // Difficulty breakdown section
  .difficulty-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
  .difficulty-item:last-child { border-bottom: none; }
  .difficulty-info { display: flex; align-items: center; gap: 8px; }
  .difficulty-dot { width: 8px; height: 8px; border-radius: 50%; }
  .difficulty-dot.easy { background: #00b8a3; }
  .difficulty-dot.medium { background: #ffc01e; }
  .difficulty-dot.hard { background: #ff375f; }
  .difficulty-name { font-size: 13px; color: #1d1d1f; font-weight: 500; }
  .difficulty-count { font-size: 14px; font-weight: 600; color: #1d1d1f; }
  .ranking { background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%); border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 600; color: #1d1d1f; margin-left: 8px; }

  // --- SUBMISSION CALENDAR STYLES ---
  .submission-calendar {
    display: grid;
    // Creates 7 rows for days of the week
    grid-template-rows: repeat(7, 1fr);
    // Automatically flows columns left-to-right
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 2px; // Increased gap for better spacing
    padding: 5px 0;
  }

  .calendar-day {
    aspect-ratio: 1 / 1; // Make the cells perfect squares
    border-radius: 3px;
    background-color: #ebedf0; // Default color for no submissions
    width: 100%; // Fill the grid cell
  }

  // Color levels for submission counts
  .calendar-day.level-0 { background-color: #ebedf0; } // No submissions
  .calendar-day.level-1 { background-color: #9be9a8; } // 1-2 submissions
  .calendar-day.level-2 { background-color: #40c463; } // 3-5 submissions
  .calendar-day.level-3 { background-color: #30a14e; } // 6-9 submissions
  .calendar-day.level-4 { background-color: #216e39; } // 10+ submissions
  
  // --- STATE INDICATORS ---
  .error, .loading { color: #86868b; text-align: center; font-size: 13px; padding: 20px; }
  .error { color: #ff3b30; }
`;

/**
 * Renders the submission calendar grid.
 * @param {object} submissionCalendar - The submission data from the API.
 * @returns {JSX.Element} The calendar component.
 */
const renderCalendar = (submissionCalendar) => {
  if (!submissionCalendar) {
    return <p className="loading">No submission data available.</p>;
  }

  // --- Calendar Generation Logic ---
  const days = [];
  // MODIFIED: Show last 91 days (13 weeks) for a 6-month view
  const daysToShow = 182; 

  // Create an array of date objects for the last 91 days
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (daysToShow - 1 - i));
    days.push(date);
  }

  const getColorLevel = (count) => {
    if (count === 0) return 'level-0';
    if (count <= 2) return 'level-1';
    if (count <= 5) return 'level-2';
    if (count <= 9) return 'level-3';
    return 'level-4';
  };

  return (
    <div className="submission-calendar">
      {days.map((date, index) => {
        // FIXED: Create timestamp based on UTC midnight to avoid timezone issues.
        // This is the key to matching the API data correctly.
        const utcMidnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const timestamp = Math.floor(utcMidnight.getTime() / 1000);
        
        const count = submissionCalendar[timestamp] || 0;
        const levelClass = getColorLevel(count);
        const dateString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const tooltip = `${count} submissions on ${dateString}`;

        return (
          <div
            key={index}
            className={`calendar-day ${levelClass}`}
            title={tooltip}
          />
        );
      })}
    </div>
  );
};


// --- RENDER FUNCTION ---
export const render = ({ output, error }) => {
  if (error || !output || output.trim() === '') {
    // Render error state...
    return (
      <div>
        <div className="header"><div className="leetcode-icon">LC</div><div className="header-text"><h1 className="username">LeetCode</h1><p className="subtitle">No Data</p></div></div>
        <div className="content"><div className="error">Could not fetch data. Check network connection or command.<br />{error && <div><small>Error: {error}</small></div>}</div></div>
      </div>
    );
  }
  
  if (output.includes('error') || output.includes('<!DOCTYPE')) {
    // Render API error state...
    return (
      <div>
        <div className="header"><div className="leetcode-icon">LC</div><div className="header-text"><h1 className="username">API Error</h1><p className="subtitle">Invalid Response</p></div></div>
        <div className="content"><div className="error" style={{textAlign: 'left', wordBreak: 'break-all'}}>Received an invalid response from the API. It might be down.<pre style={{fontSize: '10px', background: '#eee', padding: '5px', borderRadius: '4px', marginTop: '8px', whiteSpace: 'pre-wrap'}}>{output.substring(0, 300)}...</pre></div></div>
      </div>
    );
  }

  try {
    const data = JSON.parse(output);
    
    if (data.status !== "success") {
      // Render user not found state...
      return (
        <div>
          <div className="header"><div className="leetcode-icon">LC</div><div className="header-text"><h1 className="username">LeetCode</h1><p className="subtitle">Fetch Failed</p></div></div>
          <div className="content"><div className="error">Failed to fetch data for user "{LEETCODE_USERNAME}".<br /><small>{data.message || "Please check if the username is correct."}</small></div></div>
        </div>
      );
    }

    const {
      totalSolved,
      acceptanceRate,
      ranking,
      easySolved,
      mediumSolved,
      hardSolved,
      submissionCalendar // Extract calendar data
    } = data;

    // Render the main widget UI with all data
    return (
      <div>
        <div className="header">
          <div className="leetcode-icon">LC</div>
          <div className="header-text">
            <h1 className="username">{LEETCODE_USERNAME}</h1>
            <p className="subtitle">
              <span>LeetCode Stats</span>
              {ranking && ranking !== "N/A" && <span className="ranking">Rank #{ranking.toLocaleString()}</span>}
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
          
          <h3 className="section-title">Submission Calendar (Last 6 months)</h3>
          {renderCalendar(submissionCalendar)}

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
    
  } catch (e) {
    // Render loading state
    return (
      <div>
        <div className="header"><div className="leetcode-icon">LC</div><div className="header-text"><h1 className="username">LeetCode</h1><p className="subtitle">Loading...</p></div></div>
        <div className="content"><div className="loading">Fetching data...</div></div>
      </div>
    );
  }
};