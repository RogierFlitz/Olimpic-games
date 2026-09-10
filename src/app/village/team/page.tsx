"use client";

import { loc, t, useLocale } from "@/components/hooks";
import { medalCounts, pointsFor } from "@/lib/ranking";
import { TEAM_ACHIEVEMENTS } from "@/lib/seed";
import { useEvent } from "@/lib/store";

export default function TeamPage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const country = event.countries.find((c) => c.id === session?.countryId) ?? event.countries[0];
  const members = event.participants.filter((p) => p.countryId === country.id);
  const medals = medalCounts(event, country.id);
  const pts = pointsFor(event, country.id);
  const badges = TEAM_ACHIEVEMENTS[country.id] ?? [];

  return (
    <div className="safe-bottom safe-top px-5">
      <p className="text-6xl">{country.flag}</p>
      <h1 className="mt-2 font-display text-5xl">
        {t(locale, "team")} {loc(locale, country.name).toUpperCase()}
      </h1>
      <p className="mt-2 font-cond text-lg tracking-[0.14em] text-gold">“{loc(locale, country.motto)}”</p>

      <section className="mt-6">
        <p className="font-cond text-[12px] tracking-[0.2em] text-white/50">{t(locale, "members")}</p>
        <ul className="mt-3 space-y-2">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
              <span className="text-lg">{m.name}</span>
              {m.isCaptain ? <span className="text-gold">⭐ {t(locale, "captain")}</span> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-6 p-5">
        <p className="font-cond text-[12px] tracking-[0.2em] text-gold">{t(locale, "teamPerformance")}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl">🥇</p>
            <p className="font-display text-3xl">{medals.gold}</p>
            <p className="font-cond text-[10px] tracking-[0.12em]">{t(locale, "wins")}</p>
          </div>
          <div>
            <p className="text-2xl">🥈</p>
            <p className="font-display text-3xl">{medals.silver}</p>
            <p className="font-cond text-[10px] tracking-[0.12em]">{t(locale, "secondPlace")}</p>
          </div>
          <div>
            <p className="text-2xl">🥉</p>
            <p className="font-display text-3xl">{medals.bronze}</p>
            <p className="font-cond text-[10px] tracking-[0.12em]">{t(locale, "thirdPlace")}</p>
          </div>
        </div>
        <p className="mt-5 font-cond tracking-[0.18em] text-white/50">{t(locale, "total")}</p>
        <p className="font-display text-6xl">{pts} {t(locale, "points")}</p>
      </section>

      <section className="mt-6">
        <p className="font-cond text-[12px] tracking-[0.2em] text-white/50">{t(locale, "achievements")}</p>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {badges.map((b) => (
            <div key={b.id} className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-4">
              <p className="font-display text-2xl">
                {b.icon} {loc(locale, b.name)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
