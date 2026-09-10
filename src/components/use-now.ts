"use client";

import { useSyncExternalStore } from "react";

export function useNow(ms = 250) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const id = window.setInterval(onStoreChange, ms);
      return () => clearInterval(id);
    },
    () => Date.now(),
    () => 0,
  );
}
