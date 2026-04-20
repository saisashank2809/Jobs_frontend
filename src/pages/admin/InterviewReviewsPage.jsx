import { useEffect, useMemo, useState } from 'react';
import { Activity, Bot, CheckCircle, ClipboardList, Search, Send, User } from 'lucide-react';
import {
    getAdminMockInterviewReview,
    getAdminMockInterviewReviews,
    submitAdminMockInterviewReview,
} from '../../api/mockInterviewApi';
import { useAuth } from '../../hooks/useAuth';

const emptyTemplate = {
    overallSummary: '',
    strengths: '',
    improvements: '',
    topics: '',
    nextSteps: '',
};

const splitLines = (value) =>
    value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

const buildFeedbackMarkdown = ({ overallSummary, strengths, improvements, topics, nextSteps }) => {
    const sections = [
        '# Interview Review',
        '',
        '## Overall Summary',
        overallSummary || 'Summary to be added by admin.',
        '',
        '## Skills You Are Good At',
        ...splitLines(strengths).map((item) => `- ${item}`),
        '',
        '## Skills That Need Improvement',
        ...splitLines(improvements).map((item) => `- ${item}`),
        '',
        '## Topics To Work On',
        ...splitLines(topics).map((item) => `- ${item}`),
        '',
        '## Suggested Next Steps',
        nextSteps || 'Next steps to be added by admin.',
    ];

    return sections.join('\n');
};

const InterviewReviewsPage = () => {
    const { profile, user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [form, setForm] = useState(emptyTemplate);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = await getAdminMockInterviewReviews({ status: statusFilter, search });
            setReviews(data || []);
            if (!selectedReviewId && data?.length) {
                setSelectedReviewId(data[0].id);
            }
            if (selectedReviewId && data && !data.some((item) => item.id === selectedReviewId)) {
                setSelectedReviewId(data[0]?.id || null);
            }
        } catch (err) {
            console.error('Failed to load interview reviews:', err);
            if (err.message) console.log('Supabase Error Message:', err.message);
            if (err.details) console.log('Supabase Error Details:', err.details);
            setMessage('Unable to load interview reviews right now.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadReviews();
        }, 250);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!selectedReviewId) {
            setSelectedReview(null);
            setForm(emptyTemplate);
            return;
        }

        const loadDetail = async () => {
            setDetailLoading(true);
            try {
                const data = await getAdminMockInterviewReview(selectedReviewId);
                setSelectedReview(data);
                const adminReview = data?.ai_scorecard?.admin_review;
                setForm(adminReview ? {
                    overallSummary: adminReview.overall_summary || '',
                    strengths: (adminReview.strengths || []).join('\n'),
                    improvements: (adminReview.improvements || []).join('\n'),
                    topics: (adminReview.topics_to_work_on || []).join('\n'),
                    nextSteps: adminReview.next_steps || '',
                } : emptyTemplate);
            } catch (err) {
                console.error('Failed to load interview review detail:', err);
                setMessage('Unable to load the selected interview.');
            } finally {
                setDetailLoading(false);
            }
        };

        loadDetail();
    }, [selectedReviewId]);

    const reviewerName = profile?.full_name || user?.email || 'Admin Reviewer';
    const userTranscript = useMemo(() => selectedReview?.ai_scorecard?.user_transcript || [], [selectedReview]);
    const aiTranscript = useMemo(() => selectedReview?.ai_scorecard?.ai_transcript || [], [selectedReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReviewId || saving) return;

        setSaving(true);
        setMessage('');

        const payload = {
            overall_summary: form.overallSummary.trim(),
            strengths: splitLines(form.strengths),
            improvements: splitLines(form.improvements),
            topics_to_work_on: splitLines(form.topics),
            next_steps: form.nextSteps.trim(),
            reviewer_name: reviewerName,
            reviewer_id: user?.id || null,
            feedback_markdown: buildFeedbackMarkdown(form),
        };

        try {
            const updated = await submitAdminMockInterviewReview(selectedReviewId, payload);
            setSelectedReview(updated);
            setReviews((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
            setMessage('Analysis sent to the user.');
        } catch (err) {
            console.error('Failed to submit interview review:', err);
            setMessage('Could not send the analysis. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const displayedReviews = useMemo(() => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return reviews.filter(review => {
            if (review.status !== 'reviewed') return true;
            const completedAt = new Date(review.updated_at || review.created_at);
            return completedAt > oneDayAgo;
        });
    }, [reviews]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-8">
            <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-sans font-bold tracking-tight text-zinc-900 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[20px] bg-zinc-900 grid place-items-center shadow-lg shadow-zinc-900/15">
                            <ClipboardList size={28} className="text-white" />
                        </div>
                        Interview Reviews
                    </h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-4">Admin Analysis Workspace</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search user, email, role"
                            className="w-full md:w-72 pl-11 pr-4 py-3 rounded-2xl border border-zinc-100 bg-white text-sm font-medium text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-2xl border border-zinc-100 bg-white text-sm font-semibold text-zinc-900 focus:outline-none"
                    >
                        <option value="pending_review">Pending Review</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="all">All Reviews</option>
                    </select>
                </div>
            </div>

            {message && (
                <div className="mb-6 rounded-[24px] border border-zinc-100 bg-white px-6 py-4 text-sm font-semibold text-zinc-600">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
                <div className="bg-white border border-zinc-100 rounded-[32px] p-4 shadow-xl shadow-zinc-900/5">
                    <div className="px-4 py-3 border-b border-zinc-100 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                        Interview Queue
                    </div>
                    <div className="mt-3 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                        {loading && <div className="p-6 text-sm text-zinc-400">Loading reviews...</div>}
                        {!loading && displayedReviews.length === 0 && <div className="p-6 text-sm text-zinc-400">No interview reviews found.</div>}
                        {displayedReviews.map((review) => (
                            <button
                                key={review.id}
                                onClick={() => setSelectedReviewId(review.id)}
                                className={`group relative w-full text-left rounded-[24px] border p-5 transition-all ${selectedReviewId === review.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/20' : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-lg'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="min-w-0">
                                        <p className="text-lg font-bold tracking-tight truncate">
                                            {review.user?.full_name || review.user?.email || `ID: ${review.user_id?.substring(0, 8)}...`}
                                        </p>
                                        <p className={`text-xs mt-0.5 truncate ${selectedReviewId === review.id ? 'text-white/60' : 'text-zinc-400'}`}>
                                            {review.user?.email || (review.user ? 'No email' : 'Relation Missing')}
                                        </p>
                                    </div>
                                    <div className={`shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 transition-all duration-500 ${
                                        review.status === 'reviewed' 
                                        ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                        : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                                    }`} />
                                </div>

                                <div className="space-y-1">
                                    <p className={`text-[10px] uppercase tracking-[0.25em] ${selectedReviewId === review.id ? 'text-white/50' : 'text-zinc-300'}`}>
                                        Company: {review.job?.company_name || 'None'}
                                    </p>
                                    {review.job?.title && (
                                        <p className={`text-[9px] font-bold ${selectedReviewId === review.id ? 'text-white/40' : 'text-zinc-400'}`}>
                                            Role: {review.job.title}
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-xl shadow-zinc-900/5">
                        {detailLoading && <div className="text-sm text-zinc-400">Loading interview details...</div>}
                        {!detailLoading && !selectedReview && <div className="text-sm text-zinc-400">Select a user review to begin.</div>}
                        {selectedReview && (
                            <div className="space-y-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Selected User</p>
                                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                                            {selectedReview.user?.full_name || selectedReview.user?.email || `User ${selectedReview.user_id}`}
                                        </h2>
                                        <p className="text-sm text-zinc-500 mt-2">
                                            {selectedReview.user?.email || 'The database could not join the user profile for this interview.'}
                                        </p>
                                    </div>
                                    <div className="rounded-[24px] border border-zinc-100 bg-white px-6 py-4 shadow-sm min-w-[140px]">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Status</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${
                                                selectedReview.status === 'reviewed' 
                                                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                                : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                                            }`} />
                                            <p className="text-sm font-bold text-zinc-900 capitalize">
                                                {selectedReview.status.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-zinc-100 bg-[#FAFAFA] p-6 col-span-1 lg:col-span-2">
                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3 mb-5">
                                        <Activity size={16} className="text-zinc-300" /> Performance Overview
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-2xl bg-white border border-zinc-50">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Duration</p>
                                                <p className="text-lg font-bold text-zinc-900">{selectedReview.ai_scorecard?.duration_minutes || '0'} Minutes</p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white border border-zinc-50">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Interview Type</p>
                                                <p className="text-lg font-bold text-zinc-900 capitalize">{selectedReview.ai_scorecard?.interview_type || 'General'}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-white border border-zinc-50 mt-4">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">System Insights</p>
                                            <p className="text-sm text-zinc-600 leading-relaxed">
                                                {selectedReview.ai_scorecard?.combined_transcript?.length > 10
                                                    ? "This interview has been successfully processed and contains a substantial conversation for review."
                                                    : "Short interview session. Review transcripts below for engagement details."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="rounded-[28px] border border-zinc-100 bg-[#FAFAFA] p-6">
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3 mb-5">
                                            <User size={16} className="text-zinc-300" /> User Responses
                                        </h3>
                                        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                            {selectedReview.ai_scorecard?.user_transcript?.length === 0 && <p className="text-sm text-zinc-400">No student transcript captured.</p>}
                                            {selectedReview.ai_scorecard?.user_transcript?.map((entry, index) => (
                                                <div key={index} className="p-3 rounded-xl bg-white border border-zinc-50 text-sm leading-relaxed text-zinc-700">
                                                    {entry}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-[28px] border border-zinc-100 bg-[#FAFAFA] p-6">
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 flex items-center gap-3 mb-5">
                                            <Bot size={16} className="text-zinc-300" /> AI Interviewer
                                        </h3>
                                        <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                            {selectedReview.ai_scorecard?.ai_transcript?.length === 0 && <p className="text-sm text-zinc-400">No AI interviewer transcript captured.</p>}
                                            {selectedReview.ai_scorecard?.ai_transcript?.map((entry, index) => (
                                                <div key={index} className="p-3 rounded-xl bg-white border border-zinc-50 text-sm leading-relaxed text-zinc-700">
                                                    {entry}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-xl shadow-zinc-900/5 space-y-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-2">Admin Template</p>
                            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">Send analysis to the user</h3>
                        </div>

                        <textarea
                            value={form.overallSummary}
                            onChange={(e) => setForm((prev) => ({ ...prev, overallSummary: e.target.value }))}
                            placeholder="Overall summary of the interview performance"
                            rows={4}
                            className="w-full rounded-[24px] border border-zinc-100 bg-[#FAFAFA] px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                        />
                        <textarea
                            value={form.strengths}
                            onChange={(e) => setForm((prev) => ({ ...prev, strengths: e.target.value }))}
                            placeholder={"Skills you are good at\nAdd one skill per line"}
                            rows={4}
                            className="w-full rounded-[24px] border border-zinc-100 bg-[#FAFAFA] px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                        />
                        <textarea
                            value={form.improvements}
                            onChange={(e) => setForm((prev) => ({ ...prev, improvements: e.target.value }))}
                            placeholder={"Skills that need improvement\nAdd one skill per line"}
                            rows={4}
                            className="w-full rounded-[24px] border border-zinc-100 bg-[#FAFAFA] px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                        />
                        <textarea
                            value={form.topics}
                            onChange={(e) => setForm((prev) => ({ ...prev, topics: e.target.value }))}
                            placeholder={"Topics to work on\nAdd one topic per line"}
                            rows={4}
                            className="w-full rounded-[24px] border border-zinc-100 bg-[#FAFAFA] px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                        />
                        <textarea
                            value={form.nextSteps}
                            onChange={(e) => setForm((prev) => ({ ...prev, nextSteps: e.target.value }))}
                            placeholder="Suggested next steps for the user"
                            rows={4}
                            className="w-full rounded-[24px] border border-zinc-100 bg-[#FAFAFA] px-5 py-4 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={!selectedReviewId || saving}
                            className="inline-flex items-center gap-3 rounded-full bg-zinc-900 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white disabled:opacity-40"
                        >
                            {saving ? <Activity size={16} className="animate-spin" /> : <Send size={16} />}
                            {saving ? 'Sending...' : 'Send Analysis'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InterviewReviewsPage;
