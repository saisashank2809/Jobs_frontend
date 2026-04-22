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
                            href="/ottolearn"
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
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#313851]/5 to-transparent border border-[#313851]/10 overflow-hidden shadow-2xl">
                            {/* Abstract mesh shapes */}
                            <div className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[#C2CBD3]/20 blur-[100px] animate-pulse" />
                            <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-[#313851]/10 blur-[100px]" />
                            
                            {/* Stylized code snippet look */}
                            <div className="absolute inset-8 flex flex-col gap-4 opacity-10">
                                <div className="h-2 w-3/4 rounded bg-[#313851]" />
                                <div className="h-2 w-1/2 rounded bg-[#313851]" />
                                <div className="h-2 w-5/6 rounded bg-[#313851]" />
                                <div className="mt-4 h-2 w-2/3 rounded bg-[#313851]" />
                                <div className="h-2 w-3/4 rounded bg-[#313851]" />
                            </div>
                        </div>
                        
                        {/* Glow effect behind */}
                        <div className="absolute -inset-4 bg-[#313851]/5 blur-3xl -z-10 rounded-full" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
