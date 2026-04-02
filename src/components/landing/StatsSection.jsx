import { motion } from "framer-motion";

const stats = [
    { label: "Active Jobs", value: "50,000+" },
    { label: "Top Companies", value: "12,000+" },
    { label: "Successful Hires", value: "1.2M+" },
    { label: "Global Locations", value: "45+" },
];

export function StatsSection() {
    return (
        <section className="bg-neutral-50/50 py-28 border-y border-black/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-bold text-black mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm uppercase tracking-widest text-black/40 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
