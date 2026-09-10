"use client";

import Link from "next/link";
import { StatusPill } from "@/components/shell";
import { loc, t, useLocale } from "@/components/hooks";
import { gameOf, teamSchedule } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function GamesPage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const countryId = session?.countryId ?? "nl";
  const list = teamSchedule(event, countryId);

  return (
    <div className="safe-bottom safe-top px-5">
      <p className="font-cond text-[12px] tracking-[0.3em] text-gold">{t(locale, "eventTitle")}</p>
      <h1 className="mt-2 font-display text-6xl">{t(locale, "theGames")}</h1>
      <div className="mt-6 space-y-3">
        {list.map((a) => {
          const g = gameOf(event, a);
          if (!g) return null;
          const locked = a.status === "locked";
          const medal =
            a.medals[countryId] === "gold" ? "🥇" : a.medals[countryId] === "silver" ? "🥈" : a.medals[countryId] === "bronze" ? "🥉" : "";
          const pts = a.pointsAwarded[countryId];
          return (
            <Link
              key={a.id}
              href={locked ? "#" : `/village/games/${g.slug}`}
              className={`card flex items-center gap-4 p-4 ${locked ? "opacity-50" : ""}`}
              onClick={(e) => {
                if (locked) e.preventDefault();
              }}
            >
              <p className="w-14 font-display text-4xl text-gold">{String(g.station).padStart(2, "0")}</p>
              <div className="flex-1">
                <p className="font-display text-3xl leading-none">{loc(locale, g.name)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusPill status={a.status} />
                  {a.status === "completed" ? (
                    <span className="font-cond text-[12px] tracking-[0.12em] text-sand">
                      {medal} {pts} pts
                    </span>
                  ) : null}
                  {a.status === "up_next" ? (
                    <span className="font-cond text-[12px] text-white/60">
                      {new Date(a.startsAt).toLocaleTimeString(locale === "nl" ? "nl-NL" : "en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
