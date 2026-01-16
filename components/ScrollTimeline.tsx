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
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-transparent">

        {/* Header Section */}
        <div className="absolute top-8 left-0 right-0 z-20 mx-auto max-w-6xl px-4 text-center md:top-12">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)] animate-pulse">
            Scroll Down to Explore
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl text-glow-pink">
            Timeline Journey
          </h2>
        </div>

        <div className="relative mx-auto w-full max-w-[90%] overflow-visible md:max-w-7xl">
          {/* Central Timeline Axis (The "Sun" path) */}
          <div className="absolute left-0 top-1/2 block h-1 w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.4)] to-transparent shadow-[0_0_15px_rgba(212,100,118,0.5)]" />

          {/* Horizontally scrolling track */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative z-10 flex gap-12 items-center px-10 md:gap-20"
          >
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.title} className="relative flex flex-col items-center justify-center min-w-[320px]">

                  {/* Connection Line (Vertical) */}
                  <div
                    className={`absolute w-0.5 bg-gradient-to-b from-[rgba(255,255,255,0.5)] to-transparent transition-all duration-500
                    ${isEven ? "bottom-1/2 h-20 md:h-28" : "top-1/2 h-20 md:h-28"}`}
                  />

                  {/* Central Node (The "Planet") */}
                  <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0e080f] shadow-[0_0_10px_#fff] z-20" />

                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`glass-panel relative flex flex-col justify-between border bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl w-full
                      ${isEven
                        ? "mb-[200px] md:mb-[250px] border-b-4 border-b-[rgba(248,153,36,0.6)]"
                        : "mt-[200px] md:mt-[250px] border-t-4 border-t-[rgba(212,100,118,0.6)]"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded bg-[rgba(255,255,255,0.1)] 
                          ${isEven ? "text-[rgba(248,153,36,1)]" : "text-[rgba(212,100,118,1)]"}`}>
                        {item.date}
                      </span>
                      {item.title.includes("Final") && (
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-[rgba(248,244,246,0.7)] leading-relaxed">
                      Stay tuned for more details.
                    </p>
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
