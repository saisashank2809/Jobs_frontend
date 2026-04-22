import { motion } from "framer-motion";
import { User, MessageCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { ShaderAnimation } from "../ui/ShaderAnimation";

export function PathToHired() {
    return (
        <section className="relative py-24 overflow-hidden bg-[#F6F3ED]">
            {/* Shader Background */}
            <div className="absolute inset-0 z-0 opacity-10">
                <ShaderAnimation />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-6">
                    <h2
                        className="font-medium tracking-tight leading-[0.95] text-[#313851]"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                        }}
                    >
                        YOUR NEW <br />
                        PATH <br />
                        TO GET HIRED.
                    </h2>
                    <Link
                        to="/register"
                        className="font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 cursor-pointer inline-block bg-[#313851] text-[#F6F3ED]"
                    >
                        Get started free
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-20">
                    {[
                        {
                            icon: User,
                            title: "Apply to humans",
                            body: "72% of applications are never seen by a human! With Ottobon you skip the line and go direct to the hiring team.",
                            delay: 0,
                        },
                        {
                            icon: MessageCircle,
                            title: "Instantly stand out",
                            body: "Showcase your projects, passions and work ethos with Ottobon Profile to stand out from the crowd.",
                            delay: 0.1,
                        },
                        {
                            icon: Zap,
                            title: "Real time feedback",
                            body: "Don't get ghosted! Get feedback & notifications with every application, so that you're never left wondering.",
                            delay: 0.2,
                        },
                    ].map(({ icon: Icon, title, body, delay }) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
                            className="space-y-6"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-[#313851]/[0.06] border-[#313851]/[0.14]">
                                <Icon className="w-5 h-5 text-[#313851]" />
                            </div>
                            <h3
                                className="font-medium text-[#313851] tracking-tight"
                                style={{
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    fontSize: '1.1rem',
                                }}
                            >
                                {title}
                            </h3>
                            <p className="text-sm leading-relaxed font-medium text-[#313851]/85">
                                {body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
