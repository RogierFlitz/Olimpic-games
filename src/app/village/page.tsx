"use client";

import Link from "next/link";
import { Cta, LiveDot } from "@/components/shell";
import { loc, t, useLocale, useNow } from "@/components/hooks";
import { formatClock, gameOf, nextAssignments, ranking, remainingEvents, timeUntil } from "@/lib/ranking";
import { COUNTRY_TEAM_NUMBER, useEvent } from "@/lib/store";

export default function HomePage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const now = useNow(250);
  const country = event.countries.find((c) => c.id === session?.countryId) ?? event.countries.find((c) => c.id === "nl")!;
  const ranks = ranking(event);
  const you = ranks.find((r) => r.countryId === country.id)!;
  const up = event.assignments.find(
    (a) => a.countryIds.includes(country.id) && (a.status === "up_next" || a.status === "now") && a.round <= event.totalRounds,
  ) || event.assignments.find((a) => a.countryIds.includes(country.id) && a.round === event.currentRound);
  const game = up ? gameOf(event, up) : undefined;
  const upcoming = nextAssignments(event, country.id).slice(0, 2);
  const seconds = up ? timeUntil(up.startsAt, now) : 0;
  const go = seconds <= 0 && up && up.status !== "completed";
  const gold = ranks[0];
  const diff = gold && you ? Math.max(0, gold.points - you.points) : 0;

  return (
    <div className="safe-bottom safe-top px-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="font-cond text-[12px] tracking-[0.28em] text-gold">{t(locale, "eventTitle")}</p>
          <p className="mt-1 text-xl font-semibold">
            {country.flag} {loc(locale, country.name).toUpperCase()}
          </p>
        </div>
        <p className="font-cond text-[11px] tracking-[0.14em] text-white/60">
          <LiveDot />
          {t(locale, "live")} · {t(locale, "roundOf", { n: event.currentRound, total: event.totalRounds })}
        </p>
      </header>

      {go ? (
        <div className="mt-5 rounded-[28px] bg-orange p-6 text-center shadow-[0_20px_50px_rgba(236,102,8,.4)]">
          <p className="font-display text-7xl">{t(locale, "go")}</p>
          <p className="mt-2 font-cond tracking-[0.16em]">
            {t(locale, "proceedTo")} {t(locale, "station")} {String(game?.station).padStart(2, "0")}
          </p>
        </div>
      ) : null}

      <section className="card relative mt-5 overflow-hidden">
        <div className="absolute inset-0 hero-photo opacity-35" style={{ backgroundImage: `url(${game?.image || "/media/game-olympic-crane.jpg"})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
        <div className="relative p-5">
          <p className="font-cond text-[12px] tracking-[0.28em] text-orange">{t(locale, "upNext")}</p>
          <p className="mt-3 font-display text-[86px] leading-none text-gold">{String(game?.station ?? 7).padStart(2, "0")}</p>
          <h2 className="mt-1 font-display text-5xl">{game ? loc(locale, game.name) : "—"}</h2>
          {go ? (
            <p className="mt-4 font-cond text-lg tracking-[0.16em] text-gold">{t(locale, "now")}</p>
          ) : (
            <>
              <p className="mt-4 font-cond text-[12px] tracking-[0.16em] text-white/60">{t(locale, "startOver")}</p>
              <p className="font-display text-6xl">{formatClock(seconds)}</p>
            </>
          )}
          <p className="mt-2 text-white/80">📍 {t(locale, "station")} {game?.station}</p>
          <div className="mt-5">
            <Cta href={game ? `/village/games/${game.slug}` : "/village/games"}>{t(locale, "viewGame")}</Cta>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <p className="font-cond text-[11px] tracking-[0.22em] text-white/45">{t(locale, "next")}</p>
        <div className="mt-2 space-y-2">
          {upcoming.map((a) => {
            const g = gameOf(event, a);
            return (
              <div key={a.id} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <p className="font-display text-2xl">
                  {String(g?.station).padStart(2, "0")} – {g ? loc(locale, g.shortName) : ""}
                </p>
                <span className="font-cond text-[12px] tracking-[0.12em] text-white/50">
                  {new Date(a.startsAt).toLocaleTimeString(locale === "nl" ? "nl-NL" : "en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card mt-5 p-5">
        <p className="font-cond text-[11px] tracking-[0.22em] text-white/45">{t(locale, "yourCountry")}</p>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-lg">
              {country.flag} {loc(locale, country.name)}
            </p>
            <p className="font-display text-4xl text-gold">
              {you.rank === 1 ? "1ST" : you.rank === 2 ? "2ND" : you.rank === 3 ? "3RD" : `${you.rank}TH`} {t(locale, "place")}
            </p>
          </div>
          <p className="font-display text-5xl">{you.points}</p>
        </div>
        <p className="font-cond text-[11px] tracking-[0.18em] text-white/45">{t(locale, "points")}</p>
        <ol className="mt-4 space-y-2">
          {ranks.slice(0, 3).map((r) => {
            const c = event.countries.find((c) => c.id === r.countryId)!;
            const medal = r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉";
            return (
              <li key={r.countryId} className="flex items-center justify-between font-cond tracking-[0.08em]">
                <span>
                  {medal} {loc(locale, c.name)}
                </span>
                <span className="text-gold">{r.points}</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-5">
          <Cta href="/village/ranking" ghost>
            {t(locale, "fullRanking")}
          </Cta>
        </div>
      </section>

      <section className="mt-4 mb-2 grid grid-cols-3 gap-2 text-center text-[11px]">
        <Link href="/village/flame" className="card p-3">
          🔥 {t(locale, "flameLit")}
        </Link>
        <div className="card p-3">🏅 3 {t(locale, "medalsAvailable")}</div>
        <Link href="/village/photo" className="card p-3">
          📸 {t(locale, "eventGallery")}
        </Link>
      </section>

      <p className="pb-4 text-center font-cond text-[11px] tracking-[0.16em] text-white/35">
        {t(locale, "currentRank")} · {you.rank === 2 ? "🥈 2ND" : `${you.rank}`} · {t(locale, "roadToGold")} {diff} · {remainingEvents(event, country.id)} left · TEAM {COUNTRY_TEAM_NUMBER[country.id]}
      </p>
    </div>
  );
}
