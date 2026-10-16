"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "./icons";

type Photo = { src: string; alt: string };

const SLIDE_MS = 5000;

export function Gallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = photos.length;

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + count) % count),
    [count],
  );

  useEffect(() => {
    if (zoomed) return;
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [go, zoomed, index]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed, go]);

  const swipe = {
    onTouchStart: (e: React.TouchEvent) => {
      touchX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touchX.current = null;
    },
  };

  return (
    <>
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ink sm:aspect-[4/3] md:aspect-[16/10]"
        {...swipe}
      >
        {photos.map((p, i) => (
          <div
            key={p.src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image src={p.src} alt="" fill sizes="160px" className="scale-110 object-cover blur-2xl brightness-[0.6]" />
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 60vw, 100vw"
              className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            />
          </div>
        ))}

        <button
          type="button"
          aria-label="Enlarge photo"
          onClick={() => setZoomed(true)}
          className="absolute inset-0 z-[1] cursor-zoom-in"
        />

        <div className="absolute inset-x-3 top-3 z-[2] flex gap-1.5">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/45"
            >
              <span
                key={i === index ? `active-${index}` : `idle-${i}`}
                className={`block h-full rounded-full bg-white ${
                  i < index ? "w-full" : i === index && !zoomed ? "story-fill" : "w-0"
                }`}
                style={{ animationDuration: `${SLIDE_MS}ms` }}
              />
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="pointer-events-none absolute bottom-3 right-3 z-[2] rounded-full bg-black/45 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
          {index + 1} / {count}
        </div>
      </div>

      <div
        className="mx-auto mt-3 grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.min(count, 4)}, minmax(0, 1fr))`, maxWidth: count < 4 ? `${count * 9}rem` : undefined }}
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`relative aspect-square overflow-hidden rounded-xl transition ${
              i === index ? "ring-[3px] ring-accent" : "opacity-80 hover:opacity-100"
            }`}
          >
            <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 220px, 25vw" className="object-cover" />
          </button>
        ))}
      </div>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
          {...swipe}
        >
          <div className="relative h-full max-h-[88vh] w-full max-w-4xl">
            <Image src={photos[index].src} alt={photos[index].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <CloseIcon />
          </button>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
              ‹
            </button>
            <span className="text-sm text-white/80">
              {index + 1} / {count}
            </span>
            <button type="button" aria-label="Next photo" onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25">
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
