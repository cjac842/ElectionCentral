import { stateAbbreviations } from "./routes"

export const countyGeoUrl =
  "https://unpkg.com/us-atlas@3.0.1/counties-albers-10m.json"

export const stateFips: Record<string, string> = {
  AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09", DE: "10",
  FL: "12", GA: "13", HI: "15", ID: "16", IL: "17", IN: "18", IA: "19", KS: "20",
  KY: "21", LA: "22", ME: "23", MD: "24", MA: "25", MI: "26", MN: "27", MS: "28",
  MO: "29", MT: "30", NE: "31", NV: "32", NH: "33", NJ: "34", NM: "35", NY: "36",
  NC: "37", ND: "38", OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45",
  SD: "46", TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
  WI: "55", WY: "56",
}

export const countyStateOptions = Object.entries(stateAbbreviations).map(([name, abbreviation]) => ({
  name,
  abbreviation,
  fips: stateFips[abbreviation],
  slug: name.toLowerCase().replace(/\s+/g, "-"),
}))

/* =========================================================
   COUNTY COUNTS BY STATE
========================================================= */

export const countyCountsByState: Record<string, number> = {
  AL: 67, AK: 30, AZ: 15, AR: 75, CA: 58, CO: 64, CT: 9, DE: 3,
  FL: 67, GA: 159, HI: 5, ID: 44, IL: 102, IN: 92, IA: 99, KS: 105,
  KY: 120, LA: 64, ME: 16, MD: 24, MA: 14, MI: 83, MN: 87, MS: 82,
  MO: 115, MT: 56, NE: 93, NV: 17, NH: 10, NJ: 21, NM: 33, NY: 62,
  NC: 100, ND: 53, OH: 88, OK: 77, OR: 36, PA: 67, RI: 5, SC: 46,
  SD: 66, TN: 95, TX: 254, UT: 29, VT: 14, VA: 133, WA: 39, WV: 55,
  WI: 72, WY: 23,
}

