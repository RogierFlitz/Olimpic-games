"use client";

import { loc, t, useLocale } from "@/components/hooks";
import { LiveTicker } from "@/components/live";
import { RaceBar } from "@/components/visuals";
import { ranking } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function RankingPage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const rows = ranking(event);
  const youId = session?.countryId ?? "nl";
  const you = rows.find((r) => r.countryId === youId)!;
  const gold = rows[0];
  const diff = Math.max(0, gold.points - you.points);
  const max = gold.points || 1;

  return (
    <div className="safe-bottom safe-top px-5">
      <p className="font-cond text-[12px] tracking-[0.28em] text-gold">{t(locale, "live")}</p>
      <h1 className="mt-1 font-display text-5xl">{t(locale, "liveRanking")}</h1>
      <LiveTicker />
      <ol className="mt-6 space-y-3">
        {rows.map((r) => {
          const c = event.countries.find((c) => c.id === r.countryId)!;
          const mine = r.countryId === youId;
          const medal = r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `${r.rank}`;
          return (
            <li
              key={r.countryId}
              className={`rounded-[22px] px-4 py-4 ${
                mine ? "bg-orange text-white" : r.rank <= 3 ? "card" : "border border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 font-display text-3xl">{medal}</span>
                  <div>
                    <p className="font-display text-3xl leading-none">
                      {c.flag} {loc(locale, c.name).toUpperCase()}
                    </p>
                    {mine ? <p className="font-cond text-[11px] tracking-[0.18em]">{t(locale, "you")}</p> : null}
                  </div>
                </div>
                <p className="font-display text-4xl">{r.points}</p>
              </div>
              <RaceBar value={r.points} max={max} hot={mine} />
            </li>
          );
        })}
      </ol>

      <div className="shimmer mt-6 rounded-[24px] px-5 py-6 text-navy">
        {you.rank !== 1 ? (
          <>
            <p className="font-display text-7xl leading-none">{diff}</p>
            <p className="font-cond text-[13px] tracking-[0.18em]">{t(locale, "pointsToGold")}</p>
          </>
        ) : (
          <p className="font-display text-4xl">{locale === "nl" ? "JULLIE STAAN BOVENAAN" : "YOU ARE TOP OF THE TABLE"}</p>
        )}
      </div>

      <section className="card mt-5 p-5">
        <p className="font-cond text-[12px] tracking-[0.2em] text-gold">{t(locale, "roadToGold")}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p>🥇 {loc(locale, event.countries.find((c) => c.id === gold.countryId)!.name)}</p>
            <p className="font-display text-3xl">{gold.points} pts</p>
          </div>
          <div className="text-right">
            <p>
              {t(locale, "you")} · {loc(locale, event.countries.find((c) => c.id === youId)!.name)}
            </p>
            <p className="font-display text-3xl">{you.points} pts</p>
          </div>
        </div>
        <p className="mt-3 font-cond tracking-[0.12em] text-white/60">
          {t(locale, "difference")}: {diff} {t(locale, "pts")}
        </p>
      </section>
    </div>
  );
}
