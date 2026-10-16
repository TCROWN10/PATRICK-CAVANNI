"use client";

import { useEffect, useRef, type RefObject } from "react";

export function MusicPlayer({
  src,
  start,
  onPlayingChange,
  audioRef,
}: {
  src: string;
  start: boolean;
  onPlayingChange?: (playing: boolean) => void;
  audioRef?: RefObject<HTMLAudioElement | null>;
}) {
  const localRef = useRef<HTMLAudioElement>(null);
  const ref = audioRef ?? localRef;

  useEffect(() => {
    const el = ref.current;
    if (!start || !el) return;
    if (el.volume === 1 || el.volume === 0) el.volume = 0.6;
    el.play().catch(() => {});
  }, [start, ref]);

  return (
    <audio
      ref={ref}
      src={src}
      loop
      preload="auto"
      onPlay={() => onPlayingChange?.(true)}
      onPause={() => onPlayingChange?.(false)}
    />
  );
}
