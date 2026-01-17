"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";

const prizes = [
    {
        rank: "1st Runner Up",
        amount: "RM 2,500",
        icon: <Medal className="h-10 w-10 text-slate-300" />,
        color: "from-slate-300 via-slate-100 to-slate-400",
        bgGlow: "bg-slate-400/20",
        border: "border-slate-300/50",
        delay: 0.2,
        order: "order-2 md:order-1", // Left on desktop
        scale: "scale-100",
        height: "h-auto md:h-[320px]",
    },
    {
        rank: "Champion",
        amount: "RM 3,500",
        icon: <Trophy className="h-12 w-12 text-yellow-400" />,
        color: "from-yellow-400 via-yellow-200 to-yellow-500",
        bgGlow: "bg-yellow-400/20",
        border: "border-yellow-400/60",
        delay: 0,
        order: "order-1 md:order-2", // Center on desktop
        scale: "scale-105 md:scale-110", // Largest
        height: "h-auto md:h-[360px]", // Tallest
    },
    {
        rank: "2nd Runner Up",
        amount: "RM 1,500",
        icon: <Medal className="h-10 w-10 text-orange-400" />,
        color: "from-orange-400 via-orange-200 to-orange-500",
        bgGlow: "bg-orange-400/20",
        border: "border-orange-400/50",
        delay: 0.4,
        order: "order-3 md:order-3", // Right on desktop
        scale: "scale-100",
        height: "h-auto md:h-[280px]",
    },
];

export default function PrizePool() {
    return (
        <section className="relative w-full py-24">
            {/* Background Ambient Glow */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D46476]/10 blur-[120px]" />

            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <div className="mb-16 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#F89924]"
                    >
                        Rewards
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
                    >
                        Grand <span className="bg-gradient-to-r from-[#D46476] to-[#F89924] bg-clip-text text-transparent">Prize Pool</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-lg text-white/60"
                    >
                        Compete for the top spot and win amazing cash prizes.
                    </motion.p>
                </div>

                {/* Podium Grid */}
                <div className="flex flex-col items-end justify-center gap-6 md:flex-row md:items-end md:gap-4 lg:gap-8">
                    {prizes.map((prize) => (
                        <motion.div
                            key={prize.rank}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: prize.delay, duration: 0.5 }}
                            className={`relative w-full ${prize.order} ${prize.scale} flex flex-col`}
                        >
                            {/* Card */}
                            <div
                                className={`group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border ${prize.border} bg-black/60 p-8 text-center backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 ${prize.height}`}
                            >
                                {/* Inner Gradient Glow */}
                                <div className={`absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full ${prize.bgGlow} blur-[60px]`} />

                                {/* Border Gradient Animation */}
                                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${prize.color} opacity-10 transition-opacity duration-500 group-hover:opacity-20`} />

                                <div className="relative z-10 flex flex-col items-center gap-4">
                                    <div className="relative">
                                        {prize.icon}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 blur-lg"
                                        >
                                            {prize.icon}
                                        </motion.div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50 mb-2">
                                            {prize.rank}
                                        </h3>
                                        <div className={`bg-gradient-to-b ${prize.color} bg-clip-text text-4xl font-bold text-transparent md:text-5xl`}>
                                            {prize.amount}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                                        <Star className="h-3 w-3" />
                                        <span>Cash Prize</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
