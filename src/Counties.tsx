import type { ComponentType, Dispatch, SetStateAction } from "react"
import type { Page } from "./routes"
import "./Counties.css"

type Props = {
  Header: ComponentType
  setCountyMode: Dispatch<SetStateAction<"menu" | "states" | "map">>
  setPage: (page: Page, articleSlug?: string) => void
  setSelectedCountyState: Dispatch<SetStateAction<string | null>>
  setCountySearch: Dispatch<SetStateAction<string>>
  setSubmittedCountySearch: Dispatch<SetStateAction<string>>
}

export default function Counties(props: Props) {
  const { Header, setCountyMode, setPage, setSelectedCountyState, setCountySearch, setSubmittedCountySearch } = props

  return (
    <div className="app">
      <Header />
      <main className="predictions-page county-selection-page">
        <div className="page-eyebrow">COUNTY MAPS</div>
        <h1>County Maps</h1>
        <p>Choose whether you want to explore the entire United States or an individual state.</p>

        <div className="prediction-options county-mode-options">
          <button className="prediction-option county-usa-option" onClick={() => { setSelectedCountyState(null); setCountyMode("map"); setCountySearch(""); setSubmittedCountySearch("") }}>
            <span className="prediction-option-icon" aria-hidden="true" />
            <span className="prediction-option-title">USA</span>
            <span className="prediction-option-description">Rate counties across the entire United States.</span>
            <span className="prediction-option-arrow">→</span>
          </button>
          <button className="prediction-option county-states-option" onClick={() => setCountyMode("states")}>
            <span className="prediction-option-icon" aria-hidden="true" />
            <span className="prediction-option-title">States</span>
            <span className="prediction-option-description">Choose one of the 50 states and build an individual county map.</span>
            <span className="prediction-option-arrow">→</span>
          </button>
        </div>

        <button className="back-button county-menu-back" onClick={() => { setCountyMode("menu"); setPage("predictions") }}>
          ← Back to Maps
        </button>
      </main>
    </div>
  )
}
