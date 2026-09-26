import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import "./App.css"
import { senateRaceInfo, governorRaceInfo } from "./ElectionData"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "@vnedyalk0v/react19-simple-maps"
import { geoCentroid } from "d3-geo"
import html2canvas from "@html2canvas/html2canvas"
import About from "./About"

const geoUrl =
  "https://unpkg.com/us-atlas@3.0.1/states-10m.json"

type Rating =
  | "D-Safe"
  | "D-Likely"
  | "D-Lean"
  | "D-Tilt"
  | "R-Safe"
  | "R-Likely"
  | "R-Lean"
  | "R-Tilt"
  | "I-Safe"
  | "I-Likely"
  | "I-Lean"
  | "I-Tilt"
  | "T"

/* =========================================================
   2026 SENATE STATES
========================================================= */

const senate2026States = new Set([
  "Maine",
  "New Hampshire",
  "Massachusetts",
  "Rhode Island",
  "New Jersey",
  "Delaware",
  "Virginia",
  "North Carolina",
  "South Carolina",
  "Georgia",
  "Florida",
  "Alabama",
  "Mississippi",
  "Tennessee",
  "Kentucky",
  "West Virginia",
  "Ohio",
  "Michigan",
  "Illinois",
  "Iowa",
  "Minnesota",
  "South Dakota",
  "Nebraska",
  "Kansas",
  "Oklahoma",
  "Texas",
  "Arkansas",
  "Louisiana",
  "New Mexico",
  "Colorado",
  "Wyoming",
  "Montana",
  "Idaho",
  "Oregon",
  "Alaska",
])

/* =========================================================
   2026 GOVERNOR STATES
========================================================= */

const governor2026States = new Set([
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Iowa",
  "Kansas",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Mexico",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Vermont",
  "Wisconsin",
  "Wyoming",
])

/* =========================================================
   STATE ABBREVIATIONS
========================================================= */

const stateAbbreviations: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
}

/* =========================================================
   CUSTOM LABEL POSITIONS
========================================================= */

const customLabelPositions: Record<string, [number, number]> = {
  Florida: [-81.7, 28.5],

  // Michigan label position
  Michigan: [-84.6, 43.4],

  Alaska: [-151, 65],
  Louisiana: [-92.5, 31.5],
}

/* =========================================================
   SMALL-STATE SIDE BUTTONS
========================================================= */

const smallStateButtons = [
  "New Hampshire",
  "Vermont",
  "Massachusetts",
  "Rhode Island",
  "Connecticut",
  "New Jersey",
  "Delaware",
  "Maryland",
]

/* =========================================================
   STATE COLORS
=========================================================

   Democratic:
   Safe   = darkest
   Likely = previous Lean
   Lean   = previous Tilt
   Tilt   = new lighter shade

   Republican:
   Safe   = darkest
   Likely = previous Lean
   Lean   = previous Tilt
   Tilt   = new lighter shade
========================================================= */

function getStateColor(
  state: string,
  electionStates: Set<string>,
  predictions: Record<string, Rating>
) {
  /*
   * States that aren't participating in the
   * current election are shown in gray.
   */
  if (!electionStates.has(state)) {
    return "#5B6068"
  }

  const prediction = predictions[state]

  switch (prediction) {
    /* -------------------------
       DEMOCRATIC
    ------------------------- */

    case "D-Safe":
      return "#1E3A8A"

    case "D-Likely":
      return "#5274D0"

    case "D-Lean":
      return "#8FA6E8"

    case "D-Tilt":
      return "#C1CFF5"

    /* -------------------------
       REPUBLICAN
    ------------------------- */

    case "R-Safe":
      return "#991B1B"

    case "R-Likely":
      return "#D86666"

    case "R-Lean":
      return "#E39A9A"

    case "R-Tilt":
      return "#F2C4C4"

    /* -------------------------
       INDEPENDENT
    ------------------------- */

    case "I-Safe":
      return "#5B3A8E"

    case "I-Likely":
      return "#8062B3"

    case "I-Lean":
      return "#A58BCB"

    case "I-Tilt":
      return "#C9B9E4"

    /* -------------------------
       INDEPENDENT
    ------------------------- */

    case "I-Safe":
      return "#6B4A9B"

    case "I-Likely":
      return "#9277C0"

    case "I-Lean":
      return "#B19AD4"

    case "I-Tilt":
      return "#D7CAE9"

    /* -------------------------
       TOSSUP
    ------------------------- */

    case "T":
    default:
      return "#D1D1D1"
  }
}

/* =========================================================
   HOVER COLORS
========================================================= */

function getHoverColor(
  state: string,
  electionStates: Set<string>,
  selectedRating: Rating
) {
  if (!electionStates.has(state)) {
    return "#5B6068"
  }

  switch (selectedRating) {
    /* -------------------------
       DEMOCRATIC
    ------------------------- */

    case "D-Safe":
      return "#294AA0"

    case "D-Likely":
      return "#6684DB"

    case "D-Lean":
      return "#A5B7ED"

    case "D-Tilt":
      return "#D2DCFA"

    /* -------------------------
       REPUBLICAN
    ------------------------- */

    case "R-Safe":
      return "#AD2424"

    case "R-Likely":
      return "#E27676"

    case "R-Lean":
      return "#EDADAD"

    case "R-Tilt":
      return "#F7D8D8"

    /* -------------------------
       TOSSUP
    ------------------------- */

    case "T":
    default:
      return "#B5B5B5"
    // Independents
    case "I-Safe":
      return "#6B4A9B"
    case "I-Likely":
      return "#9277C0"
    case "I-Lean":
      return "#B19AD4"
    case "I-Tilt":
      return "#D7CAE9"
  }
}

/* =========================================================
   RATING SELECTOR
========================================================= */

function RatingSelector({
  selectedRating,
  setSelectedRating,
  showIndependent = true,
}: {
  selectedRating: Rating
  setSelectedRating: (
    rating: Rating
  ) => void
  showIndependent?: boolean
}) {
  useEffect(() => {
    if (!showIndependent && selectedRating.startsWith("I-")) {
      setSelectedRating("T")
    }
  }, [showIndependent, selectedRating, setSelectedRating])

  return (
    <div className="rating-selector">

      {/* DEMOCRATIC RATINGS */}

      <div className="rating-group">

        <div className="rating-group-title democrat-title">
          Democratic
        </div>

        <div className="rating-buttons">

          {(
            [
              ["D-Safe", "Safe"],
              ["D-Likely", "Likely"],
              ["D-Lean", "Lean"],
              ["D-Tilt", "Tilt"],
            ] as [Rating, string][]
          ).map(
            ([rating, label]) => (
              <button
                key={rating}
                className={`rating-button ${rating
                  .toLowerCase()} ${
                  selectedRating === rating
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedRating(
                    rating
                  )
                }
              >
                {label}
              </button>
            )
          )}

        </div>

      </div>

      {/* TOSSUP */}

      <button
        className={`rating-button tossup ${
          selectedRating === "T"
            ? "active"
            : ""
        }`}
        onClick={() =>
          setSelectedRating("T")
        }
      >
        Tossup
      </button>

      {/* REPUBLICAN RATINGS */}

      <div className="rating-group">

        <div className="rating-group-title republican-title">
          Republican
        </div>

        <div className="rating-buttons">

          {(
            [
              ["R-Tilt", "Tilt"],
              ["R-Lean", "Lean"],
              ["R-Likely", "Likely"],
              ["R-Safe", "Safe"],
            ] as [Rating, string][]
          ).map(
            ([rating, label]) => (
              <button
                key={rating}
                className={`rating-button ${rating
                  .toLowerCase()} ${
                  selectedRating === rating
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedRating(
                    rating
                  )
                }
              >
                {label}
              </button>
            )
          )}

        </div>

      </div>

      {showIndependent && (
        <>
          {/* INDEPENDENT RATINGS */}
          <div className="rating-group">
            <div className="rating-group-title independent-title">
              Independent
            </div>

            <div className="rating-buttons">
              {([
                ["I-Tilt", "Tilt"],
                ["I-Lean", "Lean"],
                ["I-Likely", "Likely"],
                ["I-Safe", "Safe"],
              ] as [Rating, string][]).map(([rating, label]) => (
                <button
                  key={rating}
                  className={`rating-button independent-rating ${rating.toLowerCase()} ${
                    selectedRating === rating ? "active" : ""
                  }`}
                  onClick={() => setSelectedRating(rating)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  )
}

/* =========================================================
   ELECTION MAP
========================================================= */

function formatCandidate(
  candidate: string | undefined,
  party: "D" | "R" | "I",
  incumbent?: boolean
) {
  if (!candidate || candidate.trim().toLowerCase() === "none") {
    return null
  }

  return `${candidate}${incumbent ? ` (${party}-inc.)` : ` (${party})`}`
}

function formatRepublicanCandidates(
  race: import("./ElectionData").ElectionRaceInfo
) {
  if (race.republicanCandidates) {
    const candidates = race.republicanCandidates.filter(Boolean)
    if (candidates.length > 0) {
      return candidates
        .map((candidate, index) =>
          formatCandidate(
            candidate,
            "R",
            index === 0 && race.republicanIncumbent
          )
        )
        .filter(Boolean)
        .join(" vs. ")
    }
  }

  return formatCandidate(
    race.republicanCandidate,
    "R",
    race.republicanIncumbent
  )
}

function formatRaceHover(
  state: string,
  race: import("./ElectionData").ElectionRaceInfo
) {
  const candidates: string[] = []

  const democratic = formatCandidate(
    race.democraticCandidate,
    "D",
    race.democraticIncumbent
  )

  const republican = formatRepublicanCandidates(race)

  const independent = formatCandidate(
    race.independentCandidate,
    "I",
    race.independentIncumbent
  )

  if (democratic) candidates.push(democratic)
  if (republican) candidates.push(republican)
  if (independent) candidates.push(independent)

  const abbreviation = stateAbbreviations[state] ?? state
  const keyRace = race.keyRace ? "Key Race - " : ""
  const rating = race.electionCentralRating
    ? ` - ${race.electionCentralRating}`
    : ""

  return `${abbreviation} - ${keyRace}${candidates.join(" vs. ")}${rating}`
}

function ElectionMap({
  electionStates,
  predictions,
  selectedRating,
  onStateClick,
  raceInfo,
}: {
  electionStates: Set<string>
  predictions: Record<string, Rating>
  selectedRating: Rating
  onStateClick: (state: string) => void
  raceInfo: Record<string, import("./ElectionData").ElectionRaceInfo>
}) {
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  const hoveredRace = hoveredState
    ? raceInfo[hoveredState]
    : undefined

  return (
    <div className="map-container">
      <div className="state-map-hint">
        {hoveredState && hoveredRace
          ? formatRaceHover(hoveredState, hoveredRace)
          : "Hover over a state to see its race"}
      </div>

      <div className="small-state-controls">
        <div className="small-state-buttons">
          {smallStateButtons
            .filter((state) => electionStates.has(state))
            .map((state) => (
              <button
                key={state}
                type="button"
                className="small-state-button"
                style={{
                  background: getStateColor(
                    state,
                    electionStates,
                    predictions
                  ),
                  color: [
                    "D-Safe",
                    "R-Safe",
                    "I-Safe",
                    "D-Likely",
                    "R-Likely",
                    "I-Likely",
                    "D-Lean",
                    "R-Lean",
                    "I-Lean",
                  ].includes(predictions[state])
                    ? "#ffffff"
                    : "#24324a",
                  borderColor: "rgba(0, 0, 0, 0.14)",
                }}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onStateClick(state)}
              >
                {stateAbbreviations[state] ?? state}
              </button>
            ))}
        </div>
      </div>

      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 1000,
        }}
      >
        {/* =================================================
            STATE SHAPES
        ================================================= */}

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName =
                geo.properties?.name

              const isElectionState =
                electionStates.has(stateName)

              const stateColor =
                getStateColor(
                  stateName,
                  electionStates,
                  predictions
                )

              return (
                <Geography
                  key={geo.id ?? stateName}
                  geography={geo}
                  tabIndex={-1}

                  /*
                   * Prevent the browser from applying
                   * a black/pressed focus appearance.
                   */
                  onMouseDown={(event) => {
                    event.preventDefault()
                  }}

                  onMouseEnter={() => {
                    if (isElectionState) {
                      setHoveredState(stateName)
                    }
                  }}

                  onMouseLeave={() => {
                    setHoveredState(null)
                  }}

                  onClick={() => {
                    if (isElectionState) {
                      onStateClick(stateName)
                    }
                  }}

                  style={{
                    default: {
                      fill: stateColor,

                      stroke:
                        isElectionState
                          ? "#333333"
                          : "#3E4248",

                      strokeWidth:
                        isElectionState
                          ? 0.8
                          : 0.6,

                      outline: "none",
                    },

                    hover: {
                      fill:
                        isElectionState
                          ? getHoverColor(
                              stateName,
                              electionStates,
                              selectedRating
                            )
                          : "#5B6068",

                      stroke:
                        isElectionState
                          ? "#222222"
                          : "#3E4248",

                      strokeWidth:
                        isElectionState
                          ? 1.2
                          : 0.6,

                      outline: "none",

                      cursor:
                        isElectionState
                          ? "pointer"
                          : "default",
                    },

                    /*
                     * Keep the state's actual color
                     * when clicked.
                     */
                    pressed: {
                      fill: stateColor,

                      stroke:
                        isElectionState
                          ? "#333333"
                          : "#3E4248",

                      strokeWidth:
                        isElectionState
                          ? 0.8
                          : 0.6,

                      outline: "none",
                    },
                  }}
                />
              )
            })
          }
        </Geographies>

        {/* =================================================
            STATE LABELS
        ================================================= */}

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties?.name
              const abbreviation = stateAbbreviations[stateName]

              if (!abbreviation || !electionStates.has(stateName)) {
                return null
              }

              // States represented by the side buttons use the
              // buttons as their labels instead of map labels.
              if (smallStateButtons.includes(stateName)) {
                return null
              }

              const coordinates =
                customLabelPositions[stateName] ??
                geoCentroid(geo)

              return (
                <Marker
                  key={`${geo.id ?? stateName}-label`}
                  coordinates={coordinates as any}
                >
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="state-label"
                  >
                    {abbreviation}
                  </text>
                </Marker>
              )
            })
          }
        </Geographies>

      </ComposableMap>
    </div>
  )
}

/* =========================================================
   HOUSE MAP
========================================================= */


function getHouseColor(prediction?: Rating) {
  switch (prediction) {
    case "D-Safe": return "#1E3A8A"
    case "D-Likely": return "#5274D0"
    case "D-Lean": return "#8FA6E8"
    case "D-Tilt": return "#C1CFF5"
    case "R-Safe": return "#991B1B"
    case "R-Likely": return "#D86666"
    case "R-Lean": return "#E39A9A"
    case "R-Tilt": return "#F2C4C4"
    case "I-Safe": return "#5B3A8E"
    case "I-Likely": return "#8062B3"
    case "I-Lean": return "#A58BCB"
    case "I-Tilt": return "#C9B9E4"
    case "T":
    default: return "#D1D1D1"
  }
}

function getHouseHoverColor(selectedRating: Rating) {
  switch (selectedRating) {
    case "D-Safe": return "#294AA0"
    case "D-Likely": return "#6684DB"
    case "D-Lean": return "#A5B7ED"
    case "D-Tilt": return "#D2DCFA"
    case "R-Safe": return "#AD2424"
    case "R-Likely": return "#E27676"
    case "R-Lean": return "#EDADAD"
    case "R-Tilt": return "#F7D8D8"
    case "I-Safe": return "#6B4A9B"
    case "I-Likely": return "#9277C0"
    case "I-Lean": return "#B19AD4"
    case "I-Tilt": return "#D7CAE9"
    case "T":
    default: return "#B5B5B5"
  }
}

function formatHouseDistrictHover(district: string) {
  return district
}

const HOUSE_REGION_PRESETS = [
  { key: "nyc", label: "NYC", x: 725, y: 160, zoom: 15 },
  { key: "philadelphia", label: "PHI", x: 700, y: 190, zoom: 8 },
  { key: "boston", label: "BOS", x: 752, y: 132, zoom: 8 },
  { key: "houston", label: "HOU", x: 420, y: 420, zoom: 8 },
  { key: "los-angeles", label: "LA", x: 66, y: 300, zoom: 8 },
  { key: "san-francisco", label: "SF", x: 22, y: 210, zoom: 8 },
  { key: "dallas", label: "DFW", x: 417, y: 363, zoom: 8 },
  { key: "chicago", label: "CHI", x: 525, y: 180, zoom: 14 },
  { key: "miami", label: "MIA", x: 670, y: 460, zoom: 14 },
] as const

function HouseMap({
  predictions,
  selectedRating,
  onDistrictClick,
  hoveredDistrict,
  setHoveredDistrict,
  searchDistrict,
}: {
  predictions: Record<string, Rating>
  selectedRating: Rating
  onDistrictClick: (district: string) => void
  hoveredDistrict: string | null
  setHoveredDistrict: (district: string | null) => void
  searchDistrict: string | null
}) {
  const [houseData, setHouseData] = useState<any>(null)
  const [houseMapError, setHouseMapError] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragStartRef = useRef<{
    x: number
    y: number
    panX: number
    panY: number
    district: string | null
  } | null>(null)
  const didDragRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    fetch(`${import.meta.env.BASE_URL}house-districts-2026-v2.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setHouseData(data)
      })
      .catch(() => {
        if (!cancelled) setHouseMapError(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const renderedDistricts: Array<{
    key: string
    d: string
    region: string
    shortName: string
    longName: string
  }> = Array.isArray(houseData?.districts)
    ? houseData.districts.map((district: any) => ({
        key: district.region,
        d: district.d,
        region: district.region,
        shortName: district.shortName ?? district.region,
        longName: district.longName ?? district.region,
      }))
    : []

  const clampPan = (x: number, y: number, nextZoom: number) => {
    // Allow enough panning to center coastal metro areas such as NYC and San Francisco.
    const maxX = ((nextZoom - 1) * 800) / 2 + 400
    const maxY = ((nextZoom - 1) * 501) / 2 + 250.5

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }

  const changeZoom = (nextZoom: number) => {
    const safeZoom = Math.max(1, Math.min(14, nextZoom))
    setZoom(safeZoom)
    setPan((currentPan) => clampPan(currentPan.x, currentPan.y, safeZoom))
  }

  const resetZoom = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const focusRegion = useCallback((x: number, y: number, regionZoom: number) => {
    const nextZoom = regionZoom
    const centeredPan = {
      x: nextZoom * (400 - x),
      y: nextZoom * (250.5 - y),
    }

    setZoom(nextZoom)
    setPan(clampPan(centeredPan.x, centeredPan.y, nextZoom))
  }, [])

  useEffect(() => {
    if (!searchDistrict || !houseData) return

    const rawSearch = searchDistrict.trim()
    const normalized = rawSearch.toUpperCase().replace(/\s+/g, "")
    const districtMatch = normalized.match(/^([A-Z]{2})-(AL|\d{1,2})$/)

    requestAnimationFrame(() => {
      /* ---------------------------------------------------
         DISTRICT SEARCH
      --------------------------------------------------- */
      if (districtMatch) {
        const state = districtMatch[1]
        const districtNumber = districtMatch[2]
        const candidates = [
          `${state}-${districtNumber}`,
          districtNumber !== "AL"
            ? `${state}-${districtNumber.padStart(2, "0")}`
            : `${state}-AL`,
        ]

        const path = candidates
          .map((candidate) =>
            document.querySelector(
              `path[data-district="${candidate}"]`,
            ) as SVGPathElement | null,
          )
          .find(Boolean)

        if (!path) return

        const box = path.getBBox()
        focusRegion(box.x + box.width / 2, box.y + box.height / 2, 8)
        return
      }

      /* ---------------------------------------------------
         STATE SEARCH
         Accepts either the full state name or abbreviation,
         regardless of capitalization.
      --------------------------------------------------- */
      const normalizedStateName = rawSearch
        .replace(/\s+/g, " ")
        .toLowerCase()

      const stateEntry = Object.entries(stateAbbreviations).find(
        ([stateName, abbreviation]) =>
          stateName.toLowerCase() === normalizedStateName ||
          abbreviation.toLowerCase() === normalizedStateName,
      )

      if (!stateEntry) return

      const abbreviation = stateEntry[1]
      const statePaths = Array.from(
        document.querySelectorAll(
          `path[data-district^="${abbreviation}-"]`,
        ),
      ) as SVGPathElement[]

      if (statePaths.length === 0) return

      const boxes = statePaths.map((path) => path.getBBox())
      const minX = Math.min(...boxes.map((box) => box.x))
      const minY = Math.min(...boxes.map((box) => box.y))
      const maxX = Math.max(...boxes.map((box) => box.x + box.width))
      const maxY = Math.max(...boxes.map((box) => box.y + box.height))

      const stateZoomOverrides: Record<string, number> = {
        // Large states need a wider view.
        TX: 2.2,
        CA: 2.25,
        MT: 3.5,
        ID: 3,
        MN: 4,
        FL: 3.5,

        // Smaller states need a slightly tighter view.
        PA: 6,
        NJ: 9,
        NH: 6,
        VT: 6,
        MA: 9,
        RI: 12,
        CT: 11,
        MD: 8,
        DE: 8,
      }

      focusRegion(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        stateZoomOverrides[abbreviation] ?? 5,
      )
    })
  }, [searchDistrict, houseData, focusRegion, setHoveredDistrict])

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (zoom <= 1) return

    event.currentTarget.setPointerCapture(event.pointerId)
    const target = event.target as Element
    const districtElement = target.closest("[data-district]") as SVGElement | null
    const district = districtElement?.getAttribute("data-district") ?? null

    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      district,
    }
    didDragRef.current = false
  }

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStartRef.current || zoom <= 1) return

    const dx = event.clientX - dragStartRef.current.x
    const dy = event.clientY - dragStartRef.current.y

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const scaleX = 800 / rect.width
    const scaleY = 501 / rect.height

    setPan(
      clampPan(
        dragStartRef.current.panX + dx * scaleX,
        dragStartRef.current.panY + dy * scaleY,
        zoom,
      ),
    )
  }

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    const start = dragStartRef.current

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    // Because the SVG captures the pointer while zoomed, the browser's
    // normal path click event can be lost. Treat a non-drag pointer release
    // that started on a district as a district click ourselves.
    if (start && !didDragRef.current && start.district) {
      onDistrictClick(start.district)
    }

    dragStartRef.current = null
    didDragRef.current = false
  }

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25))
  }

  const mapTransform = `translate(${400 * (1 - zoom) + pan.x} ${250.5 * (1 - zoom) + pan.y}) scale(${zoom})`

  return (
    <div className="map-container house-map-container">
      <div className="house-map-hint">
        {hoveredDistrict
          ? formatHouseDistrictHover(hoveredDistrict)
          : "Hover over a district to see its number"}
      </div>

      <div className="house-zoom-controls" aria-label="House map zoom controls">
        <button
          type="button"
          className="house-zoom-button"
          onClick={() => changeZoom(zoom + 0.5)}
          disabled={zoom >= 14}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="house-zoom-button"
          onClick={() => changeZoom(zoom - 0.5)}
          disabled={zoom <= 1}
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="house-zoom-reset"
          onClick={resetZoom}
          disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
        >
          Reset
        </button>
      </div>

      <div className="house-region-controls" aria-label="Zoom to major metro area">
        <div className="house-region-title">Zoom to area</div>
        <div className="house-region-buttons">
          {HOUSE_REGION_PRESETS.map((region) => (
            <button
              key={region.key}
              type="button"
              className="house-region-button"
              onClick={() => focusRegion(region.x, region.y, region.zoom)}
              title={`Zoom to ${region.label}`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      {houseMapError ? (
        <div className="house-map-error">Failed to load geography data</div>
      ) : !houseData ? (
        <div className="house-map-loading">Loading House district map…</div>
      ) : renderedDistricts.length === 0 ? (
        <div className="house-map-error">Could not read House district geography</div>
      ) : (
        <svg
          className={`house-svg ${zoom > 1 ? "is-zoomed" : ""}`}
          viewBox="0 0 800 501"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive map of the 435 U.S. House congressional districts"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          <g transform={mapTransform}>
            {renderedDistricts.map((district) => {
              const prediction = predictions[district.region] ?? "T"

              const normalizedSearch = searchDistrict?.trim() ?? ""
              const normalizedDistrictSearch = normalizedSearch
                .toUpperCase()
                .replace(/\s+/g, "")
              const districtSearchMatch = normalizedDistrictSearch.match(
                /^([A-Z]{2})-(\d{1,2})$/,
              )

              const normalizedStateSearch = normalizedSearch
                .replace(/\s+/g, " ")
                .toLowerCase()
              const stateSearchEntry = Object.entries(stateAbbreviations).find(
                ([stateName, abbreviation]) =>
                  stateName.toLowerCase() === normalizedStateSearch ||
                  abbreviation.toLowerCase() === normalizedStateSearch,
              )

              const searchCandidates = districtSearchMatch
                ? [
                    `${districtSearchMatch[1]}-${districtSearchMatch[2]}`,
                    districtSearchMatch[2] !== "AL"
                      ? `${districtSearchMatch[1]}-${districtSearchMatch[2].padStart(2, "0")}`
                      : `${districtSearchMatch[1]}-AL`,
                  ]
                : []

              const isHovered = hoveredDistrict === district.region
              const isStateSearched = stateSearchEntry
                ? district.region.startsWith(`${stateSearchEntry[1]}-`)
                : false
              const isSearched =
                searchCandidates.includes(district.region) || isStateSearched

              return (
                <path
                  key={district.key}
                  d={district.d}
                  fill={
                    isHovered
                      ? getHouseHoverColor(selectedRating)
                      : getHouseColor(prediction)
                  }
                  stroke={isSearched ? "#1d4ed8" : "#ffffff"}
                  strokeWidth={isSearched ? 1.8 : 0.65}
                  vectorEffect="non-scaling-stroke"
                  style={{
                    cursor: zoom > 1 ? "grab" : "pointer",
                    outline: "none",
                  }}
                  data-district={district.region}
                  onMouseEnter={() => setHoveredDistrict(district.region)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={(event) => {
                    // At zoom > 1, clicking is handled by the SVG pointer-up
                    // logic because the SVG captures the pointer for panning.
                    if (zoom <= 1) {
                      onDistrictClick(district.region)
                    } else {
                      event.preventDefault()
                    }
                  }}
                  aria-label={district.shortName}
                >
                  <title>{district.longName}</title>
                </path>
              )
            })}
          </g>
        </svg>
      )}

      <div className="house-map-note">
        435 voting districts · 2026 House elections · Use area buttons or drag to pan when zoomed
      </div>
    </div>
  )
}

/* =========================================================
   APP
========================================================= */

type Page = "home" | "predictions" | "articles" | "article" | "about" | "senate" | "governor" | "house"

function loadSavedPredictions(key: string): Record<string, Rating> {
  try {
    const saved = localStorage.getItem(key)

    if (!saved) {
      return {}
    }

    const parsed = JSON.parse(saved)

    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, Rating>
    }
  } catch (error) {
    console.error(`Failed to load ${key}:`, error)
  }

  return {}
}

type PredictionMapType = "senate" | "house" | "governor"

type PredictionFile = {
  format: "ElectionCentralPrediction"
  version: 1
  mapType: PredictionMapType
  title: string
  predictions: Record<string, Rating>
}

function defaultPredictionTitle(mapType: PredictionMapType) {
  if (mapType === "senate") return "2026 U.S. Senate Prediction"
  if (mapType === "house") return "2026 U.S. House Prediction"
  return "2026 Governor Prediction"
}

function predictionStorageKeys(mapType: PredictionMapType) {
  return {
    predictions: `electionCentral${mapType.charAt(0).toUpperCase()}${mapType.slice(1)}Predictions`,
    title: `electionCentral${mapType.charAt(0).toUpperCase()}${mapType.slice(1)}PredictionTitle`,
  }
}

type Article = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  image?: string
  imageAlt?: string
  content: string
}

const articleModules = import.meta.glob("./articles/*/article.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

function parseArticle(markdown: string, path: string): Article {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  const frontMatter: Record<string, string> = {}
  const content = match ? match[2].trim() : markdown.trim()

  if (match) {
    match[1].split("\n").forEach((line) => {
      const separator = line.indexOf(":")
      if (separator === -1) return

      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")
      frontMatter[key] = value
    })
  }

  const slug = path.match(/\.\/articles\/([^/]+)\/article\.md$/)?.[1] ?? "article"

  return {
    slug,
    title: frontMatter.title || "Untitled Article",
    date: frontMatter.date || "",
    category: frontMatter.category || "Article",
    excerpt: frontMatter.excerpt || "",
    image: frontMatter.image || undefined,
    imageAlt: frontMatter.imageAlt || "",
    content,
  }
}

const articles = Object.entries(articleModules)
  .map(([path, markdown]) => parseArticle(markdown, path))
  .sort((a, b) => b.date.localeCompare(a.date))

function renderMarkdown(markdown: string, slug: string) {
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")

  const inline = (value: string) => {
    let result = escapeHtml(value)

    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      const imageSrc = src.startsWith("/") ? src : `/articles/${slug}/${src}`
      return `<img src="${imageSrc}" alt="${alt}" class="article-inline-image" />`
    })
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    result = result.replace(/__([^_]+)__/g, "<strong>$1</strong>")
    result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>")
    result = result.replace(/_([^_]+)_/g, "<em>$1</em>")

    return result
  }

  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const output: string[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${inline(paragraph.join(" "))}</p>`)
      paragraph = []
    }
  }

  const flushList = () => {
    if (list.length) {
      output.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`)
      list = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      return
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/)
    if (listItem) {
      flushParagraph()
      list.push(listItem[1])
      return
    }

    flushList()
    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return output.join("")
}

function App() {
  /* =======================================================
     PAGE
  ======================================================= */

  const [page, setPage] =
    useState<Page>(() => {
      const savedPage = localStorage.getItem(
        "electionCentralPage"
      )

      if (
        savedPage === "predictions" ||
        savedPage === "senate" ||
        savedPage === "governor" ||
        savedPage === "house"
      ) {
        return savedPage
      }

      return "home"
    })

  useEffect(() => {
    localStorage.setItem(
      "electionCentralPage",
      page
    )
  }, [page])

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  /* =======================================================
     COUNTDOWN
  ======================================================= */

  const [timeLeft, setTimeLeft] =
    useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    })

  useEffect(() => {
    const electionDay =
      new Date(
        "2026-11-03T00:00:00"
      )

    const updateCountdown = () => {
      const now = new Date()

      const difference =
        electionDay.getTime() -
        now.getTime()

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })

        return
      }

      setTimeLeft({
        days: Math.floor(
          difference /
            (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
          (difference /
            (1000 * 60 * 60)) %
            24
        ),

        minutes: Math.floor(
          (difference /
            (1000 * 60)) %
            60
        ),

        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      })
    }

    updateCountdown()

    const timer =
      setInterval(
        updateCountdown,
        1000
      )

    return () =>
      clearInterval(timer)
  }, [])

  /* =======================================================
     SENATE PREDICTIONS
  ======================================================= */

  const [
    senatePredictions,
    setSenatePredictions,
  ] = useState<
    Record<string, Rating>
  >(() =>
    loadSavedPredictions(
      "electionCentralSenatePredictions"
    )
  )

  useEffect(() => {
    localStorage.setItem(
      "electionCentralSenatePredictions",
      JSON.stringify(senatePredictions)
    )
  }, [senatePredictions])

  /* =======================================================
     GOVERNOR PREDICTIONS
  ======================================================= */

  const [
    governorPredictions,
    setGovernorPredictions,
  ] = useState<
    Record<string, Rating>
  >(() =>
    loadSavedPredictions(
      "electionCentralGovernorPredictions"
    )
  )

  useEffect(() => {
    localStorage.setItem(
      "electionCentralGovernorPredictions",
      JSON.stringify(governorPredictions)
    )
  }, [governorPredictions])

  /* =======================================================
     HOUSE PREDICTIONS
  ======================================================= */

  const [
    housePredictions,
    setHousePredictions,
  ] = useState<Record<string, Rating>>(() =>
    loadSavedPredictions(
      "electionCentralHousePredictions"
    )
  )

  useEffect(() => {
    localStorage.setItem(
      "electionCentralHousePredictions",
      JSON.stringify(housePredictions)
    )
  }, [housePredictions])

  /* =======================================================
     PREDICTION TITLES
  ======================================================= */

  const [senatePredictionTitle, setSenatePredictionTitle] = useState(() =>
    localStorage.getItem(predictionStorageKeys("senate").title) ??
    defaultPredictionTitle("senate")
  )

  const [governorPredictionTitle, setGovernorPredictionTitle] = useState(() =>
    localStorage.getItem(predictionStorageKeys("governor").title) ??
    defaultPredictionTitle("governor")
  )

  const [housePredictionTitle, setHousePredictionTitle] = useState(() =>
    localStorage.getItem(predictionStorageKeys("house").title) ??
    defaultPredictionTitle("house")
  )

  const [editingPredictionTitle, setEditingPredictionTitle] =
    useState<PredictionMapType | null>(null)

  useEffect(() => {
    localStorage.setItem(predictionStorageKeys("senate").title, senatePredictionTitle)
  }, [senatePredictionTitle])

  useEffect(() => {
    localStorage.setItem(predictionStorageKeys("governor").title, governorPredictionTitle)
  }, [governorPredictionTitle])

  useEffect(() => {
    localStorage.setItem(predictionStorageKeys("house").title, housePredictionTitle)
  }, [housePredictionTitle])

  /* =======================================================
     SELECTED RATING
  ======================================================= */

  const [
    selectedRating,
    setSelectedRating,
  ] = useState<Rating>("T")

  /* =======================================================
     EXPORT
  ======================================================= */

  const [
    isExporting,
    setIsExporting,
  ] = useState(false)

  const exportRef =
    useRef<HTMLDivElement>(null)

  const predictionFileInputRef = useRef<HTMLInputElement>(null)

  const [hoveredHouseDistrict, setHoveredHouseDistrict] =
    useState<string | null>(null)

  const [houseDistrictSearch, setHouseDistrictSearch] = useState("")
  const [searchedHouseDistrict, setSearchedHouseDistrict] = useState<string | null>(null)

  /* =======================================================
     SENATE STATE CLICK
  ======================================================= */

  const makeSenatePrediction = (
    state: string
  ) => {
    if (
      !senate2026States.has(
        state
      )
    ) {
      return
    }

    setSenatePredictions(
      (previous) => ({
        ...previous,
        [state]:
          selectedRating,
      })
    )
  }

  /* =======================================================
     GOVERNOR STATE CLICK
  ======================================================= */

  const makeGovernorPrediction = (
    state: string
  ) => {
    if (
      !governor2026States.has(
        state
      )
    ) {
      return
    }

    setGovernorPredictions(
      (previous) => ({
        ...previous,
        [state]:
          selectedRating,
      })
    )
  }

  /* =======================================================
     HOUSE DISTRICT CLICK
  ======================================================= */

  const makeHousePrediction = (district: string) => {
    setHousePredictions((previous) => ({
      ...previous,
      [district]: selectedRating,
    }))
    setSearchedHouseDistrict(null)
  }

  /* =======================================================
     SENATE TOTALS

     Starting seats:
       Democrats = 34
       Republicans = 31
       Tossups = 35
  ======================================================= */

  const senateDemocraticCount =
    Object.values(
      senatePredictions
    ).filter((rating) =>
      rating.startsWith("D-")
    ).length

  const senateRepublicanCount =
    Object.values(
      senatePredictions
    ).filter((rating) =>
      rating.startsWith("R-")
    ).length

  const senateIndependentCount =
    Object.values(
      senatePredictions
    ).filter((rating) =>
      rating.startsWith("I-")
    ).length

  const senateDemocratTotal =
    34 +
    senateDemocraticCount

  const senateRepublicanTotal =
    31 +
    senateRepublicanCount

  const senateIndependentTotal =
    senateIndependentCount

  const senateTossupTotal =
    35 -
    senateDemocraticCount -
    senateRepublicanCount -
    senateIndependentCount

  /* =======================================================
     GOVERNOR TOTALS

     Starting seats:
       Democrats = 6
       Republicans = 8
       Tossups = 36
  ======================================================= */

  const governorDemocraticCount =
    Object.values(
      governorPredictions
    ).filter((rating) =>
      rating.startsWith("D-")
    ).length

  const governorRepublicanCount =
    Object.values(
      governorPredictions
    ).filter((rating) =>
      rating.startsWith("R-")
    ).length

  const governorDemocratTotal =
    6 +
    governorDemocraticCount

  const governorRepublicanTotal =
    8 +
    governorRepublicanCount

  const governorTossupTotal =
    36 -
    governorDemocraticCount -
    governorRepublicanCount


  /* =======================================================
     HOUSE TOTALS

     Every district starts as a tossup until you rate it.
  ======================================================= */

  const houseDemocraticCount =
    Object.values(housePredictions).filter((rating) =>
      rating.startsWith("D-")
    ).length

  const houseRepublicanCount =
    Object.values(housePredictions).filter((rating) =>
      rating.startsWith("R-")
    ).length

  const houseTossupTotal =
    435 -
    houseDemocraticCount -
    houseRepublicanCount

  /* =======================================================
     RESET MAPS
  ======================================================= */

  const resetSenateMap = () => {
    if (
      window.confirm(
        "Reset your Senate map? All Senate predictions will be cleared."
      )
    ) {
      setSenatePredictions({})
      setSelectedRating("T")
    }
  }

  const resetGovernorMap = () => {
    if (
      window.confirm(
        "Reset your Governor map? All Governor predictions will be cleared."
      )
    ) {
      setGovernorPredictions({})
      setSelectedRating("T")
    }
  }

  const resetHouseMap = () => {
    if (
      window.confirm(
        "Reset your House map? All House district predictions will be cleared."
      )
    ) {
      setHousePredictions({})
      setSelectedRating("T")
    }
  }

  /* =======================================================
     SAVE / LOAD PREDICTION FILE
  ======================================================= */

  const savePredictionFile = (
    mapType: PredictionMapType,
    title: string,
    predictions: Record<string, Rating>
  ) => {
    const predictionFile: PredictionFile = {
      format: "ElectionCentralPrediction",
      version: 1,
      mapType,
      title: title.trim() || defaultPredictionTitle(mapType),
      predictions,
    }

    const blob = new Blob([JSON.stringify(predictionFile, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${predictionFile.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "Election-Central-Prediction"}.ecp`
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadPredictionFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    try {
      const parsed = JSON.parse(await file.text()) as Partial<PredictionFile>

      if (parsed.format !== "ElectionCentralPrediction" || parsed.version !== 1) {
        throw new Error("This is not a valid Election Central prediction file.")
      }

      if (parsed.mapType !== page) {
        const mapName =
          parsed.mapType === "senate"
            ? "Senate"
            : parsed.mapType === "house"
              ? "House"
              : "Governor"
        throw new Error(`This file contains a ${mapName} prediction. Please load it from the ${mapName} map.`)
      }

      if (!parsed.predictions || typeof parsed.predictions !== "object") {
        throw new Error("This prediction file does not contain valid map ratings.")
      }

      const predictions = parsed.predictions as Record<string, Rating>

      if (page === "senate") {
        setSenatePredictions(predictions)
        setSenatePredictionTitle(parsed.title?.trim() || defaultPredictionTitle("senate"))
      } else if (page === "house") {
        setHousePredictions(predictions)
        setHousePredictionTitle(parsed.title?.trim() || defaultPredictionTitle("house"))
      } else if (page === "governor") {
        setGovernorPredictions(predictions)
        setGovernorPredictionTitle(parsed.title?.trim() || defaultPredictionTitle("governor"))
      }

      setSelectedRating("T")
    } catch (error) {
      console.error("Failed to load prediction file:", error)
      alert(error instanceof Error ? error.message : "Sorry, Election Central couldn't load that prediction file.")
    }
  }

  const openPredictionFilePicker = () => {
    predictionFileInputRef.current?.click()
  }

  /* =======================================================
     EXPORT MAP
  ======================================================= */

  const exportAsImage =
    async () => {
      if (
        !exportRef.current
      ) {
        return
      }

      try {
        setIsExporting(true)

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              100
            )
        )

        const canvas =
          await html2canvas(
            exportRef.current,
            {
              backgroundColor:
                "#f5f6fa",

              scale: 2,

              useCORS: true,
            }
          )

        const link =
          document.createElement(
            "a"
          )

        link.download =
          page === "governor"
            ? "Election-Central-2026-Governor-Prediction.png"
            : page === "house"
              ? "Election-Central-2026-House-Prediction.png"
              : "Election-Central-2026-Senate-Prediction.png"

        link.href =
          canvas.toDataURL(
            "image/png"
          )

        link.click()

      } catch (error) {
        console.error(
          "Failed to export image:",
          error
        )

        alert(
          "Sorry, Election Central couldn't export the map."
        )

      } finally {
        setIsExporting(false)
      }
    }

  /* =======================================================
     HEADER
  ======================================================= */

  const Header = () => (
    <header className="header">

      <div
        className="logo"
        onClick={() =>
          setPage("home")
        }
      >
        <img className="logo-mark" src={`${import.meta.env.BASE_URL}EC.png`} alt="Election Central logo" />
        <span className="logo-text">Election Central</span>
        <span className="logo-year">Published 2026</span>
      </div>

      <nav>

        <button
          className={page === "home" ? "active" : ""}
          onClick={() =>
            setPage("home")
          }
        >
          Home
        </button>

        <button
          className={
            page === "predictions" ||
            page === "senate" ||
            page === "governor" ||
            page === "house"
              ? "active"
              : ""
          }
          onClick={() =>
            setPage("predictions")
          }
        >
          Predictions
        </button>

        <button
          className={
            page === "articles" || page === "article"
              ? "active"
              : ""
          }
          onClick={() => setPage("articles")}
        >
          Articles (wip)
        </button>

        <button
          className={page === "about" ? "active" : ""}
          onClick={() => setPage("about")}
        >
          About
        </button>

      </nav>

    </header>
  )

  /* =======================================================
     HOME PAGE
  ======================================================= */

  if (page === "home") {
    return (
      <div className="app">

        <Header />

        <main>

          <section className="hero">

            <div className="hero-badge">2026 MIDTERM ELECTIONS EDITION v1.0</div>

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
                Articles (coming soon... maybe)
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
                      setPage("article")
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

  /* =======================================================
     ARTICLES MENU
  ======================================================= */

  if (page === "articles") {
    return (
      <div className="app">
        <Header />
        <main className="articles-page">
          <div className="page-eyebrow">ELECTION CENTRAL ARTICLES</div>
          <h1>Articles</h1>
          <p>Election analysis, race coverage, and updates from Election Central.</p>

          <div className="article-list">
            {articles.length === 0 ? (
              <div className="articles-coming-soon">Coming Soon...</div>
            ) : (
              articles.map((article) => (
              <button
                key={article.slug}
                className="article-preview"
                onClick={() => {
                  setSelectedArticle(article)
                  setPage("article")
                }}
              >
                <div className="article-preview-meta">
                  <span>{article.category}</span>
                  <span>{article.date}</span>
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <span className="article-preview-arrow">Read article →</span>
              </button>
              ))
            )}
          </div>
        </main>
      </div>
    )
  }

  /* =======================================================
     ARTICLE PAGE
  ======================================================= */

  if (page === "article" && selectedArticle) {
    return (
      <div className="app">
        <Header />
        <main className="article-page">
          <button className="article-back" onClick={() => setPage("articles")}>
            ← Back to Articles
          </button>

          <article className="article-content">
            <div className="article-meta">
              <span>{selectedArticle.category}</span> · {selectedArticle.date}
            </div>
            <h1>{selectedArticle.title}</h1>
            <p className="article-excerpt">{selectedArticle.excerpt}</p>
            {selectedArticle.image && (
              <img
                className="article-image"
                src={selectedArticle.image.startsWith("/") ? selectedArticle.image : `/articles/${selectedArticle.slug}/${selectedArticle.image}`}
                alt={selectedArticle.imageAlt || selectedArticle.title}
              />
            )}
            <div
              className="article-markdown"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(selectedArticle.content, selectedArticle.slug),
              }}
            />
          </article>
        </main>
      </div>
    )
  }

  /* =======================================================
     ABOUT PAGE
  ======================================================= */

  if (page === "about") {
    return (
      <div className="app">
        <Header />
        <About />
      </div>
    )
  }

  /* =======================================================
     PREDICTIONS MENU
  ======================================================= */

  if (
    page === "predictions"
  ) {
    return (
      <div className="app">

        <Header />

        <main className="predictions-page">

          <div className="page-eyebrow">2026 ELECTION FORECAST</div>

          <h1>
            Make a Prediction
          </h1>

          <p>
            Choose an election to start building your forecast.
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

          </div>

        </main>

      </div>
    )
  }

  /* =======================================================
     SENATE PAGE
  ======================================================= */

  if (page === "senate") {
    return (
      <div className="app">

        <Header />

        <main className="senate-page">

          <div
            className={`export-area ${isExporting ? "is-exporting" : ""}`}
            ref={exportRef}
          >

            <div className="senate-header">

              <div className="prediction-title-display">
                {editingPredictionTitle === "senate" ? (
                  <input
                    id="senate-prediction-title"
                    className="prediction-title-input"
                    type="text"
                    value={senatePredictionTitle}
                    autoFocus
                    onChange={(event) => setSenatePredictionTitle(event.target.value)}
                    onBlur={() => setEditingPredictionTitle(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur()
                      } else if (event.key === "Escape") {
                        setEditingPredictionTitle(null)
                      }
                    }}
                  />
                ) : (
                  <>
                    <h1>{senatePredictionTitle}</h1>
                    <button
                      type="button"
                      className="prediction-title-edit-button"
                      onClick={() => setEditingPredictionTitle("senate")}
                      aria-label="Edit prediction title"
                      title="Edit prediction title"
                    >
                      ✎
                    </button>
                  </>
                )}
              </div>

              <p>
                Select a rating, then click a state
                on the map.
              </p>

            </div>

            <RatingSelector
              selectedRating={
                selectedRating
              }
              setSelectedRating={
                setSelectedRating
              }
            />

            <ElectionMap
              electionStates={
                senate2026States
              }
              predictions={
                senatePredictions
              }
              selectedRating={
                selectedRating
              }
              onStateClick={
                makeSenatePrediction
              }
              raceInfo={senateRaceInfo}
            />

            <div className="senate-totals">

              <div className="total-democrat">

                <strong>
                  {
                    senateDemocratTotal
                  }
                </strong>

                <span>
                  Democrats
                </span>

              </div>

              <div className="total-tossup">

                <strong>
                  {
                    senateTossupTotal
                  }
                </strong>

                <span>
                  Tossups
                </span>

              </div>

              <div className="total-republican">

                <strong>
                  {
                    senateRepublicanTotal
                  }
                </strong>

                <span>
                  Republicans
                </span>

              </div>

              <div className="total-independent">

                <strong>
                  {
                    senateIndependentTotal
                  }
                </strong>

                <span>
                  Independents
                </span>

              </div>

            </div>

            {/* MAP LEGEND */}

            <div className="map-legend">

              <div>
                <span className="legend-color democrat-safe" />
                Safe D
              </div>

              <div>
                <span className="legend-color democrat-likely" />
                Likely D
              </div>

              <div>
                <span className="legend-color democrat-lean" />
                Lean D
              </div>

              <div>
                <span className="legend-color democrat-tilt" />
                Tilt D
              </div>

              <div>
                <span className="legend-color tossup" />
                Tossup
              </div>

              <div>
                <span className="legend-color independent-safe" />
                Safe I
              </div>

              <div>
                <span className="legend-color independent-likely" />
                Likely I
              </div>

              <div>
                <span className="legend-color independent-lean" />
                Lean I
              </div>

              <div>
                <span className="legend-color independent-tilt" />
                Tilt I
              </div>

              <div>
                <span className="legend-color republican-tilt" />
                Tilt R
              </div>

              <div>
                <span className="legend-color republican-lean" />
                Lean R
              </div>

              <div>
                <span className="legend-color republican-likely" />
                Likely R
              </div>

              <div>
                <span className="legend-color republican-safe" />
                Safe R
              </div>

            </div>

          </div>

          <div className="senate-controls">

            <button
              className="export-button"
              onClick={
                exportAsImage
              }
              disabled={
                isExporting
              }
            >
              {isExporting
                ? "Exporting..."
                : "Export as Image"}
            </button>

            <input
              ref={predictionFileInputRef}
              type="file"
              accept=".ecp,application/json"
              onChange={loadPredictionFile}
              className="prediction-file-input"
            />

            <button
              className="export-button prediction-file-button"
              onClick={() => savePredictionFile("senate", senatePredictionTitle, senatePredictions)}
            >
              Save Prediction
            </button>

            <button
              className="back-button prediction-file-button"
              onClick={openPredictionFilePicker}
            >
              Load Prediction
            </button>

            <button
              className="back-button"
              onClick={resetSenateMap}
            >
              Reset Map
            </button>

            <button
              className="back-button"
              onClick={() =>
                setPage(
                  "predictions"
                )
              }
            >
              ← Back to Predictions
            </button>

          </div>

        </main>

      </div>
    )
  }

  /* =======================================================
     HOUSE PAGE
  ======================================================= */

  if (page === "house") {
    return (
      <div className="app">
        <Header />

        <main className="senate-page">
          <div className={`export-area ${isExporting ? "is-exporting" : ""}`} ref={exportRef}>
            <div className="senate-header">
              <div className="prediction-title-display">
                {editingPredictionTitle === "house" ? (
                  <input
                    id="house-prediction-title"
                    className="prediction-title-input"
                    type="text"
                    value={housePredictionTitle}
                    autoFocus
                    onChange={(event) => setHousePredictionTitle(event.target.value)}
                    onBlur={() => setEditingPredictionTitle(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur()
                      } else if (event.key === "Escape") {
                        setEditingPredictionTitle(null)
                      }
                    }}
                  />
                ) : (
                  <>
                    <h1>{housePredictionTitle}</h1>
                    <button
                      type="button"
                      className="prediction-title-edit-button"
                      onClick={() => setEditingPredictionTitle("house")}
                      aria-label="Edit prediction title"
                      title="Edit prediction title"
                    >
                      ✎
                    </button>
                  </>
                )}
              </div>
              <p>
                Select a rating, then click any congressional district on the map.
              </p>
            </div>

            <RatingSelector
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              showIndependent={false}
            />

            <div className="house-search">
              <div className="house-search-label">Search House District or State</div>
              <form
                className="house-search-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  const rawSearch = houseDistrictSearch.trim()
                  const normalized = rawSearch.toUpperCase().replace(/\s+/g, "")
                  const isDistrictSearch = /^[A-Z]{2}-(?:AL|\d{1,2})$/.test(normalized)
                  const normalizedStateName = rawSearch.replace(/\s+/g, " ").toLowerCase()
                  const isStateSearch = Object.entries(stateAbbreviations).some(
                    ([stateName, abbreviation]) =>
                      stateName.toLowerCase() === normalizedStateName ||
                      abbreviation.toLowerCase() === normalizedStateName,
                  )

                  if (!isDistrictSearch && !isStateSearch) {
                    setSearchedHouseDistrict(null)
                    return
                  }

                  setSearchedHouseDistrict(rawSearch)
                }}
              >
                <input
                  type="text"
                  value={houseDistrictSearch}
                  onChange={(event) => setHouseDistrictSearch(event.target.value)}
                  placeholder="Search District or State (ex: TX-15, NJ-1, KS, Kansas)"
                  aria-label="Search House district or state"
                />
                <button type="submit">Search</button>
              </form>
            </div>

            <HouseMap
              predictions={housePredictions}
              selectedRating={selectedRating}
              onDistrictClick={makeHousePrediction}
              hoveredDistrict={hoveredHouseDistrict}
              setHoveredDistrict={setHoveredHouseDistrict}
              searchDistrict={searchedHouseDistrict}
            />

            <div className="senate-totals">
              <div className="total-democrat">
                <strong>{houseDemocraticCount}</strong>
                <span>Democratic</span>
              </div>

              <div className="total-tossup">
                <strong>{houseTossupTotal}</strong>
                <span>Tossups</span>
              </div>

              <div className="total-republican">
                <strong>{houseRepublicanCount}</strong>
                <span>Republican</span>
              </div>
            </div>

            <div className="map-legend">
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

          <div className="senate-controls">
            <button
              className="export-button"
              onClick={exportAsImage}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export as Image"}
            </button>

            <input
              ref={predictionFileInputRef}
              type="file"
              accept=".ecp,application/json"
              onChange={loadPredictionFile}
              className="prediction-file-input"
            />

            <button
              className="export-button prediction-file-button"
              onClick={() => savePredictionFile("house", housePredictionTitle, housePredictions)}
            >
              Save Prediction
            </button>

            <button
              className="back-button prediction-file-button"
              onClick={openPredictionFilePicker}
            >
              Load Prediction
            </button>

            <button className="back-button" onClick={resetHouseMap}>
              Reset Map
            </button>

            <button
              className="back-button"
              onClick={() => setPage("predictions")}
            >
              ← Back to Predictions
            </button>
          </div>
        </main>
      </div>
    )
  }

  /* =======================================================
     GOVERNOR PAGE
  ======================================================= */

  if (page === "governor") {
    return (
      <div className="app">

        <Header />

        <main className="senate-page">

          <div
            className={`export-area ${isExporting ? "is-exporting" : ""}`}
            ref={exportRef}
          >

            <div className="senate-header">

              <div className="prediction-title-display">
                {editingPredictionTitle === "governor" ? (
                  <input
                    id="governor-prediction-title"
                    className="prediction-title-input"
                    type="text"
                    value={governorPredictionTitle}
                    autoFocus
                    onChange={(event) => setGovernorPredictionTitle(event.target.value)}
                    onBlur={() => setEditingPredictionTitle(null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.blur()
                      } else if (event.key === "Escape") {
                        setEditingPredictionTitle(null)
                      }
                    }}
                  />
                ) : (
                  <>
                    <h1>{governorPredictionTitle}</h1>
                    <button
                      type="button"
                      className="prediction-title-edit-button"
                      onClick={() => setEditingPredictionTitle("governor")}
                      aria-label="Edit prediction title"
                      title="Edit prediction title"
                    >
                      ✎
                    </button>
                  </>
                )}
              </div>

              <p>
                Select a rating, then click a state
                on the map.
              </p>

            </div>

            <RatingSelector
              selectedRating={
                selectedRating
              }
              setSelectedRating={
                setSelectedRating
              }
              showIndependent={false}
            />

            <ElectionMap
              electionStates={
                governor2026States
              }
              predictions={
                governorPredictions
              }
              selectedRating={
                selectedRating
              }
              onStateClick={
                makeGovernorPrediction
              }
              raceInfo={governorRaceInfo}
            />

            <div className="senate-totals">

              <div className="total-democrat">

                <strong>
                  {
                    governorDemocratTotal
                  }
                </strong>

                <span>
                  Democrats
                </span>

              </div>

              <div className="total-tossup">

                <strong>
                  {
                    governorTossupTotal
                  }
                </strong>

                <span>
                  Tossups
                </span>

              </div>

              <div className="total-republican">

                <strong>
                  {
                    governorRepublicanTotal
                  }
                </strong>

                <span>
                  Republicans
                </span>

              </div>

            </div>

            {/* MAP LEGEND */}

            <div className="map-legend">

              <div>
                <span className="legend-color democrat-safe" />
                Safe D
              </div>

              <div>
                <span className="legend-color democrat-likely" />
                Likely D
              </div>

              <div>
                <span className="legend-color democrat-lean" />
                Lean D
              </div>

              <div>
                <span className="legend-color democrat-tilt" />
                Tilt D
              </div>

              <div>
                <span className="legend-color tossup" />
                Tossup
              </div>

              <div>
                <span className="legend-color republican-tilt" />
                Tilt R
              </div>

              <div>
                <span className="legend-color republican-lean" />
                Lean R
              </div>

              <div>
                <span className="legend-color republican-likely" />
                Likely R
              </div>

              <div>
                <span className="legend-color republican-safe" />
                Safe R
              </div>

            </div>

          </div>

          <div className="senate-controls">

            <button
              className="export-button"
              onClick={
                exportAsImage
              }
              disabled={
                isExporting
              }
            >
              {isExporting
                ? "Exporting..."
                : "Export as Image"}
            </button>

            <input
              ref={predictionFileInputRef}
              type="file"
              accept=".ecp,application/json"
              onChange={loadPredictionFile}
              className="prediction-file-input"
            />

            <button
              className="export-button prediction-file-button"
              onClick={() => savePredictionFile("governor", governorPredictionTitle, governorPredictions)}
            >
              Save Prediction
            </button>

            <button
              className="back-button prediction-file-button"
              onClick={openPredictionFilePicker}
            >
              Load Prediction
            </button>

            <button
              className="back-button"
              onClick={resetGovernorMap}
            >
              Reset Map
            </button>

            <button
              className="back-button"
              onClick={() =>
                setPage(
                  "predictions"
                )
              }
            >
              ← Back to Predictions
            </button>

          </div>

        </main>

      </div>
    )
  }

  return null
}

export default App