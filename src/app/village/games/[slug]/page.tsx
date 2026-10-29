"use client";

import { useParams } from "next/navigation";
import { Cta } from "@/components/shell";
import { VillageMap } from "@/components/map";
import { InstructionFilm } from "@/components/video";
import { Stamp, VsStrip } from "@/components/visuals";
import { loc, t, useLocale } from "@/components/hooks";
import { GAME_LIBRARY } from "@/lib/catalog";
import { opponentsOf } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function GameDetailPage() {
  const params = useParams<{ slug: string }>();
  const { event, session } = useEvent();
  const locale = useLocale();
  const game =
    event.games.find((g) => g.slug === params.slug) ||
    GAME_LIBRARY.find((g) => g.slug === params.slug);
  const assignment = event.assignments.find(
    (a) => a.gameId === game?.id && a.countryIds.includes(session?.countryId ?? "nl"),
  );
  const done = assignment?.status === "completed";
  const country = event.countries.find((c) => c.id === (session?.countryId ?? "nl"));
  const foes = game && assignment && country ? opponentsOf(event, assignment, country.id) : [];

  if (!game) {
    return <p className="p-6">{locale === "nl" ? "Spel niet gevonden." : "Game not found."}</p>;
  }

  return (
    <div className="safe-bottom safe-top px-5 pb-8">
      <div className="flex items-start justify-between">
        <p className="font-display text-[88px] leading-none text-gold">{String(game.station || 0).padStart(2, "0")}</p>
        {done ? <Stamp label="OK" icon="✓" /> : null}
      </div>
      <h1 className="font-display text-5xl">{loc(locale, game.name)}</h1>
      <p className="mt-2 font-cond text-lg tracking-[0.12em] text-orange">{loc(locale, game.tagline)}</p>
      {country && foes.length ? (
        <div className="mt-4">
          <VsStrip
            left={{ flag: country.flag, code: country.code }}
            right={foes.map((f) => ({ flag: f.flag, code: f.code }))}
          />
        </div>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-[24px]">
        <div className="hero-photo aspect-[16/10]" style={{ backgroundImage: `url(${game.image})` }} />
      </div>

      <section className="mt-6">
        <p className="font-cond text-[12px] tracking-[0.22em] text-gold">{t(locale, "yourMission")}</p>
        <p className="mt-2 text-lg leading-snug text-white/90">{loc(locale, game.mission)}</p>
      </section>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <div className="card p-3">
          <p className="text-2xl">👥</p>
          <p className="mt-1 font-display text-2xl">{game.players.max}</p>
          <p className="font-cond text-[10px] tracking-[0.12em] text-white/55">{t(locale, "players")}</p>
        </div>
        <div className="card p-3">
          <p className="text-2xl">⏱</p>
          <p className="mt-1 font-display text-2xl">{game.durationMin}</p>
          <p className="font-cond text-[10px] tracking-[0.12em] text-white/55">{t(locale, "minutes")}</p>
        </div>
        <div className="card p-3">
          <p className="text-2xl">🏆</p>
          <p className="mt-1 font-cond text-[11px] leading-tight tracking-[0.08em]">{loc(locale, game.winCondition)}</p>
        </div>
      </div>

      <section className="mt-8">
        <p className="font-cond text-[12px] tracking-[0.22em] text-gold">{t(locale, "howToPlay")}</p>
        <ol className="mt-3 space-y-3">
          {game.howTo.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-display text-3xl text-orange">{i + 1}.</span>
              <p className="pt-1 text-lg">{loc(locale, step)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8">
        <InstructionFilm game={game} />
      </section>

      <section className="mt-8">
        <p className="font-cond text-[12px] tracking-[0.22em] text-gold">{t(locale, "rules")}</p>
        <ul className="mt-3 space-y-2">
          {game.rules.map((r, i) => (
            <li key={i} className="text-white/90">
              ✓ {loc(locale, r)}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-cond text-[12px] tracking-[0.22em] text-orange">{t(locale, "noGo")}</p>
        <ul className="mt-2 space-y-2 text-white/80">
          {game.noGo.map((r, i) => (
            <li key={i}>✕ {loc(locale, r)}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-[22px] border border-gold/30 bg-gold/10 p-4">
        <p className="font-cond text-[12px] tracking-[0.2em] text-gold">💡 {t(locale, "olympicTip")}</p>
        <p className="mt-2 text-lg">“{loc(locale, game.tip)}”</p>
      </section>

      <div className="mt-8">
        <Cta href="/village/map">{t(locale, "takeMeThere")}</Cta>
      </div>
      <div className="mt-4">
        <VillageMap
          games={event.games}
          highlightStation={game.station}
          flags={country && assignment ? [country, ...foes] : undefined}
        />
        <p className="mt-3 text-center font-cond text-[12px] tracking-[0.12em] text-white/50">
          {t(locale, "fromVillage")}: {t(locale, "walkTime")}
        </p>
      </div>
    </div>
  );
}
