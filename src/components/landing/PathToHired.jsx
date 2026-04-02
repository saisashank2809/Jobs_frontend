import { motion } from "framer-motion";
import { User, MessageCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { ShaderAnimation } from "../ui/ShaderAnimation";

export function PathToHired() {
    return (
        <section className="relative bg-black py-24 overflow-hidden">
            {/* Shader Background */}
            <div className="absolute inset-0 z-0 opacity-80">
                <ShaderAnimation />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
                    <h2 className="text-6xl md:text-7xl font-display font-black tracking-tighter leading-[0.85] text-white italic">
                        YOUR NEW <br />
                        PATH <br />
                        TO HIRED.
                    </h2>
                    <Link
                        to="/register"
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform cursor-pointer inline-block"
                    >
                        Get started free
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans tracking-tight">Apply to humans</h3>
                        <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                            72% of applications are never seen by a human! With Ottobon you skip the line and go direct to the hiring team.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans tracking-tight">Instantly stand out</h3>
                        <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                            Showcase your projects, passions and work ethos with Ottobon Profile to stand out from the crowd.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-sans tracking-tight">Real time feedback</h3>
                        <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                            Don&apos;t get ghosted! Get feedback &amp; notifications with every application, so that you&apos;re never left wondering.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
