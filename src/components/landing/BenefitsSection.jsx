import { motion } from "framer-motion";
import { TrendingUp, BookOpen, MousePointerClick, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

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

const sectionHeadingStyle = {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 500,
    letterSpacing: '-0.025em',
};

export function BenefitsSection() {
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const BenefitItem = ({ benefit, index, isDark }) => (
        <div
            key={index}
            className={cn(
                "flex gap-5 sm:gap-6 items-center sm:items-start p-5 sm:p-6 rounded-2xl border transition-all duration-300 group cursor-default hover:-translate-y-1",
                isDark 
                    ? "border-[#C2CBD3]/[0.14] bg-[#F6F3ED]/[0.06] backdrop-blur-xl hover:border-[#C2CBD3]/[0.3]" 
                    : "border-[#313851]/[0.14] bg-[#313851]/[0.06] backdrop-blur-xl hover:border-[#313851]/[0.3]"
            )}
        >
            <div
                className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    isDark ? "bg-[#F6F3ED]/[0.12] group-hover:bg-[#C2CBD3]" : "bg-[#313851]/[0.12] group-hover:bg-[#313851]"
                )}
            >
                <benefit.icon
                    className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300",
                        isDark ? "text-[#C2CBD3] group-hover:text-[#313851]" : "text-[#313851] group-hover:text-[#F6F3ED]"
                    )}
                    strokeWidth={1.5}
                />
            </div>
            <p
                className={cn(
                    "font-medium leading-relaxed sm:pt-2 max-sm:text-sm",
                    isDark ? "text-[#F6F3ED]/85" : "text-[#313851]/85"
                )}
                style={{ fontSize: '0.94rem' }}
            >
                {benefit.title}
            </p>
        </div>
    );

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                {/* Job Seekers */}
                <div className="py-24 px-8 lg:px-16 xl:px-24 flex justify-center lg:justify-end bg-[#313851]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-xl w-full flex flex-col justify-center"
                    >
                        <p className="text-[#F6F3ED]/65 text-xs font-bold uppercase tracking-[0.2em] mb-4">Got talent?</p>
                        <h2 className="text-3xl md:text-4xl mb-12 text-[#F6F3ED]" style={sectionHeadingStyle}>
                            Why job seekers love us
                        </h2>

                        <div className="space-y-4">
                            {jobSeekerBenefits.map((benefit, index) => (
                                <BenefitItem key={index} benefit={benefit} index={index} isDark={true} />
                            ))}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('featured-jobs')}
                                className="px-8 py-3 rounded-xl border border-[#C2CBD3] font-bold hover:bg-[#C2CBD3]/10 transition-all text-sm cursor-pointer text-[#C2CBD3]"
                            >
                                Learn more
                            </button>
                            <Link
                                to="/register"
                                className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-sm text-sm cursor-pointer inline-block text-center text-[#313851] bg-[#C2CBD3]"
                            >
                                Sign up
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Recruiters */}
                <div className="py-24 px-8 lg:px-16 xl:px-24 flex justify-center lg:justify-start bg-[#F6F3ED]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="max-w-xl w-full flex flex-col justify-center"
                    >
                        <p className="text-[#313851]/65 text-xs font-bold uppercase tracking-[0.2em] mb-4">Need talent?</p>
                        <h2 className="text-3xl md:text-4xl mb-12 text-[#313851]" style={sectionHeadingStyle}>
                            Why recruiters love us
                        </h2>

                        <div className="space-y-4">
                            {recruiterBenefits.map((benefit, index) => (
                                <BenefitItem key={index} benefit={benefit} index={index} isDark={false} />
                            ))}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('stats')}
                                className="px-8 py-3 rounded-xl border border-[#313851]/20 font-bold hover:bg-[#313851]/5 transition-all text-sm cursor-pointer text-[#313851]"
                            >
                                Learn more
                            </button>
                            <Link
                                to="/register"
                                className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-sm text-sm cursor-pointer inline-block text-center text-[#F6F3ED] bg-[#313851]"
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
