"use client";

import { loc, t, useLocale } from "./hooks";
import type { Game } from "@/lib/types";

export function VillageMap({
  games,
  highlightStation,
}: {
  games: Game[];
  highlightStation?: number;
}) {
  const locale = useLocale();
  const stations = games.filter((g) => g.station > 0).sort((a, b) => a.station - b.station);

  return (
    <div className="sand-map relative overflow-hidden rounded-[24px] border border-white/10">
      <p className="relative px-4 pt-3 text-center font-cond text-[11px] tracking-[0.3em] text-navy/70">
        {t(locale, "sea")}
      </p>
      <div className="relative mx-4 mt-4 rounded-full bg-navy px-4 py-3 text-center shadow-lg">
        <p className="font-cond text-[11px] tracking-[0.2em] text-gold">🔥 {t(locale, "centralArena")}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4 pb-16">
        {stations.slice(0, 12).map((g) => {
          const hot = g.station === highlightStation;
          return (
            <div
              key={g.id}
              className={`relative rounded-2xl px-2 py-3 text-center ${
                hot ? "pulse-orange bg-orange text-white" : "bg-navy/90 text-white"
              }`}
            >
              {hot ? (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-cond text-[9px] tracking-[0.14em] text-navy">
                  → {t(locale, "yourStation")}
                </span>
              ) : null}
              <p className="font-display text-2xl leading-none">{String(g.station).padStart(2, "0")}</p>
              <p className="mt-1 font-cond text-[10px] tracking-[0.08em]">{loc(locale, g.shortName)}</p>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-2 left-4 font-cond text-[10px] tracking-[0.18em] text-navy/70">
        {t(locale, "startArch")}
      </div>
      <div className="absolute bottom-2 right-4 font-cond text-[10px] tracking-[0.18em] text-navy/70">
        {t(locale, "beachclub")}
      </div>
    </div>
  );
}
