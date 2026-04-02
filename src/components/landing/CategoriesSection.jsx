import React from 'react';
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
import { CategoryCard } from "../ui/CategoryCard";

/**
 * Enhanced CategoriesSection - Minimal, modern, and highly interactive.
 * Using a responsive grid (2 cols mobile / 4 cols desktop).
 */
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
        <section id="categories" className="bg-[#F8F9FA]/30 py-28 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
                    <div className="max-w-2xl space-y-6">
                        <h2 className="text-5xl md:text-6xl font-bold text-black tracking-tight leading-tight">
                            Explore specialized <br />
                            <span className="text-black/20">fields of work.</span>
                        </h2>
                        <p className="text-lg text-black/40 font-medium leading-relaxed">
                            Discover high-impact opportunities curated across global tech centers. 
                            Filtering the noise to find your perfect professional match.
                        </p>
                    </div>
                    
                    <button 
                        onClick={scrollToJobs}
                        className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-black hover:text-black/60 transition-all duration-300"
                    >
                        View All Categories
                        <div className="w-12 h-px bg-black/20 group-hover:w-16 transition-all duration-500" />
                    </button>
                </div>

                {/* Grid Layout (2 cols mobile, 4 cols desktop) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 0.8, 
                                delay: (index % 4) * 0.1,
                                ease: [0.21, 0.47, 0.32, 0.98]
                            }}
                        >
                            <CategoryCard
                                name={category.name}
                                icon={category.icon}
                                count={category.count}
                                onClick={scrollToJobs}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Decorative Element */}
                <div className="mt-32 h-px w-full bg-gradient-to-r from-transparent via-black/5 to-transparent shadow-[0_1px_4px_rgba(0,0,0,0.02)]" />
            </div>
        </section>
    );
}
