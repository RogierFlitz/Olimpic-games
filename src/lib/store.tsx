"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { GAME_LIBRARY } from "./catalog";
import { COUNTRY_TEAM_NUMBER, createDemoEvent, DEMO_CODE } from "./seed";
import { awardPlaces, headToHeadAward } from "./schedule";
import type {
  EventPhase,
  EventState,
  Game,
  Locale,
  OfficialSession,
  Session,
} from "./types";

const STATE_KEY = "flitz-bog-state-v1";
const SESSION_KEY = "flitz-bog-session-v1";
const OFFICIAL_KEY = "flitz-bog-official-v1";
const CHANNEL = "flitz-bog-v1";

type Snap = {
  event: EventState;
  session: Session | null;
  official: OfficialSession | null;
  ready: boolean;
};

const SERVER_SNAP: Snap = {
  event: createDemoEvent(0),
  session: null,
  official: null,
  ready: false,
};

let snap: Snap = SERVER_SNAP;
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;
let wired = false;

function emit() {
  listeners.forEach((l) => l());
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function hydrate() {
  if (typeof window === "undefined" || snap.ready) return;
  const stored = readJson<EventState>(STATE_KEY);
  snap = {
    event: stored?.code ? stored : createDemoEvent(),
    session: readJson<Session>(SESSION_KEY),
    official: readJson<OfficialSession>(OFFICIAL_KEY),
    ready: true,
  };
  if (!stored?.code) writeJson(STATE_KEY, snap.event);
  wire();
}

function wire() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  try {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (msg: MessageEvent) => {
      if (msg.data?.type === "state" && msg.data.event) {
        snap = { ...snap, event: msg.data.event as EventState };
        emit();
      }
      if (msg.data?.type === "session") {
        snap = { ...snap, session: msg.data.session as Session | null };
        emit();
      }
      if (msg.data?.type === "official") {
        snap = { ...snap, official: msg.data.official as OfficialSession | null };
        emit();
      }
    };
  } catch {
    /* ignore */
  }
  window.addEventListener("storage", (e) => {
    if (e.key === STATE_KEY && e.newValue) {
      snap = { ...snap, event: JSON.parse(e.newValue) as EventState };
      emit();
    }
  });
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnap() {
  hydrate();
  return snap;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function assignCountry(name: string, event: EventState) {
  const existing = event.participants.find(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
  );
  if (existing) return existing;
  const counts = event.countries.map((c) => ({
    id: c.id,
    n: event.participants.filter((p) => p.countryId === c.id).length,
  }));
  counts.sort((a, b) => a.n - b.n);
  return {
    id: uid("p"),
    name: name.trim(),
    countryId: counts[0]?.id ?? "nl",
    isCaptain: false,
  };
}

function publishEvent(next: EventState) {
  const stamped = { ...next, updatedAt: Date.now() };
  snap = { ...snap, event: stamped };
  writeJson(STATE_KEY, stamped);
  try {
    channel?.postMessage({ type: "state", event: stamped });
  } catch {
    /* ignore */
  }
  emit();
}

function publishSession(next: Session | null) {
  snap = { ...snap, session: next };
  if (next) writeJson(SESSION_KEY, next);
  try {
    channel?.postMessage({ type: "session", session: next });
  } catch {
    /* ignore */
  }
  emit();
}

function publishOfficial(next: OfficialSession | null) {
  snap = { ...snap, official: next };
  if (next) writeJson(OFFICIAL_KEY, next);
  try {
    channel?.postMessage({ type: "official", official: next });
  } catch {
    /* ignore */
  }
  emit();
}

type Store = {
  ready: boolean;
  event: EventState;
  session: Session | null;
  official: OfficialSession | null;
  setLocale: (locale: Locale) => void;
  join: (code: string, name: string) => Session;
  enterVillage: () => void;
  setPhase: (phase: EventPhase) => void;
  announce: (title: string, body: string, kind?: EventState["notices"][number]["kind"]) => void;
  startNextRound: () => void;
  startGolden: () => void;
  startFinal: () => void;
  startCeremony: () => void;
  lockScores: () => void;
  completeStation: (
    station: number,
    payload: { winnerId?: string; scores?: Record<string, number> },
  ) => void;
  loginOfficial: (station: number, name: string) => void;
  updateGame: (game: Game) => void;
  resetDemo: () => void;
  dismissNotice: (id: string) => void;
  markFlameStep: (id: string, done: boolean) => void;
  setAward: (kind: "teamSpiritCountryId" | "mvpName", value: string) => void;
};

const StoreContext = createContext<Store | null>(null);

function orderedCountryIds(ordered: string[], all: string[]) {
  const rest = all.filter((id) => !ordered.includes(id));
  return [...ordered, ...rest];
}

export function EventProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, getSnap, () => SERVER_SNAP);
  const event = current.event;
  const session = current.session;

  const setLocale = useCallback((locale: Locale) => {
    const base = snap.session ?? { participantId: "", countryId: "", eventCode: "", locale };
    publishSession({ ...base, locale });
  }, []);

  const join = useCallback((code: string, name: string) => {
    const normalized = code.trim().toUpperCase() || DEMO_CODE;
    let nextEvent = snap.event;
    if (nextEvent.code !== normalized) {
      nextEvent = { ...createDemoEvent(), code: normalized };
    }
    const person = assignCountry(name, nextEvent);
    const participants = nextEvent.participants.some((p) => p.id === person.id)
      ? nextEvent.participants
      : [...nextEvent.participants, person];
    nextEvent = { ...nextEvent, participants };
    const nextSession: Session = {
      participantId: person.id,
      countryId: person.countryId,
      eventCode: nextEvent.code,
      locale: snap.session?.locale || nextEvent.defaultLocale,
    };
    publishSession(nextSession);
    publishEvent(nextEvent);
    return nextSession;
  }, []);

  const enterVillage = useCallback(() => undefined, []);

  const setPhase = useCallback((phase: EventPhase) => {
    publishEvent({ ...snap.event, phase });
  }, []);

  const announce = useCallback(
    (title: string, body: string, kind: EventState["notices"][number]["kind"] = "host") => {
      const notice = {
        id: uid("n"),
        kind,
        title: { nl: title, en: title },
        body: { nl: body, en: body },
        at: Date.now(),
      };
      publishEvent({ ...snap.event, notices: [...snap.event.notices.slice(-6), notice] });
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(kind === "go" ? [40, 40, 80] : 30);
      }
    },
    [],
  );

  const startNextRound = useCallback(() => {
    const ev = snap.event;
    const round = Math.min(ev.totalRounds, ev.currentRound + 1);
    const assignments = ev.assignments.map((a) => {
      if (a.round < round && a.round <= ev.totalRounds) {
        return a.status === "completed" ? a : { ...a, status: "completed" as const };
      }
      if (a.round === round) return { ...a, status: "up_next" as const };
      return a;
    });
    const up = assignments.find((a) => a.round === round);
    const game = ev.games.find((g) => g.id === up?.gameId);
    publishEvent({
      ...ev,
      phase: "live",
      currentRound: round,
      assignments,
      notices: [
        ...ev.notices,
        {
          id: uid("n"),
          kind: "next",
          title: { nl: "NEXT EVENT", en: "NEXT EVENT" },
          body: {
            nl: `${game?.name.nl ?? "Volgende ronde"} start zo.`,
            en: `${game?.name.en ?? "Next round"} starts soon.`,
          },
          at: Date.now(),
        },
      ],
    });
  }, []);

  const startGolden = useCallback(() => {
    const ev = snap.event;
    const assignments = ev.assignments.map((a) =>
      a.gameId === "gold-rush"
        ? { ...a, status: "up_next" as const, startsAt: new Date(Date.now() + 120_000).toISOString() }
        : a,
    );
    publishEvent({
      ...ev,
      phase: "golden",
      goldenStartsAt: new Date(Date.now() + 120_000).toISOString(),
      assignments,
      notices: [
        ...ev.notices,
        {
          id: uid("n"),
          kind: "host",
          title: { nl: "GOLDEN EVENT", en: "GOLDEN EVENT" },
          body: { nl: "Double points. Everything can change.", en: "Double points. Everything can change." },
          at: Date.now(),
        },
      ],
    });
  }, []);

  const startFinal = useCallback(() => {
    const ev = snap.event;
    publishEvent({
      ...ev,
      phase: "final",
      notices: [
        ...ev.notices,
        {
          id: uid("n"),
          kind: "final",
          title: { nl: "FINAL", en: "FINAL" },
          body: {
            nl: "All countries report to the Central Arena.",
            en: "All countries report to the Central Arena.",
          },
          at: Date.now(),
        },
      ],
    });
  }, []);

  const startCeremony = useCallback(() => {
    const ev = snap.event;
    publishEvent({
      ...ev,
      phase: "ceremony",
      awards: { ...ev.awards, teamSpiritCountryId: ev.awards.teamSpiritCountryId || "it" },
    });
  }, []);

  const lockScores = useCallback(() => {
    announce("SCORES LOCKED", "Klassement is bevroren tot de finale.", "host");
  }, [announce]);

  const completeStation = useCallback(
    (station: number, payload: { winnerId?: string; scores?: Record<string, number> }) => {
      const ev = snap.event;
      const game = ev.games.find((g) => g.station === station);
      if (!game) return;
      const assignment = ev.assignments.find(
        (a) => a.gameId === game.id && a.round === ev.currentRound && a.status !== "completed",
      );
      if (!assignment) return;
      let award: { pointsAwarded: Record<string, number>; medals: Record<string, "gold" | "silver" | "bronze"> };
      if (payload.winnerId && assignment.countryIds.length >= 2) {
        const loser = assignment.countryIds.find((id) => id !== payload.winnerId) || assignment.countryIds[1];
        award = headToHeadAward(payload.winnerId, loser);
      } else if (payload.scores) {
        const ordered = Object.entries(payload.scores)
          .sort((a, b) => b[1] - a[1])
          .map(([id]) => id);
        award = awardPlaces(orderedCountryIds(ordered, assignment.countryIds));
      } else if (payload.winnerId) {
        award = awardPlaces([
          payload.winnerId,
          ...assignment.countryIds.filter((id) => id !== payload.winnerId),
        ]);
      } else {
        award = { pointsAwarded: {}, medals: {} };
      }
      const assignments = ev.assignments.map((a) =>
        a.id === assignment.id
          ? {
              ...a,
              status: "completed" as const,
              pointsAwarded: { ...a.pointsAwarded, ...award.pointsAwarded },
              medals: { ...a.medals, ...award.medals },
              scores: payload.scores,
            }
          : a,
      );
      const winner = ev.countries.find((c) => c.id === payload.winnerId);
      publishEvent({
        ...ev,
        assignments,
        notices: [
          ...ev.notices,
          {
            id: uid("n"),
            kind: "result",
            title: { nl: "RESULT", en: "RESULT" },
            body: {
              nl: winner ? `🥇 ${winner.name.nl} won ${game.name.nl}!` : `${game.name.nl} is gespeeld.`,
              en: winner ? `🥇 ${winner.name.en} won ${game.name.en}!` : `${game.name.en} is done.`,
            },
            at: Date.now(),
          },
        ],
      });
    },
    [],
  );

  const loginOfficial = useCallback((station: number, name: string) => {
    publishOfficial({ station, name });
  }, []);

  const updateGame = useCallback((game: Game) => {
    const ev = snap.event;
    const inEvent = ev.games.some((g) => g.id === game.id);
    publishEvent({
      ...ev,
      games: inEvent ? ev.games.map((g) => (g.id === game.id ? game : g)) : [...ev.games, game],
    });
    const idx = GAME_LIBRARY.findIndex((g) => g.id === game.id);
    if (idx >= 0) GAME_LIBRARY[idx] = game;
  }, []);

  const resetDemo = useCallback(() => {
    publishEvent(createDemoEvent());
  }, []);

  const dismissNotice = useCallback((id: string) => {
    publishEvent({ ...snap.event, notices: snap.event.notices.filter((n) => n.id !== id) });
  }, []);

  const markFlameStep = useCallback((id: string, done: boolean) => {
    publishEvent({
      ...snap.event,
      flame: snap.event.flame.map((s) => (s.id === id ? { ...s, done } : s)),
    });
  }, []);

  const setAward = useCallback((kind: "teamSpiritCountryId" | "mvpName", value: string) => {
    publishEvent({ ...snap.event, awards: { ...snap.event.awards, [kind]: value } });
  }, []);

  const value = useMemo(
    () => ({
      ready: current.ready,
      event,
      session,
      official: current.official,
      setLocale,
      join,
      enterVillage,
      setPhase,
      announce,
      startNextRound,
      startGolden,
      startFinal,
      startCeremony,
      lockScores,
      completeStation,
      loginOfficial,
      updateGame,
      resetDemo,
      dismissNotice,
      markFlameStep,
      setAward,
    }),
    [
      current.ready,
      current.official,
      event,
      session,
      setLocale,
      join,
      enterVillage,
      setPhase,
      announce,
      startNextRound,
      startGolden,
      startFinal,
      startCeremony,
      lockScores,
      completeStation,
      loginOfficial,
      updateGame,
      resetDemo,
      dismissNotice,
      markFlameStep,
      setAward,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useEvent() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useEvent must be used within EventProvider");
  return ctx;
}

export function useLocale(): Locale {
  const { session, event } = useEvent();
  return session?.locale || event.defaultLocale || "nl";
}

export { COUNTRY_TEAM_NUMBER };
