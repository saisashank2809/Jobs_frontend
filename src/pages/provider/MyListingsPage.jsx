import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import { Trash2, AlertCircle, Briefcase, Eye, PlusCircle, Clock, Sparkles } from 'lucide-react';
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

        try {
            // Optimistic update
            const originalJobs = [...jobs];
            setJobs(jobs.filter(job => job.id !== jobId));
            
            await deleteJob(jobId);
        } catch (error) {
            console.error('Deletion failed:', error);
            alert('Failed to delete job. Please try again.');
            // Rollback if failed
            const data = await getProviderJobs();
            setJobs(data);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-6xl mx-auto py-12 px-8">
            <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-zinc-100 shadow-sm"
                    >
                        <Sparkles size={12} className="text-zinc-400" />
                        Employer Dashboard
                    </motion.div>
                    <h1 className="text-7xl md:text-8xl font-sans font-bold mb-8 tracking-tight text-zinc-900">
                        Job Listings
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-xl mb-12 leading-relaxed font-medium">
                        Manage your job postings and monitor applicant engagement in real-time.
                    </p>
                </div>
                <Link to="/provider/create">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-zinc-900 text-white px-10 py-5 rounded-[24px] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-zinc-900/10"
                    >
                        <PlusCircle size={20} /> Inject New Signal
                    </motion.button>
                </Link>
            </header>

            {error && (
                <div className="mb-10 p-6 bg-rose-50 text-rose-600 rounded-[24px] border border-rose-100 flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 bg-zinc-50/30 backdrop-blur-sm rounded-[48px] border border-dashed border-zinc-200"
                >
                    <div className="w-20 h-20 bg-white rounded-[28px] grid place-items-center mx-auto mb-8 shadow-sm">
                        <Briefcase size={32} className="text-zinc-200" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Zero Active Signals</h3>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] bg-zinc-100/50 px-3 py-1.5 rounded-lg border border-zinc-200/30 block mb-10">
                        System: Online
                    </span>
                    <Link to="/provider/create">
                        <button className="bg-zinc-900 text-white px-12 py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-lg">
                            Initialize First Signal
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                            >
                                <div className="bg-white rounded-[40px] border border-zinc-100 p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-700 group">
                                    <div className="flex-1 w-full overflow-hidden">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-1.5 h-8 bg-zinc-900 rounded-full" />
                                            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 truncate tracking-tight">{job.title}</h3>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-8 px-1">
                                            <span className="flex items-center gap-2">
                                                <Clock size={14} className="text-zinc-300" />
                                                SYNCED: {new Date(job.created_at).toLocaleDateString()}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-zinc-300'}`} />
                                                <span className={job.status === 'active' ? 'text-zinc-900' : 'text-zinc-400'}>
                                                    STATUS_{job.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2.5">
                                            {job.skills_required?.slice(0, 6).map((skill, sIdx) => (
                                                <span key={sIdx} className="px-4 py-2 bg-zinc-50 border border-zinc-100 text-zinc-600 rounded-full text-[9px] font-bold uppercase tracking-widest">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                                        <Link to={`/jobs/${job.id}`} className="flex-1 md:flex-none">
                                            <motion.button 
                                                whileHover={{ scale: 1.02 }}
                                                className="w-full bg-white border border-zinc-100 text-zinc-900 px-8 py-5 rounded-[24px] font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-50 hover:border-zinc-200 transition-all flex items-center justify-center gap-3 shadow-sm"
                                            >
                                                <Eye size={18} /> View Signal
                                            </motion.button>
                                        </Link>
                                        
                                        <motion.button
                                            whileHover={{ scale: 1.1, backgroundColor: '#FEF2F2', color: '#EF4444' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(job.id)}
                                            className="p-5 bg-zinc-50 text-zinc-300 rounded-[24px] border border-zinc-100 transition-all duration-300 flex items-center justify-center"
                                        >
                                            <Trash2 size={20} />
                                        </motion.button>
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
