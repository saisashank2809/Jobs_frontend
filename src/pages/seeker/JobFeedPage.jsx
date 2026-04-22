import { useState, useEffect, useMemo } from 'react';
import { getJobFeed } from '../../api/jobsApi';
import JobCard from '../../components/ui/JobCard';
import Loader from '../../components/ui/Loader';
import JobMatchButton from '../../components/ui/JobMatchButton';
import MatchedJobsSection from '../../components/ui/MatchedJobsSection';
import { matchAllJobs } from '../../api/jobsApi';
import { Search, Sparkles, MapPin, Tag, X, ChevronDown, Filter, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import { getKeySkills } from '../../utils/jobOverview';

const JobFeedPage = () => {
    const { isAuthenticated, role } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);

    // Matching State — persist matches across navigations
    const [matchedJobs, setMatchedJobs] = useState(() => {
        try {
            const cached = sessionStorage.getItem('jobFeedMatchedJobs');
            return cached ? JSON.parse(cached) : null;
        } catch { return null; }
    });
    const [isMatching, setIsMatching] = useState(false);
    const [matchError, setMatchError] = useState(null);

    // Filter State
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [selectedExperience, setSelectedExperience] = useState('All Experience');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedSkills, setSelectedSkills] = useState([]);
    
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getJobFeed();

                // Clean job list using backend-provided fields
                const cleanedData = data.map((job) => {
                    // Use backend-normalized location directly, with title-based fallback
                    let loc = job.location || 'Remote';

                    // Category inference from title (backend doesn't provide category yet)
                    let cat = job.category;
                    const validCats = ['Engineering', 'Data Science', 'Design', 'Product', 'Marketing', 'Operations', 'Finance'];
                    if (!cat || !validCats.includes(cat)) {
                        const titleLower = (job.title || '').toLowerCase();
                        if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('hardware')) cat = 'Engineering';
                        else if (titleLower.includes('data') || titleLower.includes('analyst')) cat = 'Data Science';
                        else if (titleLower.includes('design') || titleLower.includes('ui/ux')) cat = 'Design';
                        else if (titleLower.includes('product') || titleLower.includes('manager')) cat = 'Product';
                        else if (titleLower.includes('market')) cat = 'Marketing';
                        else cat = 'Engineering';
                    }

                    return {
                        ...job,
                        cleanLocation: loc,
                        category: cat,
                        experience_level: job.experience_range || 'Not specified',
                        key_skills: job.key_skills || getKeySkills(job, 8),
                    };
                });
                setJobs(cleanedData);
            } catch (err) {
                console.error('Failed to fetch jobs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // Dynamic Options Derivation based perfectly off scraped UI data
    const locations = useMemo(() => {
        const unique = new Set(jobs.map(j => j.cleanLocation || 'Remote'));
        return ['All Locations', ...Array.from(unique)].sort();
    }, [jobs]);

    // Hardcoded experience options ensuring layout fallback
    const experiences = [
        'All Experience',
        'Freshers',
        '0-1 years',
        '0-2 years',
        '1-3 years',
        '3-5 years',
        '5+ years',
        'Not specified'
    ];

    const categories = useMemo(() => {
        const unique = new Set(jobs.map(j => j.category || 'Uncategorized'));
        return ['All Categories', ...Array.from(unique)].sort();
    }, [jobs]);

    const topSkills = useMemo(() => {
        const counts = {};
        jobs.forEach(j => {
            (j.key_skills || j.skills_required || []).forEach(s => {
                counts[s] = (counts[s] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([skill]) => skill);
    }, [jobs]);

    // sequential Filtering Logic
    const filtered = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = !searchTerm ||
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = selectedLocation === 'All Locations' ||
                job.cleanLocation === selectedLocation;

            let matchesExperience = true;
            if (selectedExperience !== 'All Experience') {
                const exp = job.experience_range || 'Not specified';
                matchesExperience = exp === selectedExperience;
            }

            const matchesCategory = selectedCategory === 'All Categories' ||
                (job.category || 'Uncategorized') === selectedCategory;

            const matchesSkills = selectedSkills.length === 0 ||
                selectedSkills.every(s => (job.key_skills || job.skills_required || []).includes(s));

            return matchesSearch && matchesLocation && matchesExperience && matchesCategory && matchesSkills;
        });
    }, [jobs, searchTerm, selectedLocation, selectedExperience, selectedCategory, selectedSkills]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(20);
    }, [searchTerm, selectedLocation, selectedSkills]);
    
    const visibleJobs = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
    const hasMore = visibleCount < filtered.length;

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedLocation('All Locations');
        setSelectedExperience('All Experience');
        setSelectedCategory('All Categories');
        setSelectedSkills([]);
    };

    const handleMatchJobs = async () => {
        setIsMatching(true);
        setMatchError(null);
        try {
            const result = await matchAllJobs();
            if (Array.isArray(result) && result.length > 0) {
                setMatchedJobs(result);
                try { sessionStorage.setItem('jobFeedMatchedJobs', JSON.stringify(result)); } catch {}
            } else {
                setMatchedJobs([]);
                try { sessionStorage.removeItem('jobFeedMatchedJobs'); } catch {}
            }
        } catch (err) {
            console.error('Match failed', err);
            if (err.response?.status === 400 || err.response?.status === 403) {
                setMatchError('incomplete_profile');
                setMatchedJobs([]);
            } else {
                setMatchedJobs([]);
            }
            try { sessionStorage.removeItem('jobFeedMatchedJobs'); } catch {}
        } finally {
            setIsMatching(false);
        }
    };

    // Auto-fetch matched jobs for authenticated seekers if no cached data
    useEffect(() => {
        if (isAuthenticated && role === ROLES.SEEKER && matchedJobs === null && !isMatching) {
            handleMatchJobs();
        }
    }, [isAuthenticated, role, matchedJobs, isMatching]);

    const hasFilters = searchTerm || 
        selectedLocation !== 'All Locations' || 
        selectedExperience !== 'All Experience' || 
        selectedCategory !== 'All Categories' || 
        selectedSkills.length > 0;

    if (loading) return <Loader fullScreen variant="logo" />;

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            {/* Minimalist Header Section */}
            <header className="relative z-20 pt-8 pb-1 px-6 md:px-10">
                {/* Refined Background Accent */}
                <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-zinc-50 to-transparent pointer-events-none opacity-40" />

                <div className="max-w-[1600px] mx-auto relative z-10 text-center">
                    {/* 1. Title Section - Moved to top for UX hierarchy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8"
                    >

                        <h1 className="text-5xl md:text-6xl font-sans font-bold mb-4 tracking-tight text-zinc-900">
                            Opportunities
                        </h1>
                        <p className="text-zinc-500 max-w-2xl mx-auto text-lg mb-4 leading-relaxed font-medium">
                            Access the latest listings and career opportunities across our global network.
                        </p>
                    </motion.div>

                    {/* 2. Neu-Minimalist Search Bar & Filters */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto mb-10"
                    >
                        <div className="flex flex-col gap-4">
                            {/* Search Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#313851]">
                                    <Search size={18} className="text-[#C2CBD3]" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by role, company, or keywords..."
                                    className="w-full pl-14 pr-6 py-4.5 bg-white text-[#313851] border border-[#C2CBD3] rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#313851]/5 focus:border-[#313851] transition-all duration-300 shadow-sm placeholder:text-[#C2CBD3]"
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-5 flex items-center text-[#C2CBD3] hover:text-[#313851] transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Hover-open Filter Dropdowns */}
                            <div className="flex flex-col md:flex-row gap-3">
                                {/* Location Dropdown */}
                                <div
                                    className="relative flex-1"
                                    onMouseEnter={() => setIsLocationOpen(true)}
                                    onMouseLeave={() => setIsLocationOpen(false)}
                                >
                                    <button
                                        className="w-full px-5 py-3.5 bg-white text-[#313851] border border-[#C2CBD3] rounded-xl text-xs font-bold flex justify-between items-center hover:border-[#313851] transition-all duration-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <MapPin size={14} className="text-[#C2CBD3] shrink-0" />
                                            <span className="truncate">{selectedLocation}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-[#C2CBD3] transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isLocationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#C2CBD3] rounded-xl shadow-xl p-1.5 max-h-64 overflow-y-auto"
                                            >
                                                {locations.map(loc => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => { setSelectedLocation(loc); setIsLocationOpen(false); }}
                                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold premium-tag ${selectedLocation === loc ? 'is-active' : ''}`}
                                                    >
                                                        {loc}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Experience Dropdown */}
                                <div
                                    className="relative flex-1"
                                    onMouseEnter={() => setIsExperienceOpen(true)}
                                    onMouseLeave={() => setIsExperienceOpen(false)}
                                >
                                    <button
                                        className="w-full px-5 py-3.5 bg-white text-[#313851] border border-[#C2CBD3] rounded-xl text-xs font-bold flex justify-between items-center hover:border-[#313851] transition-all duration-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-[#C2CBD3] shrink-0 font-bold tracking-tighter text-[10px]">EXP</span>
                                            <span className="truncate">{selectedExperience}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-[#C2CBD3] transition-transform duration-200 ${isExperienceOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isExperienceOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#C2CBD3] rounded-xl shadow-xl p-1.5 max-h-64 overflow-y-auto"
                                            >
                                                {experiences.map(exp => (
                                                    <button
                                                        key={exp}
                                                        onClick={() => { setSelectedExperience(exp); setIsExperienceOpen(false); }}
                                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold premium-tag ${selectedExperience === exp ? 'is-active' : ''}`}
                                                    >
                                                        {exp}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category Dropdown */}
                                <div
                                    className="relative flex-1"
                                    onMouseEnter={() => setIsCategoryOpen(true)}
                                    onMouseLeave={() => setIsCategoryOpen(false)}
                                >
                                    <button
                                        className="w-full px-5 py-3.5 bg-white text-[#313851] border border-[#C2CBD3] rounded-xl text-xs font-bold flex justify-between items-center hover:border-[#313851] transition-all duration-200 shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Tag size={14} className="text-[#C2CBD3] shrink-0" />
                                            <span className="truncate">{selectedCategory}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-[#C2CBD3] transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 6 }}
                                                transition={{ duration: 0.18 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#C2CBD3] rounded-xl shadow-xl p-1.5 max-h-64 overflow-y-auto"
                                            >
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold premium-tag ${selectedCategory === cat ? 'is-active' : ''}`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Skill Pill Tags - Increased margin for professional spacing */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                            {topSkills.map(skill => {
                                const isActive = selectedSkills.includes(skill);
                                return (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`premium-pill border transition-all duration-200 active:scale-[0.95] ${isActive ? 'is-active' : ''}`}
                                    >
                                        {skill}
                                    </button>
                                );
                            })}

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all duration-200"
                                >
                                    <X size={14} /> Reset
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Content Container */}
            <main className="max-w-[1600px] mx-auto pt-6 pb-20 px-6 md:px-10">
                
                {/* 3. Matched Roles Section ABOVE Available Roles */}
                {isAuthenticated && role === ROLES.SEEKER && matchedJobs !== null && (
                    <MatchedJobsSection matchedJobs={matchedJobs} isAuthenticated={isAuthenticated} error={matchError} />
                )}

                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-sans font-bold text-zinc-900 tracking-tight">
                            Available Roles
                        </h2>
                        <p className="text-zinc-400 text-sm mt-1 font-medium">
                            Explore {filtered.length} curated opportunities
                        </p>
                    </div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] bg-zinc-100/50 px-3 py-1.5 rounded-lg border border-zinc-200/30">
                        System: Online
                    </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {visibleJobs.length > 0 ? (
                        visibleJobs.map(job => <JobCard key={job.id} job={job} isAuthenticated={isAuthenticated} />)
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white card border border-zinc-100 shadow-sm">
                            <div className="w-24 h-24 bg-zinc-50 card grid place-items-center mx-auto mb-8">
                                <Search size={40} className="text-zinc-200" />
                            </div>
                            <h3 className="text-2xl font-sans font-bold text-zinc-900 mb-2">No results found</h3>
                            <p className="text-zinc-400 text-base font-medium">Broaden your parameters to reveal matching opportunities.</p>
                            <button onClick={clearFilters} className="mt-8 text-zinc-900 font-bold text-sm underline underline-offset-8">Clear all filters</button>
                        </div>
                    )}
                </div>

                {/* View More Button */}
                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mt-20"
                    >
                        <button
                            onClick={() => setVisibleCount(prev => prev + 20)}
                            className="group flex items-center gap-3 px-12 py-5 bg-zinc-900 text-white rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-zinc-800 shadow-xl shadow-zinc-900/10 active:scale-[0.98]"
                        >
                            <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                            View More Positions
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default JobFeedPage;
