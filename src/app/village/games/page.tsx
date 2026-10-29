"use client";

import Link from "next/link";
import { StatusPill } from "@/components/shell";
import { Stamp } from "@/components/visuals";
import { useGoldenToken } from "@/components/live";
import { loc, t, useLocale } from "@/components/hooks";
import { gameOf, opponentsOf, teamSchedule } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function GamesPage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const countryId = session?.countryId ?? "nl";
  const list = teamSchedule(event, countryId);
  const done = list.filter((a) => a.status === "completed");
  const { found } = useGoldenToken();

  return (
    <div className="safe-bottom safe-top px-5">
      <p className="font-cond text-[12px] tracking-[0.3em] text-gold">{t(locale, "eventTitle")}</p>
      <h1 className="mt-2 font-display text-6xl">{t(locale, "theGames")}</h1>

      <section className="mt-5">
        <p className="font-cond text-[11px] tracking-[0.2em] text-gold">{t(locale, "passport")}</p>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {list.map((a) => {
            const g = gameOf(event, a);
            if (!g) return null;
            const medal =
              a.medals[countryId] === "gold" ? "🥇" : a.medals[countryId] === "silver" ? "🥈" : a.medals[countryId] === "bronze" ? "🥉" : "✓";
            return (
              <Stamp
                key={a.id}
                label={loc(locale, g.shortName)}
                icon={a.status === "completed" ? medal : String(g.station).padStart(2, "0")}
                muted={a.status !== "completed"}
              />
            );
          })}
          {found ? <Stamp label={t(locale, "tokenStamp")} icon="✦" /> : null}
        </div>
        <p className="mt-1 font-cond text-[11px] tracking-[0.14em] text-white/40">
          {done.length}/{list.length} {t(locale, "stamps")}
        </p>
      </section>

      <div className="mt-6 space-y-3">
        {list.map((a) => {
          const g = gameOf(event, a);
          if (!g) return null;
          const locked = a.status === "locked";
          const medal =
            a.medals[countryId] === "gold" ? "🥇" : a.medals[countryId] === "silver" ? "🥈" : a.medals[countryId] === "bronze" ? "🥉" : "";
          const pts = a.pointsAwarded[countryId];
          const foes = opponentsOf(event, a, countryId);
          return (
            <Link
              key={a.id}
              href={locked ? "#" : `/village/games/${g.slug}`}
              className={`relative flex overflow-hidden rounded-[22px] ${
                a.status === "up_next" || a.status === "now" ? "pulse-orange" : ""
              } ${locked ? "opacity-45" : ""}`}
              onClick={(e) => {
                if (locked) e.preventDefault();
              }}
            >
              <div className="hero-photo w-[88px] shrink-0" style={{ backgroundImage: `url(${g.image})` }} />
              <div className="card flex flex-1 items-center gap-3 rounded-l-none border-l-0 p-4">
                <p className="w-12 font-display text-4xl text-gold">{String(g.station).padStart(2, "0")}</p>
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
                        {foes.length ? ` · ${t(locale, "versus")} ${foes.map((f) => f.code).join(" ")}` : ""}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
