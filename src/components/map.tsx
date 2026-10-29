"use client";

import Link from "next/link";
import { loc, t, useLocale } from "./hooks";
import { requestGoldenToken, useGoldenToken } from "./live";
import type { Country, Game } from "@/lib/types";

function stationPoint(station: number) {
  const i = Math.max(0, station - 1);
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { x: 58 + col * 94, y: 108 + row * 62 };
}

export function VillageMap({
  games,
  highlightStation,
  flags,
}: {
  games: Game[];
  highlightStation?: number;
  flags?: Country[];
}) {
  const locale = useLocale();
  const { found } = useGoldenToken();
  const stations = games.filter((g) => g.station > 0).sort((a, b) => a.station - b.station);
  const target = highlightStation ? stationPoint(highlightStation) : null;

  return (
    <div className="sand-map relative overflow-hidden rounded-[24px] border border-white/10">
      <div className="sea-band">
        <p className="relative z-[1] pt-2 text-center font-cond text-[11px] tracking-[0.3em] text-navy/80">
          {t(locale, "sea")}
        </p>
      </div>
      <div className="relative mx-4 mt-4 rounded-full bg-navy px-4 py-3 text-center shadow-lg">
        <p className="font-cond text-[11px] tracking-[0.2em] text-gold">🔥 {t(locale, "centralArena")}</p>
      </div>
      {target ? (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 300 360" preserveAspectRatio="none">
          <path className="map-path" d={`M150 72 L150 92 L${target.x} ${target.y}`} />
        </svg>
      ) : null}
      <div className="grid grid-cols-3 gap-2 p-4 pb-16">
        {stations.slice(0, 12).map((g) => {
          const hot = g.station === highlightStation;
          return (
            <Link
              key={g.id}
              href={`/village/games/${g.slug}`}
              className={`relative rounded-2xl px-2 py-3 text-center ${
                hot ? "pulse-orange bg-orange text-white" : "bg-navy/90 text-white"
              }`}
            >
              {hot ? (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-cond text-[9px] tracking-[0.14em] text-navy">
                  → {t(locale, "yourStation")}
                </span>
              ) : null}
              {g.station === 7 && !found ? (
                <button
                  type="button"
                  className="token-sparkle absolute right-1 top-1 text-[13px]"
                  aria-label={t(locale, "hiddenChallenge")}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    requestGoldenToken();
                  }}
                >
                  ✦
                </button>
              ) : null}
              <p className="font-display text-2xl leading-none">{String(g.station).padStart(2, "0")}</p>
              <p className="mt-1 font-cond text-[10px] tracking-[0.08em]">{loc(locale, g.shortName)}</p>
              {hot && flags?.length ? (
                <p className="mt-1 text-[14px] leading-none">{flags.map((c) => c.flag).join(" ")}</p>
              ) : null}
            </Link>
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
