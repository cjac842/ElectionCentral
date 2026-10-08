import "./App.css"

export default function About() {
  return (
    <main className="about-page">
        <div className="page-eyebrow">ABOUT ELECTION CENTRAL</div>
        <h1>About Election Central</h1>
        <p className="about-lead">
          Election Central is an independent election analysis project focused on the 2026 elections with a goal to continue expanding.
          This project was created with React and TypeScript.
        </p>

        <div className="about-card">
          <h2>What is Election Central?</h2>
          <p>
            Election Central is a website that provides users a friendly interface to make their own predictions.
            Some features include zoom in for House races, specific zoom-ins for metro areas, and for Senate and Governor, see the candidates running.
          </p>

          <h2>What can you do here?</h2>
          <ul>
            <li>Build your own Senate, House, and Governor predictions.</li>
            <li>Build County Map predictions.</li>
            <li>Read Election Central articles and analysis (coming soon).</li>
            <li>Export prediction maps as images and post them on social media.</li>
          </ul>

          <h2>About the predictions</h2>
          <p>
            Election Central's ratings are not affiliated with any political party, betting market, or other organization trying to influence the prediction. It is independently made and maintained.
          </p>

          <h2>Rating System (Margin):</h2>
          <ul>
            <li><strong>Safe (15%+):</strong> The race is very likely to be won by the party.</li>
            <li><strong>Likely (5%-14.99%):</strong> The race is likely to be won by the party but it could get closer.</li>
            <li><strong>Lean (1%-4.99%):</strong> The race is leaning toward the party.</li>
            <li><strong>Tilt (0%-0.99%):</strong> The race is narrowly leaning toward the party.</li>
            <li><strong>Tossup:</strong> The race is close.</li>
          </ul>

          <h2>Time Counter Clarification</h2>
          <p>
            The Election Day countdown automatically accounts for differences in time zones and Daylight Savings Time changes, including the one-hour fallback that occurs in some states before Election Day on November 1st, 2026.
          </p>

          <h2>Changelog (major updates)</h2>
          <ul>
            <li><strong>v1.1 (2026-10-07):</strong> Added County map functionality, and fixed various bugs.</li>
            <li><strong>v1.0 (2026-10-01):</strong> Initial release of Election Central.</li>
          </ul>
        </div>
    </main>
  )
}
