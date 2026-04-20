import { motion } from "framer-motion";

const stats = [
    { label: "Active Jobs", value: "50,000+" },
    { label: "Top Companies", value: "12,000+" },
    { label: "Successful Hires", value: "1.2M+" },
    { label: "Global Locations", value: "45+" },
];

export function StatsSection() {
    return (
        <section className="py-16 border-y border-[#C2CBD3]/50" style={{ backgroundColor: '#F6F3ED' }}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div
                                className="font-extrabold mb-2"
                                style={{
                                    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    color: '#313851',
                                    fontStyle: 'normal',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {stat.value}
                            </div>
                            <div
                                className="font-semibold uppercase tracking-widest"
                                style={{ fontSize: '0.7rem', color: 'rgba(49, 56, 81, 0.48)', letterSpacing: '0.18em' }}
                            >
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
