/* =========================================================
   ELECTION CENTRAL - RACE INFORMATION

   This file contains ONLY the race-information templates.
   Fill in the candidates, incumbency, ElectionCentral rating,
   and key-race status yourself.

   Candidate fields:
     - democraticCandidate
     - republicanCandidate

   Incumbency:
     - Set democraticIncumbent or republicanIncumbent to true
       when that candidate is the incumbent.
     - You can leave the field out when the candidate is not
       the incumbent.

   ElectionCentral rating examples:
     "Safe D"
     "Likely D"
     "Lean D"
     "Tilt D"
     "Tossup"
     "Tilt R"
     "Lean R"
     "Likely R"
     "Safe R"

   Set keyRace to true to display the gold "Key Race" label.
========================================================= */






export type ElectionRaceInfo = {
  democraticCandidate?: string
  democraticIncumbent?: boolean
  republicanCandidate?: string
  republicanCandidates?: string[]
  republicanIncumbent?: boolean
  independentCandidate?: string
  independentIncumbent?: boolean
  electionCentralRating?: string
  keyRace?: boolean
}

/* =========================================================
   2026 SENATE RACES
========================================================= */

export const senateRaceInfo: Record<string, ElectionRaceInfo> = {
  Alabama: {
    democraticCandidate: "Everett Wess",
    republicanCandidate: "Barry Moore",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Alaska: {
    democraticCandidate: "Mary Peltola",
    republicanCandidates: ["Dan Sullivan", "Dan J. Sullivan Jr.", "Gerald L. Heikes"],
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Lean D (flip)",
    keyRace: true,
  },
  Arkansas: {
    democraticCandidate: "Hallie Shoffner",
    republicanCandidate: "Tom Cotton",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Colorado: {
    democraticCandidate: "John Hickenlooper",
    democraticIncumbent: true,
    republicanCandidate: "Mark Baisley",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Delaware: {
    democraticCandidate: "Chris Coons",
    democraticIncumbent: true,
    republicanCandidate: "Michael Katz",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Florida: {
    democraticCandidate: "Angie Nixon",
    republicanCandidate: "Ashley Moody",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Likely R",
    keyRace: false,
  },
  Georgia: {
    democraticCandidate: "Jon Ossoff",
    democraticIncumbent: true,
    republicanCandidate: "Mike Collins",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: true,
  },
  Idaho: {
    democraticCandidate: "None",
    republicanCandidate: "Jim Risch",
    republicanIncumbent: true,
    independentCandidate: "Todd Achillies",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Illinois: {
    democraticCandidate: "Juliana Stratton",
    republicanCandidate: "Don Tracy",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Iowa: {
    democraticCandidate: "Josh Turek",
    republicanCandidate: "Ashley Hinson",
    electionCentralRating: "EC Rating: Lean R",
    keyRace: true,
  },
  Kansas: {
    democraticCandidate: "Adam Hamilton",
    republicanCandidate: "Roger Marshall",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Lean R",
    keyRace: false,
  },
  Kentucky: {
    democraticCandidate: "Charles Booker",
    republicanCandidate: "Andy Barr",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Louisiana: {
    democraticCandidate: "Jamie Davis",
    republicanCandidate: "Julia Letlow",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Maine: {
    democraticCandidate: "Troy Jackson",
    republicanCandidate: "Susan Collins",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Lean D (flip)",
    keyRace: true,
  },
  Massachusetts: {
    democraticCandidate: "Ed Markey",
    democraticIncumbent: true,
    republicanCandidate: "John Deaton",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Michigan: {
    democraticCandidate: "Abdul El-Sayed",
    republicanCandidate: "Mike Rogers",
    electionCentralRating: "EC Rating: Lean D",
    keyRace: true,
  },
  Minnesota: {
    democraticCandidate: "Peggy Flanagan",
    republicanCandidate: "Michele Tayofa",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: false,
  },
  Mississippi: {
    democraticCandidate: "Scott Colom",
    republicanCandidate: "Cindy Hyde-Smith",
    republicanIncumbent: true,
    independentCandidate: "Ty Pinkins",
    electionCentralRating: "EC Rating: Likely R",
    keyRace: false,
  },
  Montana: {
    democraticCandidate: "Alani Bankhead",
    republicanCandidate: "Kurt Alme",
    independentCandidate: "Seth Bodnar",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Nebraska: {
    democraticCandidate: "None",
    republicanCandidate: "Pete Ricketts",
    republicanIncumbent: true,
    independentCandidate: "Dan Osborn",
    electionCentralRating: "EC Rating: Likely R",
    keyRace: true,
  },
  "New Hampshire": {
    democraticCandidate: "Chris Pappas",
    republicanCandidate: "John E. Sununu",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: true,
  },
  "New Jersey": {
    democraticCandidate: "Cory Booker",
    democraticIncumbent: true,
    republicanCandidate: "Justin Murphy",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  "New Mexico": {
    democraticCandidate: "Ben Ray Luján",
    democraticIncumbent: true,
    republicanCandidate: "Larry Marker (write-in)",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  "North Carolina": {
    democraticCandidate: "Roy Cooper",
    republicanCandidate: "Michael Whatley",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: true,
  },
  Ohio: {
    democraticCandidate: "Sherrod Brown",
    republicanCandidate: "Jon Husted",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Tilt D (flip)",
    keyRace: true,
  },
  Oklahoma: {
    democraticCandidate: "N'Kiyla Jasmine Thomas",
    republicanCandidate: "Kevin Hern",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Oregon: {
    democraticCandidate: "Jeff Merkley",
    democraticIncumbent: true,
    republicanCandidate: "David Brock Smith",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  "Rhode Island": {
    democraticCandidate: "Jack Reed",
    democraticIncumbent: true,
    republicanCandidate: "Raymond McKay",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  "South Carolina": {
    democraticCandidate: "Annie Andrews",
    republicanCandidate: "Darline Graham",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Likely R",
    keyRace: false,
  },
  "South Dakota": {
    democraticCandidate: "None",
    republicanCandidate: "Mike Rounds",
    republicanIncumbent: true,
    independentCandidate: "Brian Bengs",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Tennessee: {
    democraticCandidate: "Marquita Bradshaw",
    republicanCandidate: "Bill Hagerty",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Texas: {
    democraticCandidate: "James Talarico",
    republicanCandidate: "Ken Paxton",
    electionCentralRating: "EC Rating: Tilt D (flip)",
    keyRace: true,
  },
  Virginia: {
    democraticCandidate: "Mark Warner",
    democraticIncumbent: true,
    republicanCandidate: "Bert Mizusawa",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  "West Virginia": {
    democraticCandidate: "Rachel Fetty Anderson",
    republicanCandidate: "Shelley Moore Capito",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Wyoming: {
    democraticCandidate: "James W. Byrd",
    republicanCandidate: "Harriet Hageman",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
}

/* =========================================================
   2026 GOVERNOR RACES
========================================================= */

export const governorRaceInfo: Record<string, ElectionRaceInfo> = {
  Alabama: {
    democraticCandidate: "Doug Jones",
    republicanCandidate: "Tommy Tuberville",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Alaska: {
    democraticCandidate: "Jonathan Kreiss-Tomkins",
    republicanCandidates: ["Bernadette Wilson", "Dave Bronson", "Candice English"],
    electionCentralRating: "EC Rating: Lean R",
    keyRace: true,
  },
  Arizona: {
    democraticCandidate: "Katie Hobbs",
    democraticIncumbent: true,
    republicanCandidate: "Andy Biggs",
    electionCentralRating: "EC Rating: Lean D",
    keyRace: true,
  },
  Arkansas: {
    democraticCandidate: "Fredrick Love",
    republicanCandidate: "Sarah Huckabee Sanders",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  California: {
    democraticCandidate: "Xavier Becerra",
    republicanCandidate: "Steve Hilton",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Colorado: {
    democraticCandidate: "Phil Weiser",
    republicanCandidate: "Victor Marx",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Connecticut: {
    democraticCandidate: "Ned Lamont",
    democraticIncumbent: true,
    republicanCandidate: "Ryan Fazio",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Florida: {
    democraticCandidate: "David Jolly",
    republicanCandidate: "Byron Donalds",
    electionCentralRating: "EC Rating: Likely R",
    keyRace: true,
  },
  Georgia: {
    democraticCandidate: "Keisha Lance Bottoms",
    republicanCandidate: "Rick Jackson",
    electionCentralRating: "EC Rating: Tilt R",
    keyRace: true,
  },
  Hawaii: {
    democraticCandidate: "Josh Green",
    republicanCandidate: "Gary Cordery",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Idaho: {
    democraticCandidate: "Terri Pickens",
    republicanCandidate: "Brad Little",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Illinois: {
    democraticCandidate: "J.B Pritzker",
    democraticIncumbent: true,
    republicanCandidate: "Darren Bailey",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Iowa: {
    democraticCandidate: "Rob Sand",
    republicanCandidate: "Zach Lahn",
    electionCentralRating: "EC Rating: Lean D (flip)",
    keyRace: true,
  },
  Kansas: {
    democraticCandidate: "Cindy Holscher",
    republicanCandidate: "Ty Masterson",
    electionCentralRating: "EC Rating: Likely R (flip)",
    keyRace: true,
  },
  Maine: {
    democraticCandidate: "Hannah Pingree",
    republicanCandidate: "Bobby Charles",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: false,
  },
  Maryland: {
    democraticCandidate: "Wes Moore",
    democraticIncumbent: true,
    republicanCandidate: "Dan Cox",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Massachusetts: {
    democraticCandidate: "Maura Healey",
    democraticIncumbent: true,
    republicanCandidate: "Michael Minogue",
    electionCentralRating: "",
    keyRace: false,
  },
  Michigan: {
    democraticCandidate: "Jocelyn Benson",
    republicanCandidate: "John James",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: true,
  },
  Minnesota: {
    democraticCandidate: "Amy Klobuchar",
    republicanCandidate: "Lisa Demuth",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: false,
  },
  Nebraska: {
    democraticCandidate: "Jim Pillen",
    democraticIncumbent: true,
    republicanCandidate: "Lynne Walz",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Nevada: {
    democraticCandidate: "Aaron Ford",
    republicanCandidate: "Joe Lombardo",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Tilt R",
    keyRace: true,
  },
  "New Hampshire": {
    democraticCandidate: "Cinde Warmington",
    republicanCandidate: "Kelly Ayotte",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Likely R",
    keyRace: false,
  },
  "New Mexico": {
    democraticCandidate: "Deb Haaland",
    republicanCandidate: "Gregg Hull",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: false,
  },
  "New York": {
    democraticCandidate: "Kathy Hochul",
    democraticIncumbent: true,
    republicanCandidate: "Bruce Blakeman",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: false,
  },
  Ohio: {
    democraticCandidate: "Amy Acton",
    republicanCandidate: "Vivek Ramaswamy",
    electionCentralRating: "EC Rating: Tilt R",
    keyRace: true,
  },
  Oklahoma: {
    democraticCandidate: "Cyndi Munson",
    republicanCandidate: "Mike Mazzei",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Oregon: {
    democraticCandidate: "Tina Kotek",
    democraticIncumbent: true,
    republicanCandidate: "Christine Drazan",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: true,
  },
  Pennsylvania: {
    democraticCandidate: "Josh Shapiro",
    democraticIncumbent: true,
    republicanCandidate: "Stacy Garrity",
    electionCentralRating: "EC Rating: Safe D",
    keyRace: true,
  },
  "Rhode Island": {
    democraticCandidate: "Helena Foulkes",
    republicanCandidate: "Aaron Guckian",
    electionCentralRating: "EC Rating: Likely D",
    keyRace: false,
  },
  "South Carolina": {
    democraticCandidate: "Jeramine Johnson",
    republicanCandidate: "Alan Wilson",
    electionCentralRating: "EC Rating: Likely R",
    keyRace: false,
  },
  "South Dakota": {
    democraticCandidate: "Dan Ahlers",
    republicanCandidate: "Larry Rhoden",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Tennessee: {
    democraticCandidate: "Jerri Green",
    republicanCandidate: "Marsha Blackburn",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
  Texas: {
    democraticCandidate: "Gina Hinojosa",
    republicanCandidate: "Greg Abbott",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Lean R",
    keyRace: true,
  },
  Vermont: {
    democraticCandidate: "Amanda Janoo",
    republicanCandidate: "Phil Scott",
    republicanIncumbent: true,
    electionCentralRating: "EC Rating: Likely R",
    keyRace: false,
  },
  Wisconsin: {
    democraticCandidate: "David Crowley",
    republicanCandidate: "Tom Tiffany",
    electionCentralRating: "EC Rating: Lean D",
    keyRace: true,
  },
  Wyoming: {
    democraticCandidate: "Kenneth Casner",
    republicanCandidate: "Eric Barlow",
    electionCentralRating: "EC Rating: Safe R",
    keyRace: false,
  },
}