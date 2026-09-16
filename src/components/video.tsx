"use client";

import { useEffect, useState } from "react";
import { loc, t, useLocale } from "./hooks";
import type { Game } from "@/lib/types";

const STEPS = [
  { at: 0, cap: { nl: "Korte intro. Dit is jullie spel.", en: "Quick intro. This is your game." } },
  { at: 6, cap: { nl: "Wat is het doel?", en: "What is the goal?" } },
  { at: 14, cap: { nl: "Wat moeten jullie doen?", en: "What do you need to do?" } },
  { at: 24, cap: { nl: "Wat mag niet?", en: "What is not allowed?" } },
  { at: 32, cap: { nl: "Wanneer win je?", en: "When do you win?" } },
];

export function InstructionFilm({ game, onClose }: { game: Game; onClose?: () => void }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t0, setT0] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [playing]);

  const elapsed = playing ? (now - t0) / 1000 : 0;
  const caption = [...STEPS].reverse().find((s) => elapsed >= s.at) ?? STEPS[0];

  const start = () => {
    setOpen(true);
    setPlaying(true);
    setT0(Date.now());
    setNow(Date.now());
  };

  return (
    <>
      <button onClick={start} className="relative w-full overflow-hidden rounded-[22px]">
        <div
          className="hero-photo relative aspect-[16/10] w-full"
          style={{ backgroundImage: `url(${game.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-navy/70 px-3 py-1 font-cond text-[11px] tracking-[0.18em]">
            {t(locale, "watchBefore")}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange text-2xl shadow-xl">
              ▶
            </span>
          </div>
          <div className="absolute bottom-3 right-4 font-cond tracking-[0.16em] text-white">
            {game.videoDuration}
          </div>
        </div>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] bg-black">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${game.image})`, animation: "rise 20s linear both" }}
          />
          <div className="absolute inset-0 bg-navy/45" />
          <button
            onClick={() => {
              setOpen(false);
              setPlaying(false);
              onClose?.();
            }}
            className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] z-10 rounded-full bg-white/15 px-3 py-2 font-cond tracking-[0.16em]"
          >
            {locale === "nl" ? "SLUITEN" : "CLOSE"}
          </button>
          <div className="absolute bottom-10 left-4 right-4 rounded-2xl bg-navy/80 p-4 text-center">
            <p className="font-cond text-[12px] tracking-[0.2em] text-gold">CC ON</p>
            <p className="mt-2 font-display text-3xl">{loc(locale, caption.cap)}</p>
            <p className="mt-3 font-cond text-white/70">{game.videoDuration}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
