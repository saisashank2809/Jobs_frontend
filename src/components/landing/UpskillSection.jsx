import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function UpskillSection() {
    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <section className="relative py-24 overflow-hidden bg-[#F6F3ED]">
            {/* Dot grid pattern overlay */}
            <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#313851 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div {...fadeUp}>
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-[#313851] mb-6">
                            Not Job-Ready Yet?<br />
                            <span className="text-[#313851]/30">Upskill First.</span>
                        </h2>
                        <p className="text-lg text-[#313851]/85 leading-relaxed mb-10 max-w-xl font-medium">
                            Found the perfect job but missing a few key requirements? 
                            Don't let the opportunity slip away. Seamlessly bridge your skill gap 
                            and become the perfect candidate.
                        </p>
                        
                        <a 
                            href="https://learn.ottobon.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-[#313851]/14 text-[#313851] font-bold transition-all duration-300 hover:bg-[#313851]/5 hover:border-[#313851]/30 group"
                        >
                            Go to Course Platform
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                    </motion.div>

                    {/* Right: Premium Abstract Visual (CSS Mesh) */}
                    <motion.div 
                        {...fadeUp}
                        transition={{ ...fadeUp.transition, delay: 0.2 }}
                        className="relative aspect-square max-w-md mx-auto lg:ml-auto w-full"
                    >
                        <div className="absolute inset-0 rounded-3xl bg-white border border-[#313851]/10 overflow-hidden shadow-2xl p-8 flex flex-col gap-6">
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#313851]/20" />
                                    <div className="w-3 h-3 rounded-full bg-[#313851]/10" />
                                    <div className="w-3 h-3 rounded-full bg-[#313851]/5" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-[#313851] text-white text-[8px] font-bold uppercase tracking-widest">
                                    Pro Learning
                                </div>
                            </div>

                            {/* Main Progress Block */}
                            <div className="space-y-4 mt-4">
                                <div className="h-4 w-2/3 rounded-lg bg-[#313851]/5" />
                                <div className="h-2 w-full rounded-full bg-[#313851]/5 relative overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "70%" }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="absolute inset-y-0 left-0 bg-[#313851] rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Skill Grid Mockup */}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 * i }}
                                        className="h-12 rounded-xl border border-[#313851]/5 bg-[#F6F3ED] flex items-center px-4 gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-[#313851]/10" />
                                        <div className="h-2 w-12 rounded bg-[#313851]/10" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Floating decorative element */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-8 right-8 w-24 h-24 rounded-2xl bg-[#C2CBD3]/20 backdrop-blur-xl border border-white/40 shadow-xl flex flex-col items-center justify-center gap-2"
                            >
                                <div className="text-[#313851] font-bold text-xl">85%</div>
                                <div className="text-[#313851]/40 text-[7px] font-black uppercase tracking-widest">Mastery</div>
                            </motion.div>
                        </div>
                        
                        {/* Glow effect behind */}
                        <div className="absolute -inset-4 bg-[#313851]/5 blur-3xl -z-10 rounded-full" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
