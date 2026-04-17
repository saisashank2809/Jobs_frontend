import { motion } from 'framer-motion';
import { MapPin, IndianRupee, ArrowRight, Building2, Bookmark, GraduationCap, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { saveJob, unsaveJob, isJobSaved } from '../../api/jobsApi';
import { getKeySkills, getOverviewPreview } from '../../utils/jobOverview';

const JobCard = ({ job, isAuthenticated = true }) => {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if the job is already saved on mount
    useEffect(() => {
        const checkSaved = async () => {
            if (!isAuthenticated) return;
            try {
                const isSaved = await isJobSaved(job.id);
                setSaved(isSaved);
            } catch (err) {
                console.error('Failed to check saved status', err);
            }
        };
        checkSaved();
    }, [job.id, isAuthenticated]);

    // Utility for date formatting
    const formattedDate = new Date(job.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
    });

    // Clean title — strip "POSTED" suffix and embedded locations
    const cleanTitle = (() => {
        let t = job.title || 'Untitled';
        t = t.replace(/POSTED.*$/i, '').trim();
        // Clean slug formatting
        t = t.replace(/^[A-Z]{2}_/, '');
        t = t.replace(/_/g, ' ');
        t = t.replace(/\b\w+/g, w =>
            ['&', 'AND', 'OF', 'THE', 'IN', 'AT', 'FOR'].includes(w.toUpperCase())
                ? w.toLowerCase()
                : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        );
        return t;
    })();

    // Prefer backend fields, fallback to client-side computation
    const displayLocation = job.location || job.cleanLocation || 'Remote';
    const displayExperience = job.experience_range || 'Not specified';
    const displayQualification = job.qualification || null;
    const displaySalary = job.salary_range && job.salary_range !== 'Not specified' ? job.salary_range : null;

    // Short description: prefer backend, fallback to overview preview
    const shortDescription = job.short_description || getOverviewPreview({ ...job, cleanTitle, cleanLocation: displayLocation }, 2);

    // Skills: prefer backend key_skills, fallback to client extraction, cap at 8
    const keySkills = (job.key_skills && job.key_skills.length > 0)
        ? job.key_skills.slice(0, 8)
        : getKeySkills(job, 8);

    const getWorkMode = () => {
        const titleLoc = `${cleanTitle} ${displayLocation}`.toLowerCase();
        if (titleLoc.includes('remote')) return 'Remote';
        if (titleLoc.includes('hybrid')) return 'Hybrid';
        
        const descText = `${job.short_description || ''} ${Array.isArray(job.role_overview) ? job.role_overview.join(' ') : ''}`.toLowerCase();
        if (/\bhybrid\b/.test(descText)) return 'Hybrid';
        if (/\bremote\b/.test(descText)) return 'Remote';
        
        return 'Onsite';
    };
    const workMode = getWorkMode();

    // Match score from job data (if available from matchAllJobs)
    const rawScore = job.match_score ?? job.similarity_score;
    const matchScore = rawScore != null
        ? Math.round(rawScore <= 1 && rawScore > 0 ? rawScore * 100 : rawScore)
        : null;

    const handleToggleSave = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return;
        
        setLoading(true);
        try {
            if (saved) {
                await unsaveJob(job.id);
                setSaved(false);
            } else {
                await saveJob(job.id);
                setSaved(true);
            }
        } catch (err) {
            console.error('Failed to toggle save status', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="group relative h-full"
        >
            <div className="relative h-full overflow-hidden bg-white rounded-[32px] border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-500 ease-in-out hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col">

                {/* 1. Status Bar: Active dot + Location · Date */}
                <div className="px-8 pt-8 pb-3 relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                            workMode === 'Remote' ? 'bg-sky-50 text-sky-600' :
                            workMode === 'Hybrid' ? 'bg-purple-50 text-purple-600' :
                            'bg-emerald-50 text-emerald-600'
                        }`}>
                            {workMode}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider ml-1">
                            <span className="text-zinc-200">·</span>
                            <span className="truncate max-w-[100px] sm:max-w-[150px]">{displayLocation}</span>
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400 shrink-0">{formattedDate}</span>
                </div>

                {/* 2. Company Row: Logo + Name */}
                <div className="px-8 pb-3 relative z-10 flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center font-sans font-bold text-sm text-white shadow-md shadow-zinc-900/10">
                        {(job.company_name || 'O').charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wide truncate">
                        {job.company_name || 'Company'}
                    </span>
                </div>

                {/* 3. Job Title — Standalone, Large */}
                <div className="px-8 pb-3 relative z-10">
                    <h3 className="font-sans font-bold text-zinc-900 tracking-tight leading-snug text-[22px] group-hover:text-zinc-600 transition-colors line-clamp-2">
                        {cleanTitle}
                    </h3>
                </div>

                {/* 4. Metadata Row: Experience · Qualification · Salary */}
                <div className="px-8 pb-3 relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
                        <Clock size={13} className="text-zinc-400" />
                        {displayExperience}
                    </span>
                    {displayQualification && displayQualification !== 'Not specified' && (
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
                            <GraduationCap size={13} className="text-zinc-400" />
                            {displayQualification}
                        </span>
                    )}
                    {displaySalary && (
                        <div className="flex items-center gap-1.5 min-w-0" title={displaySalary}>
                            <IndianRupee size={14} className="text-zinc-400 shrink-0" />
                            <span className="text-[11px] font-semibold text-zinc-500 truncate">{displaySalary}</span>
                        </div>
                    )}
                </div>

                {/* 5. Skills */}
                <div className="px-8 pt-1 pb-4 relative z-10 flex-1">
                    <div className="flex flex-wrap gap-2">
                        {keySkills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] font-semibold px-4 py-2 bg-zinc-50 text-zinc-600 border border-zinc-200/50 rounded-full capitalize tracking-wide"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 6. Footer: Visit website CTA */}
                {job.external_apply_url && (
                    <div className="px-8 pb-3 relative z-10">
                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ExternalLink size={11} />
                            Visit website for full details
                        </span>
                    </div>
                )}

                {/* 7. Bottom Action Bar: View details + Save */}
                <div className="px-8 pb-8 relative z-10 flex items-center gap-3">
                    <Link to={`/jobs/${job.id}`} state={{ displayLocation }} className="flex-1">
                        <button className="w-full bg-white border border-zinc-200 text-zinc-900 font-sans font-bold text-xs py-4 rounded-2xl transition-all duration-300 hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98]">
                            View details
                        </button>
                    </Link>
                    <button
                        onClick={handleToggleSave}
                        disabled={loading || !isAuthenticated}
                        className={`px-5 py-4 rounded-2xl font-sans font-bold text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
                            saved
                                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Bookmark size={14} className={saved ? 'fill-white' : ''} />
                        {saved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;
