import React, { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react"
import { ComposableMap, Geographies, Geography } from "@vnedyalk0v/react19-simple-maps"
import { geoIdentity, type GeoProjection } from "d3-geo"
import type { Rating } from "./ElectionTypes"
import { countyGeoUrl, stateFips } from "./CountyData"
import { stateAbbreviations } from "./routes"
import { getHouseColor, getHouseHoverColor } from "./2026_Races"

export function CountyMap({
  predictions,
  selectedRating,
  onCountyClick,
  selectedState,
  searchCounty,
  resetToken,
  countyMapRefreshVersion,
  isExporting,
}: {
  predictions: Record<string, Rating>
  selectedRating: Rating
  onCountyClick: (countyId: string) => void
  selectedState: string | null
  searchCounty: string
  resetToken: number
  countyMapRefreshVersion: number
  isExporting: boolean
}) {
  const [zoom, setZoom] = useState(selectedState ? 5 : 1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number; county: string | null } | null>(null)
  const didDragRef = useRef(false)
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [hoveredCountyId, setHoveredCountyId] = useState<string | null>(null)
  const [resetVersion, setResetVersion] = useState(0)

  const clampPan = useCallback((x: number, y: number, nextZoom: number) => {
    const maxX = ((nextZoom - 1) * 800) / 2 + 400
    const maxY = ((nextZoom - 1) * 501) / 2 + 250.5
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    }
  }, [])

  const changeZoom = (nextZoom: number) => {
    const safeZoom = Math.max(1, Math.min(15, nextZoom))
    setPan((currentPan) => {
      const ratio = zoom === 0 ? 1 : safeZoom / zoom
      return clampPan(currentPan.x * ratio, currentPan.y * ratio, safeZoom)
    })
    setZoom(safeZoom)
  }

  const resetZoom = () => {
    if (selectedState) {
      setResetVersion((current) => current + 1)
      return
    }

    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const focusCounty = useCallback((countyId: string, focusZoom = 10) => {
    requestAnimationFrame(() => {
      const path = document.querySelector(`path[data-county="${countyId}"]`) as SVGPathElement | null
      if (!path) return
      const box = path.getBBox()
      const nextZoom = focusZoom
      const centeredPan = {
        x: nextZoom * (400 - (box.x + box.width / 2)),
        y: nextZoom * (250.5 - (box.y + box.height / 2)),
      }
      setZoom(nextZoom)
      setPan(clampPan(centeredPan.x, centeredPan.y, nextZoom))
    })
  }, [clampPan])

  /* Center an individual-state county map using the county bounds.
     The bounds are measured from the already-filtered county paths, so
     the state fills the map instead of remaining in the national position. */
  useEffect(() => {
    if (!selectedState) {
      setZoom(1)
      setPan({ x: 0, y: 0 })
      return
    }

    const stateFipsCode = stateFips[selectedState.toUpperCase()]
    if (!stateFipsCode) return

    const centerState = () => {
      const paths = Array.from(
        document.querySelectorAll(`path[data-county^="${stateFipsCode}"]`),
      ) as SVGPathElement[]

      if (!paths.length) return false

      const boxes = paths.map((path) => path.getBBox())
      const minX = Math.min(...boxes.map((box) => box.x))
      const minY = Math.min(...boxes.map((box) => box.y))
      const maxX = Math.max(...boxes.map((box) => box.x + box.width))
      const maxY = Math.max(...boxes.map((box) => box.y + box.height))
      const width = Math.max(maxX - minX, 1)
      const height = Math.max(maxY - minY, 1)
      const stateZoom = Math.max(
        2.5,
        Math.min(10, Math.min(760 / width, 470 / height) * 0.88),
      )

      setZoom(stateZoom)
      setPan(clampPan(
        stateZoom * (400 - (minX + maxX) / 2),
        stateZoom * (250.5 - (minY + maxY) / 2),
        stateZoom,
      ))
      return true
    }

    // The geography is fetched/rendered asynchronously. Retry a few frames
    // rather than doing expensive polling or recalculating on every render.
    let frame = 0
    let animationFrameId = 0
    const tryCenter = () => {
      if (centerState() || frame >= 20) return
      frame += 1
      animationFrameId = requestAnimationFrame(tryCenter)
    }

    animationFrameId = requestAnimationFrame(tryCenter)

    return () => cancelAnimationFrame(animationFrameId)
  }, [selectedState, clampPan, resetVersion, resetToken])

  useEffect(() => {
    setZoom(selectedState ? 5 : 1)
    setPan({ x: 0, y: 0 })
  }, [resetToken])

  useEffect(() => {
    const rawSearch = searchCounty.trim()
    const raw = rawSearch.toLowerCase()
    if (!raw) return

    requestAnimationFrame(() => {
      const normalizedStateSearch = rawSearch.replace(/\s+/g, " ").toLowerCase()
      const stateEntry = Object.entries(stateAbbreviations).find(
        ([stateName, abbreviation]) =>
          stateName.toLowerCase() === normalizedStateSearch ||
          abbreviation.toLowerCase() === normalizedStateSearch,
      )

      /* State search: zoom to and center the state's counties. */
      if (stateEntry) {
        const stateFipsCode = stateFips[stateEntry[1]]
        const paths = Array.from(
          document.querySelectorAll(`path[data-county^="${stateFipsCode}"]`),
        ) as SVGPathElement[]

        if (!paths.length) return

        const boxes = paths.map((path) => path.getBBox())
        const minX = Math.min(...boxes.map((box) => box.x))
        const minY = Math.min(...boxes.map((box) => box.y))
        const maxX = Math.max(...boxes.map((box) => box.x + box.width))
        const maxY = Math.max(...boxes.map((box) => box.y + box.height))
        const width = Math.max(maxX - minX, 1)
        const height = Math.max(maxY - minY, 1)
        const stateZoom = Math.max(
          2.5,
          Math.min(10, Math.min(760 / width, 470 / height) * 0.88),
        )

        setZoom(stateZoom)
        setPan(clampPan(
          stateZoom * (400 - (minX + maxX) / 2),
          stateZoom * (250.5 - (minY + maxY) / 2),
          stateZoom,
        ))
        return
      }

      /* County search: exact name/FIPS first, then partial county name. */
      const paths = Array.from(document.querySelectorAll("path[data-county]")) as SVGPathElement[]
      const match = paths.find((path) => {
        const name = path.getAttribute("data-county-name")?.toLowerCase() ?? ""
        const id = path.getAttribute("data-county")?.toLowerCase() ?? ""
        return name === raw || name.includes(raw) || id === raw
      })

      if (!match) return
      const countyId = match.getAttribute("data-county")
      if (countyId) focusCounty(countyId)
    })
  }, [searchCounty, focusCounty, clampPan])

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (zoom <= 1) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const target = event.target as Element
    const countyElement = target.closest("[data-county]") as SVGElement | null
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      county: countyElement?.getAttribute("data-county") ?? null,
    }
    didDragRef.current = false
  }

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragStartRef.current || zoom <= 1) return
    const dx = event.clientX - dragStartRef.current.x
    const dy = event.clientY - dragStartRef.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true
    const rect = event.currentTarget.getBoundingClientRect()
    setPan(clampPan(
      dragStartRef.current.panX + dx * (800 / rect.width),
      dragStartRef.current.panY + dy * (501 / rect.height),
      zoom,
    ))
  }

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const start = dragStartRef.current
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (start && !didDragRef.current && start.county) onCountyClick(start.county)
    dragStartRef.current = null
    didDragRef.current = false
  }

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25))
  }

  const mapTransform = `translate(${400 * (1 - zoom) + pan.x} ${250.5 * (1 - zoom) + pan.y}) scale(${zoom})`
  const selectedFips = selectedState ? stateFips[selectedState] : null

  return (
    <div className="map-container county-map-container">
      <div className="house-map-hint">
        {hoveredCounty ?? "Hover over a county to see its name"}
      </div>

      <div className="house-zoom-controls" aria-label="County map zoom controls" style={{ display: isExporting ? "none" : undefined }}>
        <button type="button" className="house-zoom-button" onClick={() => changeZoom(zoom + 0.5)} disabled={zoom >= 15}>+</button>
        <button type="button" className="house-zoom-button" onClick={() => changeZoom(zoom - 0.5)} disabled={zoom <= 1}>−</button>
        <button type="button" className="house-zoom-reset" onClick={resetZoom}>Reset</button>
      </div>

      <ComposableMap
        className={`house-svg ${zoom > 1 ? "is-zoomed" : ""}`}
        projection={geoIdentity().scale(0.82).translate([0, 0]) as unknown as GeoProjection}
        width={800}
        height={501}
        role="img"
        aria-label={selectedState ? `Interactive county map of ${Object.entries(stateAbbreviations).find(([, code]) => code === selectedState)?.[0] ?? selectedState}` : "Interactive map of U.S. counties"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <g transform={mapTransform}>
          <CountyGeographies
            key={countyMapRefreshVersion}
            predictions={predictions}
            selectedRating={selectedRating}
            onCountyClick={onCountyClick}
            selectedFips={selectedFips}
            setHoveredCounty={setHoveredCounty}
            hoveredCountyId={hoveredCountyId}
            setHoveredCountyId={setHoveredCountyId}
          />
        </g>
      </ComposableMap>

      <div className="house-map-note">
        {selectedState ? "State county map · Click counties to apply your selected rating · Drag to pan when zoomed" : "U.S. county map · Click counties to apply your selected rating · Drag to pan when zoomed"}
      </div>
    </div>
  )
}

const CountyGeographies = React.memo(function CountyGeographies({
  predictions,
  selectedRating,
  onCountyClick,
  selectedFips,
  setHoveredCounty,
  hoveredCountyId,
  setHoveredCountyId,
}: {
  predictions: Record<string, Rating>
  selectedRating: Rating
  onCountyClick: (countyId: string) => void
  selectedFips: string | null
  setHoveredCounty: (countyName: string | null) => void
  hoveredCountyId: string | null
  setHoveredCountyId: (countyId: string | null) => void
}) {
  return (
    <Geographies geography={countyGeoUrl}>
      {({ geographies }) => (
        <>
          {geographies
            .filter((geo) => !selectedFips || String(geo.id).slice(0, 2) === selectedFips)
            .map((geo) => {
              const countyId = String(geo.id)
              const countyName = geo.properties?.name ?? countyId
              const prediction = predictions[countyId] ?? "T"
              return (
                <Geography
                  key={countyId}
                  geography={geo}
                  data-county={countyId}
                  data-county-name={countyName}
                  fill={hoveredCountyId === countyId ? getHouseHoverColor(selectedRating) : getHouseColor(prediction)}
                  stroke="#ffffff"
                  strokeWidth={0.55}
                  vectorEffect="non-scaling-stroke"
                  style={{}}
                  onMouseEnter={() => {
                    setHoveredCounty(countyName)
                    setHoveredCountyId(countyId)
                  }}
                  onMouseLeave={() => {
                    setHoveredCounty(null)
                    setHoveredCountyId(null)
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                  }}
                  onFocus={(event) => {
                    event.currentTarget.blur()
                  }}
                  onClick={() => {
                    setHoveredCountyId(null)
                    onCountyClick(countyId)
                  }}
                >
                  <title>{countyName} County</title>
                </Geography>
              )
            })}
        </>
      )}
    </Geographies>
  )
})


