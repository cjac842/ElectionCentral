import type { ComponentType, Dispatch, SetStateAction } from "react"
import { RACE_RATING_CATEGORIES, raceRatingsData, type RaceRatingPartyColor } from "./RaceRatingsData"
import "./Race_Ratings.css"

type Props = {
  Header: ComponentType
  raceRatingCategory: "U.S. Senate" | "Governors" | "U.S. House"
  setRaceRatingCategory: Dispatch<SetStateAction<"U.S. Senate" | "Governors" | "U.S. House">>
}

export default function Race_Ratings(props: Props) {
  const { Header, raceRatingCategory, setRaceRatingCategory } = props

    const visibleRaces = raceRatingsData.filter((race) => race.election === raceRatingCategory)
    const categoriesForElection = raceRatingCategory === "U.S. House"
      ? RACE_RATING_CATEGORIES.filter((category) => category !== "Safe D" && category !== "Safe R")
      : RACE_RATING_CATEGORIES

    const textColor = (partyColor: RaceRatingPartyColor) =>
      partyColor === "D" ? "#2563c9" : partyColor === "R" ? "#c62832" : "#4b5563"

    return (
      <div className="app">
        <Header />
        <main className="race-ratings-page">
          <div className="page-eyebrow">ELECTION CENTRAL FORECAST</div>
          <h1>EC Official Race Ratings Charts</h1>
          <p className="race-ratings-intro">An organized way to view ratings for Senate, House and Governor.</p>

          <div className="race-ratings-toolbar">
            <label htmlFor="race-rating-category">Election</label>
            <select
              id="race-rating-category"
              value={raceRatingCategory}
              onChange={(event) => setRaceRatingCategory(event.target.value as typeof raceRatingCategory)}
            >
              <option>U.S. Senate</option>
              <option>Governors</option>
              <option>U.S. House</option>
            </select>
          </div>

          <div
            className={`race-ratings-board${raceRatingCategory === "U.S. House" ? " race-ratings-board-house" : ""}`}
            aria-label={`${raceRatingCategory} race ratings`}
            style={{
              gridTemplateColumns: `repeat(${categoriesForElection.length}, minmax(120px, 1fr))`,
              minWidth: `${categoriesForElection.length * 120}px`,
            }}
          >
            {categoriesForElection.map((category) => {
              const racesInColumn = visibleRaces.filter((race) => race.category === category)
              return (
                <section className="race-rating-column" key={category}>
                  <h2 className={`race-rating-heading rating-${category.toLowerCase().replace(/\s+/g, "-")}`}>{category}</h2>
                  <div className="race-rating-races">
                    {racesInColumn.map((race) => (
                      <div className="race-rating-race" key={race.id} style={{ color: textColor(race.partyColor) }}>
                        {race.label}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
          <p className="race-ratings-footnote">*Ratings reflect a FORECAST... not a guarentee of a result.*</p>
        </main>
      </div>
    )
}
