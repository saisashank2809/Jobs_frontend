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

    const simplifyLoc = (l, title) => {
        const titleLower = (title || '').toLowerCase();
        const locLower = (l || '').toLowerCase();
        
        // 1. Detect Remote
        if (locLower.includes('remote') || titleLower.includes('remote')) {
            return 'Remote';
        }
        
        if (!l || l.toLowerCase() === 'remote') return 'Remote'; 
        
        // 2. Format Onsite
        const first = l.split(/[,;]/)[0].trim();
        const cityName = first.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        
        return `Onsite - ${cityName}`;
    };

    const { title: cleanTitle, loc: parsedLoc, time: parsedTime } = parseJobData(job.title);
    const displayLocation = simplifyLoc(parsedLoc || job.location, cleanTitle);
    const displayTime = parsedTime ? `Posted ${parsedTime}` : formattedDate;



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
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
                        <span>Active</span>
                        <span>·</span>
                        <span>{displayLocation}</span>
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-accent)' }}>{displayTime}</span>
                </div>

                {/* 2. Company Row: Logo + Name */}
                <div className="px-8 pb-3 relative z-10 flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-sans font-bold text-sm text-white shadow-md shadow-zinc-900/10" style={{ backgroundColor: 'var(--color-primary)' }}>
                        {(job.company_name || 'O').charAt(0)}
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wide truncate" style={{ color: 'var(--color-accent)' }}>
                        {job.company_name || 'Company'}
                    </span>
                </div>

                {/* 3. Job Title — Standalone, Large */}
                <div className="px-8 pb-4 relative z-10">
                    <h3 className="font-display font-extrabold tracking-tight leading-snug text-[22px] transition-colors line-clamp-2" style={{ color: 'var(--color-primary)' }}>
                        {cleanTitle}
                    </h3>
                </div>

                {job.salary_range && (
                    <div className="px-8 pb-2 relative z-10 flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                        <DollarSign size={15} style={{ color: 'var(--color-accent)' }} />
                        <span>{job.salary_range}</span>
                    </div>
                )}

                {/* 4. Skills Pills */}
                <div className="px-8 pt-1 pb-6 relative z-10 flex-1">
                    <div className="flex flex-wrap gap-2">
                        {job.skills_required?.slice(0, 3).map((skill, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] font-medium px-4 py-2 border rounded-full capitalize tracking-wide"
                                style={{ backgroundColor: 'var(--color-job-card)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 5. Bottom Action Bar: View details + Save + Match % */}
                <div className="px-8 pb-8 relative z-10 flex items-center gap-3">
                    <Link to={`/jobs/${job.id}`} state={{ displayLocation }} className="flex-1">
                        <button className="w-full premium-pill border transition-all duration-300 active:scale-[0.98] py-4" style={{ backgroundColor: 'transparent', borderColor: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                            View details
                        </button>
                    </Link>
                    <button
                        onClick={handleToggleSave}
                        disabled={loading || !isAuthenticated}
                        className={`px-5 py-4 rounded-2xl font-sans font-medium text-xs transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
                            saved
                                ? 'text-white shadow-lg shadow-zinc-900/10'
                                : 'border'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{
                            backgroundColor: saved ? 'var(--color-primary)' : 'transparent',
                            borderColor: 'var(--color-accent)',
                            color: saved ? 'var(--color-on-primary)' : 'var(--color-primary)'
                        }}
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


