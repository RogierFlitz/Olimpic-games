"use client";

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
  return (
    <div className="safe-bottom safe-top px-5">
      <p className="font-cond tracking-[0.24em] text-gold">{t(locale, "olympicMoment")}</p>
      <h1 className="mt-2 font-display text-5xl">{t(locale, "photoWall")}</h1>
      <div
        className="mt-5 aspect-[4/5] overflow-hidden rounded-[28px] bg-cover bg-center"
        style={{ backgroundImage: "url(/media/medal-ceremony.jpg)" }}
      />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {SHOTS.map((s) => (
          <div
            key={s.src}
            className="hero-photo aspect-square rounded-2xl"
            style={{ backgroundImage: `url(${s.src})` }}
            title={s.label}
          />
        ))}
      </div>
      <div className="mt-5 space-y-3">
        <a className="cta" href="/media/medal-ceremony.jpg" download>
          {t(locale, "downloadPhoto")}
        </a>
        <button
          className="cta cta-ghost"
          onClick={async () => {
            if (navigator.share) {
              await navigator.share({
                title: "Beach Olympic Games",
                url: window.location.origin + "/media/medal-ceremony.jpg",
              });
            }
          }}
        >
          {t(locale, "share")}
        </button>
      </div>
    </div>
  );
}
