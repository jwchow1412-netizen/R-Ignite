"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Number Counter Component
function Counter({ from, to, duration = 2, suffix = "", prefix = "" }: { from: number; to: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const currentCount = Math.floor(from + (to - from) * easeOut);
      
      setCount(currentCount);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setCount(to);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, inView]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      if (num >= 10000) {
          return (num / 1000).toFixed(1);
      }
      return (num / 1000).toFixed(1).replace(".0", "");
    }
    return num.toString();
  };

  return (
    <span ref={nodeRef} className="tabular-nums tracking-tight">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

// Elegant Vertical Bar Component
function GlowingBar({ value, label, targetHeight, delay, suffix = "" }: { value: number; label: string; targetHeight: string; delay: number; suffix?: string }) {
  return (
    <div className="flex flex-col items-center justify-end h-64 group">
      {/* Value */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.5 }}
        className="mb-3 text-2xl font-bold text-white group-hover:-translate-y-1 transition-transform"
      >
        <Counter from={0} to={value} suffix={suffix} />
      </motion.div>
      
      {/* The Bar */}
      <div className="relative w-16 bg-white/5 rounded-t-2xl overflow-hidden border border-white/10 border-b-0 backdrop-blur-sm h-full flex items-end">
        <motion.div 
          initial={{ height: "0%" }}
          whileInView={{ height: targetHeight }}
          viewport={{ once: true }}
          transition={{ delay, duration: 1.2, type: "spring", bounce: 0.3 }}
          className="w-full bg-gradient-to-t from-[#D46476]/20 via-[#D46476]/60 to-[#F89924] relative shadow-[0_0_30px_rgba(248,153,36,0.3)]"
        >
          {/* Top highlight */}
          <div className="absolute top-0 w-full h-1 bg-white/50" />
        </motion.div>
      </div>

      {/* Label */}
      <div className="mt-4 text-[11px] uppercase tracking-wider font-semibold text-white/50 text-center w-full break-words">
        {label}
      </div>
    </div>
  );
}

export default function EventImpact() {
  // 52 out of 63 teams is ~82.5%
  // SVG circle dash array is 565.48. 100% = 0 offset. 0% = 565.48 offset.
  // 82.5% fill = 565.48 * (1 - 0.825) = 98.9 offset
  
  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 bg-black/40 backdrop-blur-xl">
      {/* Ambient background glows */}
      <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-[#D46476]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-[#F89924]/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="grid lg:grid-cols-3 min-h-[500px] relative z-10 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        
        {/* Left Column: Progress Ring */}
        <div className="p-8 md:p-12 flex flex-col items-center justify-center relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="relative w-56 h-56 flex items-center justify-center"
          >
            {/* SVG Ring Background */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="112" cy="112" r="90" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              {/* Animated Progress Ring */}
              <motion.circle 
                cx="112" cy="112" r="90" 
                stroke="url(#ring-gradient)" 
                strokeWidth="12" fill="none" 
                strokeDasharray="565.48" // 2 * PI * 90
                initial={{ strokeDashoffset: 565.48 }}
                whileInView={{ strokeDashoffset: 98.9 }} // ~82.5% fill
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_15px_rgba(212,100,118,0.5)]"
              />
              <defs>
                <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D46476" />
                  <stop offset="100%" stopColor="#F89924" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Content */}
            <div className="flex flex-col items-center">
              <span className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-1">Total</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                  <Counter from={0} to={52} />
                </span>
                <span className="text-2xl font-medium text-white/30">/ 63</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <h3 className="text-xl font-semibold text-[#F89924] mb-1">Teams Submitted</h3>
            <p className="text-white/50 text-sm">for the Preliminary Round</p>
          </motion.div>
        </div>

        {/* Center Column: Highlight Stats */}
        <div className="p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden group">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold text-white mb-2">Recap <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D46476] to-[#F89924]">/2026</span></h2>
            <p className="text-white/60 font-medium tracking-wide">Our Performance This Year!</p>
          </motion.div>

          {/* Main Floating Card */}
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="w-full relative mt-auto"
          >
            {/* Glowing orb behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#D46476]/30 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#D46476]/50 transition-colors duration-700" />
            
            <div className="relative glass-panel rounded-3xl p-8 border border-white/20 bg-gradient-to-b from-white/10 to-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <p className="text-[#F89924] text-sm font-bold uppercase tracking-widest mb-2">Instagram Reach</p>
              <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-8 drop-shadow-lg">
                <Counter from={0} to={333900} suffix="K" />
              </h3>

              <div className="grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6">
                <div className="hover:bg-white/5 p-3 rounded-xl transition-colors">
                  <h4 className="text-3xl font-bold text-white"><Counter from={0} to={9366} suffix="K" /></h4>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mt-1">Website Views</p>
                </div>
                <div className="hover:bg-white/5 p-3 rounded-xl transition-colors">
                  <h4 className="text-3xl font-bold text-white"><Counter from={0} to={1740} suffix="K" /></h4>
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider mt-1">Active Users</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Elegant Bar Chart */}
        <div className="p-8 md:p-12 flex flex-col justify-between items-center relative">
          
          <div className="flex items-end justify-center gap-6 md:gap-8 w-full mt-10">
            <GlowingBar value={22} label="Universities" targetHeight="35%" delay={0.2} />
            <GlowingBar value={258} label="Participants" targetHeight="75%" delay={0.4} />
            <GlowingBar value={3500} label="Interactions" targetHeight="100%" delay={0.6} suffix="K" />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-center mt-12 w-full pt-8 border-t border-white/10"
          >
            <h3 className="text-4xl font-bold text-white mb-1"><Counter from={0} to={258} /></h3>
            <p className="text-[#D46476] font-semibold tracking-wide uppercase text-sm">Total Participants</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
