"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroIntroToggle from "@/components/HeroIntroToggle";
import ScrollTimeline from "@/components/ScrollTimeline";
import { InteractiveBackground } from './InteractiveBackground';
import { whyJoin } from "@/lib/data";
import { scaleUp, fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    const introFull =
        "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. This two-month event offers Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems, gain hands-on experience, enhance analytical skills, and network with industry professionals. The hackathon bridges academia and industry, fostering innovation and preparing participants for future challenges in the actuarial field.";
    const introShort =
        "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. This two-month event offers Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems and gain hands-on experience.";

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="relative">
            {/* Hero Section */}
            <motion.section
                className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32"
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={staggerContainer}
            >
                <InteractiveBackground />

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <motion.div variants={fadeIn} className="mx-auto max-w-4xl space-y-8">
                        {/* Logo / Badge */}
                        <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/20">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-[#D46476] to-[#F89924] p-[1px]">
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                                    <div className="relative h-5 w-5">
                                        <Image src="/logo.svg" alt="R-Ignite Logo" fill className="object-contain" />
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-white/90">
                                Malaysian Actuarial Student Association (MASA)
                            </span>
                        </div>

                        {/* Animated Text Content */}
                        <div className="space-y-4">
                            <motion.h1
                                className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl lg:text-8xl"
                                variants={slideUp}
                            >
                                MASA Hackathon 2026: <br />
                                <span className="bg-gradient-to-r from-[#D46476] to-[#F89924] bg-clip-text text-transparent">
                                    R-Ignite
                                </span>
                            </motion.h1>

                            <motion.p
                                className="mx-auto max-w-2xl text-lg text-white/70 sm:text-xl leading-relaxed"
                                variants={fadeIn}
                            >
                                Can you survive the heat? Join us for the ultimate Actuarial Science challenge where innovation meets real-world problem solving.
                            </motion.p>
                        </div>

                        {/* Buttons */}
                        <motion.div
                            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                            variants={scaleUp}
                        >
                            <Button
                                size="lg"
                                className="group relative h-12 overflow-hidden bg-gradient-to-r from-[#D46476] to-[#F89924] px-8 text-base font-semibold text-white transition-all hover:scale-105 active:scale-95"
                                disabled
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Register Interest (Coming Soon)
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                                {/* Button Glow Effect */}
                                <div className="absolute inset-0 -z-10 translate-y-full bg-white/20 transition-transform group-hover:translate-y-0" />
                            </Button>

                            <Link href="/downloads/handbook.pdf" target="_blank">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-12 border-white/20 bg-white/5 px-8 text-base text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40"
                                >
                                    Download Handbook
                                </Button>
                            </Link>

                            <div className="mt-2 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/60 backdrop-blur-sm sm:mt-0">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Focus track: Cybersecurity Risk
                            </div>
                        </motion.div>

                        {/* Stats / Info Cards */}
                        <motion.div
                            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
                            variants={fadeIn}
                        >
                            {[
                                { label: "Organizer", value: "MASA", sub: "Malaysian Actuarial Student Association" },
                                { label: "Duration", value: "2 Months", sub: "Intensive Hackathon" },
                                { label: "Contact", value: "Email Us", sub: "hackathon@masassociation.org" }
                            ].map((stat, i) => (
                                <div key={i} className="glass-panel group relative overflow-hidden rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:border-white/20">
                                    <div className="relative z-10">
                                        <div className="text-xs font-semibold uppercase tracking-wider text-white/40">{stat.label}</div>
                                        <div className="mt-1 text-lg font-bold text-white">{stat.value}</div>
                                        <div className="mt-1 text-sm text-white/60">{stat.sub}</div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-12 left-0 w-full z-20 flex justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">Scroll to Explore</span>
                        <motion.div
                            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-sm"
                        >
                            <motion.div
                                className="h-1.5 w-1.5 rounded-full bg-white/60"
                                animate={{ y: [0, 16, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Why Join Section */}
            <motion.section
                className="mx-auto max-w-6xl px-4 pb-14 md:px-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
                    <div className="flex flex-col gap-6">
                        <motion.div variants={fadeIn} className="flex flex-col gap-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
                                Why Join Us
                            </p>
                            <h2 className="text-3xl font-bold text-white">Built for actuarial students and partners</h2>
                        </motion.div>

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {whyJoin.map((item, index) => (
                                <motion.div
                                    key={item}
                                    variants={slideUp}
                                    className="glass-panel p-5 transition-transform hover:scale-[1.02]"
                                    custom={index}
                                >
                                    <p className="text-base text-[rgba(248,244,246,0.9)]">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Image Column */}
                    <motion.div variants={fadeIn} className="relative group">
                        {/* Decorative glowing background */}
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[rgba(212,100,118,0.4)] to-[rgba(248,153,36,0.1)] opacity-70 blur-lg transition duration-500 group-hover:opacity-100" />

                        <div className="glass-panel relative overflow-hidden rounded-2xl p-2">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                                <Image
                                    src="/masa-hackathon-2025-highlight.png"
                                    alt="MASA Hackathon 2025 Participants"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                    <p className="text-sm font-medium text-white">MASA Hackathon 2025 Highlights</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Timeline */}
            <ScrollTimeline />

            {/* Ready to Collaborate */}
            <motion.section
                className="mx-auto max-w-6xl px-4 pb-20 md:px-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="glass-panel grid gap-6 p-6 md:grid-cols-[2fr,1fr] md:items-center">
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-white">Ready to collaborate?</h3>
                        <p className="text-[rgba(248,244,246,0.8)]">
                            MASA Hackathon 2026: R-Ignite connects Actuarial Science students with industry to solve
                            real-world problems. Updates marked Coming Soon will be refreshed here as details are confirmed.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href="/register">
                                    Register Interest
                                </Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="mailto:hackathon@masassociation.org">
                                    Contact MASA
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-3 rounded-xl border border-border bg-[rgba(255,255,255,0.02)] p-4 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-[rgba(248,244,246,0.78)]">Focus track</span>
                            <span className="rounded-full bg-[rgba(212,100,118,0.18)] px-3 py-1 text-xs font-semibold text-white">
                                Cybersecurity Risk (subject to change)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[rgba(248,244,246,0.78)]">Grand Final</span>
                            <span className="text-white">Held physically</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[rgba(248,244,246,0.78)]">Teams shortlisted</span>
                            <span className="text-white">Top 6 teams</span>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                className="mx-auto max-w-6xl px-4 pb-24 md:px-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={slideUp}
            >
                <div className="glass-panel grid gap-6 p-6 md:grid-cols-2 md:items-center">
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-[rgba(255,255,255,0.02)] p-6">
                        <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.1)]">
                            <Image
                                src="/logo.svg"
                                alt="R-Ignite logo"
                                fill
                                sizes="112px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <p className="text-lg font-semibold text-white">MASA Hackathon 2026: R-Ignite</p>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border bg-[rgba(255,255,255,0.02)] p-6">
                        <h3 className="text-2xl font-bold text-white">Contact</h3>
                        <ul className="space-y-3 text-[rgba(248,244,246,0.9)] break-words">
                            <li className="space-y-1 break-words">
                                <span className="block font-semibold text-white">Email:</span>
                                <Link href="mailto:hackathon@masassociation.org" className="underline break-all">
                                    hackathon@masassociation.org
                                </Link>
                            </li>
                            <li className="space-y-1 break-words">
                                <span className="block font-semibold text-white">Website:</span>
                                <Link href="https://www.masassociation.org/" className="underline break-all">
                                    https://www.masassociation.org/
                                </Link>
                            </li>
                            <li className="space-y-1 break-words">
                                <span className="block font-semibold text-white">LinkedIn:</span>
                                <Link href="https://www.linkedin.com/company/masassociation/" className="underline break-all">
                                    https://www.linkedin.com/company/masassociation/
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
