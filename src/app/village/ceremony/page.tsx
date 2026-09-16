"use client";

import { useEffect, useState } from "react";
import { Cta } from "@/components/shell";
import { Confetti, Podium } from "@/components/visuals";
import { loc, t, useLocale } from "@/components/hooks";
import { ranking } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function CeremonyPage() {
  const { event } = useEvent();
  const locale = useLocale();
  const rows = ranking(event);
  const goldC = event.countries.find((c) => c.id === rows[0]?.countryId);
  const silverC = event.countries.find((c) => c.id === rows[1]?.countryId);
  const bronzeC = event.countries.find((c) => c.id === rows[2]?.countryId);
  const spirit = event.countries.find((c) => c.id === (event.awards.teamSpiritCountryId || "it"));
  const [step, setStep] = useState(0);

  useEffect(() => {
    const times = [600, 1800, 3400, 6200];
    const ids = times.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, []);

  return (
    <div className="safe-bottom safe-top relative overflow-hidden px-5 text-center">
      <Confetti run={step >= 3} />
      <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "resultsIn")}</p>
      <h1 className="mt-2 font-display text-5xl">{t(locale, "champions")}</h1>

      <Podium
        bronze={
          step >= 1 && bronzeC && rows[2]
            ? { flag: bronzeC.flag, name: loc(locale, bronzeC.name).toUpperCase(), points: rows[2].points }
            : undefined
        }
        silver={
          step >= 2 && silverC && rows[1]
            ? { flag: silverC.flag, name: loc(locale, silverC.name).toUpperCase(), points: rows[1].points }
            : undefined
        }
        gold={
          step >= 3 && goldC && rows[0]
            ? { flag: goldC.flag, name: loc(locale, goldC.name).toUpperCase(), points: rows[0].points }
            : undefined
        }
      />

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
