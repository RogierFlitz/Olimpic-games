"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Cta, Phone } from "@/components/shell";
import { Flame } from "@/components/visuals";
import { LANGS } from "@/lib/i18n";
import { DEMO_CODE } from "@/lib/seed";
import { useEvent } from "@/lib/store";
import type { Locale } from "@/lib/types";
import { t, useLocale } from "@/components/hooks";

export default function LandingPage() {
  const { session, setLocale, ready } = useEvent();
  const locale = useLocale();
  const router = useRouter();
  const [code, setCode] = useState(DEMO_CODE);
  const needsLang = !session?.locale;

  if (!ready) {
    return (
      <Phone>
        <Splash />
      </Phone>
    );
  }

  if (needsLang) {
    return (
      <Phone>
        <div className="relative flex min-h-dvh flex-col justify-end bg-cover bg-center px-6 pb-10" style={{ backgroundImage: "url(/media/hero-welcome.jpg)" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
          <div className="relative">
            <p className="font-cond text-[13px] tracking-[0.32em] text-gold">FLITZ EVENTS</p>
            <h1 className="mt-3 font-display text-6xl">BEACH<br />OLYMPIC GAMES</h1>
            <p className="mt-8 font-cond tracking-[0.2em] text-white/80">{t(locale, "langTitle")}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {LANGS.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLocale(lang.id as Locale)}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left font-cond text-lg tracking-[0.12em]"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Phone>
    );
  }

  return (
    <Phone>
      <div className="relative flex min-h-dvh flex-col">
        <div className="absolute inset-0 hero-photo" style={{ backgroundImage: "url(/media/hero-welcome.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/40 to-navy" />
        <div className="relative flex flex-1 flex-col px-6 pb-8 pt-[max(28px,env(safe-area-inset-top))]">
          <Image src="/brand/flitz-logo.svg" alt="Flitz" width={160} height={40} className="h-10 w-auto self-start" priority />
          <div className="mt-10">
            <p className="font-cond text-[13px] tracking-[0.4em] text-gold">{t(locale, "scanJoin")}</p>
            <h1 className="mt-3 font-display text-[72px] leading-[0.82]">
              BEACH
              <br />
              OLYMPIC
              <br />
              GAMES
            </h1>
          </div>
          <div className="mt-auto">
            <p className="font-cond text-[12px] tracking-[0.2em] text-white/70">{t(locale, "enterCode")}</p>
            <form
              className="mt-3 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/games/${code.trim().toUpperCase() || DEMO_CODE}`);
              }}
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="h-14 w-full rounded-2xl border border-white/20 bg-white/10 px-4 text-center font-display text-3xl tracking-[0.28em] outline-none"
              />
              <Cta type="submit">{t(locale, "joinTheGames")}</Cta>
            </form>
            <div className="mt-6 flex justify-between font-cond text-[11px] tracking-[0.16em] text-white/45">
              <a href="/official">{t(locale, "official")}</a>
              <a href="/host">{t(locale, "host")}</a>
              <a href="/admin">{t(locale, "admin")}</a>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

export function Splash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6">
      <Flame size={88} />
      <p className="font-display text-5xl">FLITZ</p>
      <p className="font-cond tracking-[0.32em] text-gold">BEACH OLYMPIC GAMES</p>
    </div>
  );
}
