"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type PersonCardProps = {
  name: string;
  role: string;
  title?: string;
  status?: string;
  image?: string;
  linkedin?: string;
  bio?: string;
};

export default function PersonCard({ name, role, title, status, image, linkedin, bio }: PersonCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasLinkedIn = Boolean(linkedin);
  const imageSrc = image ?? "/team/placeholder.svg";
  const imageAlt = image ? `${name} headshot` : `${name} placeholder`;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const cardContent = (
    <>
      <div className="flex justify-center relative cursor-pointer group">
        <div className="relative h-48 w-48 overflow-hidden rounded-full border-2 border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.08)] shadow-[0_0_0_10px_rgba(212,100,118,0.06)] transition-all duration-300 group-hover:border-[rgba(212,100,118,0.6)] group-hover:shadow-[0_0_0_15px_rgba(212,100,118,0.15)] group-hover:scale-105">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="192px"
            className="object-cover object-[center_35%]"
            priority={false}
          />
          {bio && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-sm font-semibold tracking-wider">Read Bio</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-4">
        {title && <p className="text-xs uppercase tracking-[0.08em] text-[#F89924] font-bold">{title}</p>}
        <p className="text-xs uppercase tracking-[0.08em] text-[rgba(248,244,246,0.7)]">{role}</p>
        <h3 className="text-xl font-bold text-white">{name}</h3>
        {status ? (
          <p className="text-sm text-[rgba(248,244,246,0.75)]">{status}</p>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      <div 
        onClick={() => bio && setIsOpen(true)}
        className={`glass-panel flex h-full flex-col items-center gap-4 p-6 text-center transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(212,100,118,0.3)] hover:border-[rgba(212,100,118,0.3)] ${bio ? "cursor-pointer" : ""}`}
      >
        {cardContent}
        
        <div className="mt-auto w-full pt-4">
          {hasLinkedIn ? (
            <Button asChild variant="linkedin" className="w-full justify-center" onClick={(e) => e.stopPropagation()}>
              <Link href={linkedin as string} target="_blank">
                LinkedIn
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              disabled
              variant="secondary"
              className="w-full justify-center opacity-40 cursor-not-allowed"
              aria-disabled
            >
              LinkedIn
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && bio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-[#0e080f]/90 shadow-2xl flex flex-col md:flex-row z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image side */}
              <div className="relative h-64 md:h-auto md:w-2/5 shrink-0 bg-black overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-20 md:hidden p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content side */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 z-20 hidden md:block p-2 text-white/50 hover:text-white transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="space-y-6">
                  <div>
                    {title && <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider text-[#0e080f] bg-gradient-to-r from-[#D46476] to-[#F89924] rounded-full">{title}</span>}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{name}</h2>
                    <p className="text-lg text-[rgba(248,244,246,0.8)] font-medium">{role}</p>
                  </div>

                  <div className="space-y-4 text-[rgba(255,255,255,0.7)] leading-relaxed">
                    {bio.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {hasLinkedIn && (
                    <div className="pt-4 border-t border-white/10 mt-6">
                      <Button asChild variant="linkedin">
                        <Link href={linkedin as string} target="_blank">
                          Connect on LinkedIn
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
