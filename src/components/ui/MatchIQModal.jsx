import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Sparkles, MessageSquare, Radio, ExternalLink, Briefcase, Star, Trophy, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createChatSession } from '../../api/chatApi';
import { useState } from 'react';

const MatchIQModal = ({ isOpen, onClose, matchData, job, jobId }) => {
    const navigate = useNavigate();
    const [isCreatingChat, setIsCreatingChat] = useState(false);

    if (!isOpen || !matchData) return null;

    const { score, skills_score, experience_score, interests_score, work_preference_score, missing_skills = [], gap_analysis } = matchData;

    // Handle "Chat with Coach"
    const handleStartChat = async () => {
        try {
            setIsCreatingChat(true);
            const session = await createChatSession(jobId);
            navigate('/chat', { state: { sessionId: session.id } });
        } catch (err) { 
            console.error(err); 
        } finally {
            setIsCreatingChat(false);
        }
    };

    // Color logic for gauge
    // Dynamic color logic for premium aesthetic
    const getScoreColors = (val) => {
        if (val > 70) return { primary: '#22C55E', tertiary: '#16a34a', glow: 'rgba(34, 197, 94, 0.4)' }; // Green
        if (val > 40) return { primary: '#F59E0B', tertiary: '#d97706', glow: 'rgba(245, 158, 11, 0.4)' }; // Orange
        return { primary: '#EF4444', tertiary: '#dc2626', glow: 'rgba(239, 68, 68, 0.4)' }; // Red
    };

    const colors = getScoreColors(score);
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-zinc-900/40 backdrop-blur-xl" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-4xl max-h-[90vh] card border border-zinc-100 shadow-2xl shadow-zinc-900/20 flex flex-col relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header: Locked at top */}
                    <div className="px-8 py-5 border-b border-zinc-100 flex justify-between items-center bg-white z-50 shrink-0">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={onClose}
                                className="premium-tag flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-[10px] font-bold text-zinc-600 hover:bg-zinc-900 transition-all group"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Job Board
                            </button>
                            <div className="w-[1px] h-6 bg-zinc-100 mx-2 hidden md:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-sm">
                                    <Sparkles size={14} />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Match Compatibility Analysis</h3>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center transition-all group hover:bg-zinc-900 hover:text-white"
                        >
                            <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-8 scroll-smooth">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left Column: Score & Alignment */}
                            <div className="space-y-8">
                                <div className="flex flex-col items-center justify-center p-8 bg-[#FAFAFA] card border border-zinc-100 relative overflow-hidden group">
                                    <div className="relative w-52 h-52 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 scale-110" viewBox="0 0 200 200">
                                            {/* Track 1: Outer subtle track */}
                                            <circle cx="100" cy="100" r={radius} stroke="#F0F0F0" strokeWidth="18" fill="transparent" />
                                            
                                            <motion.circle
                                                cx="100" cy="100" r={radius}
                                                stroke={colors.primary} strokeWidth="18" fill="transparent"
                                                strokeDasharray={circumference}
                                                initial={{ strokeDashoffset: circumference }}
                                                animate={{ strokeDashoffset }}
                                                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                                                strokeLinecap="round"
                                                style={{ filter: `drop-shadow(0 0 10px ${colors.glow})` }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-5xl font-sans font-bold tracking-tighter leading-tight" style={{ color: colors.primary }}>{score}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1" style={{ color: '#313851' }}>PERCENT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Skills Align */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#313851' }}>Skills Match</span>
                                            <span className="text-sm font-bold" style={{ color: getScoreColors(skills_score).primary }}>{skills_score}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-zinc-50 rounded-full border border-zinc-100/50 overflow-hidden relative shadow-inner">
                                            <motion.div 
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: getScoreColors(skills_score).primary }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skills_score}%` }}
                                                transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        </div>
                                    </div>

                                    {/* Experience Align */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#313851' }}>Experience Match</span>
                                            <span className="text-sm font-bold" style={{ color: getScoreColors(experience_score).primary }}>{experience_score}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-zinc-50 rounded-full border border-zinc-100/50 overflow-hidden relative shadow-inner">
                                            <motion.div 
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: getScoreColors(experience_score).primary }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${experience_score}%` }}
                                                transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        </div>
                                    </div>

                                    {/* Interests Align */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#313851' }}>Goals Alignment</span>
                                            <span className="text-sm font-bold" style={{ color: getScoreColors(interests_score).primary }}>{interests_score}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-zinc-50 rounded-full border border-zinc-100/50 overflow-hidden relative shadow-inner">
                                            <motion.div 
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: getScoreColors(interests_score).primary }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${interests_score}%` }}
                                                transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        </div>
                                    </div>

                                    {/* Work Preference Align */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#313851' }}>Work Preference</span>
                                            <span className="text-sm font-bold" style={{ color: getScoreColors(work_preference_score).primary }}>{work_preference_score}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-zinc-50 rounded-full border border-zinc-100/50 overflow-hidden relative shadow-inner">
                                            <motion.div 
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: getScoreColors(work_preference_score).primary }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${work_preference_score}%` }}
                                                transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Skill Gaps & Upskill */}
                            <div className="flex flex-col h-full gap-8">
                                <div className="flex-1">
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-5 text-zinc-400 flex items-center gap-2">
                                        <Trophy size={14} className="text-zinc-300" /> Skill Gaps Identified
                                    </h4>
                                    {missing_skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {missing_skills.map((skill, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-white border border-zinc-100 text-[9px] font-bold text-zinc-900 uppercase tracking-widest rounded-full shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs font-medium text-zinc-400 italic">No significant gaps detected. Optimal alignment reached.</p>
                                    )}

                                    <div className="mt-8 p-6 bg-zinc-50/50 card border border-zinc-100 relative overflow-hidden group">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-zinc-400">Recommended Learning</h4>
                                        <div className="space-y-3">
                                            {missing_skills.slice(0, 3).map((skill, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={`https://www.youtube.com/results?search_query=learn+${encodeURIComponent(skill)}+fast`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl hover:border-zinc-900 transition-all group/link shadow-sm"
                                                >
                                                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">{skill} Tutorial</span>
                                                    <ExternalLink size={14} className="text-zinc-300 group-hover/link:text-zinc-900 transition-colors" />
                                                </a>
                                            ))}
                                            {missing_skills.length === 0 && (
                                                <p className="text-[10px] font-medium text-zinc-300 italic">Alignment fully optimized.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Action Footer */}
                    <div className="px-8 py-6 border-t border-zinc-100 bg-[#FAFAFA]/50 backdrop-blur-sm flex flex-col items-center gap-5">
                        <div className="flex flex-col items-center">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300 mb-2">Recommended Next Steps</h4>
                            <div className="w-10 h-1 bg-zinc-100 rounded-full" />
                        </div>
                        
                        <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.button 
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStartChat}
                                disabled={isCreatingChat}
                                className="group relative flex items-center justify-center gap-3 bg-zinc-900 text-white py-3 px-6 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-zinc-900/10 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <MessageSquare size={16} className="transition-transform group-hover:scale-110" /> 
                                {isCreatingChat ? 'Starting Session...' : 'Chat with Coach'}
                            </motion.button>

                            <Link
                                to={`/jobs/${jobId}/mock-interview`}
                                state={{ jobTitle: job.cleanTitle, companyName: job.company_name }}
                                className="w-full"
                            >
                                <motion.button 
                                    whileTap={{ scale: 0.98 }}
                                    className="group w-full h-full bg-white border border-zinc-100 text-zinc-900 py-3 px-6 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-3 hover:bg-zinc-50"
                                >
                                    <Radio size={16} className="group-hover:animate-pulse" /> Mock Interview Simulator
                                </motion.button>
                            </Link>
                        </div>

                        <button 
                            onClick={onClose}
                            className="mt-2 text-[9px] font-bold text-zinc-300 uppercase tracking-[0.4em] hover:text-zinc-900 transition-colors"
                        >
                            CLOSE ANALYSIS
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MatchIQModal;
