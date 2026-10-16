"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  VolumeMuteIcon,
} from "./icons";

export type NavSection = { id: string; label: string; icon: ReactNode };

const fab =
  "flex h-11 w-11 items-center justify-center rounded-full shadow-lg ring-1 ring-black/5 backdrop-blur-md transition";
const idle = "bg-white/85 text-accent hover:bg-white";

export function FloatingNav({
  sections,
  music,
}: {
  sections: NavSection[];
  music?: {
    playing: boolean;
    volume: number;
    onToggle: () => void;
    onVolume: (value: number) => void;
  };
}) {
  const [open, setOpen] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 40);
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const s of sections) {
        const node = document.getElementById(s.id);
        if (node && node.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  useEffect(() => {
    if (!open && !volumeOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setVolumeOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setVolumeOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, volumeOpen]);

  function scrollToTop(el: HTMLElement) {
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 24, behavior: "smooth" });
  }

  function scrollToNext() {
    const next = sections
      .map((s) => document.getElementById(s.id))
      .find((el) => el && el.getBoundingClientRect().top > 32);
    if (next) scrollToTop(next);
    else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }

  function goTo(id: string) {
    const el = document.getElementById(id);
    if (el) scrollToTop(el);
  }

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-3 z-30 flex flex-col items-center gap-2.5 sm:right-5 md:bottom-8 md:right-8"
    >
      {music && (
        <div className="relative flex items-center">
          <div
            className={`absolute right-full mr-2 flex h-11 items-center overflow-hidden rounded-full bg-white/85 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 ${
              volumeOpen
                ? "w-32 px-3 opacity-100 sm:w-36"
                : "pointer-events-none w-0 px-0 opacity-0"
            }`}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={music.volume}
              onChange={(e) => music.onVolume(Number(e.target.value))}
              aria-label="Volume"
              tabIndex={volumeOpen ? 0 : -1}
              className="h-1.5 w-full cursor-pointer accent-accent"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (!volumeOpen) {
                setVolumeOpen(true);
                return;
              }
              music.onToggle();
            }}
            aria-label={
              !volumeOpen
                ? "Open volume"
                : music.playing
                  ? "Mute music"
                  : "Unmute music"
            }
            aria-expanded={volumeOpen}
            className={`relative ${fab} ${idle}`}
          >
            {music.playing && (
              <span className="absolute inset-0 animate-ping rounded-full border border-accent/40" />
            )}
            {music.playing ? <EqIcon /> : <VolumeMuteIcon />}
          </button>
        </div>
      )}

      <nav
        aria-label="Sections"
        inert={!open}
        className="flex flex-col items-center gap-2.5 [@media(max-height:640px)]:max-h-[calc(100dvh-8rem)] [@media(max-height:640px)]:overflow-y-auto"
      >
        {sections.map((s, i) => {
          const isActive = active === s.id;
          const delay = (sections.length - 1 - i) * 30;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id)}
              aria-label={s.label}
              aria-current={isActive ? "true" : undefined}
              style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
              className={`group relative ${fab} duration-300 ${
                open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0"
              } ${isActive ? "bg-accent text-white ring-2 ring-accent-soft" : idle}`}
            >
              {s.icon}
              <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink/85 px-3 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:block">
                {s.label}
              </span>
            </button>
          );
        })}
      </nav>

      {!open && !atEnd && (
        <button type="button" onClick={scrollToNext} aria-label="Scroll to next section" className={`${fab} ${idle}`}>
          <ChevronDownIcon />
        </button>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close section menu" : "Open section menu"}
        aria-expanded={open}
        className={`${fab} ${open ? "bg-accent text-white" : idle}`}
      >
        <span className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </span>
      </button>
    </div>
  );
}

function EqIcon() {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-full bg-current"
          style={{ animationDelay: `${i * 0.15}s`, height: "100%" }}
        />
      ))}
    </span>
  );
}
