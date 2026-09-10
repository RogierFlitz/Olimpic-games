"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BottomNav, Cta, Phone } from "@/components/shell";
import { OfflineBanner, Toasts } from "@/components/toasts";
import { Flame } from "@/components/visuals";
import { t, useLocale, useNow } from "@/components/hooks";
import { formatClock, timeUntil } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function VillageLayout({ children }: { children: React.ReactNode }) {
  const { ready, session, event } = useEvent();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const now = useNow();

  useEffect(() => {
    if (ready && !session?.participantId) router.replace("/");
  }, [ready, session, router]);

  if (!ready) return null;

  return (
    <Phone>
      <OfflineBanner />
      <Toasts />
      {event.phase === "golden" && !pathname.includes("gold-rush") && pathname !== "/village/golden" ? (
        <GoldenTakeover now={now} />
      ) : null}
      {event.phase === "final" && pathname !== "/village/final" ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy px-6 text-center md:left-1/2 md:max-w-[430px] md:-translate-x-1/2 md:rounded-[36px]">
          <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "theFinal")}</p>
          <h2 className="mt-4 font-display text-6xl">THE OLYMPIC RELAY</h2>
          <p className="mt-4 font-cond text-lg tracking-[0.12em] text-white/70">
            {locale === "nl" ? "ALLE LANDEN. EÉN LAATSTE KANS." : "ALL COUNTRIES. ONE LAST CHANCE."}
          </p>
          <Flame size={90} />
          <p className="mt-6 font-cond tracking-[0.18em]">{t(locale, "reportArena")}</p>
          <div className="mt-8 w-full">
            <Cta href="/village/final">{t(locale, "viewEvent")}</Cta>
          </div>
        </div>
      ) : null}
      {event.phase === "ceremony" || event.phase === "results" ? (
        <div className="pointer-events-none fixed right-4 top-[max(16px,env(safe-area-inset-top))] z-40">
          <Link href="/village/ceremony" className="pointer-events-auto rounded-full bg-gold px-3 py-2 font-cond text-[11px] tracking-[0.16em] text-navy">
            {t(locale, "resultsIn")}
          </Link>
        </div>
      ) : null}
      <div className="flex-1">{children}</div>
      <BottomNav />
    </Phone>
  );
}

function GoldenTakeover({ now }: { now: number }) {
  const { event } = useEvent();
  const locale = useLocale();
  const seconds = event.goldenStartsAt ? timeUntil(event.goldenStartsAt, now) : 120;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy px-6 text-center md:left-1/2 md:max-w-[430px] md:-translate-x-1/2 md:rounded-[36px]">
      <div className="absolute inset-0 hero-photo opacity-40" style={{ backgroundImage: "url(/media/olympic-flame.jpg)" }} />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative">
        <p className="text-4xl">⭐</p>
        <h2 className="mt-3 font-display text-6xl">{t(locale, "goldenEvent")}</h2>
        <p className="mt-3 font-cond text-2xl tracking-[0.18em] text-gold">{t(locale, "doublePoints")}</p>
        <p className="mt-2 text-white/70">{t(locale, "everythingChange")}</p>
        <p className="mt-8 font-cond tracking-[0.22em] text-white/50">{t(locale, "startsIn")}</p>
        <p className="font-display text-7xl text-gold">{formatClock(seconds)}</p>
        <div className="mt-8">
          <Cta href="/village/games/gold-rush">{t(locale, "viewEvent")}</Cta>
        </div>
      </div>
    </div>
  );
}
