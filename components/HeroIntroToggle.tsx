// Toggleable hero intro text to keep the hero concise by default.
"use client";

import { useState } from "react";

type HeroIntroToggleProps = {
  shortText: string;
  fullText: string;
};

export default function HeroIntroToggle({ shortText, fullText }: HeroIntroToggleProps) {
  const [expanded, setExpanded] = useState(false);
  const displayText = expanded ? fullText : shortText;

  return (
    <div className="max-w-3xl text-lg leading-relaxed text-[rgba(248,244,246,0.85)]">
      <p>{displayText}</p>
      <button
        type="button"
        className="mt-2 inline-flex items-center text-sm font-semibold text-[rgba(243,168,184,0.95)] hover:text-white"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "See less" : "...See more"}
      </button>
    </div>
  );
}
