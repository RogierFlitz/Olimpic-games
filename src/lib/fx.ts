let goPlayed = false;

export function playGoCue() {
  if (goPlayed || typeof window === "undefined") return;
  goPlayed = true;
  if (navigator.vibrate) navigator.vibrate([40, 40, 90, 40, 140]);
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const beep = (freq: number, start: number, dur: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, now + start);
      g.gain.exponentialRampToValueAtTime(0.09, now + start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      o.start(now + start);
      o.stop(now + start + dur);
    };
    beep(523, 0, 0.12);
    beep(784, 0.14, 0.22);
  } catch {
    /* ignore */
  }
}

export function playStampCue() {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(18);
}

export function resetGoCue() {
  goPlayed = false;
}
