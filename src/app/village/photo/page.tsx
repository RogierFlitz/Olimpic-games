"use client";

import { useState } from "react";
import { t, useLocale } from "@/components/hooks";

const SHOTS = [
  { src: "/media/medal-ceremony.jpg", label: "Podium" },
  { src: "/media/village-aerial.jpg", label: "Village" },
  { src: "/media/game-olympic-crane.jpg", label: "Crane" },
  { src: "/media/game-water.jpg", label: "Water" },
  { src: "/media/game-tug.jpg", label: "Tug" },
  { src: "/media/hero-welcome.jpg", label: "Flame" },
];

export default function PhotoPage() {
  const locale = useLocale();
  const [hero, setHero] = useState(SHOTS[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="safe-bottom safe-top px-5">
      <p className="font-cond tracking-[0.24em] text-gold">{t(locale, "olympicMoment")}</p>
      <h1 className="mt-2 font-display text-5xl">{t(locale, "photoWall")}</h1>
      <button
        className="mt-5 aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-cover bg-center"
        style={{ backgroundImage: `url(${hero.src})` }}
        onClick={() => setOpen(true)}
        aria-label={hero.label}
      />
      <p className="mt-2 text-center font-cond text-[11px] tracking-[0.16em] text-white/40">{t(locale, "tapPhoto")}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {SHOTS.map((s) => (
          <button
            key={s.src}
            className={`hero-photo aspect-square rounded-2xl ${hero.src === s.src ? "ring-2 ring-gold" : ""}`}
            style={{ backgroundImage: `url(${s.src})` }}
            title={s.label}
            onClick={() => setHero(s)}
          />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        <a className="cta" href={hero.src} download>
          {t(locale, "downloadPhoto")}
        </a>
        <button
          className="cta cta-ghost"
          onClick={async () => {
            if (navigator.share) {
              await navigator.share({
                title: "Beach Olympic Games",
                url: window.location.origin + hero.src,
              });
            }
          }}
        >
          {t(locale, "share")}
        </button>
      </div>

      {open ? (
        <button
          className="fixed inset-0 z-[80] bg-black"
          onClick={() => setOpen(false)}
          aria-label={t(locale, "close")}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hero.src})` }} />
          <span className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] rounded-full bg-white/15 px-3 py-2 font-cond tracking-[0.16em]">
            {t(locale, "close")}
          </span>
        </button>
      ) : null}
    </div>
  );
}
