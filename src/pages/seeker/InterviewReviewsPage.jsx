import { useEffect, useState } from 'react';
import {
    Activity,
    Bot,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    Search,
    Star,
    Trophy,
    User,
    ArrowRight,
    ChevronRight,
    Sparkles,
    ChevronDown,
    ChevronUp,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyMockInterviews, getMockInterviewDetails, markMockInterviewAsViewed } from '../../api/mockInterviewApi';
import Loader from '../../components/ui/Loader';

const StatusBadge = ({ status }) => {
    const configs = {
        reviewed: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2, label: 'Reviewed' },
        pending_review: { bg: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, label: 'Pending Review' },
        in_progress: { bg: 'bg-blue-50 text-blue-600 border-blue-100', icon: Activity, label: 'In Progress' }
    };

    const config = configs[status] || configs.in_progress;
    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} text-[10px] font-bold uppercase tracking-wider`}>
            <Icon size={12} />
            {config.label}
        </div>
    );
};

const FeedbackSection = ({ title, icon: Icon, children, colorClass = "text-zinc-900" }) => (
    <div className="bg-white/50 backdrop-blur-sm border border-zinc-100/50 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all duration-500">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3 mb-5">
            <div className={`p-2 rounded-xl bg-zinc-50 ${colorClass}`}>
                <Icon size={16} />
            </div>
            {title}
        </h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const InterviewReviewsPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    useEffect(() => {
        loadInterviews();
    }, []);

    const loadInterviews = async () => {
        setLoading(true);
        try {
            const data = await getMyMockInterviews();
            setInterviews(data || []);
            if (data?.length > 0) {
                // Priority: First unviewed reviewed, then first pending_review, then just first
                const target = data.find(i => i.status === 'reviewed' && !i.viewed_at) || 
                             data.find(i => i.status === 'pending_review') || 
                             data[0];
                setSelectedId(target.id);
            }
        } catch (err) {
            console.error('Failed to load interviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedId) return;

        const loadDetail = async () => {
            setDetailLoading(true);
            try {
                const data = await getMockInterviewDetails(selectedId);
                setSelectedData(data);
                
                // Auto-mark as viewed if it's reviewed but not yet viewed
                if (data?.status === 'reviewed' && !data?.viewed_at) {
                    await markMockInterviewAsViewed(selectedId);
                    // Update local state to reflect it's viewed without a full reload
                    setInterviews(prev => prev.map(i => 
                        i.id === selectedId ? { ...i, viewed_at: new Date().toISOString() } : i
                    ));
                }
            } catch (err) {
                console.error('Failed to load interview details:', err);
            } finally {
                setDetailLoading(false);
            }
        };

        loadDetail();
    }, [selectedId]);

    const filteredInterviews = interviews.filter(i =>
        (i.job?.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (i.job?.company_name || '').toLowerCase().includes(search.toLowerCase())
    );

    const activeInterviews = filteredInterviews.filter(i => 
        i.status !== 'reviewed' || !i.viewed_at
    );
    
    const viewedInterviews = filteredInterviews.filter(i => 
        i.status === 'reviewed' && i.viewed_at
    );

    if (loading) return <Loader fullScreen variant="logo" />;

    const renderInterviewCard = (item, idx) => (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`group relative w-full text-left px-6 py-4 rounded-[32px] border transition-all duration-500 overflow-hidden ${selectedId === item.id
                ? 'bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-900/20'
                : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-lg'
                }`}
        >
            <div className="flex justify-between items-center group-hover:px-2 transition-all duration-500">
                <div className="flex items-center gap-4 min-w-0">
                    <StatusBadge status={item.status} />
                    <h4 className={`text-sm font-bold tracking-tight truncate ${selectedId === item.id ? 'text-white' : 'text-zinc-900'}`}>
                        {item.job?.title || 'General Interview'}
                    </h4>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider shrink-0 ${selectedId === item.id ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
            </div>
        </motion.button>
    );

    return (
        <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-120px)] flex flex-col gap-8">
            {/* Header omitted for brevity in diff but included in final */}
            {/* ... same header ... */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-100">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="w-14 h-14 rounded-3xl bg-zinc-900 grid place-items-center shadow-2xl shadow-zinc-900/20">
                            <Trophy size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-zinc-900">Performance Workspace</h1>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-1">Review your AI-powered & expert interview analysis</p>
                        </div>
                    </motion.div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search interviews..."
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-zinc-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8">
                {/* Left Column: History */}
                <div className="flex flex-col gap-6">
                    {/* Active/Recent Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <Sparkles size={12} className="text-zinc-400" />
                                Active & Recent
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{activeInterviews.length}</span>
                        </div>
                        <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                            {activeInterviews.length > 0 ? (
                                activeInterviews.map((item, idx) => renderInterviewCard(item, idx))
                            ) : (
                                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest text-center py-8 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
                                    No active reviews
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Viewed/History Section */}
                    {viewedInterviews.length > 0 && (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                className="w-full flex items-center justify-between px-2 group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 group-hover:text-zinc-900 transition-colors">
                                    <History size={12} />
                                    Viewed History
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">{viewedInterviews.length}</span>
                                    {isHistoryOpen ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
                                </div>
                            </button>
                            
                            <AnimatePresence>
                                {isHistoryOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-3 py-2 pr-2 max-h-[30vh] overflow-y-auto custom-scrollbar">
                                            {viewedInterviews.map((item, idx) => renderInterviewCard(item, idx + activeInterviews.length))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col">
                    <AnimatePresence mode="wait">
                        {detailLoading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full grid place-items-center bg-white/50 backdrop-blur-sm rounded-[40px] border border-dashed border-zinc-200"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <Activity className="animate-spin text-zinc-300" size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Loading Report...</p>
                                </div>
                            </motion.div>
                        ) : selectedData ? (
                            <motion.div
                                key={selectedId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8 pb-12"
                            >
                                {/* Hero Card */}
                                <div className="relative overflow-hidden rounded-[40px] bg-zinc-900 p-8 md:p-12 text-white shadow-2xl shadow-zinc-900/10">
                                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Sparkles size={16} className="text-emerald-400" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Evaluation Ready</span>
                                            </div>
                                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-white">
                                                {selectedData.job?.title || 'Mock Practice Session'}
                                            </h2>
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Company</span>
                                                    <span className="text-sm font-bold">{selectedData.job?.company_name || 'N/A'}</span>
                                                </div>
                                                <div className="w-px h-8 bg-zinc-800"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Duration</span>
                                                    <span className="text-sm font-bold">{selectedData.ai_scorecard?.duration_minutes || '--'} Mins</span>
                                                </div>
                                                <div className="w-px h-8 bg-zinc-800"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Review Date</span>
                                                    <span className="text-sm font-bold">
                                                        {selectedData.reviewed_at ? new Date(selectedData.reviewed_at).toLocaleDateString() : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedData.status === 'reviewed' && (
                                            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10">
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-500 grid place-items-center shadow-lg shadow-emerald-500/20">
                                                    <Star size={32} className="text-white" fill="white" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-2xl font-black tracking-tight">Approved</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content Grid */}
                                {selectedData.status === 'reviewed' ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-8">
                                            <FeedbackSection title="Expert Summary" icon={FileText}>
                                                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                                                    {selectedData.ai_scorecard?.admin_review?.overall_summary || "No summary provided."}
                                                </p>
                                            </FeedbackSection>

                                            <FeedbackSection title="Core Strengths" icon={Trophy} colorClass="text-emerald-600">
                                                <div className="flex flex-wrap gap-2">
                                                    {(selectedData.ai_scorecard?.admin_review?.strengths || []).map((s, idx) => (
                                                        <span key={idx} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 capitalize">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </FeedbackSection>
                                        </div>

                                        <div className="space-y-8">
                                            <FeedbackSection title="Areas for Growth" icon={Activity} colorClass="text-amber-600">
                                                <ul className="space-y-3">
                                                    {(selectedData.ai_scorecard?.admin_review?.improvements || []).map((imp, idx) => (
                                                        <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-zinc-100">
                                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                                                            <span className="text-xs font-bold text-zinc-700">{imp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </FeedbackSection>

                                            <FeedbackSection title="Next Milestones" icon={ArrowRight} colorClass="text-blue-600">
                                                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                                                    <p className="text-xs font-bold text-blue-900 leading-relaxed">
                                                        {selectedData.ai_scorecard?.admin_review?.next_steps || "Prepare for the next round by practicing core concepts."}
                                                    </p>
                                                </div>
                                            </FeedbackSection>
                                        </div>

                                        {/* Full Transcript (Wide) */}
                                        <div className="lg:col-span-2">
                                            <div className="bg-zinc-50 border border-zinc-100 rounded-[40px] p-8 md:p-10">
                                                <div className="flex items-center justify-between mb-10">
                                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3">
                                                        <MessageSquare size={16} /> Session Transcript
                                                    </h3>
                                                    <span className="px-4 py-1.5 rounded-full bg-zinc-200/50 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                                        {(selectedData.transcript || []).length} Exchanges
                                                    </span>
                                                </div>

                                                <div className="space-y-8">
                                                    {(selectedData.transcript || []).map((msg, idx) => (
                                                        <div key={idx} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                            {msg.role !== 'user' && (
                                                                <div className="w-10 h-10 rounded-2xl bg-zinc-900 grid place-items-center shrink-0">
                                                                    <Bot size={18} className="text-zinc-400" />
                                                                </div>
                                                            )}
                                                            <div className={`max-w-[80%] p-6 rounded-[28px] ${msg.role === 'user'
                                                                ? 'bg-zinc-900 text-white rounded-tr-none'
                                                                : 'bg-white border border-zinc-100 text-zinc-700 rounded-tl-none shadow-sm'
                                                                }`}>
                                                                <p className="text-sm font-medium leading-relaxed">
                                                                    {msg.content}
                                                                </p>
                                                            </div>
                                                            {msg.role === 'user' && (
                                                                <div className="w-10 h-10 rounded-2xl bg-zinc-100 grid place-items-center shrink-0 border border-zinc-200">
                                                                    <User size={18} className="text-zinc-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-96 rounded-[40px] border-2 border-dashed border-zinc-100 grid place-items-center bg-[#FAFAFA]/50">
                                        <div className="flex flex-col items-center text-center gap-6 max-w-sm px-8">
                                            <div className="w-20 h-20 rounded-full bg-amber-50 grid place-items-center text-amber-500">
                                                <Clock size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-zinc-900 tracking-tight">Expert Analysis in Progress</h3>
                                                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                                                    An expert is currently reviewing your session transcript and performance. You'll receive a detailed dashboard once the review is complete.
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 group cursor-default">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Usually takes 24-48 hours</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-full grid place-items-center">
                                <p className="text-sm text-zinc-400">Select an interview to view its performance report.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default InterviewReviewsPage;
