"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroIntroToggle from "@/components/HeroIntroToggle";
import ScrollTimeline from "@/components/ScrollTimeline";
import { whyJoin } from "@/lib/data";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    const introFull =
        "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. This two-month event offers Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems, gain hands-on experience, enhance analytical skills, and network with industry professionals. The hackathon bridges academia and industry, fostering innovation and preparing participants for future challenges in the actuarial field.";
    const introShort =
        "MASA is back with its annual flagship competition in 2026 themed “MASA Hackathon 2026: R-Ignite”. This two-month event offers Actuarial Science students an opportunity to apply theoretical knowledge to real-world problems and gain hands-on experience.";

    return (
        <div className="relative">
            {/* Hero Section */}
            <motion.section
                className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-16 pb-14 md:flex-row md:items-center md:gap-12 md:px-6 md:pt-20 md:pb-20"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
            >
                <div className="flex-1 space-y-6">
                    <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[rgba(212,100,118,0.35)] bg-[rgba(212,100,118,0.12)]">
                            <Image
                                src="/logo.svg"
                                alt="R-Ignite logo"
                                fill
                                sizes="56px"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="badge-soft">Malaysian Actuarial Student Association (MASA)</span>
                    </motion.div>

                    <motion.h1 variants={slideUp} className="text-4xl font-bold leading-tight text-white md:text-5xl">
                        MASA Hackathon 2026: R-Ignite
                    </motion.h1>

                    <motion.div variants={fadeIn}>
                        <HeroIntroToggle shortText={introShort} fullText={introFull} />
                    </motion.div>

                    <motion.div variants={slideUp} className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <Button asChild size="lg" className="w-full sm:w-auto h-12 text-base px-8 font-bold">
                            <Link href="/register">
                                Register Interest (Coming Soon)
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto h-12 text-base px-8">
                            <Link href="/downloads/handbook.pdf">
                                Download Handbook
                            </Link>
                        </Button>
                        <span className="badge-soft">Focus track: Cybersecurity Risk (subject to change)</span>
                    </motion.div>

                    <motion.div variants={staggerContainer} className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <motion.div variants={slideUp} className="glass-panel p-4 sm:p-5">
                            <p className="text-xs uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">Organizer</p>
                            <p className="text-lg font-semibold text-white">Malaysian Actuarial Student Association (MASA)</p>
                        </motion.div>
                        <motion.div variants={slideUp} className="glass-panel p-4 sm:p-5">
                            <p className="text-xs uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">Duration</p>
                            <p className="text-lg font-semibold text-white">Two-month event</p>
                        </motion.div>
                        <motion.div variants={slideUp} className="glass-panel p-4 sm:p-5">
                            <p className="text-xs uppercase tracking-[0.14em] text-[rgba(248,244,246,0.65)]">Contact</p>
                            <p className="text-lg font-semibold text-white break-words">
                                hackathon@masassociation.org
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Why Join Section */}
            <motion.section
                className="mx-auto max-w-6xl px-4 pb-14 md:px-6"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
            >
                <div className="flex flex-col gap-6">
                    <motion.div variants={fadeIn} className="flex flex-col gap-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[rgba(248,244,246,0.7)]">
                            Why Join Us
                        </p>
                        <h2 className="text-3xl font-bold text-white">Built for actuarial students and partners</h2>
                    </motion.div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {whyJoin.map((item, index) => (
                            <motion.div
                                key={item}
                                variants={slideUp}
                                className="glass-panel p-5"
                                custom={index}
                            >
                                <p className="text-base text-[rgba(248,244,246,0.9)]">{item}</p>
                            </motion.div>
                        ))}
                    </div>
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
