import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { matchUserToJob as matchApi } from '../../api/matchingApi';
import { getJobDetails as fetchJob } from '../../api/jobsApi';
import { uploadResume, reuploadResume } from '../../api/usersApi';
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
    const [reuploading, setReuploading] = useState(false);
    const [reuploadError, setReuploadError] = useState(null);
    const [reuploadSuccess, setReuploadSuccess] = useState(false);

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

    const handleReupload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Reset the input so the same file can be selected again later
        e.target.value = '';
        setReuploading(true);
        setReuploadError(null);
        setReuploadSuccess(false);
        try {
            await reuploadResume(file);
            setReuploadSuccess(true);
            // Brief pause so the user sees the success state, then re-run match
            setTimeout(() => {
                setReuploadSuccess(false);
                runAnalysis();
            }, 1500);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.detail || err.message || 'Resume re-upload failed';
            setReuploadError(msg);
            setReuploading(false);
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

    if (loading) return <Loader fullScreen variant="logo" />;

    if (missing_resume) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBFBFB]">
                <motion.div {...fadeUp} className="max-w-xl w-full bg-white card border border-zinc-100 p-8 text-center shadow-xl shadow-zinc-900/5">
                    <div className="w-20 h-20 bg-zinc-900 card mx-auto mb-10 grid place-items-center shadow-2xl shadow-zinc-900/20">
                        <Upload size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-sans font-bold text-zinc-900 mb-4 tracking-tight">Identity Offline</h1>
                    <p className="text-zinc-400 mb-12 font-medium text-sm">
                        Inject a resume object to initialize the analysis protocol.
                    </p>
                    <label className="block w-full cursor-pointer group">
                        <div className="bg-zinc-50 border border-dashed border-zinc-200 card p-20 group-hover:bg-zinc-900 group-hover:border-zinc-900 transition-all duration-500">
                            <span className="text-zinc-600 font-bold group-hover:text-white transition-colors">Select PDF / DOCX</span>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} />
                    </label>
                    {uploading && <p className="mt-10 text-zinc-900 font-bold text-xs uppercase tracking-widest animate-pulse">Processing Stream...</p>}
                    {uploadError && (
                        <div className="mt-10 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                            <p className="text-rose-600 font-bold text-xs text-center">
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
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBFBFB]">
                <motion.div {...fadeUp} className="max-w-xl w-full bg-white card border border-zinc-100 p-8 text-center shadow-xl shadow-zinc-900/5">
                    <div className="w-20 h-20 bg-zinc-900 card mx-auto mb-10 grid place-items-center shadow-2xl shadow-zinc-900/20">
                        <RefreshCw size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-sans font-bold text-zinc-900 mb-4 tracking-tight">Signal Interrupted</h1>
                    <p className="text-zinc-500 mb-12 font-medium text-base">{error}</p>
                    <button
                        onClick={runAnalysis}
                        className="bg-zinc-900 text-white px-12 py-5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
                    >
                        Retry Analysis
                    </button>
                    <div className="mt-8">
                        <Link to={`/jobs/${id}`} className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                            ← Back to Position
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
        <div className="min-h-screen pt-8 pb-12 px-6 md:px-10 bg-[#FBFBFB]">
            <div className="max-w-[1600px] mx-auto">
                <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-all mb-16 uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to position
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: Score & Actions */}
                    <div className="lg:col-span-4 space-y-10">
                        <motion.div {...fadeUp} className="bg-white card border border-zinc-100 p-8 text-center shadow-xl shadow-zinc-900/5">
                            <h2 className="text-[11px] font-bold text-zinc-400 mb-12 uppercase tracking-[0.3em]">Alignment Matrix</h2>

                            <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
                                <svg width="256" height="256" viewBox="0 0 256 256">
                                    <circle cx="128" cy="128" r="110" fill="none" stroke="#F8F8F8" strokeWidth="16" />
                                    <motion.circle
                                        cx="128" cy="128" r="110" fill="none"
                                        stroke={scoreColor}
                                        strokeWidth="16" strokeLinecap="round"
                                        strokeDasharray="691"
                                        initial={{ strokeDashoffset: 691 }}
                                        animate={{ strokeDashoffset: 691 - (691 * displayedScore) / 100 }}
                                        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                                        transform="rotate(-90 128 128)"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-7xl font-sans font-bold text-zinc-900 tracking-tighter">
                                        {displayedScore}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">PERCENT</span>
                                </div>
                            </div>

                            <div className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-bold shadow-lg shadow-zinc-900/5 ${isHighMatch ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-100 text-zinc-600'}`}>
                                {isHighMatch ? <CheckCircle size={14} /> : <Zap size={14} />}
                                {isHighMatch ? 'High Alignment' : 'Alignment Gap'}
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <div className="bg-white card border border-zinc-100 p-8 space-y-4 shadow-sm">
                            {!isHighMatch && (
                                <button
                                    onClick={handleTailorResume}
                                    disabled={tailoring}
                                    className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-5 rounded-full font-bold text-xs transition-all hover:bg-zinc-800 disabled:opacity-30 shadow-xl shadow-zinc-900/10"
                                >
                                    {tailoring ? <RefreshCw size={18} className="animate-spin" /> : <Shield size={18} />}
                                    {tailoring ? "Optimizing..." : "Recalibrate profile"}
                                </button>
                            )}

                            <Link
                                to={`/jobs/${id}/tailor`}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-100 text-zinc-900 py-5 rounded-full font-bold text-xs transition-all hover:bg-zinc-50 shadow-sm"
                            >
                                <Target size={18} className="text-zinc-400" /> Resume Builder
                            </Link>

                            <label className="block w-full cursor-pointer">
                                <div
                                    className={`w-full flex items-center justify-center gap-3 py-5 rounded-full font-bold text-xs border transition-all
                                        ${
                                            reupload_success
                                                ? 'border-green-100 bg-green-50 text-green-600'
                                                : reuploading
                                                ? 'border-zinc-100 bg-zinc-50 text-zinc-400 opacity-60 cursor-not-allowed'
                                                : 'border-zinc-100 bg-white text-zinc-900 hover:bg-zinc-50'
                                        }`}
                                >
                                    {reuploading ? (
                                        <><RefreshCw size={18} className="animate-spin" /> Processing...</>
                                    ) : reupload_success ? (
                                        <><CheckCircle size={18} /> Uploaded!</>
                                    ) : (
                                        <><Upload size={18} className="text-zinc-400" /> Re-upload resume</>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.docx"
                                    onChange={handleReupload}
                                    disabled={reuploading || reupload_success}
                                />
                            </label>

                            <button
                                onClick={handleStartChat}
                                className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-100 text-zinc-900 py-5 rounded-full font-bold text-xs transition-all hover:bg-zinc-50 shadow-sm"
                            >
                                <MessageSquare size={18} className="text-zinc-400" /> AI Coach
                            </button>

                            {job.external_apply_url && isHighMatch && (
                                <div className="pt-4">
                                    <a
                                        href={job.external_apply_url}
                                        target="_blank"
                                        className="block w-full text-center bg-zinc-900 text-white py-5 rounded-full font-bold text-xs transition-all hover:bg-zinc-800 shadow-2xl shadow-zinc-900/20"
                                    >
                                        Proceed to apply
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Analysis */}
                    <div className="lg:col-span-8 space-y-12">
                        <motion.div {...fadeUp} className="bg-white card border border-zinc-100 p-8 shadow-sm">
                            <h2 className="text-[11px] font-bold text-zinc-400 mb-10 flex items-center gap-3 uppercase tracking-[0.3em]">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                                Structural Analysis
                            </h2>
                            <div className="text-zinc-600 text-base font-medium leading-relaxed bg-zinc-50/50 p-8 card border border-zinc-100">
                                {result.gap_analysis || "Analysis stream diagnostic in progress..."}
                            </div>
                        </motion.div>

                        {result.gap_detected && result.missing_skills?.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                                className="bg-white card border border-zinc-100 p-8 shadow-sm"
                            >
                                <h2 className="text-[11px] font-bold text-zinc-400 mb-12 flex items-center gap-3 uppercase tracking-[0.3em]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
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
                                                className="group bg-white p-8 card border border-zinc-100 hover:border-zinc-900 transition-all duration-500 flex flex-col justify-between shadow-sm"
                                            >
                                                <div>
                                                    <span className="inline-block bg-zinc-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 group-hover:bg-zinc-800 transition-colors">
                                                        Skill Gap
                                                    </span>
                                                    <h4 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">{skill}</h4>
                                                    <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-500 transition-colors line-clamp-2">
                                                        {resource ? resource.title : "Access learning resources"}
                                                    </p>
                                                </div>
                                                <div className="mt-8 flex justify-end">
                                                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                                        <ExternalLink size={16} />
                                                    </div>
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
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/40 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white w-full max-w-4xl h-[85vh] card shadow-2xl border border-zinc-100 flex flex-col overflow-hidden"
                            >
                                <div className="px-10 py-8 border-b border-zinc-100 flex justify-between items-center bg-white">
                                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Tailored Intelligence Object</h3>
                                    <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all text-2xl">×</button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-8 bg-white">
                                    <div className="prose prose-zinc max-w-none text-zinc-600 font-medium leading-relaxed text-sm">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{tailoredResume}</ReactMarkdown>
                                    </div>
                                </div>
                                <div className="px-10 py-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-4">
                                    <button onClick={() => setShowModal(false)} className="px-8 py-4 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-all">Dismiss</button>
                                    <button
                                        onClick={() => {
                                            const blob = new Blob([tailoredResume], { type: 'text/markdown' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `Optimized_${job.company_name}.md`;
                                            a.click();
                                        }}
                                        className="px-10 py-4 text-xs font-bold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10"
                                    >
                                        Export Document
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
