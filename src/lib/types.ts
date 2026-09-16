export type Locale = "nl" | "en" | "de" | "fr";

export type Localized = {
  nl: string;
  en: string;
  de?: string;
  fr?: string;
};

export type EventPhase =
  | "join"
  | "flame"
  | "opening"
  | "live"
  | "golden"
  | "final"
  | "ceremony"
  | "results";

export type GameStatus = "completed" | "now" | "up_next" | "locked";

export type ScoreMethod = "head_to_head" | "points" | "time";

export type Country = {
  id: string;
  code: string;
  name: Localized;
  flag: string;
  color: string;
  colorName: Localized;
  motto: Localized;
};

export type Participant = {
  id: string;
  name: string;
  countryId: string;
  isCaptain: boolean;
};

export type Game = {
  id: string;
  slug: string;
  station: number;
  name: Localized;
  shortName: Localized;
  tagline: Localized;
  mission: Localized;
  howTo: Localized[];
  rules: Localized[];
  noGo: Localized[];
  tip: Localized;
  players: { min: number; max: number };
  durationMin: number;
  winCondition: Localized;
  scoreMethod: ScoreMethod;
  materials: Localized;
  safety: Localized;
  image: string;
  videoDuration: string;
};

export type Assignment = {
  id: string;
  round: number;
  gameId: string;
  countryIds: string[];
  startsAt: string;
  status: GameStatus;
  pointsAwarded: Record<string, number>;
  medals: Record<string, "gold" | "silver" | "bronze">;
  scores?: Record<string, number>;
};

export type Achievement = {
  id: string;
  icon: string;
  name: Localized;
};

export type Notice = {
  id: string;
  kind: "next" | "go" | "result" | "ranking" | "final" | "host";
  title: Localized;
  body: Localized;
  at: number;
};

export type FlameStep = {
  id: string;
  name: Localized;
  done: boolean;
};

export type Session = {
  participantId: string;
  countryId: string;
  eventCode: string;
  locale: Locale;
};

export type EventState = {
  code: string;
  name: Localized;
  location: string;
  date: string;
  dateLabel: Localized;
  defaultLocale: Locale;
  phase: EventPhase;
  currentRound: number;
  totalRounds: number;
  openingAt: string;
  goldenStartsAt?: string;
  countries: Country[];
  participants: Participant[];
  games: Game[];
  assignments: Assignment[];
  flame: FlameStep[];
  notices: Notice[];
  awards: {
    teamSpiritCountryId?: string;
    mvpName?: string;
  };
  sponsor?: string;
  companyLogo?: string;
  updatedAt: number;
};

export type OfficialSession = {
  station: number;
  name: string;
};
