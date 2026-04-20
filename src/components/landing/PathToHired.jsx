import { motion } from "framer-motion";
import { User, MessageCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { ShaderAnimation } from "../ui/ShaderAnimation";

export function PathToHired() {
    return (
        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#313851' }}>
            {/* Shader Background */}
            <div className="absolute inset-0 z-0 opacity-70">
                <ShaderAnimation />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-6">
                    <h2
                        className="font-extrabold tracking-tight leading-[0.95] text-white"
                        style={{
                            fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                            fontStyle: 'normal',
                        }}
                    >
                        YOUR NEW <br />
                        PATH <br />
                        TO GET HIRED.
                    </h2>
                    <Link
                        to="/register"
                        className="font-bold px-8 py-3 rounded-xl transition-transform hover:scale-105 cursor-pointer inline-block text-white"
                        style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}
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
                            transition={{ duration: 0.5, delay }}
                            className="space-y-6"
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.20)' }}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3
                                className="font-bold text-white tracking-tight"
                                style={{
                                    fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
                                    fontSize: '1.1rem',
                                    fontStyle: 'normal',
                                }}
                            >
                                {title}
                            </h3>
                            <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgba(255,255,255,0.68)' }}>
                                {body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
