"use client";

import { useEffect, useState } from "react";
import { Cta } from "@/components/shell";
import { Flame } from "@/components/visuals";
import { loc, t, useLocale } from "@/components/hooks";
import { useEvent } from "@/lib/store";

export default function FlamePage() {
  const { event, setPhase } = useEvent();
  const locale = useLocale();
  const allDone = event.flame.every((s) => s.done);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      setPhase("live");
      return;
    }
    const id = setTimeout(() => setCount((c) => (c === null ? null : c - 1)), 800);
    return () => clearTimeout(id);
  }, [count, setPhase]);

  if (count !== null) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center">
        {count > 0 ? (
          <p className="font-display text-[140px] text-gold">{count}</p>
        ) : (
          <div className="text-center">
            <Flame size={120} />
            <h1 className="mt-4 font-display text-5xl">{t(locale, "gamesOpen")}</h1>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="safe-bottom safe-top px-5 text-center">
      <Flame size={96} />
      <h1 className="mt-4 font-display text-5xl">{t(locale, "roadToFlame")}</h1>
      <p className="mt-3 font-cond text-lg tracking-[0.16em] text-gold">{t(locale, "earnFire")}</p>
      <p className="font-cond text-lg tracking-[0.16em]">{t(locale, "lightGames")}</p>
      <ul className="mt-8 space-y-3 text-left">
        {event.flame.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-4">
            <span className="text-2xl">{s.done ? "✓" : "○"}</span>
            <span className="font-display text-3xl">{loc(locale, s.name)}</span>
          </li>
        ))}
      </ul>
      {allDone ? (
        <div className="mt-8">
          <p className="font-display text-4xl text-gold">{t(locale, "flameReady")}</p>
          <div className="mt-3 flex justify-center">
            <Flame />
          </div>
          <p className="mt-3 font-cond tracking-[0.16em]">{t(locale, "reportCauldron")}</p>
          <div className="mt-6">
            <Cta onClick={() => setCount(5)}>{locale === "nl" ? "LIGHT THE FLAME" : "LIGHT THE FLAME"}</Cta>
          </div>
        </div>
      ) : null}
    </div>
  );
}
