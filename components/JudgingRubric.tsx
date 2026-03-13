"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const processSteps = [
  {
    step: 1,
    title: "Registration & Briefing",
    description: "Participants register and attend the workshop and briefing to understand the hackathon format, problem statement, and judging criteria.",
    color: "from-[#F89924] to-[#f5841f]",
    line: "bg-gradient-to-b from-[#F89924] to-[#D46476]"
  },
  {
    step: 2,
    title: "Preliminary Phase",
    description: "Teams submit their reports, models, and presentations. Submissions are reviewed based on the rubric to shortlist the top 6 teams.",
    color: "from-[#D46476] to-[#d6485d]",
    line: "bg-gradient-to-b from-[#D46476] to-[rgba(255,255,255,0.4)]"
  },
  {
    step: 3,
    title: "Grand Final Pitch",
    description: "Shortlisted finalists present their solutions live to the judging panel, demonstrating their insights and answering rigorous Q&A.",
    color: "from-[rgba(255,255,255,0.8)] to-[rgba(255,255,255,0.4)]",
    line: "bg-gradient-to-b from-[rgba(255,255,255,0.4)] to-transparent"
  }
];

const rubricCriteria = [
  {
    title: "Problem Framing and Preliminary Data Exploration",
    weight: 20,
    color: "from-[#F89924] to-[#f5841f]",
    bullets: [
      "Defines a clear, relevant problem/ opportunity aligned to business context.",
      "Demonstrates a clear understanding of significant relationships and patterns using insightful visuals and explanations."
    ]
  },
  {
    title: "Modelling and In-Depth Data Analysis",
    weight: 20,
    color: "from-[#F89924] to-[#D46476]",
    bullets: [
      "Uses clear and defensible assumptions, and pre-processing steps.",
      "Justifies the selected model using appropriate validation methods and ensures the selected model fits the defined problem.",
      "Discusses model implications, limitations, and future improvements."
    ]
  },
  {
    title: "Financial Impact Assessment",
    weight: 20,
    color: "from-[#D46476] to-rose-500",
    bullets: [
      "Translates findings into financial or operational implications using credible external sources.",
      "Defines a relevant stress scenario and applies scenario assumptions to derive a justifiable projection."
    ]
  },
  {
    title: "Strategic Risk Management Recommendations",
    weight: 20,
    color: "from-[#D46476] to-pink-500",
    bullets: [
      "Summarises key insights and highlights limitations and uncertainties.",
      "Provides actionable risk management recommendations linked to analysis."
    ]
  },
  {
    title: "Overall Storyline and Presentation",
    weight: 20,
    color: "from-pink-500 to-purple-500",
    bullets: [
      "Provides a clear storyline with structured organisation and formatting of information.",
      "Clearly communicates key messages and professionally addresses questions."
    ]
  },
  {
    title: "Bonus points (Optional)",
    weight: 10,
    color: "from-[#D46476] via-[#F89924] to-[#f5841f]",
    bullets: [
      "Demonstrates outstanding technical skills and originality (e.g. provides interactive dashboards/apps which address the questions, links analysis to relevant policy documents/ international treaty on climate change).",
      "Articulates information with exceptional clarity and executive readiness (e.g. uses a one-slide summary, message headers, crisp narratives)."
    ]
  }
];

export default function JudgingRubric() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate accumulated score
  const currentAccumulatedScore = rubricCriteria
    .slice(0, currentIndex + 1)
    .reduce((acc, criteria) => acc + criteria.weight, 0);

  // Determines state of the flame
  const isKindled = currentAccumulatedScore >= 100 && currentAccumulatedScore < 110;
  const isVigorous = currentAccumulatedScore >= 110;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % rubricCriteria.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + rubricCriteria.length) % rubricCriteria.length);
  };

  const currentCard = rubricCriteria[currentIndex];

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 text-glow-pink">
          Judging Process & Criteria
        </h2>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[#D46476] to-[#F89924] shadow-[0_0_15px_rgba(212,100,118,0.5)]" />
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">

        {/* Left Column: Process (Span 5) */}
        <div className="lg:col-span-5 space-y-8 glass-panel p-6 md:p-8 shrink-0">
          <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Our Process</h3>
          <div className="relative pl-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative pb-12 last:pb-0"
              >
                {/* Connecting Line */}
                {index !== processSteps.length - 1 && (
                  <div className={`absolute top-10 bottom-0 left-[15px] w-0.5 ${step.line} shadow-[0_0_10px_rgba(212,100,118,0.3)]`} />
                )}

                <div className="flex gap-6">
                  {/* Number Badge */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0e080f] text-white font-bold border border-white/20 shadow-[0_0_15px_rgba(212,100,118,0.4)] overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20`} />
                    <span className="relative z-10 text-[rgba(255,255,255,0.9)]">{step.step}</span>
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-[rgba(248,244,246,0.7)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Flashcards & Progress (Span 7) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-6 lg:gap-8 h-full min-h-[500px]">

          {/* Vertical Progress Bar Container */}
          <div className="flex sm:flex-col items-center gap-4 sm:w-16 shrink-0 order-2 sm:order-1 self-center sm:self-stretch">

            {/* The Flame Icon */}
            <div className={`relative flex h-16 w-16 items-center justify-center transition-all duration-700 ${isVigorous ? "scale-125" : isKindled ? "scale-110" : "scale-100 opacity-50 grayscale"}`}>

              {/* Vibrant ambient glow for vigorous flame */}
              {(isKindled || isVigorous) && (
                <motion.div
                  className={`absolute inset-0 rounded-full blur-[20px] -z-10 ${isVigorous ? "bg-gradient-to-t from-[#D46476] to-[#F89924] opacity-80" : "bg-orange-500 opacity-40"}`}
                  animate={{ scale: [1, 1.2, 1], opacity: isVigorous ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3] }}
                  transition={{ duration: isVigorous ? 0.8 : 1.5, repeat: Infinity }}
                />
              )}

              {/* Flame SVG */}
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isVigorous ? "url(#vigorousGrad)" : isKindled ? "#F89924" : "currentColor"}
                className={`w-10 h-10 ${isVigorous ? "text-[#F89924] drop-shadow-[0_0_10px_#F89924]" : "text-white/40"}`}
                animate={isVigorous ? { y: [0, -4, 0], scale: [1, 1.1, 1] } : isKindled ? { y: [0, -2, 0] } : {}}
                transition={{ duration: isVigorous ? 0.6 : 1.2, repeat: Infinity }}
              >
                <defs>
                  <linearGradient id="vigorousGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#D46476" />
                    <stop offset="50%" stopColor="#F89924" />
                    <stop offset="100%" stopColor="#ffea00" />
                  </linearGradient>
                </defs>
                <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
              </motion.svg>
            </div>

            {/* The Vertical Bar */}
            <div className="relative flex-1 w-full h-4 sm:w-4 sm:h-full bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden border border-white/10 flex items-end">
              <motion.div
                className="w-full bg-gradient-to-t from-[#D46476] to-[#F89924] rounded-full shadow-[0_0_10px_rgba(248,153,36,0.5)] h-full sm:h-auto sm:w-full origin-left sm:origin-bottom"
                initial={{ height: "0%", width: "0%" }}
                animate={{
                  height: typeof window !== "undefined" && window.innerWidth >= 640 ? `${(currentAccumulatedScore / 110) * 100}%` : "100%",
                  width: typeof window !== "undefined" && window.innerWidth < 640 ? `${(currentAccumulatedScore / 110) * 100}%` : "100%"
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Total Score Marker */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white tracking-tighter">{currentAccumulatedScore}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">/110</span>
            </div>
          </div>

          {/* Flashcard Stack Container */}
          <div className="relative flex-1 perspective-1000 order-1 sm:order-2 h-[450px] sm:h-auto">

            {/* Background Hint Text */}
            <div className="absolute -top-8 right-0 text-xs font-medium text-white/40 uppercase tracking-widest flex items-center gap-2">
              <span>Card {currentIndex + 1} of {rubricCriteria.length}</span>
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, rotateY: -15, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, rotateY: 15, scale: 0.9 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className="absolute inset-0 glass-panel border border-white/20 p-8 flex flex-col justify-between overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing backdrop-blur-2xl"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset }) => {
                  const swipe = offset.x;
                  if (swipe < -100) {
                    handleNext();
                  } else if (swipe > 100) {
                    handlePrev();
                  }
                }}
              >
                {/* Visual Accent Glow specific to card color */}
                <div className={`absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-gradient-to-br ${currentCard.color} opacity-10 blur-[60px] pointer-events-none`} />
                <div className={`absolute bottom-0 left-0 w-48 h-48 translate-y-1/3 -translate-x-1/3 rounded-full bg-gradient-to-tr ${currentCard.color} opacity-10 blur-[50px] pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                      {currentCard.title}
                    </h3>
                    <div className="shrink-0 flex flex-col items-end">
                      <span className="text-3xl font-bold text-white">{currentCard.weight}</span>
                      <span className="text-xs uppercase tracking-widest text-white/50 font-semibold">Points</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <ul className="space-y-4 text-[rgba(248,244,246,0.85)] list-disc pl-5 marker:text-[rgba(255,255,255,0.4)]">
                      {currentCard.bullets.map((bullet, i) => (
                        <li key={i} className="leading-relaxed text-base">{bullet}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Navigation Help & Controls */}
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs text-white/40 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      Swipe to navigate
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrev}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all ring-1 ring-transparent hover:ring-white/20"
                        aria-label="Previous criteria"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button
                        onClick={handleNext}
                        className={`p-3 rounded-full bg-gradient-to-r ${currentCard.color} text-white shadow-lg transition-all hover:scale-110`}
                        aria-label="Next criteria"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 flex justify-center"
      >
        <a 
          href="/downloads/rubric.pdf" 
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#D46476] to-[#F89924] px-8 font-semibold text-white transition-all hover:scale-105 shadow-[0_0_15px_rgba(212,100,118,0.4)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            View Detailed Rubric
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <div className="absolute inset-0 -z-10 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0" />
        </a>
      </motion.div>
    </section>
  );
}
