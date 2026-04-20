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
            {/* Content Container */}
            <main className="max-w-[1600px] mx-auto pt-8 pb-12 px-6 md:px-10">
                <div className="flex flex-col gap-1 mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] w-fit border border-zinc-100 shadow-sm mb-4">
                        <Bookmark size={12} className="text-zinc-400" />
                        Personal Archive
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-sans font-bold text-zinc-900 tracking-tight">
                        Saved Roles
                    </h1>
                    <p className="text-zinc-500 text-base font-medium max-w-2xl mt-2">
                        Your curated selection of opportunities. Ready for action whenever you are.
                    </p>
                    <p className="text-zinc-400 text-sm font-medium mt-4">
                        {jobs.length} roles currently in your repository
                    </p>
                </div>

                {jobs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} isAuthenticated={isAuthenticated} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white card border border-zinc-100 shadow-sm max-w-3xl mx-auto">
                        <div className="w-16 h-16 bg-zinc-50 card grid place-items-center mx-auto mb-6">
                            <Bookmark size={24} className="text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-sans font-bold text-zinc-900 mb-2">Your archive is empty</h3>
                        <p className="text-zinc-400 text-sm font-medium mb-6">Role models and opportunities you save will appear here.</p>
                        <Link to="/jobs">
                            <button className="px-6 py-3 bg-zinc-900 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 mx-auto active:scale-[0.98]">
                                <Search size={14} /> Explore Market Intelligence
                            </button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedJobsPage;
