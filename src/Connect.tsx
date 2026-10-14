import "./Connect.css"

export default function Connect() {
  return (
    <main className="connect-page">
      <div className="connect-eyebrow">GET IN TOUCH</div>
      <h1>Connect</h1>
      <p className="connect-lead">Have a question, business inquiry, or want to get in touch with ElectionCentral? Reach out through either of the links below.</p>

      <section className="connect-card" aria-label="ElectionCentral contact information">
        <div className="connect-item">
          <div className="connect-icon connect-email-icon" aria-hidden="true">✉</div>
          <div className="connect-item-copy">
            <h2>Business Email</h2>
            <a className="connect-link" href="mailto:electioncentral0@gmail.com">electioncentral0@gmail.com</a>
          </div>
        </div>

        <div className="connect-divider" />

        <div className="connect-item">
          <div className="connect-icon connect-x-icon" aria-hidden="true">𝕏</div>
          <div className="connect-item-copy">
            <h2>X Account</h2>
            <a className="connect-link connect-x-link" href="https://x.com/ElectCentralHQ" target="_blank" rel="noopener noreferrer" aria-label="Open ElectionCentral on X">@ElectCentralHQ</a>
            <p className="connect-note">Follow ElectionCentral on X for updates and announcements.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
