"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

interface VideoCardProps {
    title: string;
    description: string;
    fbVideoUrl: string;
    thumbnail: string;
}

function VideoCard({ title, description, fbVideoUrl, thumbnail }: VideoCardProps) {
    return (
        <a 
            href={fbVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel group relative flex flex-col overflow-hidden rounded-3xl p-2 transition-all hover:border-white/30 h-full block"
        >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/60">
                <div className="absolute inset-0">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-500">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-full bg-white/10 p-4 backdrop-blur-md transition-all shadow-lg group-hover:bg-[#1877F2]/20 group-hover:shadow-[#1877F2]/50"
                        >
                            <PlayCircle className="h-12 w-12 text-[#1877F2]" strokeWidth={1.5} />
                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col p-6 text-center">
                <h3 className="text-xl font-bold text-white group-hover:text-[#1877F2] transition-colors">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{description}</p>
            </div>
        </a>
    );
}

export default function VideoRecap() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            <div className="flex flex-col gap-2 items-center text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1877F2]">
                    Facebook Live Recaps
                </p>
                <h2 className="text-3xl font-bold text-white">Relive the Action</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.1 }}
                >
                    <VideoCard
                        title="Finalist Presentations"
                        description="Watch the top teams pitch their innovative solutions to our panel of industry experts."
                        fbVideoUrl="https://www.facebook.com/share/v/1EUAS8xACW/"
                        thumbnail="/winners/collage-2.jpeg"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2 }}
                >
                    <VideoCard
                        title="Industry Panel Session"
                        description="Hear from leaders discussing Climate Risk, Financial Resilience, and the future of Actuarial Science."
                        fbVideoUrl="https://www.facebook.com/share/v/1BT8wf7h9z/"
                        thumbnail="/winners/collage-3.jpeg"
                    />
                </motion.div>
            </div>
        </div>
    );
}
