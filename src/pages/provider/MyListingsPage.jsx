import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import { Trash2, AlertCircle, Briefcase, Eye, PlusCircle, Clock, Zap, Sparkles } from 'lucide-react';
import { deleteJob, getProviderJobs } from '../../api/jobsApi';
import { motion, AnimatePresence } from 'framer-motion';

const MyListingsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await getProviderJobs();
                setJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
                setError('Failed to load listings');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to permanently delete this job requirement? This action cannot be undone.')) {
            return;
        }

        // Optimistic update
        const originalJobs = [...jobs];
        try {
            setJobs(jobs.filter(job => job.id !== jobId));
            
            await deleteJob(jobId);
        } catch (error) {
            console.error('Deletion failed:', error);
            alert('Failed to delete job. Please try again.');
            // Rollback if failed
            setJobs(originalJobs);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-[1600px] mx-auto pt-8 pb-12 px-6 md:px-10 bg-[#FBFBFB] min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 relative">
                <div className="w-full">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-transparent text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-8 border border-zinc-200">
                        <span className="text-zinc-400 text-xs">#</span> EMPLOYER DASHBOARD
                    </div>
                    <h1 className="text-5xl md:text-6xl font-sans font-bold mb-4 tracking-tight text-[#1a1a1a]">
                        Job Listings
                    </h1>
                    <p className="text-zinc-500 max-w-xl text-lg leading-relaxed font-medium">
                        Manage your job postings and monitor applicant engagement in real-time.
                    </p>
                </div>
                <Link to="/provider/create" className="md:absolute md:right-0 md:bottom-2 shrink-0">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#09090b] text-white px-8 py-3.5 rounded-full font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-black transition-all flex items-center gap-3 shadow-xl"
                    >
                        <PlusCircle size={16} /> INJECT NEW SIGNAL
                    </motion.button>
                </Link>
            </header>

            {error && (
                <div className="mb-10 p-6 bg-rose-50 text-rose-600 card border border-rose-100 flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 glass-card premium-shadow"
                >
                    <div className="w-24 h-24 bg-white/50 rounded-2xl grid place-items-center mx-auto mb-8 shadow-sm">
                        <Briefcase size={40} className="text-[#313851]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#313851] mb-2 font-display tracking-tight">Zero Active Signals</h3>
                    <span className="text-[11px] font-bold text-[#313851] uppercase tracking-[0.2em] bg-white/50 px-3 py-1.5 rounded-lg border border-[#C2CBD3] block mb-10 w-max mx-auto">
                        System: Online
                    </span>
                    <Link to="/provider/create">
                        <button className="premium-button text-white shadow-xl max-w-xs mx-auto" style={{ backgroundColor: '#313851' }}>
                            Initialize First Signal
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: idx * 0.05 }}
                                className="group relative h-full"
                            >
                                <div
                                    className="relative h-full overflow-hidden glass-card premium-shadow premium-hover flex flex-col pt-0"
                                    style={{ backgroundColor: 'var(--color-job-card)', borderColor: 'var(--color-accent)' }}
                                >
                                    {/* Status Bar */}
                                    <div className="px-8 pt-8 pb-3 relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
                                            <span>{job.status === 'active' ? 'Active' : 'Archived'}</span>
                                        </div>
                                        <span className="text-[11px] font-semibold" style={{ color: 'var(--color-accent)' }}>
                                            {job.created_at ? new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                                        </span>
                                    </div>

                                    {/* Job Title */}
                                    <div className="px-8 pb-4 relative z-10">
                                        <h3 className="font-display font-extrabold tracking-tight leading-snug text-[22px] transition-colors line-clamp-2" style={{ color: 'var(--color-primary)' }}>
                                            {job.title}
                                        </h3>
                                    </div>

                                    {/* Skills Pills */}
                                    <div className="px-8 pt-1 pb-6 relative z-10 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            {(job.skills_required || []).slice(0, 3).map((skill, sIdx) => (
                                                <span
                                                    key={sIdx}
                                                    className="text-[10px] font-medium px-4 py-2 border rounded-full capitalize tracking-wide"
                                                    style={{ backgroundColor: 'var(--color-job-card)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Action Bar */}
                                    <div className="px-8 pb-8 relative z-10 flex items-center gap-3">
                                        <Link to={`/jobs/${job.id}`} className="flex-1">
                                            <button className="w-full premium-pill border transition-all duration-300 active:scale-[0.98] py-4" style={{ backgroundColor: 'transparent', borderColor: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                                                View details
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="px-5 py-4 rounded-2xl font-sans font-medium text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] border"
                                            style={{
                                                backgroundColor: 'transparent',
                                                borderColor: '#fecdd3', // rose-200
                                                color: '#e11d48' // rose-600
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default MyListingsPage;
