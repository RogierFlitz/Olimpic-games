"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Cta, LiveDot } from "@/components/shell";
import { loc, t, useLocale, useNow } from "@/components/hooks";
import { formatClock, gameOf, nextAssignments, ranking, remainingEvents, timeUntil } from "@/lib/ranking";
import { playGoCue } from "@/lib/fx";
import { COUNTRY_TEAM_NUMBER, useEvent } from "@/lib/store";

export default function HomePage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const now = useNow();
  const country = event.countries.find((c) => c.id === session?.countryId) ?? event.countries.find((c) => c.id === "nl")!;
  const ranks = ranking(event);
  const you = ranks.find((r) => r.countryId === country.id)!;
  const up =
    event.assignments.find(
      (a) =>
        a.countryIds.includes(country.id) &&
        (a.status === "up_next" || a.status === "now") &&
        a.round <= event.totalRounds,
    ) || event.assignments.find((a) => a.countryIds.includes(country.id) && a.round === event.currentRound);
  const game = up ? gameOf(event, up) : undefined;
  const upcoming = nextAssignments(event, country.id).slice(0, 2);
  const seconds = up ? timeUntil(up.startsAt, now) : 0;
  const go = Boolean(seconds <= 0 && up && up.status !== "completed");
  const gold = ranks[0];
  const diff = gold && you ? Math.max(0, gold.points - you.points) : 0;
  const left = remainingEvents(event, country.id);
  const place =
    you.rank === 1 ? "1ST" : you.rank === 2 ? "2ND" : you.rank === 3 ? "3RD" : `${you.rank}TH`;

  useEffect(() => {
    if (go) playGoCue();
  }, [go]);

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
        <section className="go-banner mt-5 rounded-[28px] p-6 text-center">
          <p className="font-display text-[92px] leading-none">{t(locale, "go")}</p>
          <p className="mt-1 font-cond text-lg tracking-[0.18em]">
            {t(locale, "proceedTo")} {t(locale, "station")} {String(game?.station ?? 7).padStart(2, "0")}
          </p>
          <h2 className="mt-3 font-display text-4xl">{game ? loc(locale, game.name) : "Olympic Crane"}</h2>
          <div className="mt-6">
            <Link
              href="/village/map"
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-white font-cond text-[1.05rem] font-bold tracking-[0.14em] text-navy"
            >
              {t(locale, "takeMeThere")}
            </Link>
          </div>
          <Link
            href={game ? `/village/games/${game.slug}` : "/village/games"}
            className="mt-3 inline-block font-cond text-[12px] tracking-[0.2em] text-white/85"
          >
            {t(locale, "watchInstructions")}
          </Link>
        </section>
      ) : (
        <section className="card relative mt-5 overflow-hidden">
          <div
            className="absolute inset-0 hero-photo opacity-40"
            style={{ backgroundImage: `url(${game?.image || "/media/game-olympic-crane.jpg"})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/75 to-navy/25" />
          <div className="relative p-5">
            <p className="font-cond text-[12px] tracking-[0.28em] text-orange">{t(locale, "upNext")}</p>
            <p className="mt-3 font-display text-[86px] leading-none foil-text">
              {String(game?.station ?? 7).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-display text-5xl">{game ? loc(locale, game.name) : "—"}</h2>
            <p className="mt-4 font-cond text-[12px] tracking-[0.16em] text-white/60">{t(locale, "startOver")}</p>
            <p className="font-display text-6xl">{formatClock(seconds)}</p>
            <p className="mt-2 text-white/80">
              📍 {t(locale, "station")} {game?.station}
            </p>
            <div className="mt-5">
              <Cta href={game ? `/village/games/${game.slug}` : "/village/games"}>
                {t(locale, "watchInstructions")}
              </Cta>
            </div>
          </div>
        </section>
      )}

      <section className="mt-4 grid grid-cols-3 overflow-hidden rounded-[22px] border border-gold/35 bg-gold text-navy">
        <div className="px-3 py-4 text-center">
          <p className="font-display text-4xl leading-none">
            {you.rank === 1 ? "🥇" : you.rank === 2 ? "🥈" : you.rank === 3 ? "🥉" : you.rank}
          </p>
          <p className="font-cond text-[10px] tracking-[0.14em]">{place}</p>
        </div>
        <div className="border-x border-navy/15 px-3 py-4 text-center">
          <p className="font-display text-4xl leading-none">{you.points}</p>
          <p className="font-cond text-[10px] tracking-[0.14em]">{t(locale, "points")}</p>
        </div>
        <div className="px-3 py-4 text-center">
          <p className="font-display text-4xl leading-none">{diff}</p>
          <p className="font-cond text-[10px] tracking-[0.14em]">{t(locale, "toGold")}</p>
        </div>
      </section>

      <ol className="mt-4 space-y-1">
        {ranks.slice(0, 3).map((r) => {
          const c = event.countries.find((c) => c.id === r.countryId)!;
          const medal = r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : "🥉";
          const mine = r.countryId === country.id;
          return (
            <li
              key={r.countryId}
              className={`flex items-center justify-between rounded-2xl px-4 py-2.5 font-cond tracking-[0.08em] ${
                mine ? "bg-orange" : "border border-white/10"
              }`}
            >
              <span>
                {medal} {loc(locale, c.name)}
                {mine ? ` · ${t(locale, "you")}` : ""}
              </span>
              <span className={mine ? "text-white" : "text-gold"}>{r.points}</span>
            </li>
          );
        })}
      </ol>
      <Link href="/village/ranking" className="mt-3 block text-center font-cond text-[12px] tracking-[0.2em] text-gold">
        {t(locale, "fullRanking")}
      </Link>

      <section className="mt-6">
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

      <p className="mt-4 text-center font-cond text-[11px] tracking-[0.16em] text-white/40">
        {t(locale, "eventsRemaining")}: {left} · {t(locale, "team")} {COUNTRY_TEAM_NUMBER[country.id]}
      </p>

      <section className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
        <Link href="/village/flame" className="card p-3">
          🔥 {t(locale, "flameLit")}
        </Link>
        <Link href="/village/team" className="card p-3">
          🏅 {t(locale, "passport")}
        </Link>
        <Link href="/village/photo" className="card p-3">
          📸 {t(locale, "photoWall")}
        </Link>
      </section>

      <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-center font-cond text-[11px] tracking-[0.14em] text-gold">
        ⭐ {t(locale, "hiddenChallenge")} — {t(locale, "hiddenHint")}
      </p>
    </div>
  );
}
