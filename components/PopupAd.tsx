"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupAd() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Prevent showing again if they already clicked X during this session
        if (isDismissed) return;

        // Show after 2 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [isDismissed]);

    const handleDismiss = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        setIsDismissed(true);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        className="relative w-full max-w-5xl h-[300px] md:h-[500px] bg-black border-2 border-white/20 shadow-2xl overflow-hidden group shadow-[0_0_50px_rgba(212,100,118,0.2)]"
                    >
                        <button 
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/60 hover:bg-[#D46476] border border-white/20 hover:border-[#D46476] text-white rounded-full transition-colors backdrop-blur-md shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        
                        <Link href="/rewards" onClick={() => setIsVisible(false)} className="block w-full h-full relative">
                            {/* Base Image (starts vibrant, darkens on hover) */}
                            <Image 
                                src="/lucky-draw-banner.png" 
                                alt="Rewards Portal - Earn Entry Tickets" 
                                fill 
                                className="object-cover transition-all duration-700 ease-in-out group-hover:opacity-60 group-hover:mix-blend-luminosity" 
                                priority
                            />
                            
                            {/* Hover Reveal Overlays mimicking the announcement tab */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            
                            <div className="absolute top-0 left-0 border-b-2 border-r-2 border-[#D46476] bg-black/50 backdrop-blur-md px-6 py-3 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-8 group-hover:translate-x-0 pointer-events-none">
                                <div className="text-[#D46476] text-xs font-black uppercase tracking-widest">OFFICIAL_BROADCAST</div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-3/4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0 pointer-events-none">
                                <h2 className="text-2xl md:text-5xl font-black text-white mb-3 leading-tight uppercase tracking-wide border-l-4 border-[#F89924] pl-4">Earn Lucky Draw Entries! 🎯</h2>
                                <p className="text-[rgba(248,244,246,0.85)] max-w-xl font-mono text-xs md:text-sm leading-relaxed bg-black/60 p-4 border border-white/10 backdrop-blur-sm shadow-xl inline-block">
                                    Complete tasks, earn points, and spin the wheel. Every 200 points = 1 extra entry! Base entry guaranteed at Grand Final. 🎪
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
