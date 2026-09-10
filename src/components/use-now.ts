"use client";

import { useSyncExternalStore } from "react";

let current = 0;
const listeners = new Set<() => void>();
let interval: number | null = null;

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (interval == null) {
    current = Date.now();
    interval = window.setInterval(() => {
      current = Date.now();
      listeners.forEach((l) => l());
    }, 250);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && interval != null) {
      window.clearInterval(interval);
      interval = null;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => current, () => 0);
}
