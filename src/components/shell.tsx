"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, useLocale } from "./hooks";

export function Phone({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="phone-shell grain relative min-h-dvh md:flex md:justify-center md:py-6">
      <div
        className={`relative mx-auto flex min-h-dvh w-full flex-col overflow-hidden ${
          wide ? "md:max-w-[980px]" : "md:max-w-[430px]"
        } md:min-h-[844px] md:rounded-[36px] md:border md:border-white/10 md:shadow-[0_30px_80px_rgba(0,0,0,.55)]`}
      >
        {children}
      </div>
    </div>
  );
}

export function Cta({
  children,
  href,
  onClick,
  ghost = false,
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  ghost?: boolean;
  type?: "button" | "submit";
}) {
  const className = `cta ${ghost ? "cta-ghost" : ""}`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const items = [
    { href: "/village", label: t(locale, "navHome"), icon: HomeIcon },
    { href: "/village/games", label: t(locale, "navGames"), icon: GamesIcon },
    { href: "/village/ranking", label: t(locale, "navRanking"), icon: RankIcon },
    { href: "/village/map", label: t(locale, "navMap"), icon: MapIcon },
    { href: "/village/team", label: t(locale, "navTeam"), icon: TeamIcon },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-white/10 bg-[#071018]/92 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === "/village"
              ? pathname === "/village"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 text-[10px] font-cond tracking-[0.16em] ${
                  active ? "text-orange" : "text-white/55"
                }`}
              >
                <item.icon active={active} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
        stroke={active ? "#EC6608" : "currentColor"}
        strokeWidth="1.8"
      />
    </svg>
  );
}
function GamesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="8" r="3" stroke={active ? "#EC6608" : "currentColor"} strokeWidth="1.8" />
      <circle cx="16" cy="16" r="3" stroke={active ? "#EC6608" : "currentColor"} strokeWidth="1.8" />
      <path d="M10.2 10.2 13.8 13.8" stroke={active ? "#E0B422" : "currentColor"} strokeWidth="1.8" />
    </svg>
  );
}
function RankIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 20V10h4v10H5Zm5 0V4h4v16h-4Zm5 0v-7h4v7h-4Z" fill={active ? "#E0B422" : "currentColor"} />
    </svg>
  );
}
function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7.5 9 5l6 2.5L20 5v12.5L15 20l-6-2.5L4 20V7.5Z"
        stroke={active ? "#EC6608" : "currentColor"}
        strokeWidth="1.8"
      />
    </svg>
  );
}
function TeamIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="9" r="3" stroke={active ? "#EC6608" : "currentColor"} strokeWidth="1.8" />
      <circle cx="16" cy="10" r="2.4" stroke={active ? "#EC6608" : "currentColor"} strokeWidth="1.8" />
      <path d="M4 19c.6-3 2.8-5 5-5s4.4 2 5 5" stroke={active ? "#EC6608" : "currentColor"} strokeWidth="1.8" />
    </svg>
  );
}

export function StatusPill({
  status,
}: {
  status: "completed" | "now" | "up_next" | "locked";
}) {
  const locale = useLocale();
  const map = {
    completed: { label: t(locale, "completed"), className: "bg-white/10 text-sand" },
    now: { label: t(locale, "now"), className: "bg-orange text-white" },
    up_next: { label: t(locale, "upNext"), className: "bg-gold text-navy" },
    locked: { label: t(locale, "locked"), className: "bg-white/8 text-white/40" },
  };
  const item = map[status];
  return (
    <span className={`rounded-full px-2.5 py-1 font-cond text-[11px] tracking-[0.16em] ${item.className}`}>
      {item.label}
    </span>
  );
}

export function LiveDot() {
  return (
    <span className="relative mr-1 inline-flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-70" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
    </span>
  );
}
