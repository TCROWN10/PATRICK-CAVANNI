"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photo = { src: string; alt: string };

const SLIDE_MS = 5000;

export function HeroSlideshow({
  photos,
  opened,
}: {
  photos: Photo[];
  opened: boolean;
}) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(id);
  }, [count]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-28 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%)] sm:top-40 lg:inset-y-0 lg:left-auto lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent,black_35%)]">
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={i === index ? p.alt : ""}
          fill
          loading={i === 0 ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className={`object-cover object-[50%_22%] transition-[opacity,transform] duration-[1.4s] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          } ${opened ? "scale-100" : "scale-105"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-55% to-black/90 lg:bg-none lg:bg-black/10" />
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 z-[1] flex -translate-x-1/2 gap-1.5 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-accent-soft" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
