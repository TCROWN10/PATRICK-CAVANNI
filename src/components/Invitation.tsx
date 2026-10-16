"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { invite } from "@/lib/invite";
import { AddToCalendar } from "./AddToCalendar";
import { Countdown } from "./Countdown";
import { FloatingNav, type NavSection } from "./FloatingNav";
import { HeroSlideshow } from "./HeroSlideshow";
import { MusicPlayer, type MusicHandle } from "./MusicPlayer";
import { Reveal } from "./Reveal";
import { Rsvp } from "./Rsvp";
import { SaveInvite } from "./SaveInvite";
import { ScrollProgress } from "./ScrollProgress";
import { Sparkles } from "./Sparkles";
import {
  BookIcon,
  CalendarIcon,
  ClockIcon,
  ExternalIcon,
  HeartIcon,
  MailCheckIcon,
  MapIcon,
  PinIcon,
  TicketIcon,
} from "./icons";

const lagos = { timeZone: "Africa/Lagos" } as const;
const eventDate = new Date(invite.startsAt);
const dateLabel = eventDate.toLocaleDateString("en-US", {
  ...lagos,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});
const timeLabel = eventDate.toLocaleTimeString("en-US", {
  ...lagos,
  hour: "numeric",
  minute: "2-digit",
});
const fullAddress = `${invite.venue}, ${invite.venueAddress}`;
const mapQuery = encodeURIComponent(fullAddress);

export type GuestInfo = { code: string; name: string; message: string };

export function Invitation({
  guest,
  walletEnabled = false,
}: {
  guest?: GuestInfo;
  walletEnabled?: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [gateGone, setGateGone] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.6);
  const musicRef = useRef<MusicHandle>(null);

  useEffect(() => {
    document.body.style.overflow = gateGone ? "" : "hidden";
  }, [gateGone]);

  function open() {
    setOpened(true);
    // Must run in the same tap as "Open invitation" so iOS unlocks audio + volume.
    musicRef.current?.unlockAndPlay();
    setTimeout(() => setGateGone(true), 700);
  }

  function toggleMusic() {
    musicRef.current?.toggle();
  }

  function changeVolume(value: number) {
    setMusicVolume(value);
    musicRef.current?.setVolume(value);
  }

  const hasNote = Boolean(guest?.message);
  const sections = useMemo<NavSection[]>(
    () => [
      ...(hasNote ? [{ id: "note", label: "A note for you", icon: <HeartIcon /> }] : []),
      { id: "story", label: "The Invitation", icon: <BookIcon /> },
      { id: "date", label: "Date and Time", icon: <CalendarIcon /> },
      { id: "location", label: "Location", icon: <PinIcon /> },
      { id: "rsvp", label: "Confirm Your Attendance", icon: <MailCheckIcon /> },
      { id: "save", label: "Save your invitation", icon: <TicketIcon /> },
    ],
    [hasNote],
  );

  return (
    <main className="relative min-h-dvh overflow-x-hidden">
      {invite.music && (
        <MusicPlayer
          ref={musicRef}
          src={invite.music}
          volume={musicVolume}
          onPlayingChange={setMusicPlaying}
        />
      )}
      {gateGone && <ScrollProgress />}
      {gateGone && (
        <FloatingNav
          sections={sections}
          music={
            invite.music
              ? {
                  playing: musicPlaying,
                  volume: musicVolume,
                  onToggle: toggleMusic,
                  onVolume: changeVolume,
                }
              : undefined
          }
        />
      )}

      {!gateGone && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center ${opened ? "gate-out" : ""}`}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[5px]" />
          <Sparkles />
          <div className="absolute inset-x-4 top-1/2 mx-auto max-w-md -translate-y-1/2 rounded-2xl bg-white/90 px-6 py-7 text-center shadow-2xl backdrop-blur-md sm:px-10 sm:py-9 md:max-w-xl">
            <BrandLogo className="mx-auto mb-4 h-24 w-auto sm:h-28" preload />
            {guest && (
              <p className="section-title mb-1 text-base italic tracking-normal text-accent sm:text-lg">
                Dear {guest.name},
              </p>
            )}
            <p className="section-title text-lg font-bold tracking-normal text-ink sm:text-xl md:text-2xl">
              {invite.greeting}
            </p>
            <h1 className="section-title mt-2 text-3xl font-bold leading-tight tracking-normal text-accent sm:text-4xl">
              {invite.eventName}
            </h1>
            <p className="section-title mt-3 text-sm italic tracking-normal text-ink/70">
              {invite.tagline}
            </p>
            <button
              type="button"
              onClick={open}
              className="btn-accent section-title mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm italic tracking-normal sm:px-12"
            >
              <span aria-hidden>✨</span> {invite.openButton}
            </button>
          </div>
        </div>
      )}

      <section className="relative flex min-h-dvh flex-col">
        <div className="relative min-h-[60vh] flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_center,#4a1426_0%,#1c070e_55%,#000_100%)]">
          <HeroSlideshow photos={invite.heroes} opened={opened} />
          <FrameCorners />
          <Sparkles count={16} />
          <div className="absolute inset-0 flex flex-col items-center justify-between px-6 pb-10 pt-8 text-center sm:pb-14 sm:pt-10 lg:w-1/2 lg:justify-center lg:py-0">
            <BrandLogo
              className="h-24 w-auto drop-shadow-[0_8px_30px_rgba(201,162,74,0.25)] sm:h-32 lg:h-72"
              preload
            />
            <div
              className={`transition-all delay-300 duration-1000 lg:mt-8 ${
                opened ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              <p className="section-title text-xs uppercase tracking-[0.35em] text-accent-soft sm:text-sm">
                {invite.eventName}
              </p>
              <p className="section-title mt-3 text-xl italic tracking-normal text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] sm:text-2xl md:text-3xl">
                {invite.tagline}
              </p>
            </div>
          </div>
        </div>
        <Countdown target={invite.startsAt} title={invite.countdownTitle} />
      </section>

      <div className="mx-auto w-full max-w-3xl space-y-12 px-3 pb-10 pt-10 sm:px-6 md:pt-14 lg:max-w-5xl lg:px-8">
        {guest?.message && (
          <Reveal>
            <Card id="note" title={`A note for you, ${guest.name}`} icon={<HeartIcon />}>
              <p className="section-title whitespace-pre-line text-center text-lg italic leading-relaxed tracking-normal md:text-xl">
                {guest.message}
              </p>
            </Card>
          </Reveal>
        )}

        <Reveal>
          <section id="story" className="card scroll-mt-10 px-5 py-8 text-center md:px-12 md:py-12">
            <h2 className="section-title mb-5 text-xl font-bold md:text-2xl">{invite.house.title}</h2>
            <div className="section-title mx-auto max-w-2xl space-y-4 text-lg italic leading-relaxed tracking-normal md:text-xl">
              {invite.house.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <GoldRule />

            <h3 className="section-title text-base font-bold uppercase tracking-[0.12em] text-accent md:text-lg">
              {invite.house.chapterTitle}
            </h3>
            <p className="section-title mx-auto mt-3 max-w-2xl text-base italic leading-relaxed tracking-normal text-ink/80 md:text-lg">
              {invite.house.chapter}
            </p>

            <GoldRule />

            <p className="section-title text-xs uppercase tracking-[0.28em] text-accent-soft">
              {invite.tetheredLines.subtitle}
            </p>
            <h3 className="section-title mt-2 text-xl font-bold md:text-2xl">{invite.tetheredLines.title}</h3>
            <div className="section-title mx-auto mt-4 max-w-2xl space-y-4 text-lg italic leading-relaxed tracking-normal md:text-xl">
              {invite.tetheredLines.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Quote>{invite.tetheredLines.quote}</Quote>

            <GoldRule />

            <div className="mx-auto flex h-28 w-20 items-center justify-center md:h-36 md:w-28">
              <Image
                src={invite.crane.src}
                alt="The Patrick Cavanni crowned crane emblem"
                width={invite.crane.width}
                height={invite.crane.height}
                sizes="112px"
                className="h-full w-auto"
              />
            </div>
            <p className="section-title mt-3 text-xs uppercase tracking-[0.28em] text-accent-soft">
              {invite.crownedCrane.subtitle}
            </p>
            <h3 className="section-title mt-2 text-xl font-bold md:text-2xl">{invite.crownedCrane.title}</h3>
            <div className="section-title mx-auto mt-4 max-w-2xl space-y-4 text-lg italic leading-relaxed tracking-normal md:text-xl">
              {invite.crownedCrane.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Quote>{invite.crownedCrane.quote}</Quote>
          </section>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 md:gap-6 lg:gap-8">
          <Reveal>
            <Card id="date" title="Date and Time" icon={<CalendarIcon />} className="h-full">
              <div className="space-y-3">
                <DetailRow icon={<CalendarIcon size={16} />}>{dateLabel}</DetailRow>
                <DetailRow icon={<ClockIcon size={16} />}>{timeLabel}</DetailRow>
              </div>
              <div className="mt-5">
                <AddToCalendar
                  title={`${invite.title}: ${invite.eventName}`}
                  location={fullAddress}
                  details={invite.tagline}
                  start={invite.startsAt}
                  end={invite.endsAt}
                />
              </div>
            </Card>
          </Reveal>

          <Reveal>
            <Card id="location" title="Location" icon={<PinIcon />} className="h-full">
              <DetailRow icon={<PinIcon size={16} />}>
                <span className="block text-sm font-bold not-italic uppercase tracking-wide text-accent">
                  {invite.venue}
                </span>
                <span className="block text-base">{invite.venueAddress}</span>
              </DetailRow>
              <button
                type="button"
                onClick={() => setShowMap((s) => !s)}
                aria-expanded={showMap}
                className="btn-accent section-title mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm italic tracking-normal"
              >
                <MapIcon size={16} /> {showMap ? "Hide map" : "View map"}
              </button>
              {showMap && (
                <>
                  <iframe
                    title="Event location map"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    loading="lazy"
                    className="mt-4 h-60 w-full rounded-2xl border-0 md:h-64"
                  />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="section-title mt-3 flex items-center justify-center gap-1.5 text-sm italic tracking-normal text-accent underline underline-offset-4"
                  >
                    Open in Google Maps <ExternalIcon size={14} />
                  </a>
                </>
              )}
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <Card id="rsvp" title="Confirm Your Attendance" icon={<MailCheckIcon />}>
            <Rsvp defaultName={guest?.name} />
          </Card>
        </Reveal>

        <Reveal>
          <section id="save" className="card relative scroll-mt-10 px-5 pb-8 pt-10 md:px-8">
            <Badge>
              <TicketIcon />
            </Badge>
            <SaveInvite
              walletEnabled={walletEnabled}
              guestCode={guest?.code}
              guestName={guest?.name}
              location={fullAddress}
            />
          </section>
        </Reveal>

      </div>
    </main>
  );
}

function BrandLogo({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src={invite.logo.src}
      alt={invite.brand}
      width={invite.logo.width}
      height={invite.logo.height}
      sizes="(min-width: 768px) 300px, 240px"
      loading={preload ? "eager" : "lazy"}
      className={className}
    />
  );
}

function FrameCorners() {
  const corner = "absolute h-6 w-6 border-accent-soft/80 md:h-8 md:w-8";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 md:inset-5">
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

function GoldRule() {
  return (
    <div aria-hidden className="mx-auto my-7 flex max-w-xs items-center gap-3">
      <span className="h-px flex-1 bg-accent-soft/60" />
      <span className="h-1.5 w-1.5 rotate-45 bg-accent-soft" />
      <span className="h-px flex-1 bg-accent-soft/60" />
    </div>
  );
}

function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="section-title mt-6 border-l-2 border-accent-soft pl-4 text-base font-bold italic leading-relaxed tracking-normal text-accent md:text-lg">
      {children}
    </blockquote>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#a8324f] text-white shadow-lg ring-4 ring-page md:left-8">
      {children}
    </div>
  );
}

function Card({
  id,
  title,
  subtitle,
  icon,
  children,
  className = "",
}: {
  id: string;
  title: string;
  subtitle?: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`card relative scroll-mt-10 px-5 pb-6 pt-10 md:px-8 md:pb-8 ${className}`}>
      <Badge>{icon}</Badge>
      <h2 className="section-title flex items-center gap-2 text-xl font-bold tracking-normal md:text-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="section-title mt-1 text-sm italic tracking-normal text-accent">{subtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        {icon}
      </span>
      <div className="section-title text-lg italic leading-snug tracking-normal">{children}</div>
    </div>
  );
}
