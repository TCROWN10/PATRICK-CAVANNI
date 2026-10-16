"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  title: string;
  location: string;
  details: string;
  start: string;
  end: string;
};

const CLOSE_EVENT = "pc-calendar-close";

function toUtcStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function AddToCalendar({ title, location, details, start, end }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPeerClose = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== id) setOpen(false);
    };

    // Defer so the same click that opened the menu does not immediately close it.
    const timer = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointer);
    }, 0);
    document.addEventListener("keydown", onKey);
    document.addEventListener(CLOSE_EVENT, onPeerClose);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener(CLOSE_EVENT, onPeerClose);
    };
  }, [open, id]);

  function toggle() {
    setOpen((wasOpen) => {
      if (wasOpen) return false;
      document.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: id }));
      return true;
    });
  }

  const s = toUtcStamp(start);
  const e = toUtcStamp(end);

  const google = `https://calendar.google.com/calendar/render?${new URLSearchParams(
    { action: "TEMPLATE", text: title, dates: `${s}/${e}`, details, location },
  )}`;

  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?${new URLSearchParams(
    {
      subject: title,
      startdt: new Date(start).toISOString(),
      enddt: new Date(end).toISOString(),
      location,
      body: details,
      path: "/calendar/action/compose",
      rru: "addevent",
    },
  )}`;

  function downloadIcs() {
    const escape = (v: string) => v.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Patrick Cavanni//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${s}-patrickcavanni@invite`,
      `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
      `DTSTART:${s}`,
      `DTEND:${e}`,
      `SUMMARY:${escape(title)}`,
      `LOCATION:${escape(location)}`,
      `DESCRIPTION:${escape(details)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "patrick-cavanni-a-new-chapter.ics";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  const item =
    "block w-full px-4 py-2.5 text-left text-sm hover:bg-accent/10 transition";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="btn-accent section-title flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm italic tracking-normal"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add to Calendar
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        role="listbox"
        className={`absolute inset-x-0 z-20 mt-2 origin-top overflow-hidden rounded-2xl bg-white text-ink shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 scale-y-100 py-1 opacity-100"
            : "pointer-events-none -translate-y-1 scale-y-95 py-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <a href={google} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
          Google Calendar
        </a>
        <a href={outlook} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
          Outlook
        </a>
        <button type="button" onClick={downloadIcs} className={item}>
          Apple / Other (ICS)
        </button>
      </div>
    </div>
  );
}
