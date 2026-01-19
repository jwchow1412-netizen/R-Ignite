"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageSquare, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "General",
    items: [
      {
        question: "What is MASA Hackathon 2026: R-Ignite?",
        answer:
          "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. It is a two-month event offering Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems, gain hands-on experience, enhance analytical skills, and network with industry professionals.",
      },
      {
        question: "Who is organising the hackathon?",
        answer: "The Malaysian Actuarial Student Association (MASA) is organising the event.",
      },
      {
        question: "How do I get more information?",
        answer:
          "Resources will be updated under the Downloads section. For enquiries, email hackathon@masassociation.org. Registration and topic details marked Coming Soon will be published when ready.",
      },
    ],
  },
  {
    category: "Competition",
    items: [
      {
        question: "What is the current focus track?",
        answer:
          "The temporary focus track is Cybersecurity Risk. The topic is subject to change and final details will be announced.",
      },
      {
        question: "What is the high-level process?",
        answer:
          "Phases include Registration, Pre-Event Briefing and Workshop, Preliminary Round, Judging & Shortlisting, and the Grand Final. Participants work with an insurance-related dataset and learn data preprocessing during the workshop, then build predictive models, generate reports, and create visualisations. Top 6 teams are shortlisted to proceed to the Grand Final and present to judges.",
      },
      {
        question: "What are the key dates?",
        answer:
          "Registration runs 3rd – 23rd April 2026. Hackathon commences 24th April 2026. Workshop and Briefing is 25th April 2026. Preliminary Round submission is 7th May 2026. Judging Period is 8th – 22nd May 2026. Finalists announcement is 24th May 2026. Grand Final presentation is 6th June 2026.",
      },
      {
        question: "How is the Grand Final conducted?",
        answer:
          "The Grand Final is held physically. Six teams shortlisted from the Preliminary Round present models, scenario analyses, strategies and data visualisations. Each team has 15 minutes presentation plus 10 minutes Q&A.",
      },
    ],
  },
];

const categories = ["General", "Competition"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("General");

  const filteredFaqs = faqs.find((c) => c.category === activeCategory)?.items || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
          FAQ
        </p>
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Frequently <span className="text-[rgba(212,100,118,1)]">Asked</span> Questions
        </h1>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: FAQs */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-6 py-2 text-sm font-semibold transition-all duration-300 ${activeCategory === category
                  ? "border-[rgba(212,100,118,0.4)] bg-[rgba(212,100,118,0.15)] text-white shadow-[0_0_0_1px_rgba(212,100,118,0.12)]"
                  : "border-border/80 bg-[rgba(255,255,255,0.03)] text-[rgba(248,244,246,0.6)] hover:border-border hover:text-white"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filteredFaqs.map((item, index) => (
                  <FAQItem key={index} question={item.question} answer={item.answer} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: More Questions Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-border/80 bg-[rgba(255,255,255,0.03)] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm lg:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(212,100,118,1)] text-white shadow-lg shadow-[rgba(212,100,118,0.2)]">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">
              Do you have more questions?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[rgba(248,244,246,0.65)]">
              Have more questions? Reach out to us via email—we&apos;re happy to help!
            </p>
            <div className="mt-8">
              <Button asChild className="w-full bg-[rgba(212,100,118,1)] text-white hover:bg-[rgba(212,100,118,0.8)]">
                <Link href="mailto:hackathon@masassociation.org">
                  Send an Email!
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`group cursor-pointer rounded-2xl border bg-[rgba(255,255,255,0.02)] p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)] ${isOpen
        ? "border-[rgba(212,100,118,0.3)] shadow-[0_0_20px_-5px_rgba(212,100,118,0.1)]"
        : "border-border/60 hover:border-border"
        }`}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className={`font-semibold transition-colors ${isOpen ? "text-[rgba(212,100,118,1)]" : "text-white"}`}>
          {question}
        </h3>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen
            ? "rotate-180 border-[rgba(212,100,118,0.3)] bg-[rgba(212,100,118,0.1)] text-[rgba(212,100,118,1)]"
            : "border-white/10 text-white/60 group-hover:border-white/20 group-hover:text-white"
            }`}
        >
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[rgba(248,244,246,0.7)] leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
