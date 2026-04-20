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
        <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
                    <div>
                        <p className="section-label mb-3">Curated Picks</p>
                        <h2
                            className="font-extrabold tracking-tight mb-3"
                            style={{
                                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                                color: '#313851',
                                fontStyle: 'normal',
                            }}
                        >
                            Featured Opportunities
                        </h2>
                        <p
                            className="max-w-xl font-medium"
                            style={{ color: 'rgba(49, 56, 81, 0.58)', fontSize: '0.975rem' }}
                        >
                            Discover roles at leading Indian startups and global tech giants.
                            Find your next career move with us.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            to="/register"
                            className="font-semibold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-opacity hover:opacity-90 cursor-pointer inline-block text-white"
                            style={{ backgroundColor: '#313851' }}
                        >
                            Get started
                        </Link>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 font-semibold text-sm transition-colors cursor-pointer hover:opacity-70"
                            style={{ color: '#313851', borderBottom: '2px solid #313851', paddingBottom: '2px' }}
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
