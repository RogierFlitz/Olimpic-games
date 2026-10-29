"use client";

import { useId } from "react";

export function Flame({ size = 72 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 80" className="flame-anim drop-shadow-[0_0_18px_rgba(236,102,8,.65)]">
      <defs>
        <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#F3D36A" />
          <stop offset="45%" stopColor="#FF7A18" />
          <stop offset="100%" stopColor="#EC6608" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M32 2c8 14 6 22-2 30 14-4 24 6 24 20 0 16-12 26-24 26S8 68 8 52c0-14 8-24 16-28-10-4-14-14-8-28 6 8 12 8 16 6Z"
      />
      <path fill="#F7F4EE" opacity=".35" d="M32 38c6 4 10 10 10 18 0 8-5 14-10 14s-10-6-10-14c0-7 4-13 10-18Z" />
    </svg>
  );
}

export function Confetti({ run }: { run: boolean }) {
  if (!run) return null;
  const bits = Array.from({ length: 56 }, (_, i) => ({
    id: i,
    left: `${(i * 17) % 100}%`,
    delay: `${(i % 10) * 0.08}s`,
    color: ["#EC6608", "#E0B422", "#F7F4EE", "#A71680", "#FF7A18"][i % 5],
    w: 6 + (i % 5),
    h: 10 + (i % 6),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute -top-4 rounded-[1px]"
          style={{
            left: b.left,
            width: b.w,
            height: b.h,
            background: b.color,
            animation: `confetti-fall ${2.4 + (b.id % 5) * 0.2}s linear ${b.delay} forwards`,
          }}
        />
      ))}
    </div>
  );
}

export function Medal({ place, size = 56 }: { place: 1 | 2 | 3; size?: number }) {
  const fill = place === 1 ? "#E0B422" : place === 2 ? "#C9D0D8" : "#C47A3A";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d="M20 8h10l2 12H22L20 8Zm14 0h10l-2 12H36l-2-12Z" fill="#EC6608" />
      <circle cx="32" cy="40" r="18" fill={fill} />
      <circle cx="32" cy="40" r="13" fill="none" stroke="#071018" strokeWidth="2" opacity=".35" />
      <text x="32" y="46" textAnchor="middle" fontSize="16" fontFamily="var(--font-bebas)" fill="#071018">
        {place}
      </text>
    </svg>
  );
}

export function Stamp({
  label,
  icon,
  muted = false,
}: {
  label: string;
  icon?: string;
  muted?: boolean;
}) {
  return (
    <div className={`stamp ${muted ? "opacity-25 grayscale" : ""}`} title={label}>
      <span className="leading-none">{icon ?? label.slice(0, 2)}</span>
    </div>
  );
}

export function RaceBar({ value, max, hot = false }: { value: number; max: number; hot?: boolean }) {
  const w = max <= 0 ? 0 : Math.max(8, (value / max) * 100);
  return (
    <div className="rank-bar mt-2">
      <span style={{ width: `${w}%`, background: hot ? "linear-gradient(90deg,#fff,#f3d36a)" : undefined }} />
    </div>
  );
}

export function FlagWave({ flag, size = "text-6xl" }: { flag: string; size?: string }) {
  return <span className={`flag-wave inline-block origin-bottom ${size}`}>{flag}</span>;
}

export function VsStrip({
  left,
  right,
}: {
  left: { flag: string; code: string };
  right: { flag: string; code: string }[];
}) {
  return (
    <div className="vs-strip flex items-center justify-center gap-3">
      <span className="font-display text-3xl">
        {left.flag} {left.code}
      </span>
      <span className="font-display text-2xl text-gold">VS</span>
      <span className="font-display text-3xl">
        {right.length ? right.map((r) => `${r.flag} ${r.code}`).join("  ") : "—"}
      </span>
    </div>
  );
}

export function Podium({
  gold,
  silver,
  bronze,
}: {
  gold?: { flag: string; name: string; points: number };
  silver?: { flag: string; name: string; points: number };
  bronze?: { flag: string; name: string; points: number };
}) {
  return (
    <div className="mt-8 flex items-end justify-center gap-2">
      <div className="flex w-[30%] flex-col items-center">
        {silver ? (
          <>
            <p className="text-3xl">{silver.flag}</p>
            <Medal place={2} size={40} />
            <p className="mt-1 font-display text-xl leading-none">{silver.name}</p>
          </>
        ) : (
          <p className="mb-2 font-display text-3xl text-white/20">2</p>
        )}
        <div className="mt-2 flex h-24 w-full items-end justify-center rounded-t-2xl bg-white/15 pb-3">
          <p className="font-display text-2xl">{silver?.points ?? ""}</p>
        </div>
      </div>
      <div className="flex w-[36%] flex-col items-center">
        {gold ? (
          <>
            <p className="text-4xl">{gold.flag}</p>
            <Medal place={1} size={56} />
            <p className="mt-1 font-display text-2xl leading-none">{gold.name}</p>
          </>
        ) : (
          <p className="mb-2 font-display text-4xl text-white/20">1</p>
        )}
        <div className="mt-2 flex h-36 w-full items-end justify-center rounded-t-2xl bg-gold pb-3 text-navy">
          <p className="font-display text-3xl">{gold?.points ?? ""}</p>
        </div>
      </div>
      <div className="flex w-[30%] flex-col items-center">
        {bronze ? (
          <>
            <p className="text-3xl">{bronze.flag}</p>
            <Medal place={3} size={40} />
            <p className="mt-1 font-display text-xl leading-none">{bronze.name}</p>
          </>
        ) : (
          <p className="mb-2 font-display text-3xl text-white/20">3</p>
        )}
        <div className="mt-2 flex h-16 w-full items-end justify-center rounded-t-2xl bg-white/10 pb-3">
          <p className="font-display text-2xl">{bronze?.points ?? ""}</p>
        </div>
      </div>
    </div>
  );
}
