"use client";

// @ts-expect-error - framer-motion types are currently causing IDE resolution errors in some setups.
import { motion } from "framer-motion";
import { MapPin, Briefcase, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const jobs = [
    {
        id: 1,
        company: "Google",
        role: "Senior Software Engineer",
        location: "Bangalore, India",
        type: "Full-time",
        logo: "G",
        color: "bg-blue-50",
        global: true,
    },
    {
        id: 2,
        company: "TCS",
        role: "Full Stack Developer",
        location: "Hyderabad, India",
        type: "Full-time",
        logo: "T",
        color: "bg-gray-50",
        global: false,
    },
    {
        id: 3,
        company: "Swiggy",
        role: "Product Designer",
        location: "Bangalore, India",
        type: "Full-time",
        logo: "S",
        color: "bg-orange-50",
        global: false,
    },
    {
        id: 4,
        company: "Microsoft",
        role: "Cloud Architect",
        location: "Remote / Hyderabad",
        type: "Full-time",
        logo: "M",
        color: "bg-blue-50",
        global: true,
    },
    {
        id: 5,
        company: "Zomato",
        role: "Frontend Engineer",
        location: "Gurugram, India",
        type: "Full-time",
        logo: "Z",
        color: "bg-red-50",
        global: false,
    },
    {
        id: 6,
        company: "CRED",
        role: "iOS Developer",
        location: "Bangalore, India",
        type: "Full-time",
        logo: "C",
        color: "bg-black text-white",
        global: false,
    },
];

export function FeaturedJobs() {
    const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

    const handleApply = (index: number) => {
        if (!appliedJobs.includes(index)) {
            setAppliedJobs([...appliedJobs, index]);
        }
    };

    return (
        <section className="bg-white py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <h2 className="text-4xl font-bold text-black mb-4">
                            Featured Opportunities
                        </h2>
                        <p className="text-black/60 max-w-xl">
                            Discover roles at leading Indian startups and global tech giants.
                            Find your next career move with Us.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/signup"
                            className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-black/90 transition-colors shadow-sm text-sm cursor-pointer inline-block"
                        >
                            Get started
                        </Link>
                        <button
                            onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-black font-semibold border-b-2 border-black pb-1 hover:text-black/60 hover:border-black/30 transition-all cursor-pointer"
                        >
                            View All Jobs
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => handleApply(index)}
                            className="group border border-black/5 rounded-xl p-6 hover:border-black/20 hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer bg-white relative overflow-hidden"
                        >
                            {appliedJobs.includes(index) && (
                                <div className="absolute top-0 right-0 p-4 animate-in fade-in zoom-in duration-300">
                                    <div className="bg-green-500 text-white p-1 rounded-full">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${job.color}`}>
                                    {job.logo}
                                </div>
                                {job.global && (
                                    <span className="text-[10px] uppercase font-bold tracking-tighter bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        Global
                                    </span>
                                )}
                            </div>

                            <h3 className={`text-xl font-bold mb-1 transition-colors ${appliedJobs.includes(index) ? "text-green-600" : "text-black group-hover:text-primary"}`}>
                                {appliedJobs.includes(index) ? "Applied Successfully" : job.role}
                            </h3>
                            <p className="text-black/80 font-medium mb-4">{job.company}</p>

                            <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-black/5">
                                <div className="flex items-center gap-1.5 text-xs text-black/50">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-black/50">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {job.type}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
