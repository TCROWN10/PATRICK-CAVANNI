"use client";

import { useEffect, useRef, useState } from "react";
import { invite } from "@/lib/invite";
import { AddToCalendar } from "./AddToCalendar";

const shortDate = new Date(invite.startsAt).toLocaleDateString("en-US", {
  timeZone: "Africa/Lagos",
  month: "short",
  day: "numeric",
});

/** How long each open/closed pose is held (ms). */
const HOLD_MS = 2800;
/** CSS transition duration — keep in sync with the class below. */
const MOVE_MS = 1400;

export function SaveInvite({
  walletEnabled,
  guestCode,
  guestName,
  location,
}: {
  walletEnabled: boolean;
  guestCode?: string;
  guestName?: string;
  location: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [fanned, setFanned] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.4),
      { threshold: [0, 0.4, 0.7, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hovering) return;
    // Start by opening shortly after the section appears.
    const first = window.setTimeout(() => setFanned(true), 400);
    const id = window.setInterval(() => {
      setFanned((open) => !open);
    }, HOLD_MS + MOVE_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [inView, hovering]);

  const open = hovering || fanned;
  const walletHref = `/api/wallet${guestCode ? `?code=${encodeURIComponent(guestCode)}` : ""}`;
  const backCard =
    "absolute inset-0 rounded-2xl shadow-lg transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div className="text-center">
      <h2 className="section-title text-xl font-bold tracking-normal md:text-2xl">
        Save your invitation
      </h2>
      <p className="section-title mt-1 text-sm italic tracking-normal text-ink/60">
        Have it on your phone, ready for the big day.
      </p>

      <div
        ref={ref}
        role="img"
        aria-label="Invitation pass preview"
        className="relative mx-auto mb-12 mt-8 h-44 w-56 sm:h-48 sm:w-64"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className={`${backCard} bg-gradient-to-br from-accent to-[#a8324f] ${
            open ? "-translate-x-9 translate-y-3 -rotate-[10deg] sm:-translate-x-12" : "translate-x-0 translate-y-0 rotate-0"
          }`}
        >
          <div className="absolute bottom-3 left-3 flex h-4 gap-[2px] opacity-50">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="w-[2px] bg-white" />
            ))}
          </div>
        </div>
        <div
          className={`${backCard} bg-gradient-to-br from-[#e2c376] to-accent-soft ${
            open ? "translate-x-9 translate-y-3 rotate-[10deg] sm:translate-x-12" : "translate-x-0 translate-y-0 rotate-0"
          }`}
        />
        <div className="absolute inset-0 flex flex-col rounded-2xl bg-white p-4 text-left shadow-xl ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <span className="section-title text-[10px] font-bold uppercase italic tracking-wide text-ink/70">
              {walletEnabled ? "Google Wallet" : "Your invite"}
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </div>
          <div className="mt-auto text-center">
            <p className="section-title truncate text-sm font-bold italic tracking-normal">{invite.title}</p>
            <p className="section-title text-xs italic tracking-normal text-ink/60">
              {guestName ? `${guestName} · ${shortDate}` : shortDate}
            </p>
          </div>
          <div className="mt-auto flex h-7 items-stretch gap-[3px] overflow-hidden rounded-sm">
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} className="flex-1 bg-accent/80" style={{ opacity: i % 3 === 0 ? 0.55 : 1 }} />
            ))}
          </div>
        </div>
      </div>

      {walletEnabled ? (
        <a
          href={walletHref}
          className="section-title inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm italic tracking-normal text-white shadow-lg transition hover:bg-black/85"
        >
          <WalletIcon /> Add to Google Wallet
        </a>
      ) : (
        <div className="mx-auto max-w-xs">
          <AddToCalendar
            title={invite.title}
            location={location}
            details={invite.tagline}
            start={invite.startsAt}
            end={invite.endsAt}
          />
        </div>
      )}
    </div>
  );
}

function WalletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7a2 2 0 012-2h13v4" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M16 13.5h2" />
    </svg>
  );
}
