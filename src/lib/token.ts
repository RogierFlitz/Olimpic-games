const KEY = "flitz-bog-golden-token";

let found = false;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  found = window.localStorage.getItem(KEY) === "1";
  hydrated = true;
}

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeToken(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getTokenSnap() {
  hydrate();
  return found;
}

export function unlockGoldenToken() {
  hydrate();
  if (found) return false;
  found = true;
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
  emit();
  return true;
}

export function resetGoldenToken() {
  found = false;
  hydrated = true;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  emit();
}
