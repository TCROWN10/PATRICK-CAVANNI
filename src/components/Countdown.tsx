"use client";

import { useEffect, useState } from "react";

function remaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    Days: Math.floor(diff / 86_400_000),
    Hours: Math.floor(diff / 3_600_000) % 24,
    Minutes: Math.floor(diff / 60_000) % 60,
    Seconds: Math.floor(diff / 1000) % 60,
  };
}

export function Countdown({
  target,
  title,
}: {
  target: string;
  title: string;
}) {
  const time = new Date(target).getTime();
  const [parts, setParts] = useState<ReturnType<typeof remaining> | null>(
    null,
  );

  useEffect(() => {
    const tick = () => setParts(remaining(time));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [time]);

  return (
    <div className="relative z-10 w-full bg-white/80 py-5 backdrop-blur-md md:py-8">
      <h2 className="section-title mb-3 text-center text-base font-bold italic text-ink md:mb-5 md:text-2xl">
        {title}
      </h2>
      <div className="flex items-start justify-center gap-2.5 sm:gap-4 md:gap-6">
        {Object.entries(
          parts ?? { Days: 0, Hours: 0, Minutes: 0, Seconds: 0 },
        ).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="relative min-w-[3.25rem] overflow-hidden rounded-lg bg-white px-2.5 py-1.5 text-center shadow-md sm:min-w-[4rem] md:min-w-[5rem] md:rounded-xl md:px-4 md:py-2.5"
              style={{ perspective: 300 }}
            >
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-black/10" />
              <div
                key={parts ? value : "placeholder"}
                className="flip section-title text-2xl font-bold italic tabular-nums sm:text-3xl md:text-5xl"
              >
                {parts ? String(value).padStart(2, "0") : "--"}
              </div>
            </div>
            <span className="mt-1 text-xs md:mt-2 md:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
