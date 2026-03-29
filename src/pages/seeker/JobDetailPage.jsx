import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getJobDetails } from '../../api/jobsApi';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/ui/Loader';
import { Briefcase, MapPin, ExternalLink, CheckCircle, HelpCircle, FileText, Target, ArrowLeft, Sparkles, Clock, Building2, RefreshCw, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`bg-white rounded-3xl border-2 border-black p-4 md:p-8 flex flex-col shadow-[8px_8px_0px_rgba(0,0,0,0.04)] overflow-hidden min-w-0 ${className}`}
    >
        {children}
    </motion.div>
);

const JobDetailPage = () => {
    const { id } = useParams();
    const locationState = useLocation();
    const passedLocation = locationState.state?.displayLocation;
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    // Gen Z Summary States
    const [genZSummary, setGenZSummary] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSpecExpanded, setIsSpecExpanded] = useState(false);

    const fetchJob = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            const data = await getJobDetails(id);
            
            // Replicate JobCard Location Extractor OR use passed state from the Card Link directly
            let loc = passedLocation || data.location || 'REMOTE';
            let t = data.title || '';
            t = t.replace(/POSTED.*$/i, '').trim();
            const cities = ['BANGALORE', 'BENGALURU', 'HYDERABAD', 'PUNE', 'MUMBAI', 'DELHI', 'INDIA', 'NEW YORK', 'KARNATAKA'];
            for (const city of cities) {
                const idx = t.toUpperCase().indexOf(city);
                if (idx > 10) { 
                    let extracted = t.substring(idx).trim();
                    extracted = extracted.replace(/India.*/i, 'India');
                    extracted = extracted.replace(/Karnataka.*/i, 'Karnataka');
                    loc = extracted;
                    t = t.substring(0, idx).trim();
                    break;
                }
            }
            data.cleanLocation = loc;
            data.cleanTitle = t;

            setJob(data);

            // Trigger AI summarization automatically
            if (!data.genz_summary && !data.executive_summary) {
                setIsSummarizing(true);
                setTimeout(() => {
                    const exp = data.experience_level === 0 ? "Fresher" : (data.experience_level || "Not Specified");
                    
                    // Dynamic Heuristic Extraction for AI Mock
                    const rawJD = data.description_raw || '';
                    const cleanText = rawJD.replace(/<[^>]+>/g, '').trim();
                    const sentences = cleanText.split(/(?<=[.!?])\s+/);
                    const dynamicOverview = sentences.slice(0, 3).join(' ') || "We are looking for exceptional talent to join our team and drive key initiatives.";
                    
                    let dynamicRequirements = '';
                    const bulletsReg = /(?:^|\n)[-•*]\s*([^.\n]+)/g;
                    let match;
                    const extractedBullets = [];
                    while ((match = bulletsReg.exec(rawJD)) !== null && extractedBullets.length < 4) {
                        extractedBullets.push(match[1].trim());
                    }
                    if (extractedBullets.length >= 2) {
                        dynamicRequirements = extractedBullets.map(b => `<li>${b}</li>`).join('');
                    } else if (sentences.length > 5) {
                        dynamicRequirements = sentences.slice(3, 6).map(s => `<li>${s.trim()}</li>`).join('');
                    } else {
                        dynamicRequirements = `
                            <li>Strong foundation in relevant engineering domains and system architecture.</li>
                            <li>Proven ability to debug, test, and optimize complex software/hardware systems.</li>
                            <li>Excellent analytical skills and ability to thrive in fast-paced collaborative environments.</li>
                        `;
                    }

                    const fakeSummaryHTML = `
                        <div style="font-size: 13px; line-height: 1.6; text-transform: none; color: #111;">
                            <div style="margin-bottom: 16px; padding: 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;">
                                <div style="margin-bottom: 4px;"><strong>📍 Location:</strong> <span style="text-transform: uppercase; font-weight: 600;">${data.cleanLocation}</span></div>
                                <div><strong>⏳ Experience Required:</strong> <span style="text-transform: uppercase; font-weight: 600;">${exp}</span></div>
                            </div>
                            <p style="margin-bottom: 12px; font-weight: 500;">
                                <strong>Role Overview:</strong> ${dynamicOverview}
                            </p>
                            <div style="font-weight: 500;">
                                <strong>Key Requirements:</strong>
                                <ul style="list-style-type: disc; margin-left: 24px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                                    ${dynamicRequirements}
                                </ul>
                            </div>
                        </div>
                    `;
                    setGenZSummary(fakeSummaryHTML);
                    setIsSummarizing(false);
                }, 1200);
            } else {
                setGenZSummary(data.executive_summary || data.genz_summary);
            }
        } catch (error) {
            console.error('Failed to fetch job:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchJob(); }, [id]);

    if (loading) return <Loader fullScreen />;
    if (!job) return <div className="min-h-screen grid place-items-center text-black font-black uppercase tracking-widest">Protocol Null / Object Not Found</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    return (
        <div className="min-h-screen pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto bg-white overflow-x-hidden">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft size={16} /> Return to Signal
                </Link>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Header Card - High Contrast */}
                <div className="lg:col-span-12">
                    <BentoCard className="relative overflow-hidden !py-12 !px-12 border-4 shadow-[16px_16px_0px_#000]">
                        <div className="relative z-10 flex flex-col items-start gap-10 w-full">
                            <div className="max-w-4xl min-w-0 w-full flex flex-col items-start">
                                <h1 className="text-5xl md:text-6xl font-display font-black text-black tracking-tighter uppercase mb-6 leading-none break-words text-left">
                                    {job.cleanTitle}
                                </h1>
                                <div className="flex flex-wrap justify-start gap-8 text-black opacity-40 font-black uppercase text-[10px] tracking-[0.2em]">
                                    <span className="flex items-center gap-2">
                                        <Building2 size={16} />
                                        {job.company_name || 'CONFIDENTIAL'}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {job.cleanLocation}
                                    </span>
                                    <span className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg border border-black italic">
                                        <Clock size={12} /> STATUS: ACTIVE
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-start gap-4 shrink-0 w-full">
                                {user ? (
                                    <>
                                        <Link to={`/jobs/${id}/match`} className="w-full sm:w-auto">
                                            <button className="w-full bg-black text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl">
                                                <Sparkles size={18} /> Run Match IQ
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/login" className="w-full sm:w-auto">
                                        <button className="w-full bg-black text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl">
                                            <Sparkles size={18} /> Run Match IQ <Lock size={14} className="opacity-60" />
                                        </button>
                                    </Link>
                                )}
                                {job.external_apply_url && (
                                    <a href={job.external_apply_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                        <button className="w-full bg-white border-4 border-black text-black px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
                                            <ExternalLink size={20} /> Deploy Apply
                                        </button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* Left Column */}
                <div className="lg:col-span-8 flex flex-col gap-10 min-w-0">
                    <BentoCard className="overflow-hidden min-w-0 flex flex-col items-start relative">
                        <h2 className="text-sm font-black text-black mb-10 pb-4 border-b-2 border-black flex items-center justify-start gap-3 uppercase tracking-[0.3em] w-full">
                            <div className="w-2 h-4 bg-black" />
                            Role Specifications
                        </h2>
                        {/* Gen Z Summary Display */}
                        {isSummarizing ? (
                            <div className="mb-12 p-8 rounded-3xl border-2 border-black bg-gray-50 flex flex-col gap-4 relative overflow-hidden">
                                <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.03)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-[200%] -ml-[100%]" />
                                <div className="h-4 bg-black/10 rounded w-1/3 relative z-10"></div>
                                <div className="h-4 bg-black/10 rounded w-full relative z-10 mt-4"></div>
                                <div className="h-4 bg-black/10 rounded w-5/6 relative z-10"></div>
                                <div className="h-4 bg-black/10 rounded w-4/6 relative z-10"></div>
                            </div>
                        ) : genZSummary ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                                className="mb-12 p-8 rounded-3xl border-2 border-black bg-[#fafafa] relative overflow-hidden group hover:bg-[#f4f4f4] transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.05)]"
                            >
                                <div className="absolute -top-4 -right-4 p-4 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity rotate-12">
                                    <FileText size={120} className="text-black" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 text-black border-b-2 border-black/10 pb-4 inline-flex">
                                     <Sparkles size={14} /> AI EXECUTIVE SUMMARY
                                </h3>
                                <div 
                                    className="relative z-10 text-black prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: genZSummary }}
                                />
                            </motion.div>
                        ) : null}

                        <div className="w-full relative overflow-hidden">
                            <div
                                className={`prose prose-neutral max-w-none text-black font-medium leading-relaxed text-sm break-words text-left [&_*]:text-left [&_*]:break-words [&_*]:max-w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block [&_pre]:overflow-x-auto [&_img]:hidden w-full transition-all duration-500 will-change-[max-height] ${isSpecExpanded ? 'max-h-[8000px]' : 'max-h-[400px] overflow-hidden'}`}
                                dangerouslySetInnerHTML={{ __html: job.description_raw }}
                            />
                            {!isSpecExpanded && (
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            )}
                        </div>
                        <button
                            onClick={() => setIsSpecExpanded(!isSpecExpanded)}
                            className="w-full mt-6 py-4 border-2 border-black rounded-xl text-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            {isSpecExpanded ? (
                                <>View Less <ChevronUp size={14} /></>
                            ) : (
                                <>View More <ChevronDown size={14} /></>
                            )}
                        </button>
                    </BentoCard>

                    <BentoCard delay={0.2}>
                        <h2 className="text-sm font-black text-black mb-10 pb-4 border-b-2 border-black flex items-center gap-3 uppercase tracking-[0.3em]">
                            <div className="w-2 h-4 bg-black" />
                            Interview Vectors
                        </h2>
                        <div className={`relative ${!user ? 'min-h-[200px]' : ''}`}>
                            <div className={!user ? "blur-xl select-none pointer-events-none opacity-50 transition-all duration-500" : "transition-all duration-500"}>
                                {job.prep_guide_generated?.length > 0 ? (
                                    <div className="grid gap-6">
                                        {job.prep_guide_generated.map((item, idx) => {
                                            const question = typeof item === 'string' ? item : item.question;
                                            const strategy = typeof item === 'string' ? "DEPLOY STAR METHOD" : item.answer_strategy;
                                            return (
                                                <div key={idx} className="p-8 bg-white rounded-2xl border-2 border-black hover:shadow-[8px_8px_0px_#000] transition-all flex flex-col items-start text-left">
                                                    <p className="font-black text-black mb-4 uppercase text-xs tracking-widest leading-normal">VECTOR {idx + 1}: {question}</p>
                                                    <div className="text-[10px] text-gray-400 font-bold flex items-start justify-start gap-4 mt-6 bg-gray-50 p-5 rounded-xl border border-black/5 uppercase tracking-[0.2em] leading-relaxed w-full">
                                                        <Sparkles size={16} className="mt-0.5 text-black shrink-0" />
                                                        <span>
                                                            <span className="text-black opacity-30">Strategy Layer: </span>
                                                            {strategy}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-16 text-center bg-gray-50 rounded-3xl border-4 border-dashed border-black/5">
                                        <Sparkles className="mb-6 text-black/20" size={64} />
                                        <p className="mb-8 font-black uppercase text-[10px] tracking-widest text-black/50">Questions Pending Logic Ingestion</p>
                                        <button
                                            onClick={() => fetchJob(true)}
                                            disabled={refreshing}
                                            className="flex items-center gap-3 text-[10px] font-black text-black px-6 py-3 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all uppercase tracking-widest disabled:opacity-30"
                                        >
                                            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                                            {refreshing ? 'Syncing...' : 'Force Refresh'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!user && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
                                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                                        <Target size={32} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Protocol Locked</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest max-w-[200px] leading-relaxed mb-8">
                                        Interview Vectors require active authentication session. 
                                    </p>
                                    <Link to="/login">
                                        <button className="px-8 py-4 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                                            Decrypt Access
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </BentoCard>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-10 min-w-0">
                    <BentoCard delay={0.1} className="flex flex-col items-start">
                        <h2 className="text-sm font-black text-black mb-10 pb-4 border-b-2 border-black flex items-center justify-start gap-3 uppercase tracking-[0.3em] w-full">
                            <div className="w-2 h-4 bg-black" />
                            Required Scalar Skills
                        </h2>
                        {job.skills_required?.length > 0 ? (
                            <div className="flex flex-wrap justify-start gap-3">
                                {job.skills_required.map((skill, idx) => (
                                    <span key={idx} className="px-5 py-2.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-10 bg-gray-50 rounded-2xl border border-black/5 text-center">
                                <p className="font-black uppercase text-[10px] tracking-widest text-black/40">No skills metadata extracted</p>
                            </div>
                        )}
                    </BentoCard>

                    <BentoCard delay={0.3} className="flex flex-col items-start">
                        <h2 className="text-[10px] font-black text-black mb-10 pb-4 border-b border-black/20 flex items-center justify-start gap-3 uppercase tracking-[0.4em] w-full">
                            <div className="w-1.5 h-4 bg-black" />
                            Content Optimization Tips
                        </h2>
                        <div className={`relative w-full ${!user ? 'min-h-[250px]' : ''}`}>
                            <div className={!user ? "blur-xl select-none pointer-events-none opacity-40 transition-all duration-500" : "transition-all duration-500"}>
                                {job.resume_guide_generated?.length > 0 ? (
                                    <ul className="space-y-6 w-full">
                                        {job.resume_guide_generated.map((point, idx) => (
                                            <li key={idx} className="flex gap-4 items-start justify-start p-5 bg-gray-50 rounded-2xl border border-black/10 hover:bg-gray-100 transition-colors">
                                                <CheckCircle size={20} className="text-black mt-0.5 shrink-0" />
                                                <span className="text-black opacity-80 text-[10px] font-bold uppercase tracking-widest leading-loose text-left">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex flex-col items-center text-center py-10 bg-gray-50 rounded-2xl border border-black/5">
                                        <p className="mb-6 font-black uppercase text-[10px] tracking-widest text-black/40">Optimized Guidance Offline</p>
                                        <button
                                            onClick={() => fetchJob(true)}
                                            disabled={refreshing}
                                            className="px-6 py-3 border-2 border-black/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-black transition-all disabled:opacity-20 flex items-center gap-2"
                                        >
                                            <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                                            Try Sync
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!user && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-4 shadow-xl">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-tight mb-1">Tips Redacted</h3>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-6 opacity-60">
                                        Login to view optimization logic.
                                    </p>
                                    <Link to="/login" className="w-full">
                                        <button className="w-full py-3 border-2 border-black text-black rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-md">
                                            Login
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </BentoCard>
                </div>
            </motion.div>
        </div>
    );
};

export default JobDetailPage;
