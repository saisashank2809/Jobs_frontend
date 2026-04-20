import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';

const CoursesPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-24 px-6 bg-[#FBFBFB]">
            {/* Page Header */}
            <header className="mb-20 border-b border-zinc-100 pb-12">
                <h1 className="text-4xl md:text-5xl font-sans font-bold text-zinc-900 tracking-tight">
                    Learning Pathways
                </h1>
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-6 flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-zinc-200" />
                    Exclusive cohorts and upskilling resources to bridge your gaps.
                </div>
            </header>

            {/* Flagship Course Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white border border-zinc-100 rounded-[48px] overflow-hidden shadow-2xl shadow-zinc-900/5 hover:-translate-y-1 transition-all duration-500"
            >
                {/* Top Zone — Hero Gradient */}
                <div className="h-56 bg-zinc-900 p-10 relative overflow-hidden">
                    {/* Subtle design element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-700 rounded-full blur-3xl opacity-30 -ml-16 -mb-16" />

                    {/* Live Cohort Badge */}
                    <div className="relative inline-flex items-center gap-2.5 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border border-white/10 backdrop-blur-xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                        </span>
                        LIVE SYNTHESIS
                    </div>
                </div>

                {/* Bottom Zone — Content */}
                <div className="p-12 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight mb-3">
                                AI Native Architect
                            </h2>
                            <div className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xl">
                                Master high-performance system architecture and LLM integration. 
                                Deep dive into React, Hexagonal Architecture, and Production AI Ops.
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100">
                                <Sparkles size={28} />
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <a
                        href="https://learn.ottobon.in/course/ai-native-fullstack-developer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-5 rounded-full bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
                    >
                        Enroll Now
                        <ExternalLink size={16} />
                    </a>
                </div>
            </motion.div>

            {/* Footer hint */}
            <div className="mt-16 text-center">
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.5em]">
                    New signals dropping soon
                </p>
            </div>
        </div>
    );
};

export default CoursesPage;
