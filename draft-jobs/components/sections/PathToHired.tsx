"use client";

import { motion } from "framer-motion";
import { User, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";

export function PathToHired() {
    // const scrollToSignup = () => {
    //     const el = document.getElementById('newsletter-section');
    //     if (el) el.scrollIntoView({ behavior: 'smooth' });
    // };

    return (
        <section className="bg-[#F9F7F2] py-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
                    <h2 className="text-6xl md:text-7xl font-serif font-black tracking-tight leading-[0.9] text-black italic">
                        YOUR NEW <br />
                        PATH <br />
                        TO HIRED.
                    </h2>
                    <Link
                        href="/signup"
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
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                            <User className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-black font-sans tracking-tight">Apply to humans</h3>
                        <p className="text-black/60 text-sm leading-relaxed font-sans font-medium">
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
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-black font-sans tracking-tight">Instantly stand out</h3>
                        <p className="text-black/60 text-sm leading-relaxed font-sans font-medium">
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
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-black font-sans tracking-tight">Real time feedback</h3>
                        <p className="text-black/60 text-sm leading-relaxed font-sans font-medium">
                            Don&apos;t get ghosted! Get feedback &amp; notifications with every application, so that you&apos;re never left wondering.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
