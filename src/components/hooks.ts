"use client";

import { useLocale as useLocaleFromStore } from "@/lib/store";
import { t as translate, loc as localize } from "@/lib/i18n";
import type { Locale, Localized } from "@/lib/types";
import { useNow as useNowClock } from "./use-now";

export function useNow() {
  return useNowClock();
}

export function useLocale() {
  return useLocaleFromStore();
}

export function t(locale: Locale, key: Parameters<typeof translate>[1], vars?: Record<string, string | number>) {
  return translate(locale, key, vars);
}

export function loc(locale: Locale, value: Localized) {
  return localize(locale, value);
}
