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
import { cn } from "../../utils/cn";

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
        <section id="categories" className="py-16 overflow-hidden" style={{ backgroundColor: '#F6F3ED' }}>
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">

                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-6">
                    <div className="max-w-3xl">
                        <p className="section-label mb-5">Job Categories</p>
                        <h2
                            className="font-extrabold tracking-tight leading-tight"
                            style={{
                                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                color: '#313851',
                                fontStyle: 'normal',
                            }}
                        >
                            Browse by <br />
                            <span style={{ color: 'rgba(49, 56, 81, 0.30)' }}>Job Categories.</span>
                        </h2>
                        <p
                            className="mt-6 font-medium leading-relaxed max-w-xl"
                            style={{ fontSize: '1.1rem', color: 'rgba(49, 56, 81, 0.60)' }}
                        >
                            Explore top-tier opportunities across global tech hubs.
                            We filter the noise, presenting only the elite professional matches.
                        </p>
                    </div>

                    <div className="lg:pb-2">
                        <button
                            onClick={scrollToJobs}
                            className="group flex flex-col items-start gap-4"
                        >
                            <span
                                className="font-bold uppercase transition-colors group-hover:opacity-100"
                                style={{ fontSize: '0.68rem', letterSpacing: '0.36em', color: 'rgba(49, 56, 81, 0.45)' }}
                            >
                                Explore Jobs
                            </span>
                            <div
                                className="h-[2px] transition-all duration-700 group-hover:w-40"
                                style={{ width: '5rem', backgroundColor: 'rgba(49, 56, 81, 0.18)' }}
                            />
                        </button>
                    </div>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={cn(
                                "h-full",
                                index % 4 === 1 ? "lg:mt-12" : "",
                                index % 4 === 2 ? "lg:-mt-8" : "",
                                index % 4 === 3 ? "lg:mt-4" : ""
                            )}
                            transition={{
                                duration: 1.0,
                                delay: (index % 4) * 0.12,
                                ease: [0.23, 1, 0.32, 1]
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

                <div className="mt-24 h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(49, 56, 81, 0.10), transparent)' }} />
            </div>
        </section>
    );
}
