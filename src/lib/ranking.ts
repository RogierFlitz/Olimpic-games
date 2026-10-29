import { BASELINE_POINTS } from "./seed";
import type { Assignment, EventState } from "./types";

const SEED_RESULT_IDS = new Set(["r1-nl", "r2-nl", "r1-br", "r2-br"]);

export type RankRow = {
  countryId: string;
  points: number;
  rank: number;
  gold: number;
  silver: number;
  bronze: number;
};

export function pointsFor(event: EventState, countryId: string) {
  const extra = event.assignments
    .filter((a) => a.status === "completed" && !SEED_RESULT_IDS.has(a.id))
    .reduce((sum, a) => sum + (a.pointsAwarded[countryId] ?? 0), 0);
  return (BASELINE_POINTS[countryId] ?? 0) + extra;
}

export function medalCounts(event: EventState, countryId: string) {
  let gold = 0;
  let silver = 0;
  let bronze = 0;
  for (const a of event.assignments) {
    if (a.status !== "completed") continue;
    if (a.medals[countryId] === "gold") gold += 1;
    if (a.medals[countryId] === "silver") silver += 1;
    if (a.medals[countryId] === "bronze") bronze += 1;
  }
  if (countryId === "nl") {
    // Opening flame gold is part of the story, not a station result.
    gold += 1;
    silver += 1;
  }
  return { gold, silver, bronze };
}

export function ranking(event: EventState): RankRow[] {
  const rows = event.countries.map((c) => {
    const medals = medalCounts(event, c.id);
    return {
      countryId: c.id,
      points: pointsFor(event, c.id),
      rank: 0,
      ...medals,
    };
  });
  rows.sort((a, b) => b.points - a.points || b.gold - a.gold);
  rows.forEach((r, i) => {
    r.rank = i + 1;
  });
  return rows;
}

export function countryAssignment(
  event: EventState,
  countryId: string,
  round = event.currentRound,
) {
  return event.assignments.find(
    (a) => a.round === round && a.countryIds.includes(countryId),
  );
}

export function nextAssignments(event: EventState, countryId: string) {
  return event.assignments
    .filter(
      (a) =>
        a.countryIds.includes(countryId) &&
        a.round > event.currentRound &&
        a.round <= event.totalRounds,
    )
    .sort((a, b) => a.round - b.round);
}

export function teamSchedule(event: EventState, countryId: string) {
  return event.assignments
    .filter(
      (a) => a.countryIds.includes(countryId) && a.round <= event.totalRounds,
    )
    .sort((a, b) => a.round - b.round);
}

export function gameOf(event: EventState, assignment: Assignment) {
  return event.games.find((g) => g.id === assignment.gameId);
}

export function remainingEvents(event: EventState, countryId: string) {
  return event.assignments.filter(
    (a) =>
      a.countryIds.includes(countryId) &&
      a.round >= event.currentRound &&
      a.round <= event.totalRounds &&
      a.status !== "completed",
  ).length;
}

export function opponentsOf(event: EventState, assignment: Assignment, countryId: string) {
  return assignment.countryIds
    .filter((id) => id !== countryId)
    .map((id) => event.countries.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
}

export function lastCompleted(event: EventState, countryId: string) {
  return teamSchedule(event, countryId)
    .filter((a) => a.status === "completed")
    .at(-1);
}

export function villageFeed(event: EventState) {
  const items: {
    countryId: string;
    medal: "gold" | "silver" | "bronze";
    gameId: string;
    round: number;
    points: number;
  }[] = [];
  for (const a of event.assignments) {
    if (a.status !== "completed") continue;
    for (const [countryId, medal] of Object.entries(a.medals)) {
      items.push({
        countryId,
        medal,
        gameId: a.gameId,
        round: a.round,
        points: a.pointsAwarded[countryId] ?? 0,
      });
    }
  }
  return items.sort((a, b) => b.round - a.round || a.medal.localeCompare(b.medal));
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function timeUntil(iso: string, now = Date.now()) {
  return (new Date(iso).getTime() - now) / 1000;
}

export function ordinal(n: number, locale: "nl" | "en") {
  if (locale === "nl") return `${n}e`;
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return `${n}ST`;
  if (j === 2 && k !== 12) return `${n}ND`;
  if (j === 3 && k !== 13) return `${n}RD`;
  return `${n}TH`;
}
