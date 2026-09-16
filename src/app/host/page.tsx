"use client";

import { Cta, Phone } from "@/components/shell";
import { loc, t, useLocale } from "@/components/hooks";
import { ranking } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function HostPage() {
  const {
    event,
    setPhase,
    startNextRound,
    startGolden,
    startFinal,
    startCeremony,
    lockScores,
    announce,
    resetDemo,
  } = useEvent();
  const locale = useLocale();
  const rows = ranking(event);
  const active = event.assignments.filter((a) => a.round === event.currentRound);

  return (
    <Phone wide>
      <div className="min-h-dvh px-6 pb-10 pt-[max(24px,env(safe-area-inset-top))]">
        <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "commandCenter")}</p>
        <h1 className="mt-2 font-display text-5xl">FLITZ HOST</h1>
        <p className="mt-1 font-cond text-white/50">
          {event.location} · {event.code}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="card p-4">
            <p className="font-cond text-[11px] tracking-[0.16em] text-white/50">{t(locale, "currentRound")}</p>
            <p className="font-display text-6xl">{event.currentRound}</p>
          </div>
          <div className="card p-4">
            <p className="font-cond text-[11px] tracking-[0.16em] text-white/50">{t(locale, "nextRound")}</p>
            <p className="font-display text-6xl">{Math.min(event.totalRounds, event.currentRound + 1)}</p>
          </div>
          <div className="card p-4">
            <p className="font-cond text-[11px] tracking-[0.16em] text-white/50">{locale === "nl" ? "FASE" : "PHASE"}</p>
            <p className="font-display text-4xl uppercase">{event.phase}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Cta onClick={startNextRound}>{t(locale, "announceNext")}</Cta>
          <Cta onClick={startGolden}>{t(locale, "startGolden")}</Cta>
          <Cta onClick={startFinal}>{t(locale, "startFinal")}</Cta>
          <Cta onClick={startCeremony}>{t(locale, "startCeremony")}</Cta>
          <Cta onClick={lockScores} ghost>{t(locale, "lockScores")}</Cta>
        </div>

        <section className="mt-6">
          <p className="font-cond tracking-[0.16em] text-gold">{t(locale, "activeStations")}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {active.map((a) => {
              const g = event.games.find((g) => g.id === a.gameId);
              return (
                <div key={a.id} className="rounded-2xl border border-white/10 px-3 py-3">
                  <p className="font-display text-2xl">{String(g?.station).padStart(2, "0")}</p>
                  <p className="font-cond text-[11px]">{g ? loc(locale, g.shortName) : ""}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <p className="font-cond tracking-[0.16em] text-gold">{t(locale, "liveRanking")}</p>
          <ol className="mt-3 space-y-1">
            {rows.map((r) => {
              const c = event.countries.find((c) => c.id === r.countryId)!;
              return (
                <li key={r.countryId} className="flex justify-between font-cond">
                  <span>
                    {r.rank}. {c.flag} {loc(locale, c.name)}
                  </span>
                  <span className="text-gold">{r.points}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mt-6">
          <p className="font-cond tracking-[0.16em] text-gold">{t(locale, "issues")}</p>
          <p className="mt-2 text-white/70">{t(locale, "noIssues")}</p>
        </section>

        <div className="mt-8 space-y-3">
          <Cta onClick={() => { setPhase("flame"); }}>{t(locale, "startFlame")}</Cta>
          <Cta onClick={() => { setPhase("opening"); announce("5", "Countdown", "go"); }}>{t(locale, "openGames")}</Cta>
          <Cta onClick={resetDemo} ghost>{t(locale, "resetDemo")}</Cta>
        </div>
      </div>
    </Phone>
  );
}
