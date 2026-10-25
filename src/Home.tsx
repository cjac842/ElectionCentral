import type { ComponentType, Dispatch, SetStateAction } from "react"
import type { Page } from "./routes"
import type { Article } from "./ArticleTypes"
import "./Home.css"

type Props = {
  Header: ComponentType
  timeLeft: { days: number; hours: number; minutes: number; seconds: number }
  setPage: (page: Page, articleSlug?: string) => void
  articles: Article[]
  setSelectedArticle: Dispatch<SetStateAction<Article | null>>
}

export default function Home(props: Props) {
  const { Header, timeLeft, setPage, articles, setSelectedArticle } = props

    return (
      <div className="app">

        <Header />

        <main>

          <section className="hero">

            <div className="hero-badge">2026 MIDTERM ELECTIONS EDITION v1.3</div>

            <h1>
              Welcome to <span>Election Central!</span>
            </h1>

            <h2>
              Make your 2026 predictions using user-friendly interactive maps!
            </h2>

            <p className="hero-intro">
              Build your 2026 election forecast across the U.S. Senate, House, and Governor races!
            </p>

            <div className="countdown">

              <div>
                <span>
                  {timeLeft.days}
                </span>

                <small>
                  DAYS
                </small>
              </div>

              <div>
                <span>
                  {String(
                    timeLeft.hours
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <small>
                  HOURS
                </small>
              </div>

              <div>
                <span>
                  {String(
                    timeLeft.minutes
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <small>
                  MINUTES
                </small>
              </div>

              <div>
                <span>
                  {String(
                    timeLeft.seconds
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <small>
                  SECONDS
                </small>
              </div>

            </div>

            <p>
              Until Election Day
            </p>

            <div className="hero-action-buttons">
              <button
                className="prediction-button"
                onClick={() =>
                  setPage("predictions")
                }
              >
                Predictions
                <span className="button-arrow">→</span>
              </button>

              <button
                className="prediction-button articles-button"
                onClick={() => setPage("articles")}
              >
                Final Predictions (coming soon)
                <span className="button-arrow">→</span>
              </button>
            </div>

            <div className="home-features">
              <div className="home-feature-card">
                <span className="feature-icon">🇺🇸</span>
                <div>
                  <strong>Senate</strong>
                  <span>35 seats up in 2026</span>
                </div>
              </div>

              <div className="home-feature-card">
                <span className="feature-icon">🏛️</span>
                <div>
                  <strong>Governor</strong>
                  <span>39 races across the states</span>
                </div>
              </div>

              <div className="home-feature-card">
                <span className="feature-icon">🗺️</span>
                <div>
                  <strong>House</strong>
                  <span>All 435 seats up in 2026</span>
                </div>
              </div>
            </div>

          </section>

          <section className="home-dashboard">
            <div className="home-dashboard-inner">
              <div className="page-eyebrow">DASHBOARD</div>
              <h2>Explore the 2026 Elections</h2>
              <p className="home-dashboard-intro">
                Jump directly into the election maps.
              </p>

              <div className="home-dashboard-grid">
                <button className="home-dashboard-card senate-dashboard-card" onClick={() => setPage("senate")}>
                  <span className="dashboard-card-title">Senate</span>
                  <span className="dashboard-card-text">Rate the 35 Senate races up for 2026, including key races such as Michigan, Maine, North Carolina, Georgia, Texas, and more!.</span>
                  <span className="dashboard-card-arrow">→</span>
                </button>

                <button className="home-dashboard-card house-dashboard-card" onClick={() => setPage("house")}>
                  <span className="dashboard-card-title">House</span>
                  <span className="dashboard-card-text">Rate all 435 congressional districts!</span>
                  <span className="dashboard-card-arrow">→</span>
                </button>

                <button className="home-dashboard-card governor-dashboard-card" onClick={() => setPage("governor")}>
                  <span className="dashboard-card-title">Governor</span>
                  <span className="dashboard-card-text">Rate every Governor race, including key races such as Georgia, Nevada, Texas, Arizona, and more!</span>
                  <span className="dashboard-card-arrow">→</span>
                </button>

                {articles.length > 0 && (
                  <button
                    className="home-dashboard-card article-dashboard-card"
                    onClick={() => {
                      setSelectedArticle(articles[0])
                      setPage("article", articles[0].slug)
                    }}
                  >
                    <span className="dashboard-card-label">LATEST ARTICLE</span>
                    <span className="dashboard-card-title">{articles[0].title}</span>
                    <span className="dashboard-card-text">{articles[0].excerpt}</span>
                    <span className="dashboard-card-arrow">Read article →</span>
                  </button>
                )}
              </div>
            </div>
          </section>

        </main>

      </div>
    )
}
