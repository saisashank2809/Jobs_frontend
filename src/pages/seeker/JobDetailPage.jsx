import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getJobDetails } from '../../api/jobsApi';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/ui/Loader';
import { Briefcase, MapPin, ExternalLink, CheckCircle, HelpCircle, FileText, Target, ArrowLeft, Sparkles, Clock, Building2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen pt-16 pb-24 px-8 max-w-7xl mx-auto bg-white">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-12">
                <Link to="/jobs" className="inline-flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft size={16} /> Return to Signal
                </Link>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Header Card - High Contrast */}
                <div className="lg:col-span-12">
                    <BentoCard className="relative overflow-hidden !py-12 !px-12 border-4 shadow-[16px_16px_0px_#000]">
                        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                            <div className="max-w-3xl">
                                <h1 className="text-5xl md:text-6xl font-display font-black text-black tracking-tighter uppercase mb-6 leading-none">
                                    {job.cleanTitle}
                                </h1>
                                <div className="flex flex-wrap gap-8 text-black opacity-40 font-black uppercase text-[10px] tracking-[0.2em]">
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

                            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
                                {user ? (
                                    <>
                                        <Link to={`/jobs/${id}/match`} className="w-full sm:w-auto">
                                            <button className="w-full bg-black text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-xl">
                                                <Sparkles size={18} /> Run Match IQ
                                            </button>
                                        </Link>
                                        <Link to={`/jobs/${id}/tailor`} className="w-full sm:w-auto">
                                            <button className="w-full bg-white border-4 border-black text-black px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl">
                                                <Target size={18} /> Tailor & Score
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/login" className="w-full sm:w-auto">
                                        <button className="w-full bg-black text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:opacity-90 transition-all">
                                            Authorize Access
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
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <BentoCard>
                        <h2 className="text-sm font-black text-black mb-10 pb-4 border-b-2 border-black flex items-center gap-3 uppercase tracking-[0.3em]">
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

                    </BentoCard>

                    <BentoCard delay={0.2}>
                        <h2 className="text-sm font-black text-black mb-10 pb-4 border-b-2 border-black flex items-center gap-3 uppercase tracking-[0.3em]">
                            <div className="w-2 h-4 bg-black" />
                            Interview Vectors
                        </h2>
                        {job.prep_guide_generated ? (
                            <div className="grid gap-6">
                                {job.prep_guide_generated.map((item, idx) => {
                                    const question = typeof item === 'string' ? item : item.question;
                                    const strategy = typeof item === 'string' ? "DEPLOY STAR METHOD" : item.answer_strategy;
                                    return (
                                        <div key={idx} className="p-8 bg-white rounded-2xl border-2 border-black hover:shadow-[8px_8px_0px_#000] transition-all">
                                            <p className="font-black text-black mb-4 uppercase text-xs tracking-widest leading-normal">VECTOR {idx + 1}: {question}</p>
                                            <div className="text-[10px] text-gray-400 font-bold flex items-start gap-4 mt-6 bg-gray-50 p-5 rounded-xl border border-black/5 uppercase tracking-[0.2em] leading-relaxed">
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
                            <div className="flex flex-col items-center justify-center p-16 text-center text-black/20 bg-gray-50 rounded-3xl border-4 border-dashed border-black/5">
                                <Sparkles className="mb-6 opacity-10" size={64} />
                                <p className="mb-8 font-black uppercase text-[10px] tracking-widest">Questions Pending Logic Ingestion</p>
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
                    </BentoCard>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    <BentoCard delay={0.1}>
                        <h2 className="text-sm font-black text-black mb-10 pb-4 border-b-2 border-black flex items-center gap-3 uppercase tracking-[0.3em]">
                            <div className="w-2 h-4 bg-black" />
                            Required Scalar Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {job.skills_required?.map((skill, idx) => (
                                <span key={idx} className="px-5 py-2.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </BentoCard>

                    <BentoCard delay={0.3} className="bg-black border-4 border-black text-white shadow-[12px_12px_0px_rgba(0,0,0,0.1)]">
                        <h2 className="text-[10px] font-black text-white mb-10 pb-4 border-b border-white/20 flex items-center gap-3 uppercase tracking-[0.4em]">
                            <div className="w-1.5 h-4 bg-white" />
                            Content Optimization Tips
                        </h2>
                        {job.resume_guide_generated ? (
                            <ul className="space-y-6">
                                {job.resume_guide_generated.map((point, idx) => (
                                    <li key={idx} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                        <CheckCircle size={20} className="text-white mt-0.5 shrink-0" />
                                        <span className="text-white opacity-80 text-[10px] font-bold uppercase tracking-widest leading-loose">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center text-center py-10 text-white/20">
                                <p className="mb-6 font-black uppercase text-[10px] tracking-widest">Optimized Guidance Offline</p>
                                <button
                                    onClick={() => fetchJob(true)}
                                    disabled={refreshing}
                                    className="px-6 py-3 border-2 border-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-white transition-all disabled:opacity-20"
                                >
                                    Try Sync
                                </button>
                            </div>
                        )}
                    </BentoCard>
                </div>
            </motion.div>
        </div>
    );
};

export default JobDetailPage;
