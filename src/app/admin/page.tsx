"use client";

import { useState } from "react";
import { Cta, Phone } from "@/components/shell";
import { loc, t, useLocale } from "@/components/hooks";
import { GAME_LIBRARY } from "@/lib/catalog";
import { generateSchedule } from "@/lib/schedule";
import { COUNTRIES, createDemoEvent } from "@/lib/seed";
import { useEvent } from "@/lib/store";
import type { Game } from "@/lib/types";

export default function AdminPage() {
  const { event, updateGame, resetDemo } = useEvent();
  const locale = useLocale();
  const [selected, setSelected] = useState<Game>(event.games[0] || GAME_LIBRARY[0]);
  const [location, setLocation] = useState(event.location);
  const [code, setCode] = useState(event.code);

  return (
    <Phone wide>
      <div className="min-h-dvh px-5 pb-12 pt-[max(24px,env(safe-area-inset-top))]">
        <p className="font-cond tracking-[0.28em] text-gold">{t(locale, "admin")}</p>
        <h1 className="mt-1 font-display text-5xl">BEACH OLYMPICS</h1>

        <section className="card mt-6 p-4">
          <p className="font-cond text-[12px] tracking-[0.16em] text-gold">{t(locale, "createEvent")}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="block text-sm">
              CODE
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3 font-display text-2xl" />
            </label>
            <label className="block text-sm">
              LOCATION
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3" />
            </label>
            <label className="block text-sm">
              DATE
              <input defaultValue={event.date} className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3" />
            </label>
          </div>
          <p className="mt-3 font-cond text-[12px] text-white/50">
            {event.participants.length} {t(locale, "participants")} · {event.countries.length} {t(locale, "countries")} · {event.games.filter((g) => g.station > 0).length} {t(locale, "disciplines")}
          </p>
          <div className="mt-4 flex gap-3">
            <Cta
              onClick={() => {
                const fresh = createDemoEvent();
                fresh.code = code;
                fresh.location = location;
                fresh.assignments = generateSchedule(COUNTRIES, GAME_LIBRARY.filter((g) => g.station > 0).slice(0, 8), new Date());
                updateGame(selected);
                resetDemo();
              }}
            >
              {locale === "nl" ? "GENEREER SCHEMA" : "GENERATE SCHEDULE"}
            </Cta>
          </div>
        </section>

        <section className="mt-8">
          <p className="font-cond tracking-[0.16em] text-gold">{t(locale, "gameLibrary")}</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {GAME_LIBRARY.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelected(g)}
                className={`rounded-2xl px-4 py-3 text-left ${selected.id === g.id ? "bg-orange" : "border border-white/10"}`}
              >
                <p className="font-display text-2xl">
                  {String(g.station).padStart(2, "0")} {loc(locale, g.name)}
                </p>
                <p className="font-cond text-[11px] tracking-[0.12em] text-white/70">{loc(locale, g.tagline)}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="card mt-6 space-y-3 p-4">
          <p className="font-display text-3xl">{loc(locale, selected.name)}</p>
          <Field label="TAGLINE" value={selected.tagline.nl} onChange={(v) => updateSelected({ tagline: { ...selected.tagline, nl: v, en: v } })} />
          <Field label="MISSION" value={selected.mission.nl} onChange={(v) => updateSelected({ mission: { ...selected.mission, nl: v, en: v } })} />
          <Field label="TIP" value={selected.tip.nl} onChange={(v) => updateSelected({ tip: { ...selected.tip, nl: v, en: v } })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="DURATION" value={String(selected.durationMin)} onChange={(v) => updateSelected({ durationMin: Number(v) || selected.durationMin })} />
            <Field label="STATION" value={String(selected.station)} onChange={(v) => updateSelected({ station: Number(v) || selected.station })} />
          </div>
          <Field label="VIDEO" value={selected.videoDuration} onChange={(v) => updateSelected({ videoDuration: v })} />
          <Field label="IMAGE URL" value={selected.image} onChange={(v) => updateSelected({ image: v })} />
          <Cta onClick={() => updateGame(selected)}>{locale === "nl" ? "OPSLAAN" : "SAVE GAME"}</Cta>
        </section>

        <div className="mt-6">
          <Cta onClick={resetDemo} ghost>
            {t(locale, "resetDemo")}
          </Cta>
        </div>
      </div>
    </Phone>
  );

  function updateSelected(patch: Partial<Game>) {
    const next = { ...selected, ...patch };
    setSelected(next);
  }
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="font-cond text-[11px] tracking-[0.16em] text-white/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-3"
      />
    </label>
  );
}
