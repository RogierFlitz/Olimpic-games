import type { Assignment, Country, Game } from "./types";

const GOLD = 10;
const SILVER = 7;
const BRONZE = 5;

export function generateSchedule(
  countries: Country[],
  games: Game[],
  start: Date,
  roundMinutes = 12,
): Assignment[] {
  const rotationGames = games.filter((g) => g.station > 0 && g.id !== "gold-rush");
  const assignments: Assignment[] = [];
  const n = countries.length;

  for (let round = 0; round < rotationGames.length; round++) {
    for (let t = 0; t < n; t++) {
      const game = rotationGames[(t + round) % rotationGames.length];
      const startsAt = new Date(start.getTime() + round * roundMinutes * 60_000).toISOString();
      const existing = assignments.find(
        (a) => a.round === round + 1 && a.gameId === game.id,
      );
      if (existing) {
        if (
          game.scoreMethod === "head_to_head" &&
          existing.countryIds.length < 2
        ) {
          existing.countryIds.push(countries[t].id);
        }
        continue;
      }
      assignments.push({
        id: `r${round + 1}-${game.id}-${countries[t].id}`,
        round: round + 1,
        gameId: game.id,
        countryIds: [countries[t].id],
        startsAt,
        status: round === 0 ? "up_next" : "locked",
        pointsAwarded: {},
        medals: {},
      });
    }
  }

  return assignments;
}

export function awardPlaces(orderedCountryIds: string[]) {
  const pointsAwarded: Record<string, number> = {};
  const medals: Record<string, "gold" | "silver" | "bronze"> = {};
  const table = [GOLD, SILVER, BRONZE, 3, 2, 1];
  orderedCountryIds.forEach((id, i) => {
    pointsAwarded[id] = table[i] ?? 0;
    if (i === 0) medals[id] = "gold";
    if (i === 1) medals[id] = "silver";
    if (i === 2) medals[id] = "bronze";
  });
  return { pointsAwarded, medals };
}

export function headToHeadAward(winnerId: string, loserId: string) {
  return {
    pointsAwarded: { [winnerId]: GOLD, [loserId]: 4 },
    medals: { [winnerId]: "gold" as const },
  };
}
