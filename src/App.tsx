import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import "./App.css"
import "./Home.css"
import "./Predictions.css"
import "./2026_Races.css"
import "./Articles.css"
import "./About.css"
import "./Feedback.css"
import "./Connect.css"
import "./AppShared.css"
import "./Counties.css"
import "./Race_Ratings.css"
import "./USA.css"
import "./States.css"
import html2canvas from "@html2canvas/html2canvas"
import About from "./About"
import Feedback from "./Feedback"
import Connect from "./Connect"
import Home from "./Home"
import Predictions from "./Predictions"
import Counties from "./Counties"
import USA from "./USA"
import States from "./States"
import Races from "./2026_Races"
import Race_Ratings from "./Race_Ratings"
import Articles from "./Articles"
import ArticlePage from "./ArticlePage"
import type { Article } from "./ArticleTypes"
import type { Rating } from "./ElectionTypes"
import { articles, renderMarkdown } from "./ArticleUtils"
import { pathForPage, resolveRoute, stateAbbreviations, stateSlugFromAbbreviation, type Page } from "./routes"
import { countyCountsByState, countyStateOptions } from "./CountyData"
import { senate2026States, governor2026States } from "./ElectionCycleData"

/* =========================================================
   APP
========================================================= */

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

type PredictionMapType = "senate" | "house" | "governor" | "county"

type PredictionFile = {
  format: "ElectionCentralPrediction"
  version: 1
  mapType: PredictionMapType
  title: string
  predictions: Record<string, Rating>
  scope?: string
  partyLabels?: {
    democrats: string
    republicans: string
  }
}

function defaultPredictionTitle(mapType: PredictionMapType, countyState?: string) {
  if (mapType === "senate") return "2026 U.S. Senate Prediction"
  if (mapType === "house") return "2026 U.S. House Prediction"
  if (mapType === "county") {
    if (countyState) {
      const stateName = Object.entries(stateAbbreviations).find(([, abbreviation]) => abbreviation === countyState)?.[0] ?? countyState
      return `2026 ${stateName} County Prediction`
    }
    return "2026 U.S. County Prediction"
  }
  return "2026 Governor Prediction"
}

function predictionStorageKeys(mapType: PredictionMapType) {
  return {
    predictions: `electionCentral${mapType.charAt(0).toUpperCase()}${mapType.slice(1)}Predictions`,
    title: `electionCentral${mapType.charAt(0).toUpperCase()}${mapType.slice(1)}PredictionTitle`,
  }
}


function App() {
  /* =======================================================
     PAGE
  ======================================================= */

  const [page, setPageState] = useState<Page>(() => resolveRoute(window.location.pathname).page)

  useEffect(() => {
    if (window.location.pathname === "/") {
      window.history.replaceState({}, "", "/home")
    }
  }, [])

  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem("electionCentralDarkMode") === "true"
  )

  useEffect(() => {
    document.body.classList.toggle("ec-dark", isDarkMode)
    localStorage.setItem("electionCentralDarkMode", String(isDarkMode))

    return () => {
      document.body.classList.remove("ec-dark")
    }
  }, [isDarkMode])

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    const match = window.location.pathname.match(/^\/articles\/([^/]+)$/)
    const slug = match ? decodeURIComponent(match[1]) : null
    return slug ? articles.find((article) => article.slug === slug) ?? null : null
  })
  const [raceRatingCategory, setRaceRatingCategory] = useState<"U.S. Senate" | "Governors" | "U.S. House">("U.S. Senate")

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
     COUNTY PREDICTIONS
  ======================================================= */

  const [countyPredictions, setCountyPredictions] = useState<Record<string, Record<string, Rating>>>(() => {
    try {
      return JSON.parse(localStorage.getItem("electionCentralCountyPredictions") ?? "{}")
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem("electionCentralCountyPredictions", JSON.stringify(countyPredictions))
  }, [countyPredictions])

  const [countyTitles, setCountyTitles] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("electionCentralCountyTitles") ?? "{}")
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem("electionCentralCountyTitles", JSON.stringify(countyTitles))
  }, [countyTitles])

  const [countyPartyLabels, setCountyPartyLabels] = useState<Record<string, { democrats: string; republicans: string }>>(() => {
    try {
      return JSON.parse(localStorage.getItem("electionCentralCountyPartyLabels") ?? "{}")
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem("electionCentralCountyPartyLabels", JSON.stringify(countyPartyLabels))
  }, [countyPartyLabels])

  const [countyMode, setCountyMode] = useState<"menu" | "states" | "map">(() => resolveRoute(window.location.pathname).countyMode)

  const [selectedCountyState, setSelectedCountyState] = useState<string | null>(() => resolveRoute(window.location.pathname).selectedCountyState)

  const setPage = useCallback((nextPage: Page, articleSlug?: string) => {
    if (nextPage === "county") {
      setCountyMode("menu")
      setSelectedCountyState(null)
    }
    setPageState(nextPage)
    const nextPath = pathForPage(nextPage, articleSlug)
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath)
    }
  }, [])

  // The URL is the source of truth, so nested pages continue to work on refresh
  // and browser Back/Forward restores the appropriate view.
  useEffect(() => {
    const handlePopState = () => {
      const route = resolveRoute(window.location.pathname)
      setPageState(route.page)
      setCountyMode(route.countyMode)
      setSelectedCountyState(route.selectedCountyState)
      const articleMatch = window.location.pathname.match(/^\/articles\/([^/]+)$/)
      const articleSlug = articleMatch ? decodeURIComponent(articleMatch[1]) : null
      setSelectedArticle(articleSlug ? articles.find((article) => article.slug === articleSlug) ?? null : null)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (page !== "county") return
    let target = "/predictions/counties"
    if (countyMode === "states") target = "/predictions/counties/states"
    if (countyMode === "map") {
      target = selectedCountyState
        ? `/predictions/counties/states/${stateSlugFromAbbreviation(selectedCountyState)}`
        : "/predictions/counties/USA"
    }
    if (window.location.pathname !== target) {
      window.history.pushState({}, "", target)
    }
  }, [page, countyMode, selectedCountyState])

  const [countyMapResetVersion, setCountyMapResetVersion] = useState(0)
  const [countyMapRefreshVersion, setCountyMapRefreshVersion] = useState(0)
  const [countySearch, setCountySearch] = useState("")
  const [submittedCountySearch, setSubmittedCountySearch] = useState("")
  const [countyStateSearch, setCountyStateSearch] = useState("")

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
        "Reset your Senate map? All Senate predictions and the title will be reset."
      )
    ) {
      setSenatePredictions({})
      setSenatePredictionTitle(defaultPredictionTitle("senate"))
      setSelectedRating("T")
    }
  }

  const resetGovernorMap = () => {
    if (
      window.confirm(
        "Reset your Governor map? All Governor predictions and the title will be reset."
      )
    ) {
      setGovernorPredictions({})
      setGovernorPredictionTitle(defaultPredictionTitle("governor"))
      setSelectedRating("T")
    }
  }

  const resetHouseMap = () => {
    if (
      window.confirm(
        "Reset your House map? All House district predictions and the title will be reset."
      )
    ) {
      setHousePredictions({})
      setHousePredictionTitle(defaultPredictionTitle("house"))
      setSelectedRating("T")
    }
  }

  const resetCountyMap = () => {
    const scope = selectedCountyState ?? "USA"
    const title = defaultPredictionTitle("county", selectedCountyState ?? undefined)
    if (window.confirm(`Reset your ${selectedCountyState ? `${selectedCountyState} ` : "U.S. "}county map? All county predictions and the title will be reset.`)) {
      setCountyPredictions((current) => ({ ...current, [scope]: {} }))
      setCountyTitles((current) => ({ ...current, [scope]: title }))
      setCountyPartyLabels((current) => ({ ...current, [scope]: { democrats: "Democrats", republicans: "Republicans" } }))
      setCountyMapResetVersion((current) => current + 1)
      setCountyMapRefreshVersion((current) => current + 1)
      setSelectedRating("T")
      setCountySearch("")
      setSubmittedCountySearch("")
    }
  }

  /* =======================================================
     SAVE / LOAD PREDICTION FILE
  ======================================================= */

  const savePredictionFile = (
    mapType: PredictionMapType,
    title: string,
    predictions: Record<string, Rating>,
    scope?: string,
    partyLabels?: { democrats: string; republicans: string }
  ) => {
    const predictionFile: PredictionFile = {
      format: "ElectionCentralPrediction",
      version: 1,
      mapType,
      title: title.trim() || defaultPredictionTitle(mapType),
      predictions,
      ...(scope ? { scope } : {}),
      ...(partyLabels ? { partyLabels } : {}),
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
              : parsed.mapType === "county"
                ? "County"
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
      } else if (page === "county") {
        const scope = parsed.scope || "USA"
        setCountyPredictions((current) => ({ ...current, [scope]: predictions }))
        setCountyTitles((current) => ({ ...current, [scope]: parsed.title?.trim() || defaultPredictionTitle("county", scope === "USA" ? undefined : scope) }))
        setCountyPartyLabels((current) => ({
          ...current,
          [scope]: {
            democrats: parsed.partyLabels?.democrats?.trim() || "Democrats",
            republicans: parsed.partyLabels?.republicans?.trim() || "Republicans",
          },
        }))
        setSelectedCountyState(scope === "USA" ? null : scope)
        setCountyMode("map")
        setCountyMapRefreshVersion((current) => current + 1)
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

              onclone: (clonedDocument) => {
                clonedDocument.body.classList.remove("ec-dark")
              },
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
              : page === "county"
                ? `Election-Central-2026-${selectedCountyState ?? "US"}-County-Prediction.png`
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
        <img className="logo-mark" src="/EC.png" alt="Election Central logo" />
        <span className="logo-text">Election Central</span>
        <span className="logo-year">Published 2026</span>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setIsDarkMode((current) => !current)}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>

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
            page === "house" ||
            page === "county"
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
          className={page === "raceRatings" ? "active" : ""}
          onClick={() => setPage("raceRatings")}
        >
          Race Ratings
        </button>

        <button
          className={
            page === "articles" || page === "article"
              ? "active"
              : ""
          }
          onClick={() => setPage("articles")}
        >
          Final Predictions 2026
        </button>

        <button
          className={page === "about" ? "active" : ""}
          onClick={() => setPage("about")}
        >
          About
        </button>

        <button
          className={page === "feedback" ? "active" : ""}
          onClick={() => setPage("feedback")}
        >
          Feedback
        </button>

        <button
          className={page === "connect" ? "active" : ""}
          onClick={() => setPage("connect")}
        >
          Connect
        </button>
        </nav>
      </div>

    </header>
  )

  const racePageProps = {
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
  }

  /* =======================================================
     MODULAR PAGE COMPONENTS
  ======================================================= */

  if (page === "home") {
    return <Home Header={Header} timeLeft={timeLeft} setPage={setPage} articles={articles} setSelectedArticle={setSelectedArticle} />
  }

  if (page === "raceRatings") {
    return <Race_Ratings Header={Header} raceRatingCategory={raceRatingCategory} setRaceRatingCategory={setRaceRatingCategory} />
  }

  if (page === "articles") {
    return <Articles Header={Header} articles={articles} setSelectedArticle={setSelectedArticle} setPage={setPage} />
  }

  if (page === "article" && selectedArticle) {
    return <ArticlePage Header={Header} selectedArticle={selectedArticle} setPage={setPage} renderMarkdown={renderMarkdown} />
  }

  if (page === "article") {
    return <Articles Header={Header} articles={articles} setSelectedArticle={setSelectedArticle} setPage={setPage} />
  }

  /* =======================================================
     FEEDBACK PAGE
  ======================================================= */

  if (page === "feedback") {
    return (
      <div className="app">
        <Header />
        <Feedback />
      </div>
    )
  }

  /* =======================================================
     CONNECT PAGE
  ======================================================= */

  if (page === "connect") {
    return (
      <div className="app">
        <Header />
        <Connect />
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

  if (page === "predictions") {
    return <Predictions Header={Header} setPage={setPage} setCountyMode={setCountyMode} />
  }

  /* =======================================================
     COUNTY SELECTION / LANDING PAGE
  ======================================================= */

  if (page === "county" && countyMode === "menu") {
    return <Counties Header={Header} setCountyMode={setCountyMode} setPage={setPage} setSelectedCountyState={setSelectedCountyState} setCountySearch={setCountySearch} setSubmittedCountySearch={setSubmittedCountySearch} />
  }

  if (page === "county" && countyMode === "states") {
    return <States mode="selection" Header={Header} setCountyMode={setCountyMode} setSelectedCountyState={setSelectedCountyState} setCountySearch={setCountySearch} setSubmittedCountySearch={setSubmittedCountySearch} countyStateSearch={countyStateSearch} setCountyStateSearch={setCountyStateSearch} countyStateOptions={countyStateOptions} />
  }

  const countyMapPageProps = {
    Header, selectedCountyState, countyTitles, setCountyTitles, defaultPredictionTitle,
    countyPredictions, countyPartyLabels, editingPredictionTitle, setEditingPredictionTitle,
    isExporting, exportRef, selectedRating, setSelectedRating, countySearch,
    submittedCountySearch, setCountySearch, setSubmittedCountySearch, countyMapRefreshVersion,
    countyMapResetVersion, setCountyPredictions, setCountyPartyLabels, countyCountsByState,
    exportAsImage, predictionFileInputRef, loadPredictionFile, savePredictionFile,
    openPredictionFilePicker, resetCountyMap, setCountyMode,
  }

  if (page === "county" && countyMode === "map") {
    return selectedCountyState
      ? <States mode="map" {...countyMapPageProps} />
      : <USA {...countyMapPageProps} />
  }

  /* =======================================================
     2026 RACE PREDICTION PAGES
  ======================================================= */

  if (page === "senate" || page === "house" || page === "governor") {
    return <Races {...racePageProps} />
  }

  return null
}

export default App
