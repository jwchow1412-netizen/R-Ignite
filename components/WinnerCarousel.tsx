"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { pastWinners } from "@/lib/data";

export default function WinnerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (!isHovered) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex === pastWinners.length - 1 ? 0 : prevIndex + 1));
      }, 4000);
    }
    return () => resetTimeout();
  }, [currentIndex, isHovered]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          Hall of Fame
        </p>
        <h2 className="text-3xl font-bold text-white">R-Ignite 2026 Winners</h2>
      </div>

      <div 
        className="glass-panel relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl p-2 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  setCurrentIndex((prev) => (prev === pastWinners.length - 1 ? 0 : prev + 1));
                } else if (swipe > swipeConfidenceThreshold) {
                  setCurrentIndex((prev) => (prev === 0 ? pastWinners.length - 1 : prev - 1));
                }
              }}
            >
              <Image
                src={pastWinners[currentIndex].image}
                alt={pastWinners[currentIndex].teamName}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm md:text-base font-medium text-[#F89924] mb-1"
                >
                  {pastWinners[currentIndex].title}
                </motion.span>
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-4xl font-bold text-white"
                >
                  {pastWinners[currentIndex].teamName}
                </motion.h3>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 right-6 flex gap-2 z-10">
          {pastWinners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "w-8 bg-gradient-to-r from-[#D46476] to-[#F89924]" 
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
