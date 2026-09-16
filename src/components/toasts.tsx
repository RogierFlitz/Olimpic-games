"use client";

import { useSyncExternalStore } from "react";
import { useEvent } from "@/lib/store";
import { loc, t, useLocale } from "./hooks";
import { useNow } from "./use-now";

export function Toasts() {
  const { event, dismissNotice } = useEvent();
  const locale = useLocale();
  const now = useNow();
  const latest = event.notices.at(-1);
  if (!latest || now - latest.at > 7000) return null;

  return (
    <button
      onClick={() => dismissNotice(latest.id)}
      className="fixed left-1/2 top-[max(16px,env(safe-area-inset-top))] z-50 w-[min(92%,400px)] -translate-x-1/2 rounded-2xl border border-gold/40 bg-navy-2/95 p-4 text-left shadow-2xl backdrop-blur"
    >
      <p className="font-cond text-[11px] tracking-[0.22em] text-gold">
        {loc(locale, latest.title)}
      </p>
      <p className="mt-1 text-[15px] font-semibold">{loc(locale, latest.body)}</p>
      <p className="mt-2 font-cond text-[10px] tracking-[0.16em] text-white/40">
        {t(locale, "live")}
      </p>
    </button>
  );
}

export function OfflineBanner() {
  const locale = useLocale();
  const online = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("online", onStoreChange);
      window.addEventListener("offline", onStoreChange);
      return () => {
        window.removeEventListener("online", onStoreChange);
        window.removeEventListener("offline", onStoreChange);
      };
    },
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <div className="bg-orange px-4 py-2 text-center font-cond text-[12px] tracking-[0.14em] text-white">
      {t(locale, "offline")}
    </div>
  );
}
