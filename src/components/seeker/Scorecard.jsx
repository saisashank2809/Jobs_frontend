import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, MessageSquare, Briefcase, Star, Zap, User } from 'lucide-react';
import { requestExpertReview } from '../../api/mockInterviewApi';

const Scorecard = ({ interview, onUpdate }) => {
    const { ai_scorecard, status, id, transcript, expert_feedback } = interview;

    const getScoreColor = (score) => {
        if (score >= 8) return 'bg-black text-white';
        if (score >= 6) return 'bg-gray-200 text-black';
        return 'bg-gray-100 text-black opacity-60';
    };

    const handleRequestReview = async () => {
        try {
            await requestExpertReview(id);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("Failed to request review", err);
        }
    };

    const scorecardData = ai_scorecard || {
        technical_accuracy: 0,
        clarity: 0,
        confidence: 0,
        summary_notes: "Evaluation pending..."
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
            {/* 1. Header Analysis - Large Bento Box */}
            <div className="md:col-span-2 bg-white border-4 border-black p-8 card shadow-[10px_10px_0px_#000]">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter">Performance Analysis</h3>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Post-Interview Evaluation</p>
                    </div>
                </div>
                <p className="text-sm font-medium leading-relaxed text-black/80">
                    {scorecardData.summary_notes}
                </p>
            </div>

            {/* 2. Scores - 3 Small Bento Boxes Stacked */}
            <div className="flex flex-col gap-4">
                {['Technical Accuracy', 'Clarity', 'Confidence'].map((label, idx) => {
                    const key = label.toLowerCase().replace(' ', '_');
                    const score = scorecardData[key] || 0;
                    return (
                        <div key={label} className={`p-6 rounded-2xl border-2 border-black flex items-center justify-between ${getScoreColor(score)}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                            <span className="text-2xl font-black italic">/10.{score}</span>
                        </div>
                    );
                })}
            </div>

            {/* 3. Transcript - Medium Box */}
            <div className="md:col-span-1 bg-gray-50 border-2 border-black p-6 card h-[300px] flex flex-col">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Interview Transcript
                </h4>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {transcript?.map((entry, idx) => (
                        <div key={idx} className={`p-3 rounded-xl border ${entry.role === 'assistant' ? 'bg-white border-gray-100' : 'bg-black text-white border-black'}`}>
                            <div className="text-[8px] font-black uppercase tracking-tighter mb-1 opacity-40">
                                {entry.role === 'assistant' ? 'INTERVIEWER' : 'USER'}
                            </div>
                            <p className="text-[10px] leading-snug">{entry.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Expert Feedback / CTA - Long Box */}
            <div className="md:col-span-2 bg-black text-white p-8 card flex flex-col md:flex-row items-center gap-8 border-4 border-black">
                {status === 'reviewed' ? (
                    <>
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-black shrink-0">
                            <Briefcase size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Expert Human Feedback</h3>
                            <p className="text-xs font-medium leading-relaxed opacity-70">
                                {expert_feedback}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex-1">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Need a human eye?</h3>
                            <p className="text-xs font-medium opacity-60">
                                Get your transcript reviewed by an industry expert for deeper behavioral coaching and technical precision.
                            </p>
                        </div>
                        {status === 'pending_review' ? (
                            <div className="px-8 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                <CheckCircle2 size={16} /> Review Requested
                            </div>
                        ) : (
                            <button
                                onClick={handleRequestReview}
                                className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[8px_8px_0px_rgba(255,255,255,0.2)] active:translate-y-1 active:shadow-none"
                            >
                                Get Expert Review
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Scorecard;
