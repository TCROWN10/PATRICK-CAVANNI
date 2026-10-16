"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type MusicHandle = {
  /** Call inside a user gesture (e.g. Open invitation) so iOS allows audio + volume. */
  unlockAndPlay: () => void;
  toggle: () => void;
  setVolume: (value: number) => void;
};

/**
 * Volume is controlled with Web Audio GainNode so it works on iOS
 * (Safari ignores HTMLAudioElement.volume).
 */
export const MusicPlayer = forwardRef<
  MusicHandle,
  {
    src: string;
    volume: number;
    onPlayingChange?: (playing: boolean) => void;
  }
>(function MusicPlayer({ src, volume, onPlayingChange }, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  function ensureGraph() {
    const el = audioRef.current;
    if (!el) return;

    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const source = ctx.createMediaElementSource(el);
      const gain = ctx.createGain();
      gain.gain.value = clamp(volume);
      source.connect(gain);
      gain.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = gain;
      // HTML volume stays at 1; loudness is the gain node.
      el.volume = 1;
    }

    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
  }

  function applyVolume(value: number) {
    const v = clamp(value);
    if (gainRef.current) {
      gainRef.current.gain.value = v;
    } else if (audioRef.current) {
      // Before the graph exists (desktop), native volume still works.
      audioRef.current.volume = v;
    }
  }

  useImperativeHandle(ref, () => ({
    unlockAndPlay: () => {
      ensureGraph();
      applyVolume(volume);
      void audioRef.current?.play().catch(() => {});
    },
    toggle: () => {
      const el = audioRef.current;
      if (!el) return;
      if (el.paused) {
        ensureGraph();
        void el.play().catch(() => {});
      } else {
        el.pause();
      }
    },
    setVolume: (value: number) => {
      ensureGraph();
      applyVolume(value);
    },
  }));

  useEffect(() => {
    applyVolume(volume);
  }, [volume]);

  return (
    <audio
      ref={audioRef}
      src={src}
      loop
      preload="auto"
      playsInline
      onPlay={() => onPlayingChange?.(true)}
      onPause={() => onPlayingChange?.(false)}
    />
  );
});

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}
