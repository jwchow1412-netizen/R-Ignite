// Sticky timeline: vertical scroll drives horizontal translation (no progress bar).
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { timelineItems } from "@/lib/data";

export default function ScrollTimeline() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [scrollSpan, setScrollSpan] = useState(0);
  const [progress, setProgress] = useState(0);

  // Measure horizontal travel distance and set scroll span
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      const shift = Math.max(track.scrollWidth - section.clientWidth, 0);
      setMaxShift(shift);

      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      // Enough vertical distance to finish the horizontal travel while sticky
      setScrollSpan(Math.max(shift, viewportH * 1.5));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Map vertical scroll over the sticky span to 0–1 progress
  useEffect(() => {
    const handleScroll = () => {
      const sectionEl = sectionRef.current;
      if (!sectionEl) return;
      const start = sectionEl.offsetTop;
      const span = Math.max(scrollSpan || window.innerHeight, 1);
      const y = window.scrollY || window.pageYOffset;
      const raw = (y - start) / span;
      const clamped = Math.min(Math.max(raw, 0), 1);
      setProgress(clamped);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollSpan]);

  const items = useMemo(() => timelineItems, []);
  const translateX = -(progress * maxShift);

  return (
    // Outer wrapper: tall to allow entry/exit; no overflow to preserve sticky
    <section
      ref={sectionRef}
      className="relative"
      style={{ minHeight: `calc(160vh + ${scrollSpan}px)` }}
      aria-label="Timeline"
    >
      {/* Sticky viewport; overflow-hidden to prevent horizontal page scroll */}
      <div className="sticky top-0 flex h-screen flex-col justify-center bg-transparent px-4 py-20 md:px-6 md:py-24 overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
              Timeline
            </p>
            <h2 className="text-3xl font-bold text-white">Save the milestones</h2>
          </div>
          <p className="text-sm text-[rgba(248,244,246,0.75)]">Scroll to reveal what&apos;s next.</p>
        </div>

        <div className="relative mx-auto mt-12 max-w-6xl overflow-hidden">
          <div
            ref={trackRef}
            className="relative z-10 flex gap-6 transition-transform duration-75 ease-linear md:gap-5"
            style={{ transform: `translate3d(${translateX}px,0,0)`, willChange: "transform" }}
          >
            {items.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.title} className="relative min-w-[240px] flex-1">
                  <div
                    className={`glass-panel relative border bg-[rgba(255,255,255,0.05)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${
                      isEven
                        ? "md:-translate-y-6 border-[rgba(248,153,36,0.35)]"
                        : "md:translate-y-6 border-[rgba(217,63,67,0.35)]"
                    }`}
                  >
                    <div className="absolute left-1/2 top-[-28px] hidden h-7 w-[2px] -translate-x-1/2 rounded-full bg-[rgba(248,153,36,0.65)] md:block" />
                    <div className="absolute left-1/2 bottom-[-28px] hidden h-7 w-[2px] -translate-x-1/2 rounded-full bg-[rgba(217,63,67,0.55)] md:block" />
                    <span className="rounded-full bg-[rgba(248,153,36,0.2)] px-3 py-1 text-xs font-semibold text-white">
                      Coming Soon
                    </span>
                    <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm font-medium text-[rgba(248,244,246,0.8)]">{item.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
