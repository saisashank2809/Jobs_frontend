"use client";

// @ts-expect-error - framer-motion types are currently causing IDE resolution errors in some setups.
import { motion } from "framer-motion";
import {
    Code2,
    Palette,
    BarChart,
    Search,
    Cpu,
    Globe,
    Zap,
    Heart
} from "lucide-react";

const categories = [
    { name: "Engineering", icon: Code2, count: "12k+ Jobs" },
    { name: "Design", icon: Palette, count: "5k+ Jobs" },
    { name: "Marketing", icon: BarChart, count: "8k+ Jobs" },
    { name: "Data Science", icon: Search, count: "4k+ Jobs" },
    { name: "Robotics", icon: Cpu, count: "2k+ Jobs" },
    { name: "Finance", icon: Globe, count: "6k+ Jobs" },
    { name: "Sales", icon: Zap, count: "10k+ Jobs" },
    { name: "Healthcare", icon: Heart, count: "3k+ Jobs" },
];

export function CategoriesSection() {
    const scrollToJobs = () => {
        const el = document.getElementById('featured-jobs');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="bg-white py-24 border-t border-black/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-black mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-black/60 max-w-2xl mx-auto">
                        Explore thousands of job opportunities across specialized domains.
                        Filtering through the noise to find your perfect fit.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            onClick={scrollToJobs}
                            className="bg-gray-50/50 border border-black/5 rounded-2xl p-6 md:p-8 hover:bg-white hover:border-black/20 hover:shadow-xl hover:shadow-black/5 transition-all group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <category.icon className="w-6 h-6 text-black" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-1">{category.name}</h3>
                            <p className="text-sm text-black/40 font-medium">{category.count}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={scrollToJobs}
                        className="px-8 py-3.5 rounded-full bg-black text-white font-medium hover:bg-black/90 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl text-sm inline-flex items-center gap-2"
                    >
                        Explore all categories
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
