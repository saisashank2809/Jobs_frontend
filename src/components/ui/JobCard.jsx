import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, ArrowRight, Building2, Calendar, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { saveJob, unsaveJob, isJobSaved } from '../../api/jobsApi';

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

    // Advanced parser for scraped titles containing locations and timestamps
    const parseJobData = (raw) => {
        if (!raw) return { title: 'Untitled', loc: null, time: null };
        let t = raw;
        let time = null;
        let loc = null;
        
        // Extract "Posted X hours ago"
        const postedMatch = t.match(/POSTED\s*(.*)$/i);
        if (postedMatch) {
            time = postedMatch[1].trim();
            t = t.replace(/POSTED.*$/i, '').trim();
        }

        // Extract apparent locations
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

        // Clean slug formatting
        t = t.replace(/^[A-Z]{2}_/, '');
        t = t.replace(/_/g, ' ');
        t = t.replace(/\b\w+/g, w =>
            ['&', 'AND', 'OF', 'THE', 'IN', 'AT', 'FOR'].includes(w.toUpperCase())
                ? w.toLowerCase()
                : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        );

        return { title: t, loc, time };
    };

    const { title: cleanTitle, loc: parsedLoc, time: parsedTime } = parseJobData(job.title);
    const displayLocation = parsedLoc || job.location || 'Remote';
    const displayTime = parsedTime ? `Posted ${parsedTime}` : formattedDate;

    // Match score from job data (if available from matchAllJobs)
    const matchScore = job.match_score != null
        ? Math.round(job.match_score * 100)
        : job.similarity_score != null
            ? Math.round(job.similarity_score * 100)
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
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span>Active</span>
                        <span className="text-zinc-200">·</span>
                        <span>{displayLocation}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400">{displayTime}</span>
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
                <div className="px-8 pb-4 relative z-10">
                    <h3 className="font-sans font-bold text-zinc-900 tracking-tight leading-snug text-[22px] group-hover:text-zinc-600 transition-colors line-clamp-2">
                        {cleanTitle}
                    </h3>
                </div>

                {job.salary_range && (
                    <div className="px-8 pb-2 relative z-10 flex items-center gap-2 text-sm font-bold text-zinc-900">
                        <DollarSign size={15} className="text-zinc-400" />
                        <span>{job.salary_range}</span>
                    </div>
                )}

                {/* 4. Skills Pills */}
                <div className="px-8 pt-1 pb-6 relative z-10 flex-1">
                    <div className="flex flex-wrap gap-2">
                        {job.skills_required?.slice(0, 3).map((skill, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] font-semibold px-4 py-2 bg-zinc-50 text-zinc-600 border border-zinc-200/50 rounded-full capitalize tracking-wide"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 5. Bottom Action Bar: View details + Save + Match % */}
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
                    {matchScore != null && (
                        <span className="text-lg font-bold text-zinc-900 tabular-nums shrink-0">
                            {matchScore}%
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;


