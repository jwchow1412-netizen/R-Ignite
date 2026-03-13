"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search } from "lucide-react";
import { faqData as faqs, getFaqCategories } from "@/lib/faqData";

export default function FAQLanding() {
  const categories = getFaqCategories();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Process flat list of all questions for search mode
  const allFaqs = faqs.flatMap(c => 
    c.items.map(item => ({ ...item, category: c.category }))
  );

  const isSearching = searchQuery.trim().length > 0;

  // Filter logic
  const filteredFaqs = isSearching 
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs.find((c) => c.category === activeCategory)?.items || [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 md:px-6 border-t border-white/5">
      
      {/* Search Header */}
      <div className="mb-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Frequently <span className="text-glow-pink">Asked Questions</span>
        </h2>
        <p className="text-[rgba(248,244,246,0.7)] text-lg mb-8">
          Find answers to the most commonly asked questions below. Search for topics you&apos;re interested in or sort by category.
        </p>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-2xl md:text-3xl text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[#F89924] transition-colors"
          />
          <div className="absolute right-0 top-0 p-2 bg-[#F89924] rounded-md text-black shadow-lg shadow-orange-500/20">
            <Search className="h-6 w-6" />
          </div>
        </div>
        
        {isSearching && (
          <p className="mt-4 text-sm font-semibold text-[#D46476]">
            {filteredFaqs.length} results found
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16 items-start">
        
        {/* Left Sidebar: Categories */}
        <div className="lg:col-span-4 space-y-2 glass-panel p-4 sticky top-24">
          {!isSearching ? (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#D46476] to-[#F89924] text-white shadow-lg"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))
          ) : (
             <div className="px-6 py-4 text-white/40 italic">
               Clear search to view categories.
             </div>
          )}
        </div>

        {/* Right Content: FAQ Accordions */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <FAQItem question={faq.question} answer={faq.answer} highlight={searchQuery} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/50"
              >
                No questions found matching &quot;<span className="text-white">{searchQuery}</span>&quot;.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}

function FAQItem({ question, answer, highlight }: { question: string; answer: string, highlight?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to highlight search terms securely mapping to JSX
  const renderHighlightedText = (text: string) => {
    if (!highlight || highlight.trim() === "") return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-[#F89924]/30 text-[#F89924] font-semibold px-1 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`group cursor-pointer rounded-2xl glass-panel p-5 transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] ${
        isOpen
          ? "border-[rgba(212,100,118,0.5)] shadow-[0_0_20px_-5px_rgba(212,100,118,0.2)]"
          : "border-border/60 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className={`font-medium sm:text-lg transition-colors leading-snug ${isOpen ? "text-[rgba(212,100,118,1)]" : "text-white"}`}>
          {renderHighlightedText(question)}
        </h3>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
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
            <p className="pt-4 text-[rgba(248,244,246,0.7)] text-sm sm:text-base leading-relaxed">
              {renderHighlightedText(answer)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
