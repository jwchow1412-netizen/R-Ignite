"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type Speaker = {
  name: string;
  role: string;
  title?: string;
  image?: string;
  linkedin?: string;
  bio?: string;
};

export default function SpeakerSpotlight({ speaker }: { speaker: Speaker }) {
  const imageSrc = speaker.image || "/team/placeholder.svg";
  
  return (
    <div className="relative mt-16 mx-auto max-w-5xl">
      {/* Animated glowing background */}
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[rgba(212,100,118,0.5)] via-[rgba(248,153,36,0.3)] to-[rgba(212,100,118,0.5)] blur-2xl opacity-40 z-0"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 glass-panel rounded-3xl border border-white/10 bg-[rgba(14,8,15,0.8)] backdrop-blur-3xl overflow-hidden p-8 md:p-12 shadow-[0_0_80px_-20px_rgba(212,100,118,0.3)]"
      >
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start">
          
          {/* Left Column: Image & Connect */}
          <div className="flex flex-col items-center gap-6 shrink-0 md:w-1/3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative relative group"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D46476] to-[#F89924] opacity-50 blur-lg group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-64 w-64 md:h-72 md:w-72 overflow-hidden rounded-full border-4 border-white/10 shadow-2xl">
                <Image
                  src={imageSrc}
                  alt={speaker.name}
                  fill
                  sizes="300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </motion.div>
            
            {speaker.linkedin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full"
              >
                <Button asChild variant="linkedin" className="w-full h-12 text-md rounded-xl font-bold shadow-[0_0_20px_rgba(0,119,181,0.3)] hover:shadow-[0_0_30px_rgba(0,119,181,0.6)] transition-all">
                  <Link href={speaker.linkedin} target="_blank">
                    Connect on LinkedIn
                  </Link>
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Right Column: Text Content */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="inline-block px-4 py-1.5 mb-5 text-sm font-bold uppercase tracking-widest text-[#0e080f] bg-gradient-to-r from-[#D46476] to-[#F89924] rounded-full shadow-[0_0_15px_rgba(212,100,118,0.5)]">
                Featured Workshop Speaker
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                {speaker.name} {speaker.title && <span className="text-2xl text-[rgba(248,244,246,0.5)] font-normal align-middle">{speaker.title}</span>}
              </h2>
              <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#D46476] to-[rgba(248,153,36,0.8)] font-semibold mb-8">
                {speaker.role}
              </p>
              
              {speaker.bio && (
                <div className="space-y-5 text-left text-[rgba(248,244,246,0.8)] text-lg leading-relaxed relative">
                  {/* Decorative quote mark */}
                  <div className="absolute -top-6 -left-6 text-6xl text-white/5 font-serif select-none">"</div>
                  
                  {speaker.bio.split('\n\n').map((paragraph, i) => (
                    <motion.p 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + Math.min(i * 0.1, 0.5) }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
