import { motion } from 'framer-motion';
import { Bot, Users, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        className="group flex flex-col p-8 rounded-2xl border border-[#C2CBD3]/10 bg-[#F6F3ED]/[0.03] backdrop-blur-xl hover:border-[#C2CBD3]/30 transition-all duration-300"
        style={{ minHeight: '240px' }}
    >
        {/* Icon box */}
        <div
            className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-[#C2CBD3]/20 bg-[#F6F3ED]/5 transition-all duration-500 group-hover:bg-[#C2CBD3] group-hover:border-[#C2CBD3]"
        >
            <Icon
                className="h-6 w-6 text-[#C2CBD3] transition-colors duration-500 group-hover:text-[#313851]"
            />
        </div>

        {/* Title */}
        <h3
            className="mb-3 font-medium leading-snug tracking-tight text-[#F6F3ED]"
            style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '1.1rem',
            }}
        >
            {title}
        </h3>

        {/* Description */}
        <p
            className="font-medium leading-7 text-[#F6F3ED]/85"
            style={{ fontSize: '0.9rem' }}
        >
            {description}
        </p>
    </motion.div>
);

export function MockInterviewSection() {
    return (
        <section className="py-24 px-6 md:px-12 lg:px-20 overflow-hidden relative bg-[#313851]">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">

                    {/* Left — Intro copy */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Badge */}
                            <div
                                className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F6F3ED]/20 bg-[#F6F3ED]/10 px-4 py-2"
                                style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F6F3ED' }}
                            >
                                <Sparkles size={12} className="text-[#C2CBD3]" />
                                <span>Next-Gen Preparation</span>
                            </div>

                            {/* Heading */}
                            <h2
                                className="mb-8 pr-4 font-medium leading-tight tracking-tight text-[#F6F3ED]"
                                style={{
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                }}
                            >
                                Master Your<br />
                                <span className="text-[#F6F3ED]/30">Mock Interview</span>
                            </h2>

                            {/* Body */}
                            <p
                                className="font-medium leading-9 max-w-lg mb-10 text-[#F6F3ED]/85"
                                style={{ fontSize: '1.1rem' }}
                            >
                                Experience a simulation so real, you'll forget it's AI. We've synthesized the collective
                                wisdom of top industry professionals into a single, cohesive training partner.
                            </p>

                            {/* Dark quote panel */}
                            <div
                                className="group relative overflow-hidden rounded-xl p-8 border border-[#C2CBD3]/20 bg-[#F6F3ED]/[0.03] backdrop-blur-xl"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                                    <MessageSquare size={64} className="text-[#C2CBD3]" />
                                </div>
                                <h3
                                    className="mb-4 flex items-center gap-3 font-medium tracking-tight text-[#F6F3ED]"
                                    style={{
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    <Bot className="text-[#C2CBD3]" />
                                    The Core Message
                                </h3>
                                <p className="font-medium leading-8 text-[#F6F3ED]/85" style={{ fontSize: '1.05rem' }}>
                                    "Real insights are used from the people of the company and AI is used to present it."
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — 4-card grid */}
                    <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureCard
                            icon={Users}
                            title="Human Verified"
                            description="Direct data from employees at Tier-1 tech firms ensures your prep matches actual internal bars."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Bot}
                            title="AI Delivered"
                            description="Neural-engine agents adapt to your tone and responses in real-time, providing infinite variation."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="High Fidelity"
                            description="Not just generic questions. We mirror specific company cultures, values, and technical stacks."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Mastery"
                            description="Receive granular feedback on your non-verbal cues, technical depth, and cultural alignment."
                            delay={0.4}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
