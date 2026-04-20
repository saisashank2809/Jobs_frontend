import { motion } from 'framer-motion';
import { Bot, Users, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="landing-card group flex flex-col p-6"
        style={{ minHeight: '240px' }}
    >
        {/* Icon box */}
        <div
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#C2CBD3] transition-all duration-300 group-hover:border-[#313851] group-hover:bg-[#313851]"
            style={{ backgroundColor: '#F6F3ED' }}
        >
            <Icon
                className="h-6 w-6 transition-colors duration-300 group-hover:text-white"
                style={{ color: '#313851' }}
            />
        </div>

        {/* Title */}
        <h3
            className="mb-3 font-semibold leading-snug tracking-tight"
            style={{
                fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
                fontSize: '1.1rem',
                color: '#313851',
                fontStyle: 'normal',
            }}
        >
            {title}
        </h3>

        {/* Description */}
        <p
            className="font-medium leading-7"
            style={{ fontSize: '0.9rem', color: 'rgba(49, 56, 81, 0.62)' }}
        >
            {description}
        </p>
    </motion.div>
);

export function MockInterviewSection() {
    return (
        <section className="py-16 px-6 md:px-12 lg:px-20 overflow-hidden relative" style={{ backgroundColor: '#F6F3ED' }}>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">

                    {/* Left — Intro copy */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Badge */}
                            <div
                                className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C2CBD3] bg-white px-4 py-2"
                                style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(49,56,81,0.65)' }}
                            >
                                <Sparkles size={12} style={{ color: '#313851' }} />
                                <span>Next-Gen Preparation</span>
                            </div>

                            {/* Heading */}
                            <h2
                                className="mb-8 pr-4 font-extrabold leading-tight tracking-tight"
                                style={{
                                    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                    color: '#313851',
                                    fontStyle: 'normal',
                                }}
                            >
                                Master Your<br />
                                <span style={{ color: 'rgba(49, 56, 81, 0.72)' }}>Mock Interview</span>
                            </h2>

                            {/* Body */}
                            <p
                                className="font-medium leading-9 max-w-lg mb-10"
                                style={{ fontSize: '1.1rem', color: 'rgba(49, 56, 81, 0.68)' }}
                            >
                                Experience a simulation so real, you'll forget it's AI. We've synthesized the collective
                                wisdom of top industry professionals into a single, cohesive training partner.
                            </p>

                            {/* Dark quote panel */}
                            <div
                                className="group relative overflow-hidden rounded-xl p-6 text-white shadow-[0_24px_58px_-34px_rgba(49,56,81,0.55)]"
                                style={{ backgroundColor: '#313851' }}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                                    <MessageSquare size={64} />
                                </div>
                                <h3
                                    className="mb-4 flex items-center gap-3 font-semibold tracking-tight text-white"
                                    style={{
                                        fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
                                        fontSize: '1.25rem',
                                        fontStyle: 'normal',
                                    }}
                                >
                                    <Bot style={{ color: 'white' }} />
                                    The Core Message
                                </h3>
                                <p className="font-medium leading-8" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.80)' }}>
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
