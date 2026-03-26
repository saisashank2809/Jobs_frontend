import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { matchUserToJob as matchApi } from '../../api/matchingApi';
import { getJobDetails as fetchJob } from '../../api/jobsApi';
import { uploadResume } from '../../api/usersApi';
import Loader from '../../components/ui/Loader';
import { CheckCircle, MessageSquare, Upload, RefreshCw, ArrowLeft, ExternalLink, Zap, Shield, Target } from 'lucide-react';
import { createChatSession } from '../../api/chatApi';
import { tailorResume } from '../../api/matchingApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

const MatchPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [missingResume, setMissingResume] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const [tailoring, setTailoring] = useState(false);
    const [tailoredResume, setTailoredResume] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [displayedScore, setDisplayedScore] = useState(0);

    const handleTailorResume = async () => {
        try {
            setTailoring(true);
            const res = await tailorResume(id);
            setTailoredResume(res.tailored_resume);
            setShowModal(true);
        } catch (err) {
            console.error(err);
            alert("Analysis failure. Protocol exception.");
        } finally {
            setTailoring(false);
        }
    };

    const runAnalysis = async () => {
        try {
            setLoading(true);
            setError(null);
            setMissingResume(false);
            const jobRes = await fetchJob(id);
            setJob(jobRes);
            const matchRes = await matchApi(id);
            setResult(matchRes);
        } catch (err) {
            console.error(err);
            if (err.code === 'ECONNABORTED') {
                setError('Analysis timed out — the AI service may be overloaded. Please try again in a moment.');
            } else if (!err.response) {
                setError('Unable to connect to the server. Please make sure the backend is running and try again.');
            } else {
                const detail = err.response?.data?.detail || '';
                if (err.response?.status === 422) {
                    if (detail.includes("resume")) {
                        setMissingResume(true);
                        return;
                    }
                }
                if (err.response?.status === 504) {
                    setError('Analysis timed out — the AI service may be overloaded. Please try again in a moment.');
                } else {
                    setError(detail || 'Match analysis failed. Please try again.');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { runAnalysis(); }, [id]);

    useEffect(() => {
        if (result?.similarity_score) {
            const target = Math.round(result.similarity_score * 100);
            let current = 0;
            const interval = setInterval(() => {
                current += 1;
                setDisplayedScore(current);
                if (current >= target) clearInterval(interval);
            }, 10);
            return () => clearInterval(interval);
        }
    }, [result]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            await uploadResume(file);
            setTimeout(() => runAnalysis(), 1000);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || err.message || "Unknown Server Error during Upload";
            setUploadError(msg);
            setUploading(false);
        }
    };

    const handleStartChat = async () => {
        try {
            const session = await createChatSession(id);
            navigate('/chat', { state: { sessionId: session.id } });
        } catch (err) { console.error(err); }
    };

    if (loading) return <Loader fullScreen />;

    if (missingResume) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <motion.div {...fadeUp} className="max-w-xl w-full bg-white rounded-3xl border-4 border-black p-12 text-center shadow-[12px_12px_0px_#000]">
                    <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-8 grid place-items-center">
                        <Upload size={32} className="text-white" />
                    </div>
                    <h1 className="font-display text-4xl font-black text-black mb-4 uppercase tracking-tighter">Identity Offline</h1>
                    <p className="text-gray-500 mb-10 font-medium uppercase text-[10px] tracking-[0.3em]">
                        Requirement: Valid Resume Object
                    </p>
                    <label className="block w-full cursor-pointer group">
                        <div className="border-4 border-dashed border-black rounded-3xl p-16 group-hover:bg-black group-hover:text-white transition-all duration-500">
                            <span className="font-display text-xl font-black uppercase tracking-widest">Inject PDF / DOCX</span>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    {uploading && <p className="mt-8 text-black font-black uppercase tracking-widest animate-pulse">Processing Stream...</p>}
                    {uploadError && (
                        <div className="mt-8 p-4 bg-red-50 border-2 border-red-500 rounded-xl">
                            <p className="text-red-600 font-bold text-xs uppercase tracking-widest text-center">
                                ERROR: {typeof uploadError === 'string' ? uploadError : JSON.stringify(uploadError)}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
                <motion.div {...fadeUp} className="max-w-xl w-full bg-white rounded-3xl border-4 border-black p-12 text-center shadow-[12px_12px_0px_#000]">
                    <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-8 grid place-items-center">
                        <RefreshCw size={32} className="text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-black text-black mb-4 uppercase tracking-tighter">Connection Error</h1>
                    <p className="text-gray-500 mb-8 font-medium text-sm">{error}</p>
                    <button
                        onClick={runAnalysis}
                        className="bg-black text-white px-10 py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.25em] hover:bg-gray-900 transition-all"
                    >
                        Retry Analysis
                    </button>
                    <div className="mt-6">
                        <Link to={`/jobs/${id}`} className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] hover:text-black transition-colors">
                            ← Back to Job
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!result || !job) return null;

    const isHighMatch = result.similarity_score >= 0.7;
    const scoreColor = isHighMatch ? '#000000' : '#404040';

    return (
        <div className="min-h-screen pt-16 pb-24 px-8 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-[0.3em] hover:translate-x-[-4px] transition-transform mb-12">
                    <ArrowLeft size={16} /> Back to Signal
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT: Score & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div {...fadeUp} className="bg-white rounded-3xl border-2 border-black p-10 text-center shadow-[8px_8px_0px_#000]">
                            <h2 className="font-display text-xs font-black text-black mb-10 uppercase tracking-[0.4em] opacity-40">Match IQ</h2>

                            <div className="relative w-56 h-56 mx-auto mb-10 flex items-center justify-center">
                                <svg width="224" height="224" viewBox="0 0 224 224">
                                    <circle cx="112" cy="112" r="95" fill="none" stroke="#F0F0F0" strokeWidth="20" />
                                    <motion.circle
                                        cx="112" cy="112" r="95" fill="none"
                                        stroke={scoreColor}
                                        strokeWidth="20" strokeLinecap="round"
                                        strokeDasharray="597"
                                        initial={{ strokeDashoffset: 597 }}
                                        animate={{ strokeDashoffset: 597 - (597 * displayedScore) / 100 }}
                                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                        transform="rotate(-90 112 112)"
                                        style={{ opacity: isHighMatch ? 1 : 0.6 }}
                                    />
                                </svg>
                                <span className="absolute font-display text-6xl font-black text-black tracking-tighter" style={{ marginLeft: '-0.1em' }}>
                                    {displayedScore}
                                </span>
                            </div>

                            <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${isHighMatch ? 'bg-black text-white' : 'bg-white text-black border-2 border-black'}`}>
                                {isHighMatch ? <CheckCircle size={14} /> : <Zap size={14} />}
                                {isHighMatch ? 'Optimal Alignment' : 'Alignment Gap'}
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <div className="bg-white rounded-3xl border-2 border-black p-8 space-y-4 shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
                            {!isHighMatch && (
                                <button
                                    onClick={handleTailorResume}
                                    disabled={tailoring}
                                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.25em] hover:bg-gray-900 transition-all disabled:opacity-30"
                                >
                                    {tailoring ? <RefreshCw size={18} className="animate-spin" /> : <Shield size={18} />}
                                    {tailoring ? "Optimizing..." : "Recalibrate Info"}
                                </button>
                            )}

                            <Link
                                to={`/jobs/${id}/tailor`}
                                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-black text-black py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-500"
                            >
                                <Target size={18} /> Resume Builder
                            </Link>

                            <button
                                onClick={handleStartChat}
                                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-black text-black py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all duration-500"
                            >
                                <MessageSquare size={18} /> Chat with Coach
                            </button>

                            {job.external_apply_url && isHighMatch && (
                                <a
                                    href={job.external_apply_url}
                                    target="_blank"
                                    className="block w-full text-center bg-black text-white py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.25em] hover:bg-gray-800 transition-all shadow-2xl"
                                >
                                    Execute Apply Sequence
                                </a>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Analysis */}
                    <div className="lg:col-span-8 space-y-10">
                        <motion.div {...fadeUp} className="bg-white rounded-3xl border-2 border-black p-10 shadow-[12px_12px_0px_rgba(0,0,0,0.03)]">
                            <h2 className="font-display text-sm font-black text-black mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                                <div className="w-2 h-6 bg-black" />
                                Structural Analysis
                            </h2>
                            <div className="text-black text-sm font-medium leading-relaxed bg-gray-50 p-8 rounded-2xl border-2 border-black/5 uppercase tracking-[0.05em]">
                                {result.gap_analysis || "Analysis Stream Null."}
                            </div>
                        </motion.div>

                        {result.gap_detected && result.missing_skills?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="bg-white rounded-3xl border-2 border-black p-10"
                            >
                                <h2 className="font-display text-sm font-black text-black mb-10 flex items-center gap-3 uppercase tracking-[0.3em]">
                                    Requirement Gaps
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {result.missing_skills.map((skill, idx) => {
                                        const resource = result.learning_recommendations?.find(r => r.skill_name === skill);
                                        return (
                                            <a
                                                key={idx}
                                                href={resource ? resource.url : `https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skill)}+crash+course`}
                                                target="_blank"
                                                className="group bg-white p-6 rounded-2xl border-2 border-black hover:bg-black transition-all duration-500 flex flex-col justify-between shadow-[6px_6px_0px_#000]"
                                            >
                                                <div>
                                                    <span className="inline-block bg-white text-black text-[9px] font-black px-3 py-1 border border-black uppercase tracking-widest mb-4 group-hover:bg-black group-hover:text-white group-hover:border-white transition-colors">
                                                        Missing Scalar
                                                    </span>
                                                    <h4 className="font-display text-xl font-black text-black uppercase tracking-tighter mb-1 group-hover:text-white transition-colors">{skill}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-500 transition-colors line-clamp-2">
                                                        {resource ? resource.title : "Access Tutorial Layer"}
                                                    </p>
                                                </div>
                                                <div className="mt-6 flex justify-end">
                                                    <ExternalLink size={16} className="text-black group-hover:text-white transition-colors" />
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* TAILORED RESUME MODAL */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl border-4 border-black shadow-[24px_24px_0px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
                            >
                                <div className="px-8 py-6 border-b-4 border-black flex justify-between items-center bg-white">
                                    <h3 className="font-display text-xl font-black text-black uppercase tracking-[0.2em]">Optimized Info Stream</h3>
                                    <button onClick={() => setShowModal(false)} className="text-black hover:scale-125 transition-transform text-3xl font-black">×</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-12 bg-white">
                                    <div className="prose prose-neutral max-w-none text-black font-medium leading-relaxed uppercase text-xs tracking-wider">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{tailoredResume}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="px-8 py-6 border-t-4 border-black bg-gray-50 flex justify-end gap-4">
                                    <button onClick={() => setShowModal(false)} className="px-8 py-3 text-[10px] font-black text-black uppercase tracking-widest border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all">Abort</button>
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([tailoredResume], { type: 'text/markdown' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `Optimized_Object_${job.company_name}.md`;
                                            a.click();
                                        }}
                                        className="px-8 py-3 text-[10px] font-black text-white bg-black rounded-xl border-2 border-black hover:glass-panel transition-all uppercase tracking-widest"
                                    >
                                        Execute Export
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MatchPage;
