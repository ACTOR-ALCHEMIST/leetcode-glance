// LeetCode Stats Widget for Übersicht
// Fetches and displays LeetCode user statistics, including a submission calendar.

// --- CONFIGURATION ---
// Replace with your LeetCode username.
const LEETCODE_USERNAME = "YourLeetCodeUsername"; // e.g., "john_doe"
// Make sure to replace this with your actual LeetCode username.

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
  background: rgba(34, 34, 58, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1.5px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(.4,0,.2,1);

  // Header section
  .header {
    background: linear-gradient(135deg, #3a2d71 0%, #1e1b3a 100%);
    color: #fff;
    padding: 20px 24px 12px 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .leetcode-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #ff6a00 0%, #ffb347 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    color: #fff;
    box-shadow: 0 2px 8px rgba(255,106,0,0.15);
  }

  .header-text { flex: 1; }
  .username { font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.5px; }
  .subtitle { font-size: 13px; opacity: 0.85; margin: 2px 0 0 0; }

  // Main content area
  .content {
    padding: 24px 24px 18px 24px;
    background: rgba(255,255,255,0.06);
    border-radius: 0 0 24px 24px;
    min-height: 180px;
  }

  .stat-card {
    background: rgba(255,255,255,0.10);
    border-radius: 14px;
    padding: 16px 0;
    text-align: center;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }

  .stat-number { font-size: 26px; font-weight: 700; color: #fff; margin: 0; }
  .stat-label { font-size: 12px; color: #e0e0e0; margin: 2px 0 0 0; font-weight: 500; }

  // Common section title
  .section-title { font-size: 14px; font-weight: 600; color: #fff; margin: 18px 0 10px 0; }

  // Submission calendar styles
  .submission-calendar {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 2px;
    padding: 5px 0 10px 0;
  }

  .calendar-day {
    aspect-ratio: 1 / 1;
    border-radius: 4px;
    background-color: #23234a;
    width: 100%;
    transition: background 0.2s;
  }

  // Color levels for submission counts
  .calendar-day.level-0 { background-color:rgba(21, 21, 55, 0.5); }
  .calendar-day.level-1 { background-color:rgb(5, 94, 54); }
  .calendar-day.level-2 { background-color:rgb(8, 135, 67); }
  .calendar-day.level-3 { background-color: #26a641; }
  .calendar-day.level-4 { background-color: #39d353; }

  // Difficulty breakdown section
  .difficulty-section { margin-top: 10px; }
  .difficulty-item { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .difficulty-item:last-child { border-bottom: none; }
  .difficulty-info { display: flex; align-items: center; gap: 8px; }
  .difficulty-dot { width: 8px; height: 8px; border-radius: 50%; }
  .difficulty-dot.easy { background: #00e6a3; }
  .difficulty-dot.medium { background: #ffc01e; }
  .difficulty-dot.hard { background: #ff375f; }
  .difficulty-name { font-size: 13px; color: #fff; font-weight: 500; }
  .difficulty-count { font-size: 14px; font-weight: 600; color: #fff; }

  // State indicators
  .error, .loading { color: #ffb347; text-align: center; font-size: 13px; padding: 20px; }
  .error { color: #ff375f; }
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
        <div className="content"><div className="error">Could not fetch data.<br />{error && <div><small>Error: {error}</small></div>}</div></div>
      </div>
    );
  }
  
  if (output.includes('error') || output.includes('<!DOCTYPE')) {
    // Render API error state...
    return (
      <div>
        <div className="header"><div className="leetcode-icon">LC</div><div className="header-text"><h1 className="username">API Error</h1><p className="subtitle">Invalid Response</p></div></div>
        <div className="content"><div className="error">API error.</div></div>
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
          <div className="content"><div className="error">Failed to fetch data for user "{LEETCODE_USERNAME}".</div></div>
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
            <p className="subtitle">LeetCode Stats {ranking && ranking !== "N/A" && <span style={{marginLeft:8}}>Rank #{ranking.toLocaleString()}</span>}</p>
          </div>
        </div>
        
        <div className="content">
          <div style={{display: 'flex', gap: 16, marginBottom: 18}}>
            <div className="stat-card" style={{flex: 1, marginBottom: 0}}>
              <h2 className="stat-number">{totalSolved}</h2>
              <p className="stat-label">Total Solved</p>
            </div>
            <div className="stat-card" style={{flex: 1, marginBottom: 0}}>
              <h2 className="stat-number">{acceptanceRate}%</h2>
              <p className="stat-label">Acceptance</p>
            </div>
          </div>
          <h3 className="section-title">Submission Calendar</h3>
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