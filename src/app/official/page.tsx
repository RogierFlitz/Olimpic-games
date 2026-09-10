"use client";

import { useEffect, useState } from "react";
import { Cta, Phone } from "@/components/shell";
import { loc, t, useLocale } from "@/components/hooks";
import { formatClock } from "@/lib/ranking";
import { GAME_LIBRARY } from "@/lib/catalog";
import { useEvent } from "@/lib/store";

export default function OfficialPage() {
  const { event, official, loginOfficial, completeStation } = useEvent();
  const locale = useLocale();
  const [station, setStation] = useState(official?.station ?? 7);
  const [name, setName] = useState(official?.name ?? "");
  const [remaining, setRemaining] = useState(8 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const game = event.games.find((g) => g.station === station) || GAME_LIBRARY.find((g) => g.station === station);
  const assignment = event.assignments.find(
    (a) => a.gameId === game?.id && a.round === event.currentRound && a.status !== "completed",
  );
  const countries = (assignment?.countryIds || []).map((id) => event.countries.find((c) => c.id === id)!).filter(Boolean);
  const [winner, setWinner] = useState<string>("");
  const [scores, setScores] = useState<Record<string, number>>({});

  if (!official) {
    return (
      <Phone>
        <div className="flex min-h-dvh flex-col px-6 pt-[max(28px,env(safe-area-inset-top))]">
          <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "official")}</p>
          <h1 className="mt-3 font-display text-5xl">STATION LOGIN</h1>
          <label className="mt-8 font-cond text-[12px] tracking-[0.16em]">STATION</label>
          <input
            type="number"
            value={station}
            onChange={(e) => setStation(Number(e.target.value))}
            className="mt-2 h-16 rounded-2xl border border-white/15 bg-white/10 px-4 font-display text-4xl"
          />
          <label className="mt-4 font-cond text-[12px] tracking-[0.16em]">NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Official"
            className="mt-2 h-14 rounded-2xl border border-white/15 bg-white/10 px-4"
          />
          <div className="mt-6">
            <Cta onClick={() => loginOfficial(station, name || "Official")}>{locale === "nl" ? "OPEN STATION" : "OPEN STATION"}</Cta>
          </div>
        </div>
      </Phone>
    );
  }

  return (
    <Phone>
      <div className="flex min-h-dvh flex-col px-6 pb-8 pt-[max(24px,env(safe-area-inset-top))]">
        <p className="font-cond tracking-[0.22em] text-gold">
          {t(locale, "station")} {String(station).padStart(2, "0")}
        </p>
        <h1 className="mt-2 font-display text-5xl">{game ? loc(locale, game.name) : "—"}</h1>
        <p className="mt-2 font-cond text-white/60">
          {t(locale, "round")} {String(event.currentRound).padStart(2, "0")}
        </p>

        <div className="card mt-8 p-5 text-center">
          {countries.length >= 2 ? (
            <p className="font-display text-4xl">
              {countries[0].flag} {loc(locale, countries[0].name).toUpperCase()}
              <span className="mx-3 text-gold">{t(locale, "vs")}</span>
              {countries[1].flag} {loc(locale, countries[1].name).toUpperCase()}
            </p>
          ) : countries[0] ? (
            <p className="font-display text-4xl">
              {countries[0].flag} {loc(locale, countries[0].name).toUpperCase()}
            </p>
          ) : (
            <p>{locale === "nl" ? "Geen teams op dit station." : "No teams at this station."}</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="font-display text-7xl text-gold">{formatClock(remaining)}</p>
          <div className="mt-4">
            <Cta
              onClick={() => {
                setRunning(true);
                if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
              }}
            >
              {t(locale, "startTimer")}
            </Cta>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-cond tracking-[0.2em] text-gold">{t(locale, "whoWon")}</p>
          <div className="mt-3 grid gap-2">
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => setWinner(c.id)}
                className={`rounded-2xl px-4 py-4 font-display text-3xl ${winner === c.id ? "bg-orange" : "border border-white/15"}`}
              >
                {c.flag} {loc(locale, c.name).toUpperCase()}
              </button>
            ))}
          </div>
          {game?.scoreMethod === "points" ? (
            <div className="mt-4 space-y-2">
              {countries.map((c) => (
                <label key={c.id} className="flex items-center justify-between gap-3">
                  <span>{c.flag}</span>
                  <input
                    type="number"
                    value={scores[c.id] ?? 0}
                    onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))}
                    className="h-12 w-28 rounded-xl border border-white/15 bg-white/10 px-3 text-right font-display text-2xl"
                  />
                </label>
              ))}
            </div>
          ) : null}
          <div className="mt-6">
            <Cta
              onClick={() => {
                completeStation(station, { winnerId: winner, scores });
                setRunning(false);
                setRemaining(8 * 60);
                setWinner("");
              }}
            >
              {t(locale, "completeRound")}
            </Cta>
          </div>
        </div>
        <p className="mt-auto pt-6 text-center font-cond text-[11px] tracking-[0.14em] text-white/30">
          {official.name}
        </p>
      </div>
    </Phone>
  );
}
