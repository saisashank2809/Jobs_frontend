"use client";

// @ts-expect-error - framer-motion types are currently causing IDE resolution errors in some setups.
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, MousePointerClick, Star, Sparkles } from "lucide-react";
import Link from "next/link";


const jobSeekerBenefits = [
    {
        title: "Connect directly with founders at top startups - no third party recruiters allowed.",
        icon: TrendingUp,
    },
    {
        title: "Everything you need to know, all upfront. View salary, stock options, and more before applying.",
        icon: BookOpen,
    },
    {
        title: "Say goodbye to cover letters - your profile is all you need. One click to apply and you're done.",
        icon: MousePointerClick,
    },
    {
        title: "Unique jobs at startups and tech companies you can't find anywhere else.",
        icon: Star,
    },
    {
        title: "Customized approach to accelerate your career.",
        icon: Sparkles,
    },
];

const recruiterBenefits = [
    {
        title: "Tap into a community of 10M+ engaged, startup-ready candidates.",
        icon: TrendingUp,
    },
    {
        title: "Everything you need to kickstart your recruiting — set up job posts, company branding, and HR tools within 10 minutes, all for free.",
        icon: BookOpen,
    },
    {
        title: "A free applicant tracking system, or free integration with any ATS you may already use.",
        icon: MousePointerClick,
    },
    {
        title: "Let us handle the heavy-lifting with RecruiterCloud. Our new AI-Recruiter scans 500M+ candidates, filters it down based on your unique calibration, and schedules your favorites on your calendar in a matter of days.",
        icon: Star,
    },
];

export function BenefitsSection() {
    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Job Seekers Section */}
                <div className="bg-white py-24 px-8 lg:px-16 xl:px-24 flex justify-center lg:justify-end">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl w-full flex flex-col justify-center"
                    >
                        <p className="text-black font-medium mb-4 text-lg font-serif">Got talent?</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-12 tracking-tight font-serif">
                            Why job seekers love us
                        </h2>

                        <div className="space-y-4">
                            {jobSeekerBenefits.map((benefit, index) => (
                                <div key={index} className="flex gap-5 sm:gap-6 items-center sm:items-start p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white hover:border-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors duration-300">
                                        <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-black/80 font-medium leading-relaxed sm:pt-2 max-sm:text-sm text-[15px] group-hover:text-black transition-colors duration-300">
                                        {benefit.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('featured-jobs')}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-black font-semibold hover:bg-black/5 transition-colors text-sm cursor-pointer"
                            >
                                Learn more
                            </button>
                            <Link
                                href="/signup"
                                className="px-6 py-2.5 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition-colors shadow-sm text-sm cursor-pointer inline-block text-center"
                            >
                                Sign up
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Recruiters Section */}
                <div className="bg-gray-50/50 py-24 px-8 lg:px-16 xl:px-24 flex justify-center lg:justify-start">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="max-w-xl w-full flex flex-col justify-center"
                    >
                        <p className="text-black font-medium mb-4 text-lg font-serif">Need talent?</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-black mb-12 tracking-tight font-serif">
                            Why recruiters love us
                        </h2>

                        <div className="space-y-4">
                            {recruiterBenefits.map((benefit, index) => (
                                <div key={index} className="flex gap-5 sm:gap-6 items-center sm:items-start p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white hover:border-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors duration-300">
                                        <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-black/80 font-medium leading-relaxed sm:pt-2 max-sm:text-sm text-[15px] group-hover:text-black transition-colors duration-300">
                                        {benefit.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('stats')}
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-black font-semibold hover:bg-black/5 transition-colors text-sm cursor-pointer"
                            >
                                Learn more
                            </button>
                            <Link
                                href="/employers/signup"
                                className="px-6 py-2.5 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition-colors shadow-sm text-sm cursor-pointer inline-block text-center"
                            >
                                Sign up
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
