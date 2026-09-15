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
