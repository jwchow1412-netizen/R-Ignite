"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
    Download, 
    ExternalLink, 
    Compass, 
    TrendingUp, 
    Award, 
    Globe, 
    Users, 
    Network,
    Calendar,
    BookOpen,
    Star
} from "lucide-react";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";

export default function CUHKPage() {
    return (
        <div className="relative min-h-screen bg-[#0e080f] selection:bg-[#D46476]/30">
            {/* Background elements */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(212,100,118,0.15)] via-[rgba(212,100,118,0.05)] to-transparent blur-3xl" />
                <div className="absolute right-[-10%] top-[40%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(248,153,36,0.1)] via-[rgba(248,153,36,0.02)] to-transparent blur-3xl pointer-events-none" />
            </div>

            <div className="relative z-10">
                {/* 1. Hero Section */}
                <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/CUHK/Visuals/Website banner (image only).jpg"
                            alt="CUHK Actuarial Science Programme"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0e080f]/80 via-[#0e080f]/70 to-[#0e080f]" />
                    </div>

                    <motion.div
                        className="container relative z-10 mx-auto px-4 text-center md:px-6 mt-10"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn} className="mx-auto max-w-sm max-h-[120px] relative w-full aspect-[3/1] mb-6">
                            <Image
                                src="/sponsors/CUHK.png"
                                alt="CUHK Logo"
                                fill
                                className="object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                            />
                        </motion.div>

                        <motion.h1
                            variants={slideUp}
                            className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl max-w-5xl mx-auto leading-tight"
                        >
                            MSc in Actuarial Science and Insurance Analytics
                        </motion.h1>

                        <motion.p
                            variants={slideUp}
                            className="mx-auto mb-10 max-w-3xl text-xl text-[#F89924] font-medium tracking-wide sm:text-2xl"
                        >
                            Asia’s Foremost University for Actuarial Science
                        </motion.p>
                    </motion.div>
                </section>

                {/* 2. Key Stats Bar (APU Style "Course Details") */}
                <section className="container mx-auto px-4 -mt-12 relative z-20 md:px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="bg-[#1a101a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 p-6 md:p-8">
                            <div className="flex items-center gap-4 p-4">
                                <Calendar className="h-10 w-10 text-[#D46476]" strokeWidth={1.5} />
                                <div>
                                    <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Duration</p>
                                    <p className="text-white font-semibold text-lg">1 Year Full-Time</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4">
                                <BookOpen className="h-10 w-10 text-[#F89924]" strokeWidth={1.5} />
                                <div>
                                    <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Discipline</p>
                                    <p className="text-white font-semibold text-lg">Actuarial Science & Analytics</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4">
                                <Star className="h-10 w-10 text-yellow-400" strokeWidth={1.5} />
                                <div>
                                    <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Recognition</p>
                                    <p className="text-white font-semibold text-lg max-w-[200px] leading-tight">SOA UEC Status (5 Exams)</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Prominent Action Buttons */}
                        <div className="bg-white/5 p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg" className="w-full sm:w-64 h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl transition-transform hover:scale-105">
                                <Link href="/CUHK/CUHK_ASI_Brochure.pdf" target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-5 w-5" /> Download Brochure
                                </Link>
                            </Button>
                            
                            <Button asChild size="lg" className="w-full sm:w-64 h-14 bg-gradient-to-r from-[#D46476] to-[#F89924] text-white hover:opacity-90 font-bold text-lg rounded-xl transition-transform hover:scale-105 shadow-[0_0_20px_rgba(212,100,118,0.4)]">
                                <Link href="https://masters.bschool.cuhk.edu.hk/programmes/mscasi/" target="_blank" rel="noopener noreferrer">
                                    Discover More <ExternalLink className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </section>

                {/* 4. "Why Choose CUHK ASI?" Grid */}
                <section className="container mx-auto px-4 py-24 md:px-6">
                    <div className="text-center mb-16">
                        <p className="text-[#F89924] font-bold tracking-widest uppercase text-sm mb-2">About CUHK</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">Why choose ASI?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <Compass className="h-10 w-10 text-[#D46476] mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Pioneering Curriculum</h3>
                            <p className="text-white/70 leading-relaxed">A pioneering initiative in Asia seamlessly integrating actuarial science and insurance analytics within a cohesive framework.</p>
                        </motion.div>

                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.1}} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <TrendingUp className="h-10 w-10 text-[#F89924] mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Industry Aligned</h3>
                            <p className="text-white/70 leading-relaxed">Students will develop advanced analytical and modern insurance analytics skills applicable to a range of roles in insurance companies, banks, financial institutions, and InsurTech start-ups.</p>
                        </motion.div>

                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.2}} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <Award className="h-10 w-10 text-yellow-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">SOA UEC Recognized</h3>
                            <p className="text-white/70 leading-relaxed">Attained University-Earned Credit status from the SOA for five preliminary exams: FM, FAM, SRM, ALTAM, and ASTAM.</p>
                        </motion.div>

                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.3}} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <Globe className="h-10 w-10 text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Global Practice Ready</h3>
                            <p className="text-white/70 leading-relaxed">Covers the associate-level exam materials, facilitating your ability to practice as a recognized professional globally.</p>
                        </motion.div>

                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.4}} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <Users className="h-10 w-10 text-green-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Vibrant Student Life</h3>
                            <p className="text-white/70 leading-relaxed">A range of activities—including workshops, company visits, and other extracurricular engagements—facilitates meaningful connections.</p>
                        </motion.div>

                        <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: 0.5}} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                            <Network className="h-10 w-10 text-purple-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Strong Network</h3>
                            <p className="text-white/70 leading-relaxed">Meaningful connections among students, faculty, peers, and alumni, allowing them to celebrate shared achievements and experiences within a supportive and collegial environment.</p>
                        </motion.div>
                    </div>
                </section>

                {/* Separator */}
                <div className="h-px w-full max-w-5xl mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

                {/* 5. Deep Dive Features (Zig-Zag Layout) */}
                <section className="container mx-auto px-4 py-20 md:px-6">
                    
                    {/* Feature 1 */}
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <Image
                                src="/CUHK/Visuals/_Y8A8606 (2).jpg"
                                alt="A Career-Focused Curriculum"
                                fill
                                className="object-cover"
                            />
                            {/* Decorative accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D46476]/40 to-transparent blur-2xl" />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2"
                        >
                            <p className="text-[#D46476] font-bold tracking-widest uppercase text-sm mb-2">Rigorous Framework</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">A Career-Focused Curriculum</h2>
                            <p className="text-lg text-white/70 leading-relaxed mb-6">
                                The curriculum of MSc in ASI is aligned to standards of professional bodies. It covers the associate-level exam materials administered by the Society of Actuaries (SOA). Notably, the programme has received University-Earned Credit status from the SOA for five preliminary exams – FM, FAM, SRM, ALTAM and ASTAM – underscoring its rigorous and industry-aligned approach.
                            </p>
                            <p className="text-lg text-white/70 leading-relaxed">
                                This full-time, one-year master’s programme is meticulously designed to cultivate high-caliber actuaries capable of addressing the increasing demand for expertise in this field. It creates pathways for individual adept in mathematics and statistics to evaluate and mitigate risks across the insurance, finance, and business sectors.
                            </p>
                        </motion.div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <Image
                                src="/CUHK/Visuals/2613377575.jpg"
                                alt="Beyond Academia"
                                fill
                                className="object-cover"
                            />
                             {/* Decorative accent */}
                             <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#F89924]/40 to-transparent blur-2xl" />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2"
                        >
                            <p className="text-[#F89924] font-bold tracking-widest uppercase text-sm mb-2">Student Life</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Beyond Academia</h2>
                            <p className="text-lg text-white/70 leading-relaxed mb-6">
                                Beyond the acquisition of robust analytical skills and modern insurance analytics competencies applicable to various actuarial and analytical roles, the programme also fosters a vibrant student life that extends beyond academia.
                            </p>
                            <p className="text-lg text-white/70 leading-relaxed">
                                A range of activities—including workshops, company visits, and other extracurricular engagements—facilitates meaningful connections among students, faculty, peers, and alumni, allowing them to celebrate shared achievements and experiences within a supportive and collegial environment.
                            </p>
                        </motion.div>
                    </div>

                </section>
                
                {/* Bottom Spacer */}
                <div className="h-24" />
            </div>
        </div>
    );
}
