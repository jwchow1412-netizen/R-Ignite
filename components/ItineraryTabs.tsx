"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { grandFinalSchedule, workshopSchedule } from "@/lib/data";

type TabType = "workshop" | "grandFinal";

export default function ItineraryTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("workshop");

  return (
    <div className="mt-12 w-full max-w-5xl mx-auto">
      {/* Tabs Menu */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 bg-[rgba(255,255,255,0.02)] p-1.5 rounded-2xl backdrop-blur-md border border-white/10 relative z-10 w-full sm:w-fit mx-auto mb-8">
        <button
          onClick={() => setActiveTab("workshop")}
          className={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-colors duration-300 outline-none ${
            activeTab === "workshop" ? "text-white" : "text-white/50 hover:text-white/80"
          }`}
        >
          {activeTab === "workshop" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-gradient-to-r from-[#D46476] to-[#F89924] rounded-xl -z-10 shadow-[0_0_15px_rgba(212,100,118,0.3)]"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          Workshop &amp; Briefing
        </button>
        <button
          onClick={() => setActiveTab("grandFinal")}
          className={`relative px-6 py-3 text-sm font-semibold rounded-xl transition-colors duration-300 outline-none ${
            activeTab === "grandFinal" ? "text-white" : "text-white/50 hover:text-white/80"
          }`}
        >
          {activeTab === "grandFinal" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-gradient-to-r from-[#D46476] to-[#F89924] rounded-xl -z-10 shadow-[0_0_15px_rgba(212,100,118,0.3)]"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          Grand Final
        </button>
      </div>

      {/* Content Area */}
      <div className="glass-panel p-6 md:p-8 relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "workshop" && (
            <motion.div
              key="workshop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Workshop &amp; Briefing Itinerary</h2>
                  <p className="text-sm text-[rgba(248,244,246,0.7)]">Hackathon commencement and introduction. Hands-on learning and dataset preparation.</p>
                </div>
                <span className="badge-soft shrink-0">25th April 2026</span>
              </div>
              <ul className="space-y-3">
                {workshopSchedule.map((slot, i) => (
                  <motion.li 
                    key={slot.time + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 rounded-xl border border-white/5 bg-[rgba(255,255,255,0.02)] px-5 py-4 transition-all hover:bg-[rgba(255,255,255,0.05)] hover:border-white/20"
                  >
                    <span className="font-mono text-sm font-bold text-[#F89924] shrink-0 w-32 tracking-wider">{slot.time}</span>
                    <span className="text-white/90 text-base flex-1">{slot.item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {activeTab === "grandFinal" && (
            <motion.div
              key="grandFinal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Grand Final Itinerary</h2>
                  <p className="text-sm text-[rgba(248,244,246,0.7)] max-w-2xl leading-relaxed">
                    Grand Final held physically. Six teams shortlisted from the Preliminary Round present models,
                    scenario analyses, strategies and data visualisations. Each team format involves a 15 minutes presentation followed by 10 minutes Q&amp;A.
                  </p>
                </div>
                <span className="badge-soft shrink-0 mt-1">6th June 2026</span>
              </div>
              <ul className="space-y-3">
                {/* Type any since lib/data might not have duration explicitly typed if it's inferred, but it's fine */}
                {grandFinalSchedule.map((slot: any, i) => (
                  <motion.li 
                    key={slot.time + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-xl border border-white/5 bg-[rgba(255,255,255,0.02)] px-5 py-4 transition-all hover:bg-[rgba(255,255,255,0.05)] hover:border-white/20"
                  >
                    <div className="flex flex-col sm:w-40 shrink-0 gap-1 border-l-2 border-[#D46476] pl-3">
                      <span className="font-mono text-sm font-bold text-[#D46476] tracking-wider">{slot.time}</span>
                      {slot.duration && (
                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{slot.duration}</span>
                      )}
                    </div>
                    <span className="text-white/90 text-base flex-1">{slot.item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
