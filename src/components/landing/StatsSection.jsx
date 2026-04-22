import { motion } from "framer-motion";

const stats = [
    { label: "Active Jobs", value: "50,000+" },
    { label: "Top Companies", value: "12,000+" },
    { label: "Successful Hires", value: "1.2M+" },
    { label: "Global Locations", value: "45+" },
];

export function StatsSection() {
    return (
        <section className="py-16 border-y border-[#C2CBD3]/[0.14] bg-[#313851]">
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
                                className="font-medium mb-2"
                                style={{
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                                    color: '#F6F3ED',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                {stat.value}
                            </div>
                            <div
                                className="font-medium uppercase tracking-[0.2em] text-[#F6F3ED]/65"
                                style={{ fontSize: '0.65rem' }}
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
