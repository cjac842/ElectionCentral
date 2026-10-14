import type { ComponentType, Dispatch, SetStateAction } from "react"
import type { Page } from "./routes"
import "./Predictions.css"

type Props = {
  Header: ComponentType
  setPage: (page: Page, articleSlug?: string) => void
  setCountyMode: Dispatch<SetStateAction<"menu" | "states" | "map">>
}

export default function Predictions(props: Props) {
  const { Header, setPage, setCountyMode } = props

    return (
      <div className="app">

        <Header />

        <main className="predictions-page">

          <div className="page-eyebrow">2026 ELECTION FORECAST</div>

          <h1>
            Maps
          </h1>

          <p>
            Choose an election type to start building your forecast.
          </p>

          <div className="prediction-options">

            <button
              className="prediction-option senate-option"
              onClick={() =>
                setPage("senate")
              }
            >
              <span className="prediction-option-icon" aria-hidden="true" />
              <span className="prediction-option-title">Senate</span>
              <span className="prediction-option-description">Predict the 2026 U.S. Senate races.</span>
              <span className="prediction-option-arrow">→</span>
            </button>

            <button
              className="prediction-option governor-option"
              onClick={() =>
                setPage("governor")
              }
            >
              <span className="prediction-option-icon" aria-hidden="true" />
              <span className="prediction-option-title">Governor</span>
              <span className="prediction-option-description">Predict the 2026 gubernatorial races.</span>
              <span className="prediction-option-arrow">→</span>
            </button>

            <button
              className="prediction-option house-option"
              onClick={() =>
                setPage("house")
              }
            >
              <span className="prediction-option-icon" aria-hidden="true" />
              <span className="prediction-option-title">House</span>
              <span className="prediction-option-description">Predict all 435 U.S. House districts.</span>
              <span className="prediction-option-arrow">→</span>
            </button>

            <button
              className="prediction-option county-option"
              onClick={() => {
                setCountyMode("menu")
                setPage("county")
              }}
            >
              <span className="prediction-option-icon" aria-hidden="true" />
              <span className="prediction-option-title">Counties</span>
              <span className="prediction-option-description">Explore and rate counties across the United States.</span>
              <span className="prediction-option-arrow">→</span>
            </button>

          </div>

        </main>

      </div>
    )
}
