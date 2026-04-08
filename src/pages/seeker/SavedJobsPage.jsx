import { useState, useEffect } from 'react';
import { getSavedJobs } from '../../api/jobsApi';
import JobCard from '../../components/ui/JobCard';
import Loader from '../../components/ui/Loader';
import { Bookmark, Sparkles, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const SavedJobsPage = () => {
    const { isAuthenticated } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        setLoading(true);
        try {
            const data = await getSavedJobs();
            setJobs(data);
        } catch (err) {
            console.error('Failed to fetch saved jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchSaved();
        }
    }, [isAuthenticated]);

    if (loading) return <Loader fullScreen variant="logo" />;

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            {/* Minimalist Header Section */}
            <header className="relative z-20 pt-24 pb-12 px-6">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-zinc-50 to-transparent pointer-events-none opacity-50" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-zinc-100 shadow-sm">
                            <Bookmark size={12} className="text-zinc-400" />
                            Personal Archive
                        </div>
                        <h1 className="text-7xl md:text-8xl font-sans font-bold mb-8 tracking-tight text-zinc-900">
                            Saved Roles
                        </h1>
                        <p className="text-zinc-500 max-w-2xl mx-auto text-xl mb-12 leading-relaxed font-medium">
                            Your curated selection of opportunities. Ready for action whenever you are.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Content Container */}
            <main className="max-w-7xl mx-auto pt-8 pb-32 px-6">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-sans font-bold text-zinc-900 tracking-tight">
                            Archived Opportunities
                        </h2>
                        <p className="text-zinc-400 text-sm mt-1 font-medium">
                            {jobs.length} roles currently in your repository
                        </p>
                    </div>
                </div>

                {jobs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} isAuthenticated={isAuthenticated} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-zinc-100 shadow-sm max-w-4xl mx-auto">
                        <div className="w-24 h-24 bg-zinc-50 rounded-[32px] grid place-items-center mx-auto mb-8">
                            <Bookmark size={40} className="text-zinc-200" />
                        </div>
                        <h3 className="text-2xl font-sans font-bold text-zinc-900 mb-2">Your archive is empty</h3>
                        <p className="text-zinc-400 text-base font-medium mb-8">Role models and opportunities you save will appear here.</p>
                        <Link to="/jobs">
                            <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 mx-auto active:scale-[0.98]">
                                <Search size={16} /> Explore Market Intelligence
                            </button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedJobsPage;
