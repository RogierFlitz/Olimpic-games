"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Confetti } from "./visuals";
import { loc, t, useLocale } from "./hooks";
import { playTokenCue } from "@/lib/fx";
import { villageFeed } from "@/lib/ranking";
import { useEvent } from "@/lib/store";
import { getTokenSnap, subscribeToken, unlockGoldenToken } from "@/lib/token";

export function useGoldenToken() {
  const found = useSyncExternalStore(subscribeToken, getTokenSnap, () => false);
  return { found, unlock: unlockGoldenToken };
}

export function LiveTicker() {
  const { event } = useEvent();
  const locale = useLocale();
  const items = villageFeed(event).slice(0, 8);
  if (!items.length) return null;
  const line = items
    .map((item) => {
      const c = event.countries.find((c) => c.id === item.countryId);
      const g = event.games.find((g) => g.id === item.gameId);
      const medal = item.medal === "gold" ? "🥇" : item.medal === "silver" ? "🥈" : "🥉";
      return `${c?.flag ?? ""} ${c ? loc(locale, c.name) : ""} ${medal} ${g ? loc(locale, g.shortName) : ""}`;
    })
    .join("   ·   ");

  return (
    <div className="ticker mt-4 rounded-full border border-white/10 bg-white/5 py-2">
      <p className="px-4 font-cond text-[10px] tracking-[0.22em] text-gold">{t(locale, "aroundVillage")}</p>
      <div className="ticker-mask mt-1">
        <p className="ticker-track font-cond text-[12px] tracking-[0.12em] text-white/80">
          {line}   ·   {line}
        </p>
      </div>
    </div>
  );
}

export function GoldenHunter() {
  const { found, unlock } = useGoldenToken();
  const locale = useLocale();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const onUnlock = () => {
      if (unlock()) {
        playTokenCue();
        setCelebrate(true);
      }
    };
    window.addEventListener("flitz-token", onUnlock);

    let last = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const mag = Math.abs(acc.x ?? 0) + Math.abs(acc.y ?? 0) + Math.abs(acc.z ?? 0);
      if (mag > 32 && Date.now() - last > 1600) {
        last = Date.now();
        onUnlock();
      }
    };
    window.addEventListener("devicemotion", onMotion);

    return () => {
      window.removeEventListener("flitz-token", onUnlock);
      window.removeEventListener("devicemotion", onMotion);
    };
  }, [unlock]);

  if (!celebrate || !found) return null;

  return (
    <button
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-navy/92 px-6 text-center md:left-1/2 md:max-w-[430px] md:-translate-x-1/2 md:rounded-[36px]"
      onClick={() => setCelebrate(false)}
    >
      <Confetti run />
      <p className="text-6xl">✦</p>
      <p className="mt-4 font-cond tracking-[0.28em] text-gold">{t(locale, "hiddenChallenge")}</p>
      <h2 className="mt-3 font-display text-6xl">{t(locale, "tokenFound")}</h2>
      <p className="mt-3 text-white/75">{t(locale, "tokenBody")}</p>
      <p className="mt-8 font-cond text-[12px] tracking-[0.2em] text-white/40">{t(locale, "close")}</p>
    </button>
  );
}

export function requestGoldenToken() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("flitz-token"));
}
