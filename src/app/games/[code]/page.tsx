"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Cta, Phone } from "@/components/shell";
import { t, useLocale } from "@/components/hooks";
import { useEvent } from "@/lib/store";

export default function JoinPage() {
  const params = useParams<{ code: string }>();
  const code = String(params.code || "ABC123").toUpperCase();
  const { join, session, ready, event } = useEvent();
  const locale = useLocale();
  const router = useRouter();
  const knownName = event.participants.find((p) => p.id === session?.participantId)?.name || "";
  const [name, setName] = useState(knownName);

  useEffect(() => {
    if (ready && session?.participantId && session.eventCode === code) {
      router.replace("/welcome");
    }
  }, [ready, session, code, router]);

  if (!ready) return null;

  return (
    <Phone>
      <div className="relative flex min-h-dvh flex-col px-6 pb-8 pt-[max(28px,env(safe-area-inset-top))]">
        <div className="absolute inset-0 hero-photo opacity-40" style={{ backgroundImage: "url(/media/olympic-flame.jpg)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-navy" />
        <div className="relative">
          <p className="font-cond text-[12px] tracking-[0.32em] text-gold">EVENT {code}</p>
          <h1 className="mt-4 font-display text-6xl">
            JOIN
            <br />
            THE GAMES
          </h1>
          <p className="mt-4 max-w-[16ch] text-lg text-white/75">
            {locale === "nl" ? "Geen gedoe. Alleen je naam." : "No fuss. Just your name."}
          </p>
          <form
            className="mt-10 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              join(code, name);
              router.push("/welcome");
            }}
          >
            <label className="block">
              <span className="font-cond text-[12px] tracking-[0.2em] text-white/60">{t(locale, "yourName")}</span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(locale, "namePlaceholder")}
                className="mt-2 h-16 w-full rounded-2xl border border-white/15 bg-white/10 px-4 font-display text-4xl outline-none placeholder:text-white/25"
              />
            </label>
            <Cta type="submit">{t(locale, "joinTheGames")}</Cta>
          </form>
        </div>
      </div>
    </Phone>
  );
}
