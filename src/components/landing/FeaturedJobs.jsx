import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { JobFlipCard } from "../ui/JobFlipCard";

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
    const navigate = useNavigate();

    return (
        <section className="py-24 bg-[#F6F3ED]">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
                    <div>
                        <p className="text-[#313851]/65 text-xs font-bold uppercase tracking-[0.2em] mb-4">Curated Picks</p>
                        <h2
                            className="font-medium tracking-tight mb-3 text-[#313851]"
                            style={{
                                fontFamily: "'Inter', system-ui, sans-serif",
                                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                            }}
                        >
                            Featured Opportunities
                        </h2>
                        <p
                            className="max-w-xl font-medium text-[#313851]/85"
                            style={{ fontSize: '0.975rem' }}
                        >
                            Discover roles at leading startups and global tech giants.
                            Find your next career move with us.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            to="/register"
                            className="font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all hover:scale-105 cursor-pointer inline-block bg-[#313851] text-[#F6F3ED]"
                        >
                            Get started
                        </Link>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 font-semibold text-sm transition-colors cursor-pointer text-[#313851] border-b-2 border-[#313851]/20 hover:border-[#313851] pb-1"
                        >
                            View All Jobs <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.1,
                                ease: [0.21, 0.47, 0.32, 0.98]
                            }}
                        >
                            <JobFlipCard job={job} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
