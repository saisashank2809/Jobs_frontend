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
            <div
                className="relative h-full overflow-hidden card border premium-shadow premium-hover flex flex-col pt-0"
                style={{ backgroundColor: 'var(--color-job-card)', borderColor: 'var(--color-accent)' }}
            >

                {/* 1. Status Bar: Active dot + Location · Date */}
                <div className="px-8 pt-8 pb-3 relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${
                            workMode === 'Remote' ? 'bg-sky-100 text-sky-700' :
                            workMode === 'Hybrid' ? 'bg-purple-100 text-purple-700' :
                            'bg-emerald-100 text-emerald-700'
                        }`}>
                            {workMode}
                        </span>
                        <span className="text-zinc-400">·</span>
                        <span className="text-zinc-500 font-bold">{displayLocation}</span>
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400">{formattedDate}</span>
                </div>

                {/* 2. Company Row: Logo + Name */}
                <div className="px-8 pb-3 relative z-10 flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-sans font-bold text-sm text-white shadow-md shadow-zinc-900/10" style={{ backgroundColor: 'var(--color-primary)' }}>
                        {(job.company_name || 'O').charAt(0)}
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest truncate" style={{ color: 'var(--color-primary)' }}>
                        {job.company_name || 'Company'}
                    </span>
                </div>

                {/* 3. Job Title — Standalone, Large */}
                <div className="px-8 pb-4 relative z-10">
                    <h3 className="font-display font-extrabold tracking-tight leading-snug text-[22px] transition-colors line-clamp-2" style={{ color: 'var(--color-primary)' }}>
                        {cleanTitle}
                    </h3>
                </div>

                {/* 4. Metadata Row: Experience · Qualification · Salary */}
                <div className="px-8 pb-3 relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900">
                        <Clock size={13} className="text-zinc-900" />
                        {displayExperience}
                    </span>
                    {displayQualification && displayQualification !== 'Not specified' && (
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900">
                            <GraduationCap size={13} className="text-zinc-900" />
                            {displayQualification}
                        </span>
                    )}
                    {displaySalary && (
                        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                            <IndianRupee size={15} className="text-zinc-900" />
                            <span>{displaySalary}</span>
                        </div>
                    )}
                </div>

                {/* 5. Skills */}
                <div className="px-8 pt-1 pb-4 relative z-10 flex-1">
                    <div className="flex flex-wrap gap-2">
                        {keySkills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] font-bold px-4 py-2 border rounded-full capitalize tracking-wider"
                                style={{ backgroundColor: 'white', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' }}
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
                        <button className="w-full premium-pill border border-zinc-900 transition-all duration-300 active:scale-[0.98] py-4 bg-zinc-900 text-white font-black uppercase tracking-widest text-[11px]">
                            View details
                        </button>
                    </Link>
                    <button
                        onClick={handleToggleSave}
                        disabled={loading || !isAuthenticated}
                        className={`px-5 py-4 rounded-2xl font-sans font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
                            saved
                                ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                : 'bg-white border border-zinc-900 text-zinc-900'
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
