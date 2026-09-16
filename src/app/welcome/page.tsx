"use client";

import { useRouter } from "next/navigation";
import { Cta, Phone } from "@/components/shell";
import { FlagWave } from "@/components/visuals";
import { loc, t, useLocale } from "@/components/hooks";
import { COUNTRY_TEAM_NUMBER, useEvent } from "@/lib/store";

export default function WelcomePage() {
  const { session, event, ready } = useEvent();
  const locale = useLocale();
  const router = useRouter();

  if (!ready) return null;
  if (!session?.participantId) {
    router.replace("/");
    return null;
  }

  const country = event.countries.find((c) => c.id === session.countryId) ?? event.countries[0];
  const captain = event.participants.find((p) => p.countryId === country.id && p.isCaptain);
  const teamNo = COUNTRY_TEAM_NUMBER[country.id] ?? "01";

  return (
    <Phone>
      <div className="relative min-h-dvh">
        <div className="absolute inset-0 hero-photo" style={{ backgroundImage: "url(/media/hero-welcome.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/70 to-navy" />
        <div className="relative flex min-h-dvh flex-col px-6 pb-8 pt-[max(24px,env(safe-area-inset-top))]">
          <p className="font-cond text-[12px] tracking-[0.38em] text-gold">FLITZ</p>
          <h1 className="mt-2 font-display text-[58px] leading-[0.86]">
            BEACH
            <br />
            OLYMPIC GAMES
          </h1>
          <p className="mt-6 font-cond text-[15px] tracking-[0.22em] text-orange">
            {t(locale, "welcomeTo")}
          </p>
          <div className="card mt-8 overflow-hidden p-5" style={{ borderColor: `${country.color}55` }}>
            <p className="font-cond text-[11px] tracking-[0.18em] text-white/55">{t(locale, "todayYou")}</p>
            <p className="mt-3">
              <FlagWave flag={country.flag} size="text-6xl" />
            </p>
            <p className="mt-2 font-display text-4xl">
              {t(locale, "team")} {loc(locale, country.name).toUpperCase()}
            </p>
            <p className="mt-2 font-cond text-lg tracking-[0.12em] text-gold">“{loc(locale, country.motto)}”</p>
            <p className="mt-3 font-cond tracking-[0.2em] text-gold">
              {t(locale, "team")} {teamNo}
            </p>
            <span className="team-stripe mt-4 block" style={{ background: country.color }} />
            <div className="mt-5 flex justify-between text-sm">
              <div>
                <p className="font-cond text-[10px] tracking-[0.16em] text-white/45">{t(locale, "captain")}</p>
                <p className="text-lg font-semibold">{captain?.name ?? "—"}</p>
              </div>
              <div className="text-right">
                <p className="font-cond text-[10px] tracking-[0.16em] text-white/45">{t(locale, "yourColor")}</p>
                <p className="text-lg font-semibold" style={{ color: country.color }}>
                  {loc(locale, country.colorName)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto space-y-5 pt-8">
            <Cta href="/village">{t(locale, "enterVillage")}</Cta>
            <p className="pb-6 text-center font-cond text-[12px] tracking-[0.14em] text-white/45">
              {event.location} · {event.participants.length} {t(locale, "participants")} · {event.countries.length}{" "}
              {t(locale, "countries")} · {event.totalRounds} {t(locale, "disciplines")}
            </p>
          </div>
        </div>
      </div>
    </Phone>
  );
}
