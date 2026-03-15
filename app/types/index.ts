export type EntityType = "industry" | "skill" | "role" | "location";

export interface EntityChip {
  id: string;
  type: EntityType;
  value: string;
}

export type SearchTab = "project" | "people";

export type BadgeSource = "ai" | "self";

export interface ExternalLink {
  label: string;
  url: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  aiTags: string[];
  municipality: string;
  availability: "available" | "busy" | "open-to-offers";
  matchScore?: number;
  matchReason?: string;
  badgeSource: BadgeSource;
  externalLinks: ExternalLink[];
  email: string;
  phone?: string;
  verifiedBadges?: string[];
}

export interface SearchState {
  query: string;
  tab: SearchTab;
  entities: EntityChip[];
}
