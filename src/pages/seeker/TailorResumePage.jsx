import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobDetails, getJobMatchScore, tailorResume, downloadTailoredResume } from '../../api/jobsApi';
import { uploadResume } from '../../api/usersApi';
import Loader from '../../components/ui/Loader';
import { motion } from 'framer-motion';
import { Target, Download, ArrowLeft, Building2, MapPin, Sparkles, CheckCircle, BrainCircuit, Upload, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BentoCard = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`bg-white rounded-3xl border-2 border-black p-8 flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,0.04)] ${className}`}
    >
        {children}
    </motion.div>
);

const TailorResumePage = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [scoreData, setScoreData] = useState(null);
    const [tailoredResume, setTailoredResume] = useState(null);
    const [changeSummary, setChangeSummary] = useState(null);
    
    const [loadingJob, setLoadingJob] = useState(true);
    const [loadingScore, setLoadingScore] = useState(true);
    const [loadingTailor, setLoadingTailor] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    
    // Upload state
    const [uploadingResume, setUploadingResume] = useState(false);
    const [uploadMessage, setUploadMessage] = useState(null);
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Job Details
                const jobData = await getJobDetails(id);
                setJob(jobData);
                setLoadingJob(false);

                // Fetch Score and Tailored Resume in parallel
                const results = await Promise.allSettled([
                    getJobMatchScore(id),
                    tailorResume(id)
                ]);

                if (results[0].status === 'fulfilled') {
                    setScoreData(results[0].value);
                }

                if (results[1].status === 'fulfilled') {
                    setTailoredResume(results[1].value.tailored_resume);
                    
                    // GPT sometimes returns the bulleted list as a JSON array instead of a single string.
                    // If it's an array, convert it to a markdown bulleted string.
                    let summaryRaw = results[1].value.change_summary;
                    if (Array.isArray(summaryRaw)) {
                        summaryRaw = summaryRaw.map(item => `- ${item}`).join('\n');
                    }
                    setChangeSummary(summaryRaw);
                }

                // Prioritize Tailor failure
                if (results[1].status === 'rejected') {
                    const err = results[1].reason;
                    const msg = err?.response?.data?.detail || err?.message || "Optimization Service Offline";
                    setError(msg);
                } else if (results[0].status === 'rejected') {
                    const err = results[0].reason;
                    const msg = err?.response?.data?.detail || err?.message || "Match scoring failed.";
                    setError(msg);
                }

            } catch (err) {
                console.error("Failed to load initial data", err);
                setError(err?.response?.data?.detail || err?.message || "Failed to initialize tailoring process.");
            } finally {
                setLoadingJob(false); // ensuring it's off
                setLoadingScore(false);
                setLoadingTailor(false);
            }
        };

        fetchInitialData();
    }, [id]);

    const handleDownload = async () => {
        if (!tailoredResume || !job) return;
        setDownloading(true);
        try {
            const blob = await downloadTailoredResume(job.title || 'Job', tailoredResume);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Tailored_Resume_${job.title.replace(/[^a-z0-9]/gi, '_')}.docx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download docx. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingResume(true);
        setUploadMessage(null);
        setLocalError(null);

        try {
            const res = await uploadResume(file);
            setUploadMessage(`Success: Data extracted from resume.`);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error("Upload failed", err);
            setLocalError(err.response?.data?.detail || "Upload Error / Service Failed");
        } finally {
            setUploadingResume(false);
        }
    };

    if (loadingJob) return <Loader fullScreen variant="logo" />;
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4 font-display">
            <BentoCard className="max-w-xl w-full text-center items-center py-16">
                <p className="text-2xl font-black uppercase tracking-tighter mb-4 text-red-500">Service Error</p>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-8">{error}</p>
                
                {/* Upload Section */}
                <div className="w-full mb-8 p-8 border-4 border-dashed border-black/10 rounded-3xl text-center hover:bg-black group transition-all duration-500 cursor-pointer relative overflow-hidden">
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept=".pdf,.docx"
                        onChange={handleFileUpload}
                        disabled={uploadingResume}
                    />
                    <div className="flex flex-col items-center gap-4 group-hover:text-white transition-colors">
                        {uploadingResume ? (
                            <RefreshCw size={48} className="text-black group-hover:text-white transition-colors animate-spin" />
                        ) : (
                            <Upload size={48} className="text-black group-hover:text-white transition-colors" />
                        )}
                        <span className="font-black text-xl uppercase tracking-tighter">
                            {uploadingResume ? "Uploading..." : "Upload Resume"}
                        </span>
                        <span className="text-[9px] font-bold text-black/40 group-hover:text-white/40 uppercase tracking-[0.3em]">
                            PDF / DOCX (MAX 5MB)
                        </span>
                    </div>
                </div>

                {uploadMessage && (
                    <div className="bg-black text-white w-full p-4 rounded-xl font-black uppercase text-[10px] tracking-widest mb-4 flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> {uploadMessage}
                    </div>
                )}
                
                {localError && (
                    <div className="bg-white border-2 border-red-500 text-red-500 w-full p-4 rounded-xl font-black uppercase text-[10px] tracking-widest mb-4">
                        {localError}
                    </div>
                )}

                <Link to={`/jobs/${id}`} className="mt-2 px-8 py-4 bg-white border-4 border-black text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all shadow-xl inline-flex items-center gap-3">
                    <ArrowLeft size={16} /> Back to Job
                </Link>
            </BentoCard>
        </div>
    );

    const matchScoreRaw = scoreData?.similarity_score || scoreData?.overall_match || 0;
    const matchOverall = Math.round(matchScoreRaw * 100);
    
    // Determine gradient/color based on score
    let scoreColor = "text-yellow-500";
    if (matchOverall >= 80) scoreColor = "text-green-500";
    if (matchOverall < 50) scoreColor = "text-red-500";

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 md:px-10 max-w-[1600px] mx-auto bg-[#fafafa]">
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
                <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft size={16} /> Back to Job Details
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Header Section */}
                <div className="lg:col-span-12">
                     <BentoCard className="relative overflow-hidden !py-12 !px-12 border-4 shadow-[16px_16px_0px_#000]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.03),transparent_70%)] pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/5 rounded-lg mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <Target size={14} /> Resume Optimizer Active
                                </div>
                                <h1 className="text-4xl md:text-5xl font-display font-black text-black tracking-tighter uppercase mb-4 leading-none">
                                    {job?.title?.replace(/POSTED.*$/i, '').trim()}
                                </h1>
                                <div className="flex flex-wrap gap-6 text-black/40 font-black uppercase text-[10px] tracking-[0.2em]">
                                    <span className="flex items-center gap-2">
                                        <Building2 size={16} />
                                        {job?.company_name || 'CONFIDENTIAL'}
                                    </span>
                                </div>
                            </div>
                        </div>
                     </BentoCard>
                </div>

                {/* Left Column - Score & Status */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <BentoCard delay={0.1}>
                        <h2 className="text-sm font-black text-black mb-8 pb-4 border-b-2 border-black flex items-center gap-3 uppercase tracking-[0.3em]">
                            <div className="w-2 h-4 bg-black" />
                            Original Resume Match
                        </h2>
                        
                        {loadingScore ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-6 animate-pulse">
                                <div className="w-24 h-24 rounded-full border-8 border-black/10 border-t-black animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Analyzing Match...</span>
                            </div>
                        ) : scoreData ? (
                            <div className="flex flex-col items-center">
                                <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100" />
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                                            strokeDasharray={`${matchOverall * 2.83} 283`}
                                            className={`${scoreColor} transition-all duration-1000 ease-out`} />
                                    </svg>
                                    <div className="absolute flex flex-col items-center justify-center text-center">
                                        <span className="text-5xl font-black tracking-tighter">{matchOverall}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Score</span>
                                    </div>
                                </div>
                                
                                {scoreData.gap_analysis && (
                                    <div className="w-full space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-gray-400">Analysis Summary</h3>
                                        <p className="text-xs font-bold text-gray-600 leading-relaxed">{scoreData.gap_analysis}</p>
                                    </div>
                                )}
                                
                                {scoreData.missing_skills?.length > 0 && (
                                    <div className="w-full space-y-4 bg-red-50 p-6 rounded-2xl border-2 border-red-100 mt-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-red-400">Missing Core Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {scoreData.missing_skills.map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 text-sm font-bold">Unable to process match score.</div>
                        )}
                    </BentoCard>

                    <BentoCard delay={0.2}>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-black/10">
                            <BrainCircuit size={24} className="text-black" />
                            <h2 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Optimization Details</h2>
                        </div>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-black/5">
                            The tailored resume is dynamically restructured to highlight the most relevant experiences targeting the specific core competencies found in this job description.
                        </p>
                    </BentoCard>
                </div>

                {/* Right Column - Tailored Resume */}
                <div className="lg:col-span-8">
                     <BentoCard delay={0.3} className="h-full border-4 shadow-[12px_12px_0px_#000]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b-2 border-black/10">
                            <h2 className="text-sm font-black text-black flex items-center gap-3 uppercase tracking-[0.3em]">
                                <div className="w-2 h-4 bg-black" />
                                Tailored Output
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <label className="w-full sm:w-auto cursor-pointer bg-white border-4 border-black text-black px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.docx" 
                                        onChange={handleFileUpload}
                                        disabled={uploadingResume}
                                    />
                                    {uploadingResume ? <RefreshCw className="animate-spin" size={16} /> : <Upload size={16} />}
                                    {uploadingResume ? "Uploading..." : "Update Resume"}
                                </label>
                                <button 
                                    onClick={handleDownload}
                                    disabled={loadingTailor || !tailoredResume || downloading}
                                    className="w-full sm:w-auto bg-black border-4 border-black text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {downloading ? <Loader size={16} color="white" inline /> : <Download size={16} />}
                                    {downloading ? "Exporting..." : "Download DOCX"}
                                </button>
                            </div>
                        </div>

                        {loadingTailor ? (
                            <div className="flex-1 min-h-[500px] flex flex-col gap-6 relative overflow-hidden bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
                                 <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.03)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-[200%] -ml-[100%]" />
                                 <div className="flex items-center gap-4 mb-8 relative z-10 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                     <Sparkles className="animate-pulse" size={16}/> Finalizing Layout
                                 </div>
                                 {Array.from({length: 6}).map((_, i) => (
                                     <div key={i} className="space-y-3 relative z-10">
                                        <div className="h-4 bg-black/5 rounded w-1/4"></div>
                                        <div className="h-4 bg-black/5 rounded w-full"></div>
                                        <div className="h-4 bg-black/5 rounded w-5/6"></div>
                                     </div>
                                 ))}
                            </div>
                        ) : tailoredResume ? (
                            <div className="space-y-8 flex-1">
                                {changeSummary && (
                                    <div className="bg-black text-white p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#404040]">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-white/20 pb-4 mb-4 flex items-center gap-3">
                                            <Sparkles size={18} className="text-yellow-400" /> Summary of Optimization
                                        </h3>
                                        <div className="prose prose-invert prose-sm max-w-none font-medium leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
                                            <ReactMarkdown>{changeSummary}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="bg-green-50 text-green-700 border-2 border-green-500 p-4 rounded-2xl flex items-center font-black uppercase tracking-widest text-[10px] shadow-[4px_4px_0px_#22c55e]">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={18} className="text-green-600" />
                                        <span>Optimization Complete: Resume Refined for Role</span>
                                    </div>
                                </div>

                                <div className="prose prose-sm max-w-none text-black font-medium prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-h1:text-center prose-h1:border-b-2 prose-h1:border-black/10 prose-h1:pb-6 prose-a:text-black mt-8">
                                    <ReactMarkdown>{tailoredResume}</ReactMarkdown>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 min-h-[400px] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                Could not generate tailored output.
                            </div>
                        )}
                     </BentoCard>
                </div>
            </div>
        </div>
    );
};

export default TailorResumePage;
