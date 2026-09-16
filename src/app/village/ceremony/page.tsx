"use client";

import { useEffect, useState } from "react";
import { Cta } from "@/components/shell";
import { Confetti, Medal } from "@/components/visuals";
import { loc, t, useLocale } from "@/components/hooks";
import { ranking } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function CeremonyPage() {
  const { event } = useEvent();
  const locale = useLocale();
  const rows = ranking(event);
  const gold = event.countries.find((c) => c.id === rows[0]?.countryId);
  const silver = event.countries.find((c) => c.id === rows[1]?.countryId);
  const bronze = event.countries.find((c) => c.id === rows[2]?.countryId);
  const spirit = event.countries.find((c) => c.id === (event.awards.teamSpiritCountryId || "it"));
  const [step, setStep] = useState(0);

  useEffect(() => {
    const times = [800, 2800, 5200, 7800];
    const ids = times.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <div className="safe-bottom safe-top relative overflow-hidden px-5 text-center">
      <Confetti run={step >= 4} />
      <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "resultsIn")}</p>

      {step >= 1 && bronze ? (
        <div className="rise mt-10">
          <Medal place={3} />
          <p className="font-cond tracking-[0.2em]">{t(locale, "bronze")}</p>
          <p className="font-display text-4xl">
            {bronze.flag} {t(locale, "team")} {loc(locale, bronze.name).toUpperCase()}
          </p>
        </div>
      ) : null}

      {step >= 2 && silver ? (
        <div className="rise mt-8">
          <Medal place={2} />
          <p className="font-cond tracking-[0.2em]">{t(locale, "silver")}</p>
          <p className="font-display text-4xl">
            {silver.flag} {t(locale, "team")} {loc(locale, silver.name).toUpperCase()}
          </p>
        </div>
      ) : null}

      {step >= 3 && gold ? (
        <div className="rise mt-10 rounded-[28px] bg-gold px-4 py-8 text-navy">
          <Medal place={1} size={72} />
          <p className="font-display text-5xl">{t(locale, "champions")}</p>
          <p className="mt-3 text-5xl">{gold.flag}</p>
          <p className="font-display text-5xl">
            {t(locale, "team")} {loc(locale, gold.name).toUpperCase()}
          </p>
          <p className="mt-4 font-cond tracking-[0.16em]">
            {t(locale, "finalScore")} {rows[0].points} {t(locale, "pts")}
          </p>
        </div>
      ) : null}

      {step >= 4 && spirit ? (
        <div className="rise mt-8">
          <p className="text-3xl">❤️</p>
          <p className="font-cond tracking-[0.2em] text-gold">{t(locale, "bestSpirit")}</p>
          <p className="font-display text-3xl">
            {spirit.flag} {t(locale, "team")} {loc(locale, spirit.name).toUpperCase()}
          </p>
          <p className="mt-2 text-white/60">{t(locale, "notAboutWinning")}</p>
        </div>
      ) : null}

      <div className="mt-8 space-y-3">
        <Cta href="/village/medal">{t(locale, "viewResults")}</Cta>
        <Cta href="/village/photo" ghost>
          {t(locale, "olympicMoment")}
        </Cta>
      </div>
    </div>
  );
}
