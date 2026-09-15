"use client";

import Image from "next/image";
import { loc, t, useLocale } from "@/components/hooks";
import { ranking } from "@/lib/ranking";
import { useEvent } from "@/lib/store";

export default function MedalPage() {
  const { event, session } = useEvent();
  const locale = useLocale();
  const person = event.participants.find((p) => p.id === session?.participantId);
  const country = event.countries.find((c) => c.id === (session?.countryId ?? "nl"))!;
  const you = ranking(event).find((r) => r.countryId === country.id)!;
  const champion = you.rank === 1;
  const played = event.assignments.filter((a) => a.countryIds.includes(country.id) && a.status === "completed").length;

  async function share() {
    const text = `${person?.name ?? "Athlete"} · ${loc(locale, country.name)} · ${you.rank === 1 ? "🥇" : you.rank === 2 ? "🥈" : you.rank === 3 ? "🥉" : `#${you.rank}`} · Flitz Beach Olympic Games · ${event.location}`;
    if (navigator.share) {
      await navigator.share({ title: "Beach Olympic Games", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  return (
    <div className="safe-bottom safe-top px-5">
      <div
        className="relative mx-auto aspect-[9/16] max-h-[72dvh] overflow-hidden rounded-[28px] px-5 py-8 text-center"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(7,16,24,.2), rgba(7,16,24,.88)), url(/media/share-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image src="/brand/flitz-logo.svg" alt="Flitz" width={140} height={32} className="mx-auto h-8 w-auto" />
        <p className="mt-6 font-cond text-[11px] tracking-[0.28em] text-gold">{t(locale, "myResult")}</p>
        <p className="mt-6 font-display text-6xl">{(person?.name ?? "ROGIER").toUpperCase()}</p>
        <p className="mt-2 text-2xl">
          {country.flag} {loc(locale, country.name).toUpperCase()}
        </p>
        <p className="mt-10 text-8xl">{you.rank === 1 ? "🥇" : you.rank === 2 ? "🥈" : you.rank === 3 ? "🥉" : you.rank}</p>
        <p className="mt-3 font-display text-4xl">
          {champion ? t(locale, "olympicChampion") : `${you.rank}${locale === "nl" ? "e PLAATS" : ""}`}
        </p>
        <p className="mt-auto pt-10 font-cond tracking-[0.18em] text-white/70">FLITZ BEACH OLYMPIC GAMES</p>
        <p className="font-cond tracking-[0.18em] text-gold">{event.location.toUpperCase()}</p>
      </div>
      <div className="card mt-5 p-4 text-center">
        <p className="font-cond text-[11px] tracking-[0.2em] text-gold">{t(locale, "recap")}</p>
        <p className="mt-2 font-display text-3xl">
          {you.points} {t(locale, "pts")} · {played} {t(locale, "gamesPlayed")}
        </p>
      </div>
      <div className="mt-6">
        <button onClick={share} className="cta">
          {t(locale, "shareResult")}
        </button>
      </div>
    </div>
  );
}
