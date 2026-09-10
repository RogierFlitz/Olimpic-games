"use client";

import { VillageMap } from "@/components/map";
import { loc, t, useLocale } from "@/components/hooks";
import { countryAssignment, gameOf } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function MapPage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const countryId = session?.countryId ?? "nl";
  const a = countryAssignment(event, countryId);
  const game = a ? gameOf(event, a) : undefined;

  return (
    <div className="safe-bottom safe-top px-5">
      <p className="font-cond text-[12px] tracking-[0.28em] text-gold">{t(locale, "olympicVillage")}</p>
      <h1 className="mt-1 font-display text-6xl">MAP</h1>
      {game ? (
        <p className="mt-3 font-cond text-lg tracking-[0.12em] text-orange">
          → {t(locale, "station")} {String(game.station).padStart(2, "0")} · {loc(locale, game.name)}
        </p>
      ) : null}
      <div className="mt-5">
        <VillageMap games={event.games} highlightStation={game?.station} />
      </div>
      <p className="mt-4 text-center font-cond tracking-[0.12em] text-white/60">
        {t(locale, "fromVillage")}: {t(locale, "walkTime")}
      </p>
    </div>
  );
}
