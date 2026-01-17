"use client";

import { motion } from "framer-motion";
import {
    Github,
    FileSpreadsheet,
    BarChart3,
    Code2,
    Terminal
} from "lucide-react";

import Link from "next/link";
import { MoveUpRight } from "lucide-react";

// Tool Data
const tools = [
    {
        name: "R",
        description: "Statistical computing and graphics used for data analysis.",
        icon: <BarChart3 className="h-8 w-8 text-[#276DC3]" />, // R blue
        color: "from-[#276DC3]/20 via-transparent to-transparent",
        span: "col-span-1 md:col-span-2 lg:col-span-1",
        href: "https://www.r-project.org/",
    },
    {
        name: "Spyder-IDE",
        description: "Powerful scientific environment for Python development.",
        icon: <Terminal className="h-8 w-8 text-[#FF0000]" />, // Red-ish for Spyder logo
        color: "from-[#FF0000]/20 via-transparent to-transparent",
        span: "col-span-1 md:col-span-1 lg:col-span-1",
        href: "https://www.spyder-ide.org/",
    },
    {
        name: "VS Code",
        description: "Streamlined code editor with support for operations like debugging and version control.",
        icon: <Code2 className="h-8 w-8 text-[#007ACC]" />, // VS Code Blue
        color: "from-[#007ACC]/20 via-transparent to-transparent",
        span: "col-span-1 md:col-span-3 lg:col-span-2",
        href: "https://code.visualstudio.com/",
    },
    {
        name: "GitHub",
        description: "Cloud-based version control system for collaboration.",
        icon: <Github className="h-8 w-8 text-white" />,
        color: "from-white/10 via-transparent to-transparent",
        span: "col-span-1 md:col-span-2 lg:col-span-2",
        href: "https://github.com/",
    },
    {
        name: "Power BI",
        description: "Interactive data visualization and business intelligence tools.",
        icon: <BarChart3 className="h-8 w-8 text-[#F2C811]" />, // Power BI Yellow
        color: "from-[#F2C811]/20 via-transparent to-transparent",
        span: "col-span-1 md:col-span-1 lg:col-span-1",
        href: "https://powerbi.microsoft.com/",
    },
    {
        name: "Excel",
        description: "Powerful spreadsheet software for data organization and analysis.",
        icon: <FileSpreadsheet className="h-8 w-8 text-[#217346]" />, // Excel Green
        color: "from-[#217346]/20 via-transparent to-transparent",
        span: "col-span-1 md:col-span-3 lg:col-span-1",
        href: "https://www.microsoft.com/en-us/microsoft-365/excel",
    },
];

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function ToolsGrid() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold tracking-tight text-white sm:text-5xl"
                >
                    Tools & <span className="bg-gradient-to-r from-[#D46476] to-[#F89924] bg-clip-text text-transparent">Technologies</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 text-lg text-white/60"
                >
                    Master the industry-standard software and tools commonly used by actuaries and data scientists.
                </motion.p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
            >
                {tools.map((tool) => (
                    <motion.div
                        key={tool.name}
                        variants={item}
                        className={tool.span}
                    >
                        <Link href={tool.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                            <div className={`group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl`}>
                                {/* Background Gradient Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />

                                <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 shadow-inner ring-1 ring-white/10">
                                            {tool.icon}
                                        </div>
                                        <MoveUpRight className="h-5 w-5 text-white/30 transition-colors group-hover:text-white" />
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="mb-2 text-xl font-bold text-white">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-white/60">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
