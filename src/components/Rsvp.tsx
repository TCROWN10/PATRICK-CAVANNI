"use client";

import { useState } from "react";
import { CheckIcon, CloseIcon } from "./icons";

type Answer = "yes" | "no";

export function Rsvp({ defaultName = "" }: { defaultName?: string }) {
  const [name, setName] = useState(defaultName);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckIcon size={26} />
        </div>
        <h3 className="section-title text-xl font-bold tracking-normal text-accent">
          {answer === "yes" ? "See you there!" : "Thank you for letting us know"}
        </h3>
        <p className="section-title mt-2 text-sm italic tracking-normal text-ink/70">
          We have received your response{name ? `, ${name}` : ""}.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setAnswer(null);
            setName(defaultName);
          }}
          className="mt-5 text-sm font-medium text-accent underline underline-offset-4"
        >
          Change my response
        </button>
      </div>
    );
  }

  const choice = (value: Answer, label: string, icon: React.ReactNode) => {
    const active = answer === value;
    return (
      <button
        type="button"
        onClick={() => setAnswer(value)}
        aria-pressed={active}
        className={`section-title flex items-center justify-center gap-2.5 rounded-2xl border-2 py-3.5 text-base italic tracking-normal transition ${
          active
            ? "border-accent bg-accent text-white shadow-md"
            : "border-black/10 bg-white text-ink hover:border-accent/40"
        }`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            active ? "bg-white/20" : "bg-black/5 text-ink/50"
          }`}
        >
          {icon}
        </span>
        {label}
      </button>
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (answer && name.trim()) setSubmitted(true);
      }}
    >
      <p className="section-title mb-3 italic tracking-normal">Will you attend? *</p>
      <div className="grid grid-cols-2 gap-3">
        {choice("yes", "Yes", <CheckIcon size={14} />)}
        {choice("no", "No", <CloseIcon size={14} />)}
      </div>

      {answer && (
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="rsvp-name" className="section-title mb-1.5 block text-sm italic tracking-normal">
              Full name *
            </label>
            <input
              id="rsvp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-2xl border-2 border-black/10 px-4 py-3 text-base outline-none transition focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-accent section-title w-full rounded-full py-3.5 italic tracking-normal disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send my response
          </button>
        </div>
      )}
    </form>
  );
}
