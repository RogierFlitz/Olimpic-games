"use client";

import { useEffect, useState } from "react";
import { t, useLocale } from "./hooks";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);
  return null;
}

export function InstallHint() {
  const locale = useLocale();
  const [show, setShow] = useState(false);
  const [promptEvent, setPromptEvent] = useState<{ prompt: () => Promise<void> } | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("flitz-install-dismissed");
    if (dismissed) return;
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as unknown as { prompt: () => Promise<void> });
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const tmr = ios ? window.setTimeout(() => setShow(true), 12000) : undefined;
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (tmr) clearTimeout(tmr);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-gold/30 bg-navy-2 px-4 py-2">
      <p className="font-cond text-[11px] tracking-[0.12em] text-gold">{t(locale, "addHome")}</p>
      <button
        className="font-cond text-[11px] tracking-[0.12em] text-white/50"
        onClick={() => {
          sessionStorage.setItem("flitz-install-dismissed", "1");
          setShow(false);
        }}
      >
        {t(locale, "later")}
      </button>
      {promptEvent ? (
        <button className="font-cond text-[11px] tracking-[0.12em] text-orange" onClick={() => promptEvent.prompt()}>
          OK
        </button>
      ) : null}
    </div>
  );
}
