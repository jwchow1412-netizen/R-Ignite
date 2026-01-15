"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { timelineItems } from "@/lib/data";

export default function ScrollTimeline() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Measure the total width of the track to determine how far to scroll
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;

      const parentWidth = track.parentElement?.clientWidth || window.innerWidth;
      const trackWidth = track.scrollWidth;

      // Calculate max shift needed to see the very end.
      // Add a small buffer to ensure the last item is fully revealed.
      const shift = Math.max(trackWidth - parentWidth + 48, 0);
      setScrollRange(shift);
    };

    measure();
    // Safety delay to ensure layout is settled
    const timer = setTimeout(measure, 200);

    // Resize Observer for robustness
    const resizeObserver = new ResizeObserver(measure);
    const track = trackRef.current;
    if (track) resizeObserver.observe(track);

    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
      if (track) resizeObserver.unobserve(track);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map vertical scroll progress to horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${scrollRange}px`]);

  return (
    // The tall container that creates the scroll track
    <section ref={targetRef} className="relative" style={{ height: "300vh" }}>
      {/* The sticky viewport that freezes */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-transparent px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
              Timeline
            </p>
            <h2 className="text-3xl font-bold text-white">Save the milestones</h2>
          </div>
          <p className="text-sm text-[rgba(248,244,246,0.75)]">Scroll to reveal what&apos;s next.</p>
        </div>

        <div className="relative mx-auto mt-12 w-full max-w-6xl overflow-hidden">
          {/* Central Timeline Track */}
          <div className="absolute left-0 top-1/2 block h-0.5 w-full -translate-y-1/2 bg-[rgba(255,255,255,0.1)]" />

          {/* Horizontally scrolling track */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative z-10 flex gap-6 items-center md:gap-5"
          >
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.title} className="relative min-w-[280px] flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`glass-panel relative flex h-full min-h-[180px] flex-col justify-between border bg-[rgba(255,255,255,0.05)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${isEven
                        ? "md:-translate-y-8 border-[rgba(248,153,36,0.35)]"
                        : "md:translate-y-8 border-[rgba(217,63,67,0.35)]"
                      }`}
                  >
                    {/* Top line for bottom items (odd) */}
                    {!isEven && (
                      <div className="absolute left-1/2 top-[-34px] hidden h-9 w-0.5 -translate-x-1/2 bg-[rgba(255,255,255,0.15)] md:block" />
                    )}

                    {/* Bottom line for top items (even) */}
                    {isEven && (
                      <div className="absolute left-1/2 bottom-[-34px] hidden h-9 w-0.5 -translate-x-1/2 bg-[rgba(255,255,255,0.15)] md:block" />
                    )}

                    <span className="self-start rounded-full bg-[rgba(248,153,36,0.2)] px-3 py-1 text-xs font-semibold text-white">
                      Coming Soon
                    </span>
                    <div>
                      <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium text-[rgba(248,244,246,0.8)]">{item.date}</p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
