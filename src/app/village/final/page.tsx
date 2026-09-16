"use client";

import { Cta } from "@/components/shell";
import { Flame } from "@/components/visuals";
import { t, useLocale } from "@/components/hooks";

export default function FinalPage() {
  const locale = useLocale();
  return (
    <div className="safe-bottom safe-top flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
      <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "theFinal")}</p>
      <h1 className="mt-4 font-display text-6xl">THE OLYMPIC RELAY</h1>
      <p className="mt-4 font-cond text-xl tracking-[0.12em] text-white/70">
        {locale === "nl" ? "ALLE LANDEN. EÉN LAATSTE KANS." : "ALL COUNTRIES. ONE LAST CHANCE."}
      </p>
      <div className="mt-6">
        <Flame size={110} />
      </div>
      <p className="mt-6 font-cond text-lg tracking-[0.16em]">{t(locale, "reportArena")}</p>
      <div className="mt-8 w-full">
        <Cta href="/village/map">{t(locale, "takeMeThere")}</Cta>
      </div>
    </div>
  );
}
