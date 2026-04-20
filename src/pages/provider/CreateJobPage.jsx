import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/jobsApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Briefcase, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateJobPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const skillsRequired = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

        try {
            await createJob({
                title,
                description_raw: description,
                skills_required: skillsRequired
            });
            navigate('/provider/listings');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'OBJECT_CREATION_FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto pt-8 pb-12 px-6 md:px-10 bg-[#FBFBFB] min-h-screen">
            <header className="mb-12 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-zinc-200"
                >
                    <Sparkles size={12} className="text-zinc-400" />
                    Signal Injection
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-zinc-900 mb-4">
                    Publish Requirement
                </h1>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-[0.3em]">
                    Transmit new job parameters to the network
                </p>
            </header>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-zinc-100 p-8 shadow-2xl shadow-zinc-900/5"
            >
                <form onSubmit={handleSubmit} className="space-y-12">
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-6 rounded-[24px] border border-rose-100 text-[10px] font-bold uppercase tracking-widest text-center">
                            Exception Detected: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">
                                Requirement Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-zinc-50/50 border border-zinc-100 rounded-[28px] px-8 py-6 text-zinc-900 font-bold text-sm placeholder:text-zinc-200 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                placeholder="Systems Architect / Product Lead"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">
                                Strategic Description
                            </label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={10}
                                className="w-full bg-zinc-50/50 border border-zinc-100 rounded-[32px] px-8 py-8 text-zinc-700 font-medium text-sm placeholder:text-zinc-200 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all leading-relaxed"
                                placeholder="Define the primary mission and technical scope..."
                            />
                            <div className="flex justify-between items-center mt-4 px-4">
                                <p className="text-[9px] font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-widest">
                                    <Info size={14} className="text-zinc-200" /> Min_Char: 20
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-4">
                                Required Scalars (Skills)
                            </label>
                            <input
                                type="text"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                className="w-full bg-zinc-50/50 border border-zinc-100 rounded-[28px] px-8 py-6 text-zinc-900 font-bold text-sm placeholder:text-zinc-200 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                placeholder="Node.js, React, Strategy (Comma Separated)"
                            />
                        </div>
                    </div>

                    <div className="pt-8 flex justify-center">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full md:w-auto px-16 py-6 bg-zinc-900 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl shadow-zinc-900/20 disabled:opacity-20"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Transmitting...
                                </>
                            ) : (
                                <>
                                    <Briefcase size={20} />
                                    Publish Requirement
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateJobPage;
