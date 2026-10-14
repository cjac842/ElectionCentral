import type { ComponentType, Dispatch, RefObject, SetStateAction, ChangeEvent } from "react"
import type { Rating } from "./ElectionTypes"
import { RatingSelector as RatingSelectorComponent } from "./2026_Races"
import { CountyMap as CountyMapComponent } from "./CountyMapComponents"
import "./Counties.css"

type CountyPartyLabels = { democrats: string; republicans: string }
type PredictionMapType = "senate" | "house" | "governor" | "county"

type Props = {
  Header: ComponentType
  selectedCountyState: string | null
  countyTitles: Record<string, string>
  setCountyTitles: Dispatch<SetStateAction<Record<string, string>>>
  defaultPredictionTitle: (mapType: PredictionMapType, countyState?: string) => string
  countyPredictions: Record<string, Record<string, Rating>>
  countyPartyLabels: Record<string, CountyPartyLabels>
  editingPredictionTitle: PredictionMapType | null
  setEditingPredictionTitle: Dispatch<SetStateAction<PredictionMapType | null>>
  isExporting: boolean
  exportRef: RefObject<HTMLDivElement | null>
  selectedRating: Rating
  setSelectedRating: Dispatch<SetStateAction<Rating>>
  countySearch: string
  submittedCountySearch: string
  setCountySearch: Dispatch<SetStateAction<string>>
  setSubmittedCountySearch: Dispatch<SetStateAction<string>>
  countyMapRefreshVersion: number
  countyMapResetVersion: number
  setCountyPredictions: Dispatch<SetStateAction<Record<string, Record<string, Rating>>>>
  setCountyPartyLabels: Dispatch<SetStateAction<Record<string, CountyPartyLabels>>>
  countyCountsByState: Record<string, number>
  exportAsImage: () => void
  predictionFileInputRef: RefObject<HTMLInputElement | null>
  loadPredictionFile: (event: ChangeEvent<HTMLInputElement>) => void
  savePredictionFile: (mapType: PredictionMapType, title: string, predictions: Record<string, Rating>, scope?: string, partyLabels?: CountyPartyLabels) => void
  openPredictionFilePicker: () => void
  resetCountyMap: () => void
  setCountyMode: Dispatch<SetStateAction<"menu" | "states" | "map">>
}

export default function CountyMapPage(props: Props) {
  const {
    Header, selectedCountyState, countyTitles, setCountyTitles, defaultPredictionTitle,
    countyPredictions, countyPartyLabels, editingPredictionTitle, setEditingPredictionTitle,
    isExporting, exportRef, selectedRating, setSelectedRating, countySearch,
    submittedCountySearch, setCountySearch, setSubmittedCountySearch, countyMapRefreshVersion,
    countyMapResetVersion, setCountyPredictions, setCountyPartyLabels, countyCountsByState,
    exportAsImage, predictionFileInputRef, loadPredictionFile, savePredictionFile,
    openPredictionFilePicker, resetCountyMap, setCountyMode,
  } = props
  const countyScope = selectedCountyState ?? "USA"
  const countyTitle = countyTitles[countyScope] ?? defaultPredictionTitle("county", selectedCountyState ?? undefined)
  const countyMapPredictions: Record<string, Rating> = countyPredictions[countyScope] ?? {}
  const countyPartyLabel: CountyPartyLabels = countyPartyLabels[countyScope] ?? { democrats: "Democrats", republicans: "Republicans" }

  return (
    <div className="app">
      <Header />
      <main className="senate-page">
        <div className={`export-area ${isExporting ? "is-exporting" : ""}`} ref={exportRef}>
          <div className="senate-header">
            <div className="prediction-title-display">
              {editingPredictionTitle === "county" ? (
                <input
                  id="county-prediction-title"
                  className="prediction-title-input"
                  type="text"
                  value={countyTitle}
                  autoFocus
                  onChange={(event) => setCountyTitles((current) => ({ ...current, [countyScope]: event.target.value }))}
                  onBlur={() => setEditingPredictionTitle(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur()
                    else if (event.key === "Escape") setEditingPredictionTitle(null)
                  }}
                />
              ) : (
                <>
                  <h1>{countyTitle}</h1>
                  <button type="button" className="prediction-title-edit-button" onClick={() => setEditingPredictionTitle("county")} aria-label="Edit prediction title" title="Edit prediction title">✎</button>
                </>
              )}
            </div>
            <p>Select a rating, then click a county on the map.</p>
          </div>

          <RatingSelectorComponent selectedRating={selectedRating} setSelectedRating={setSelectedRating} showIndependent={false} />

          <div className="house-search">
            <div className="house-search-label">Search County or State</div>
            <form
              className="house-search-form"
              onSubmit={(event) => {
                event.preventDefault()
                const rawSearch = countySearch.trim()
                if (!rawSearch) {
                  setSubmittedCountySearch("")
                  return
                }
                setSubmittedCountySearch(rawSearch)
              }}
            >
              <input
                type="text"
                value={countySearch}
                onChange={(event) => setCountySearch(event.target.value)}
                placeholder="Search County or State (ex: Camden, NJ, New Jersey)"
                aria-label="Search county or state"
              />
              <button type="submit">Search</button>
            </form>
          </div>

          <CountyMapComponent
            predictions={countyMapPredictions}
            selectedRating={selectedRating}
            onCountyClick={(countyId: string) => setCountyPredictions((current) => ({ ...current, [countyScope]: { ...(current[countyScope] ?? {}), [countyId]: selectedRating } }))}
            selectedState={selectedCountyState}
            searchCounty={submittedCountySearch}
            resetToken={countyMapResetVersion}
            countyMapRefreshVersion={countyMapRefreshVersion}
            isExporting={isExporting}
          />

          <div className="senate-totals">
            <div className="total-democrat">
              <strong>{Object.values(countyMapPredictions).filter((rating) => rating.startsWith("D-")).length}</strong>
              <div className="county-party-label">
                {selectedCountyState ? (
                  <input
                    type="text"
                    value={countyPartyLabel.democrats}
                    maxLength={40}
                    onChange={(event) => setCountyPartyLabels((current) => ({
                      ...current,
                      [countyScope]: { ...countyPartyLabel, democrats: event.target.value },
                    }))}
                    aria-label="Democratic label"
                  />
                ) : <span>Democrats</span>}
                {selectedCountyState && <span className="county-party-edit-hint">✎</span>}
              </div>
            </div>

            <div className="total-tossup">
              <strong>{(selectedCountyState ? (countyCountsByState[selectedCountyState] ?? 0) : 3143) - Object.values(countyMapPredictions).filter((rating) => rating.startsWith("D-") || rating.startsWith("R-")).length}</strong>
              <span>Tossups</span>
            </div>

            <div className="total-republican">
              <strong>{Object.values(countyMapPredictions).filter((rating) => rating.startsWith("R-")).length}</strong>
              <div className="county-party-label">
                {selectedCountyState ? (
                  <input
                    type="text"
                    value={countyPartyLabel.republicans}
                    maxLength={40}
                    onChange={(event) => setCountyPartyLabels((current) => ({
                      ...current,
                      [countyScope]: { ...countyPartyLabel, republicans: event.target.value },
                    }))}
                    aria-label="Republican label"
                  />
                ) : <span>Republicans</span>}
                {selectedCountyState && <span className="county-party-edit-hint">✎</span>}
              </div>
            </div>
          </div>

          <div className="county-map-actions" style={{ display: isExporting ? "none" : undefined }}>
            <button className="export-button" onClick={exportAsImage} disabled={isExporting}>{isExporting ? "Exporting..." : "Export as Image"}</button>
            <input ref={predictionFileInputRef} type="file" accept=".ecp,application/json" onChange={loadPredictionFile} className="prediction-file-input" />
            <button className="export-button prediction-file-button" onClick={() => savePredictionFile("county", countyTitle, countyMapPredictions, countyScope, selectedCountyState ? countyPartyLabel : undefined)}>Save Prediction</button>
            <button className="back-button prediction-file-button" onClick={openPredictionFilePicker}>Load Prediction</button>
            <button className="back-button" onClick={resetCountyMap}>Reset Map</button>
            <button className="back-button" onClick={() => { setCountySearch(""); setSubmittedCountySearch(""); setCountyMode(selectedCountyState ? "states" : "menu") }}>← Back to {selectedCountyState ? "States" : "County Maps"}</button>
          </div>

          <div className="map-legend county-map-legend">
            <div><span className="legend-color democrat-safe" />Safe D</div>
            <div><span className="legend-color democrat-likely" />Likely D</div>
            <div><span className="legend-color democrat-lean" />Lean D</div>
            <div><span className="legend-color democrat-tilt" />Tilt D</div>
            <div><span className="legend-color tossup" />Tossup</div>
            <div><span className="legend-color republican-tilt" />Tilt R</div>
            <div><span className="legend-color republican-lean" />Lean R</div>
            <div><span className="legend-color republican-likely" />Likely R</div>
            <div><span className="legend-color republican-safe" />Safe R</div>
          </div>
        </div>
      </main>
    </div>
  )
}
