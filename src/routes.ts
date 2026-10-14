export type Page = "home" | "predictions" | "raceRatings" | "articles" | "article" | "about" | "feedback" | "connect" | "senate" | "governor" | "house" | "county"

export const stateAbbreviations: Record<string, string> = {
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


type ResolvedRoute = {
  page: Page
  countyMode: "menu" | "states" | "map"
  selectedCountyState: string | null
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1)
  return pathname || "/"
}

export function stateSlugFromAbbreviation(abbreviation: string) {
  const stateName = Object.entries(stateAbbreviations).find(([, value]) => value === abbreviation)?.[0] ?? abbreviation
  return stateName.toLowerCase().replace(/\s+/g, "-")
}

export function resolveRoute(pathname: string): ResolvedRoute {
  const path = normalizePath(pathname)
  const base: ResolvedRoute = { page: "home", countyMode: "menu", selectedCountyState: null }

  if (path === "/" || path === "/home") return base
  if (path === "/predictions") return { ...base, page: "predictions" }
  if (path === "/predictions/2026_senate") return { ...base, page: "senate" }
  if (path === "/predictions/2026_house") return { ...base, page: "house" }
  if (path === "/predictions/2026_governor") return { ...base, page: "governor" }
  if (path === "/race_ratings") return { ...base, page: "raceRatings" }
  if (path === "/articles") return { ...base, page: "articles" }
  if (path.startsWith("/articles/")) return { ...base, page: "article" }
  if (path === "/about") return { ...base, page: "about" }
  if (path === "/feedback") return { ...base, page: "feedback" }
  if (path === "/connect") return { ...base, page: "connect" }
  if (path === "/predictions/counties") return { ...base, page: "county", countyMode: "menu" }
  if (path === "/predictions/counties/USA" || path === "/predictions/counties/usa") return { ...base, page: "county", countyMode: "map" }
  if (path === "/predictions/counties/states") return { ...base, page: "county", countyMode: "states" }

  const stateMatch = path.match(/^\/predictions\/counties\/states\/([^/]+)$/)
  if (stateMatch) {
    const slug = stateMatch[1].toLowerCase()
    const stateName = Object.keys(stateAbbreviations).find((name) => name.toLowerCase().replace(/\s+/g, "-") === slug)
    if (stateName) {
      return { ...base, page: "county", countyMode: "map", selectedCountyState: stateAbbreviations[stateName] }
    }
  }

  return base
}

export function pathForPage(page: Page, articleSlug?: string) {
  switch (page) {
    case "home": return "/home"
    case "predictions": return "/predictions"
    case "senate": return "/predictions/2026_senate"
    case "house": return "/predictions/2026_house"
    case "governor": return "/predictions/2026_governor"
    case "county": return "/predictions/counties"
    case "raceRatings": return "/race_ratings"
    case "articles": return "/articles"
    case "article": return articleSlug ? `/articles/${encodeURIComponent(articleSlug)}` : "/articles"
    case "about": return "/about"
    case "feedback": return "/feedback"
    case "connect": return "/connect"
    default: return "/home"
  }
}
