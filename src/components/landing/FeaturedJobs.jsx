import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
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
                            to="/register"
                            className="bg-black text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-black/90 transition-colors shadow-sm text-sm cursor-pointer inline-block"
                        >
                            Get started
                        </Link>
                        <Link
                            to="/jobs"
                            className="text-black font-semibold border-b-2 border-black pb-1 hover:text-black/60 hover:border-black/30 transition-all cursor-pointer"
                        >
                            View All Jobs
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
