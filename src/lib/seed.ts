import { GAME_LIBRARY } from "./catalog";
import type {
  Achievement,
  Assignment,
  Country,
  EventState,
  FlameStep,
  Participant,
} from "./types";

export const DEMO_CODE = "ABC123";

const minutesFrom = (base: Date, minutes: number) =>
  new Date(base.getTime() + minutes * 60_000).toISOString();

export const COUNTRIES: Country[] = [
  {
    id: "nl",
    code: "NED",
    name: { nl: "Netherlands", en: "Netherlands" },
    flag: "🇳🇱",
    color: "#EC6608",
    colorName: { nl: "ORANGE", en: "ORANGE" },
    motto: { nl: "Go for Gold.", en: "Go for Gold." },
  },
  {
    id: "br",
    code: "BRA",
    name: { nl: "Brazil", en: "Brazil" },
    flag: "🇧🇷",
    color: "#009B3A",
    colorName: { nl: "GREEN", en: "GREEN" },
    motto: { nl: "Joga bonito.", en: "Joga bonito." },
  },
  {
    id: "jp",
    code: "JPN",
    name: { nl: "Japan", en: "Japan" },
    flag: "🇯🇵",
    color: "#BC002D",
    colorName: { nl: "RED", en: "RED" },
    motto: { nl: "One team, one fire.", en: "One team, one fire." },
  },
  {
    id: "us",
    code: "USA",
    name: { nl: "USA", en: "USA" },
    flag: "🇺🇸",
    color: "#3C3B6E",
    colorName: { nl: "BLUE", en: "BLUE" },
    motto: { nl: "Bring the heat.", en: "Bring the heat." },
  },
  {
    id: "it",
    code: "ITA",
    name: { nl: "Italy", en: "Italy" },
    flag: "🇮🇹",
    color: "#008C45",
    colorName: { nl: "AZURE", en: "AZURE" },
    motto: { nl: "Forza.", en: "Forza." },
  },
  {
    id: "de",
    code: "GER",
    name: { nl: "Germany", en: "Germany" },
    flag: "🇩🇪",
    color: "#000000",
    colorName: { nl: "BLACK", en: "BLACK" },
    motto: { nl: "Präzision.", en: "Precision." },
  },
];

export const PARTICIPANTS: Participant[] = [
  { id: "p-sophie", name: "Sophie", countryId: "nl", isCaptain: true },
  { id: "p-rogier", name: "Rogier", countryId: "nl", isCaptain: false },
  { id: "p-mila", name: "Mila", countryId: "nl", isCaptain: false },
  { id: "p-thomas", name: "Thomas", countryId: "nl", isCaptain: false },
  { id: "p-eva", name: "Eva", countryId: "nl", isCaptain: false },
  { id: "p-lucas", name: "Lucas", countryId: "nl", isCaptain: false },
  { id: "p-ana", name: "Ana", countryId: "br", isCaptain: true },
  { id: "p-joao", name: "João", countryId: "br", isCaptain: false },
  { id: "p-camila", name: "Camila", countryId: "br", isCaptain: false },
  { id: "p-rafa", name: "Rafa", countryId: "br", isCaptain: false },
  { id: "p-yuki", name: "Yuki", countryId: "jp", isCaptain: true },
  { id: "p-haruto", name: "Haruto", countryId: "jp", isCaptain: false },
  { id: "p-hana", name: "Hana", countryId: "jp", isCaptain: false },
  { id: "p-kenji", name: "Kenji", countryId: "jp", isCaptain: false },
  { id: "p-maya", name: "Maya", countryId: "us", isCaptain: true },
  { id: "p-jordan", name: "Jordan", countryId: "us", isCaptain: false },
  { id: "p-alex", name: "Alex", countryId: "us", isCaptain: false },
  { id: "p-giulia", name: "Giulia", countryId: "it", isCaptain: true },
  { id: "p-marco", name: "Marco", countryId: "it", isCaptain: false },
  { id: "p-sofia", name: "Sofia", countryId: "it", isCaptain: false },
  { id: "p-lena", name: "Lena", countryId: "de", isCaptain: true },
  { id: "p-max", name: "Max", countryId: "de", isCaptain: false },
  { id: "p-nina", name: "Nina", countryId: "de", isCaptain: false },
  { id: "p-tim", name: "Tim", countryId: "de", isCaptain: false },
];

export const TEAM_ACHIEVEMENTS: Record<string, Achievement[]> = {
  nl: [
    {
      id: "first-flame",
      icon: "🔥",
      name: { nl: "FIRST FLAME", en: "FIRST FLAME" },
    },
    {
      id: "sharp",
      icon: "🎯",
      name: { nl: "SHARP SHOOTERS", en: "SHARP SHOOTERS" },
    },
    {
      id: "teamwork",
      icon: "🤝",
      name: { nl: "TEAMWORK MASTER", en: "TEAMWORK MASTER" },
    },
  ],
  br: [
    {
      id: "first-flame",
      icon: "🔥",
      name: { nl: "FIRST FLAME", en: "FIRST FLAME" },
    },
  ],
  it: [
    {
      id: "spirit",
      icon: "❤️",
      name: { nl: "BEST TEAM SPIRIT", en: "BEST TEAM SPIRIT" },
    },
  ],
};

const FLAME: FlameStep[] = [
  { id: "obstacle", name: { nl: "Obstacle Run", en: "Obstacle Run" }, done: true },
  {
    id: "team",
    name: { nl: "Team Challenge", en: "Team Challenge" },
    done: true,
  },
  { id: "target", name: { nl: "Target", en: "Target" }, done: false },
  {
    id: "starter",
    name: { nl: "Fire Starter", en: "Fire Starter" },
    done: false,
  },
];

const DEMO_GAMES = GAME_LIBRARY.filter((g) =>
  [
    "cone-catch",
    "optical-delusion",
    "tug-battle",
    "balance-masters",
    "olympic-crane",
    "water-works",
    "olympic-code",
    "target-attack",
    "gold-rush",
    "olympic-relay",
  ].includes(g.id),
);

export function createDemoEvent(now = Date.now()): EventState {
  const origin = new Date(now - 18 * 60_000);

  const assignments: Assignment[] = [
    {
      id: "r1-nl",
      round: 1,
      gameId: "cone-catch",
      countryIds: ["nl"],
      startsAt: minutesFrom(origin, 0),
      status: "completed",
      pointsAwarded: { nl: 10, us: 7, it: 5, de: 3, jp: 2, br: 1 },
      medals: { nl: "gold", us: "silver", it: "bronze" },
    },
    {
      id: "r2-nl",
      round: 2,
      gameId: "optical-delusion",
      countryIds: ["nl"],
      startsAt: minutesFrom(origin, 12),
      status: "completed",
      pointsAwarded: { jp: 10, br: 7, nl: 6, de: 3, us: 2, it: 1 },
      medals: { jp: "gold", br: "silver", nl: "bronze" },
    },
    {
      id: "r1-br",
      round: 1,
      gameId: "tug-battle",
      countryIds: ["br", "jp"],
      startsAt: minutesFrom(origin, 0),
      status: "completed",
      pointsAwarded: { br: 10, jp: 4 },
      medals: { br: "gold" },
    },
    {
      id: "r2-br",
      round: 2,
      gameId: "water-works",
      countryIds: ["br"],
      startsAt: minutesFrom(origin, 12),
      status: "completed",
      pointsAwarded: { br: 10, de: 7, us: 5, it: 3, jp: 2, nl: 0 },
      medals: { br: "gold", de: "silver" },
    },
    {
      id: "r3-crane",
      round: 3,
      gameId: "olympic-crane",
      countryIds: ["nl", "br"],
      startsAt: minutesFrom(new Date(now), 4.5),
      status: "up_next",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r3-water",
      round: 3,
      gameId: "water-works",
      countryIds: ["jp", "us"],
      startsAt: minutesFrom(new Date(now), 4.5),
      status: "up_next",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r3-code",
      round: 3,
      gameId: "olympic-code",
      countryIds: ["it", "de"],
      startsAt: minutesFrom(new Date(now), 4.5),
      status: "up_next",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r4-nl",
      round: 4,
      gameId: "water-works",
      countryIds: ["nl"],
      startsAt: minutesFrom(new Date(now), 16.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r5-nl",
      round: 5,
      gameId: "olympic-code",
      countryIds: ["nl"],
      startsAt: minutesFrom(new Date(now), 28.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r6-nl",
      round: 6,
      gameId: "balance-masters",
      countryIds: ["nl"],
      startsAt: minutesFrom(new Date(now), 40.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r7-nl",
      round: 7,
      gameId: "tug-battle",
      countryIds: ["nl", "de"],
      startsAt: minutesFrom(new Date(now), 52.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r8-nl",
      round: 8,
      gameId: "target-attack",
      countryIds: ["nl"],
      startsAt: minutesFrom(new Date(now), 64.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r4-br",
      round: 4,
      gameId: "olympic-code",
      countryIds: ["br"],
      startsAt: minutesFrom(new Date(now), 16.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "r4-jp",
      round: 4,
      gameId: "target-attack",
      countryIds: ["jp"],
      startsAt: minutesFrom(new Date(now), 16.5),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "golden",
      round: 9,
      gameId: "gold-rush",
      countryIds: ["nl", "br", "jp", "us", "it", "de"],
      startsAt: minutesFrom(new Date(now), 80),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
    {
      id: "final",
      round: 10,
      gameId: "olympic-relay",
      countryIds: ["nl", "br", "jp", "us", "it", "de"],
      startsAt: minutesFrom(new Date(now), 100),
      status: "locked",
      pointsAwarded: {},
      medals: {},
    },
  ];

  return {
    code: DEMO_CODE,
    name: {
      nl: "Flitz Beach Olympic Games",
      en: "Flitz Beach Olympic Games",
    },
    location: "Scheveningen",
    date: new Date().toISOString().slice(0, 10),
    dateLabel: { nl: "Scheveningen", en: "Scheveningen" },
    defaultLocale: "nl",
    phase: "live",
    currentRound: 3,
    totalRounds: 8,
    openingAt: minutesFrom(origin, -20),
    countries: COUNTRIES,
    participants: PARTICIPANTS,
    games: DEMO_GAMES,
    assignments,
    flame: FLAME,
    notices: [
      {
        id: "n-live",
        kind: "host",
        title: { nl: "LIVE", en: "LIVE" },
        body: {
          nl: "Olympic Flame lit. Round 3 staat klaar.",
          en: "Olympic Flame lit. Round 3 is ready.",
        },
        at: now,
      },
    ],
    awards: {},
    updatedAt: now,
  };
}

export const BASELINE_POINTS: Record<string, number> = {
  br: 52,
  nl: 47,
  jp: 44,
  us: 39,
  it: 35,
  de: 31,
};

export const COUNTRY_TEAM_NUMBER: Record<string, string> = {
  nl: "04",
  br: "01",
  jp: "02",
  us: "03",
  it: "05",
  de: "06",
};
