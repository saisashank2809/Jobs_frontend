import { motion } from "framer-motion";
import { TrendingUp, BookOpen, MousePointerClick, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

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
    fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
    fontStyle: 'normal',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    color: '#313851',
};

export function BenefitsSection() {
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const BenefitItem = ({ benefit, index }) => (
        <div
            key={index}
            className="flex gap-5 sm:gap-6 items-center sm:items-start p-5 sm:p-6 rounded-2xl border bg-white transition-all duration-300 group cursor-default hover:-translate-y-1 hover:shadow-xl"
            style={{ borderColor: '#C2CBD3' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#313851'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#C2CBD3'}
        >
            <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#313851]"
                style={{ backgroundColor: 'rgba(49, 56, 81, 0.07)' }}
            >
                <benefit.icon
                    className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 group-hover:text-white"
                    style={{ color: '#313851' }}
                    strokeWidth={1.5}
                />
            </div>
            <p
                className="font-medium leading-relaxed sm:pt-2 max-sm:text-sm transition-colors duration-300"
                style={{ fontSize: '0.94rem', color: 'rgba(49, 56, 81, 0.78)' }}
            >
                {benefit.title}
            </p>
        </div>
    );

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                {/* Job Seekers */}
                <div className="py-16 px-8 lg:px-16 xl:px-24 flex justify-center lg:justify-end" style={{ backgroundColor: '#ffffff' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-xl w-full flex flex-col justify-center"
                    >
                        <p className="section-label mb-4">Got talent?</p>
                        <h2 className="text-3xl md:text-3xl mb-12" style={sectionHeadingStyle}>
                            Why job seekers love us
                        </h2>

                        <div className="space-y-4">
                            {jobSeekerBenefits.map((benefit, index) => (
                                <BenefitItem key={index} benefit={benefit} index={index} />
                            ))}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('featured-jobs')}
                                className="px-6 py-2.5 rounded-xl border font-semibold hover:opacity-75 transition-opacity text-sm cursor-pointer"
                                style={{ borderColor: '#C2CBD3', color: '#313851' }}
                            >
                                Learn more
                            </button>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90 shadow-sm text-sm cursor-pointer inline-block text-center text-white"
                                style={{ backgroundColor: '#313851' }}
                            >
                                Sign up
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Recruiters */}
                <div className="py-16 px-8 lg:px-16 xl:px-24 flex justify-center lg:justify-start" style={{ backgroundColor: '#F6F3ED' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="max-w-xl w-full flex flex-col justify-center"
                    >
                        <p className="section-label mb-4">Need talent?</p>
                        <h2 className="text-3xl md:text-3xl mb-12" style={sectionHeadingStyle}>
                            Why recruiters love us
                        </h2>

                        <div className="space-y-4">
                            {recruiterBenefits.map((benefit, index) => (
                                <BenefitItem key={index} benefit={benefit} index={index} />
                            ))}
                        </div>

                        <div className="mt-16 flex items-center gap-4">
                            <button
                                onClick={() => scrollToSection('stats')}
                                className="px-6 py-2.5 rounded-xl border font-semibold hover:opacity-75 transition-opacity text-sm cursor-pointer"
                                style={{ borderColor: '#C2CBD3', color: '#313851' }}
                            >
                                Learn more
                            </button>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90 shadow-sm text-sm cursor-pointer inline-block text-center text-white"
                                style={{ backgroundColor: '#313851' }}
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
