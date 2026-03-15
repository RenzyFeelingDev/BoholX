import { EntityChip, EntityType } from "@/app/types";

let counter = 0;
function uid() {
  return `chip-${++counter}-${Date.now()}`;
}

const INDUSTRY_KEYWORDS: Record<string, string> = {
  restaurant: "F&B",
  catering: "F&B",
  "food and beverage": "F&B",
  "f&b": "F&B",
  food: "F&B",
  hospitality: "Hospitality",
  hotel: "Hospitality",
  resort: "Hospitality",
  tourism: "Tourism",
  "eco-tourism": "Eco-Tourism",
  marine: "Marine",
  agriculture: "Agriculture",
  farming: "Agriculture",
  tech: "Technology",
  technology: "Technology",
  software: "Technology",
  design: "Design",
  creative: "Creative",
  media: "Media",
  events: "Events",
  education: "Education",
  healthcare: "Healthcare",
  construction: "Construction",
};

const SKILL_KEYWORDS: Record<string, string> = {
  developer: "Web Development",
  "web developer": "Web Development",
  "full-stack": "Full-Stack Dev",
  "full stack": "Full-Stack Dev",
  react: "React",
  "node.js": "Node.js",
  nodejs: "Node.js",
  postgresql: "PostgreSQL",
  designer: "Graphic Design",
  "graphic design": "Graphic Design",
  branding: "Branding",
  photographer: "Photography",
  photography: "Photography",
  "social media": "Social Media",
  marketing: "Marketing",
  seo: "SEO",
  content: "Content Creation",
  "event coordinator": "Event Coordination",
  "event management": "Event Management",
  caterer: "Catering",
  cooking: "Culinary Arts",
  "marine biologist": "Marine Biology",
  diving: "Scuba Diving",
  "dive instructor": "Dive Instruction",
  farming: "Organic Farming",
  "organic farming": "Organic Farming",
  consultant: "Consulting",
  trainer: "Training",
  facilitator: "Facilitation",
  writer: "Writing",
  copywriting: "Copywriting",
  videographer: "Videography",
  video: "Videography",
};

const ROLE_KEYWORDS: Record<string, string> = {
  "project manager": "Project Manager",
  manager: "Manager",
  developer: "Developer",
  designer: "Designer",
  photographer: "Photographer",
  videographer: "Videographer",
  consultant: "Consultant",
  coordinator: "Coordinator",
  instructor: "Instructor",
  guide: "Tour Guide",
  "tour guide": "Tour Guide",
  chef: "Chef",
  cook: "Chef",
  caterer: "Caterer",
  farmer: "Farmer",
  researcher: "Researcher",
  "virtual assistant": "Virtual Assistant",
  "va ": "Virtual Assistant",
  accountant: "Accountant",
  lawyer: "Lawyer",
  engineer: "Engineer",
};

const LOCATION_KEYWORDS: Record<string, string> = {
  panglao: "Panglao",
  carmen: "Carmen",
  tagbilaran: "Tagbilaran",
  loboc: "Loboc",
  baclayon: "Baclayon",
  alburquerque: "Alburquerque",
  antequera: "Antequera",
  balilihan: "Balilihan",
  batuan: "Batuan",
  bilar: "Bilar",
  buenavista: "Buenavista",
  calape: "Calape",
  candijay: "Candijay",
  corella: "Corella",
  cortes: "Cortes",
  dagohoy: "Dagohoy",
  dauis: "Dauis",
  dimiao: "Dimiao",
  duero: "Duero",
  "garcia hernandez": "Garcia Hernandez",
  guindulman: "Guindulman",
  inabanga: "Inabanga",
  jagna: "Jagna",
  lila: "Lila",
  loay: "Loay",
  mabini: "Mabini",
  maribojoc: "Maribojoc",
  pilar: "Pilar",
  pres: "Pres. Carlos P. Garcia",
  sagbayan: "Sagbayan",
  "san isidro": "San Isidro",
  "san miguel": "San Miguel",
  "sierra bullones": "Sierra Bullones",
  sikatuna: "Sikatuna",
  talibon: "Talibon",
  trinidad: "Trinidad",
  tubigon: "Tubigon",
  ubay: "Ubay",
  "bien unido": "Bien Unido",
  "anda ": "Anda",
  bohol: "Bohol",
};

function matchKeywords(
  text: string,
  keywords: Record<string, string>
): { matched: string; normalized: string }[] {
  const lower = text.toLowerCase();
  const results: { matched: string; normalized: string }[] = [];
  const seen = new Set<string>();

  // Sort by length descending so longer phrases match first
  const sortedKeys = Object.keys(keywords).sort((a, b) => b.length - a.length);

  for (const kw of sortedKeys) {
    if (lower.includes(kw) && !seen.has(keywords[kw])) {
      seen.add(keywords[kw]);
      results.push({ matched: kw, normalized: keywords[kw] });
    }
  }

  return results;
}

export function parseEntities(query: string): EntityChip[] {
  if (!query.trim()) return [];

  const chips: EntityChip[] = [];
  const addedValues = new Set<string>();

  const addChip = (type: EntityType, value: string) => {
    if (!addedValues.has(value.toLowerCase())) {
      addedValues.add(value.toLowerCase());
      chips.push({ id: uid(), type, value });
    }
  };

  matchKeywords(query, LOCATION_KEYWORDS).forEach(({ normalized }) =>
    addChip("location", normalized)
  );
  matchKeywords(query, INDUSTRY_KEYWORDS).forEach(({ normalized }) =>
    addChip("industry", normalized)
  );
  matchKeywords(query, SKILL_KEYWORDS).forEach(({ normalized }) =>
    addChip("skill", normalized)
  );
  matchKeywords(query, ROLE_KEYWORDS).forEach(({ normalized }) =>
    addChip("role", normalized)
  );

  return chips;
}

export function scoreMatch(
  talent: { aiTags: string[]; skills: string[]; municipality: string; availability: string },
  entities: EntityChip[]
): number {
  if (!entities.length) return 0;

  const allTalentText = [
    ...talent.aiTags,
    ...talent.skills,
    talent.municipality,
  ]
    .map((s) => s.toLowerCase())
    .join(" ");

  let primarySkillScore = 0;
  let industryScore = 0;
  let availabilityScore = 0;

  const skillEntities = entities.filter((e) => e.type === "skill" || e.type === "role");
  const industryEntities = entities.filter((e) => e.type === "industry");
  const locationEntities = entities.filter((e) => e.type === "location");

  if (skillEntities.length > 0) {
    const matches = skillEntities.filter((e) =>
      allTalentText.includes(e.value.toLowerCase())
    );
    primarySkillScore = matches.length / skillEntities.length;
  } else {
    primarySkillScore = 0.5;
  }

  if (industryEntities.length > 0) {
    const matches = industryEntities.filter((e) =>
      allTalentText.includes(e.value.toLowerCase())
    );
    industryScore = matches.length / industryEntities.length;
  } else {
    industryScore = 0.5;
  }

  if (locationEntities.length > 0) {
    const locationMatch = locationEntities.some((e) =>
      talent.municipality.toLowerCase().includes(e.value.toLowerCase())
    );
    availabilityScore = locationMatch ? 1 : 0;
  } else {
    availabilityScore = talent.availability === "available" ? 1 : talent.availability === "open-to-offers" ? 0.7 : 0.3;
  }

  const raw = primarySkillScore * 0.5 + industryScore * 0.3 + availabilityScore * 0.2;
  return Math.round(raw * 100);
}
