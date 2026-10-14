import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "@vnedyalk0v/react19-simple-maps"
import { geoCentroid } from "d3-geo"
import type { Rating } from "./ElectionTypes"
import { senateRaceInfo, governorRaceInfo } from "./ElectionData"
import { stateAbbreviations } from "./routes"
import { senate2026States, governor2026States } from "./ElectionCycleData"
import "./2026_Races.css"

const geoUrl =
  "https://unpkg.com/us-atlas@3.0.1/states-10m.json"

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
      return "#1C408C"

    case "D-Likely":
      return "#577CCC"

    case "D-Lean":
      return "#8AAFFF"

    case "D-Tilt":
      return "#949BB3"

    /* -------------------------
       REPUBLICAN
    ------------------------- */

    case "R-Safe":
      return "#BF1D29"

    case "R-Likely":
      return "#FF5865"

    case "R-Lean":
      return "#FF8B98"

    case "R-Tilt":
      return "#CF8980"

    /* -------------------------
       INDEPENDENT
    ------------------------- */

    case "I-Safe":
      return "#822194"

    case "I-Likely":
      return "#AE20C6"

    case "I-Lean":
      return "#DB14FF"

    case "I-Tilt":
      return "#A369AE"

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

export function RatingSelector({
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


export function getHouseColor(prediction?: Rating) {
  switch (prediction) {
    case "D-Safe": return "#1C408C"
    case "D-Likely": return "#577CCC"
    case "D-Lean": return "#8AAFFF"
    case "D-Tilt": return "#949BB3"
    case "R-Safe": return "#BF1D29"
    case "R-Likely": return "#FF5865"
    case "R-Lean": return "#FF8B98"
    case "R-Tilt": return "#CF8980"
    case "I-Safe": return "#822194"
    case "I-Likely": return "#AE20C6"
    case "I-Lean": return "#DB14FF"
    case "I-Tilt": return "#A369AE"
    case "T":
    default: return "#D1D1D1"
  }
}

export function getHouseHoverColor(selectedRating: Rating) {
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
  { key: "denver", label: "DEN", x: 270, y: 210, zoom: 14 },
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

    fetch("/house-districts-2026-v2.json")
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
    const safeZoom = Math.max(1, Math.min(15, nextZoom))

    // Keep the same map location centered when changing zoom. Metro buttons
    // set both zoom and pan, so the pan must scale with the zoom level.
    setPan((currentPan) => {
      const zoomRatio = zoom === 0 ? 1 : safeZoom / zoom
      return clampPan(
        currentPan.x * zoomRatio,
        currentPan.y * zoomRatio,
        safeZoom,
      )
    })
    setZoom(safeZoom)
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
        AZ: 4,
        NM: 4,

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

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
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

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
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

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
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

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
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
   COUNTY MAP
========================================================= */


type Props = Record<string, any>

export default function Races(props: Props) {
  const {
    page, Header, setPage, exportRef, isExporting, editingPredictionTitle, setEditingPredictionTitle,
    senatePredictionTitle, setSenatePredictionTitle, governorPredictionTitle, setGovernorPredictionTitle,
    housePredictionTitle, setHousePredictionTitle, selectedRating, setSelectedRating,
    senatePredictions, governorPredictions, housePredictions, makeSenatePrediction,
    makeGovernorPrediction, makeHousePrediction, senateDemocratTotal, senateRepublicanTotal,
    senateIndependentTotal, senateTossupTotal, governorDemocratTotal, governorRepublicanTotal,
    governorTossupTotal, houseDemocraticCount, houseRepublicanCount, houseTossupTotal,
    resetSenateMap, resetGovernorMap, resetHouseMap, exportAsImage, savePredictionFile,
    openPredictionFilePicker, predictionFileInputRef, loadPredictionFile, houseDistrictSearch,
    setHouseDistrictSearch, searchedHouseDistrict, setSearchedHouseDistrict, hoveredHouseDistrict,
    setHoveredHouseDistrict,
  } = props

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
