"use client";

import { Cta } from "@/components/shell";
import { loc, t, useLocale, useNow } from "@/components/hooks";
import { formatClock, timeUntil } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function GoldenPage() {
  const { event } = useEvent();
  const locale = useLocale();
  const now = useNow();
  const seconds = event.goldenStartsAt ? timeUntil(event.goldenStartsAt, now) : 120;
  const game = event.games.find((g) => g.id === "gold-rush");

  return (
    <div className="safe-bottom safe-top px-5 text-center">
      <p className="text-5xl">⭐</p>
      <h1 className="mt-3 font-display text-6xl">{t(locale, "goldenEvent")}</h1>
      <p className="mt-2 font-cond text-2xl tracking-[0.16em] text-gold">{t(locale, "doublePoints")}</p>
      <p className="mt-2 text-white/70">{t(locale, "everythingChange")}</p>
      <p className="mt-8 font-cond tracking-[0.2em] text-white/50">{t(locale, "startsIn")}</p>
      <p className="font-display text-7xl">{formatClock(seconds)}</p>
      <p className="mt-4 font-display text-3xl">{game ? loc(locale, game.name) : "Gold Rush"}</p>
      <div className="mt-8">
        <Cta href="/village/games/gold-rush">{t(locale, "viewEvent")}</Cta>
      </div>
    </div>
  );
}
