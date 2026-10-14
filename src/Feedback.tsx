import { useRef, useState, type FormEvent } from "react"
import "./Feedback.css"

const GOOGLE_FORM_SUBMISSION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfx1_gmwy6fOslArmy1O2GBG4erLBpHELtMNPenwgxqycZzhw/formResponse"

export default function Feedback() {
  const timestampInputRef = useRef<HTMLInputElement>(null)
  const submittedRef = useRef(false)
  const [username, setUsername] = useState("")
  const [feedback, setFeedback] = useState("")
  const [submissionState, setSubmissionState] = useState<"idle" | "sending" | "success">("idle")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!feedback.trim()) {
      event.preventDefault()
      return
    }

    if (timestampInputRef.current) {
      timestampInputRef.current.value = new Date().toISOString()
    }

    submittedRef.current = true
    setSubmissionState("sending")
  }

  const handleFrameLoad = () => {
    if (submittedRef.current) {
      submittedRef.current = false
      setSubmissionState("success")
      setUsername("")
      setFeedback("")
    }
  }

  return (
    <main className="feedback-page">
      <div className="page-eyebrow">HELP THE WEBSITE IMPROVE!</div>
      <h1>Feedback</h1>
      <p className="feedback-lead">
        Have a suggestion? Send it below!
      </p>

      <section className="feedback-card">
        <form
          action={GOOGLE_FORM_SUBMISSION_URL}
          method="POST"
          target="election-central-feedback-submit-frame"
          onSubmit={handleSubmit}
        >
          <input
            ref={timestampInputRef}
            type="hidden"
            name="entry.824427509"
            defaultValue=""
          />

          <label className="feedback-label" htmlFor="feedback-x-username">
            X Username <span>(optional)</span>
          </label>
          <input
            id="feedback-x-username"
            className="feedback-input"
            type="text"
            name="entry.419467364"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="@YourUsername"
            autoComplete="off"
            maxLength={100}
          />

          <label className="feedback-label" htmlFor="feedback-message">
            Feedback <span className="feedback-required">(required)</span>
          </label>
          <textarea
            id="feedback-message"
            className="feedback-textarea"
            name="entry.1837924428"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Tell us what you think..."
            rows={7}
            maxLength={5000}
            required
          />
          <p className="feedback-privacy-note">
            Your feedback will be recorded in a Google Spreadsheet and may be used to improve the website.
          </p>

          <button
            className="feedback-submit-button"
            type="submit"
            disabled={!feedback.trim() || submissionState === "sending"}
          >
            {submissionState === "sending" ? "Submitting..." : "Submit Feedback"}
          </button>

          {submissionState === "success" && (
            <p className="feedback-status feedback-status-success" role="status">
              Thanks! Your feedback has been submitted.
            </p>
          )}
          {submissionState === "sending" && (
            <p className="feedback-status" role="status">
              Sending your feedback...
            </p>
          )}
        </form>
      </section>

      <iframe
        className="feedback-submit-frame"
        name="election-central-feedback-submit-frame"
        title="Feedback submission"
        tabIndex={-1}
        aria-hidden="true"
        onLoad={handleFrameLoad}
      />
    </main>
  )
}
