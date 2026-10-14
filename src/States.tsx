import type { ComponentProps, ComponentType, Dispatch, SetStateAction } from "react"
import CountyMapPage from "./CountyMapPage"
import "./Counties.css"
import "./States.css"

type CountyStateOption = { name: string; abbreviation: string; slug: string }
type MapProps = ComponentProps<typeof CountyMapPage> & { mode: "map" }
type SelectionProps = {
  mode: "selection"
  Header: ComponentType
  setCountyMode: Dispatch<SetStateAction<"menu" | "states" | "map">>
  setSelectedCountyState: Dispatch<SetStateAction<string | null>>
  setCountySearch: Dispatch<SetStateAction<string>>
  setSubmittedCountySearch: Dispatch<SetStateAction<string>>
  countyStateSearch: string
  setCountyStateSearch: Dispatch<SetStateAction<string>>
  countyStateOptions: CountyStateOption[]
}
type Props = MapProps | SelectionProps

export default function States(props: Props) {
  if (props.mode === "map") {
    return <CountyMapPage {...props} />
  }

  const {
    Header, setCountyMode, setSelectedCountyState, setCountySearch,
    setSubmittedCountySearch, countyStateSearch, setCountyStateSearch, countyStateOptions,
  } = props

  return (
    <div className="app">
      <Header />
      <main className="predictions-page county-selection-page">
        <div className="page-eyebrow">COUNTY MAPS</div>
        <h1>Select a State</h1>
        <p>Choose a state to open its individual county map.</p>

        <div className="county-state-search">
          <input
            type="text"
            value={countyStateSearch}
            onChange={(event) => setCountyStateSearch(event.target.value)}
            placeholder="Search state (ex: NJ, Texas, tx)"
            aria-label="Search state"
          />
        </div>

        <button className="back-button county-selection-back" onClick={() => { setCountyStateSearch(""); setCountyMode("menu") }}>
          ← Back to County Maps
        </button>

        <div className="county-state-grid">
          {countyStateOptions
            .filter((state) => {
              const query = countyStateSearch.trim().toLowerCase()
              if (!query) return true
              return state.name.toLowerCase().includes(query) || state.abbreviation.toLowerCase().includes(query)
            })
            .map((state) => (
              <button
                key={state.abbreviation}
                className="county-state-card"
                style={{ backgroundImage: `url("/states/${state.slug}.png")` }}
                onClick={() => {
                  setSelectedCountyState(state.abbreviation)
                  setCountyMode("map")
                  setCountySearch("")
                  setSubmittedCountySearch("")
                  setCountyStateSearch("")
                }}
              >
                <span className="county-state-card-overlay" />
                <span className="county-state-card-name">{state.name}</span>
                <span className="county-state-card-abbreviation">{state.abbreviation}</span>
              </button>
            ))}
        </div>

        {countyStateSearch.trim() && !countyStateOptions.some((state) => {
          const query = countyStateSearch.trim().toLowerCase()
          return state.name.toLowerCase().includes(query) || state.abbreviation.toLowerCase().includes(query)
        }) && <div className="county-state-no-results">No states found.</div>}
      </main>
    </div>
  )
}
