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

const JobFeedPage = () => {
    const { isAuthenticated, role } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);

    // Matching State
    const [matchedJobs, setMatchedJobs] = useState(null);
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
                const simplifyLoc = (l, title = '') => {
                    const titleLower = (title || '').toLowerCase();
                    const locLower = (l || '').toLowerCase();
                    
                    if (locLower.includes('remote') || titleLower.includes('remote')) {
                        return 'Remote';
                    }
                    
                    if (!l || l.toLowerCase() === 'remote') return 'Remote'; 
                    
                    const first = l.split(/[,;]/)[0].trim();
                    const cityName = first.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                    
                    return `Onsite - ${cityName}`;
                };


                // Natively clean job list so filters match generated JobCards
                const cleanedData = data.map((job, index) => {
                    let loc = simplifyLoc(job.location, job.title);
                    let t = job.title || '';

                    const cities = ['BANGALORE', 'BENGALURU', 'HYDERABAD', 'PUNE', 'MUMBAI', 'DELHI', 'INDIA', 'NEW YORK', 'KARNATAKA'];
                    for (const city of cities) {
                        const idx = t.toUpperCase().indexOf(city);
                        if (idx > 10) { 
                            let extracted = t.substring(idx).trim();
                            extracted = extracted.replace(/India.*/i, 'India');
                            extracted = extracted.replace(/Karnataka.*/i, 'Karnataka');
                            loc = simplifyLoc(extracted);
                            break;
                        }
                    }

                    // --- MOCK INJECTIONS (Since Backend Is Missing These Fields currently) ---
                    let cat = job.category;
                    const validCats = ['Engineering', 'Data Science', 'Design', 'Product', 'Marketing', 'Operations', 'Finance'];
                    if (!cat || !validCats.includes(cat)) {
                        const titleLower = t.toLowerCase();
                        if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer') || titleLower.includes('hardware')) cat = 'Engineering';
                        else if (titleLower.includes('data') || titleLower.includes('analyst')) cat = 'Data Science';
                        else if (titleLower.includes('design') || titleLower.includes('ui/ux')) cat = 'Design';
                        else if (titleLower.includes('product') || titleLower.includes('manager')) cat = 'Product';
                        else if (titleLower.includes('market')) cat = 'Marketing';
                        else {
                            cat = validCats[index % validCats.length];
                        }
                    }

                    let exp = job.experience_level;
                    // strictly overwrite database garbage like "null" string, space, undefined, or unsupported tags
                    const isExpValid = exp === 0 || ['Fresher', '1+ Years', '2+ Years', '3+ Years', '5+ Years', '10+ Years'].includes(exp);
                    
                    if (!isExpValid) {
                        const titleLower = t.toLowerCase();
                        if (titleLower.includes('senior') || titleLower.includes('sr ') || titleLower.includes('lead')) exp = '5+ Years';
                        else if (titleLower.includes('junior') || titleLower.includes('jr ') || titleLower.includes('entry') || titleLower.includes('intern')) exp = 'Fresher';
                        else if (titleLower.includes('staff') || titleLower.includes('principal')) exp = '10+ Years';
                        else {
                            const exps = ['Fresher', '1+ Years', '2+ Years', '3+ Years', '5+ Years'];
                            exp = exps[index % exps.length];
                        }
                    }

                    return { ...job, cleanLocation: loc, category: cat, experience_level: exp };
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
        'Fresher',
        '1+ Years',
        '2+ Years',
        '3+ Years',
        '5+ Years',
        '10+ Years'
    ];

    const categories = useMemo(() => {
        const unique = new Set(jobs.map(j => j.category || 'Uncategorized'));
        return ['All Categories', ...Array.from(unique)].sort();
    }, [jobs]);

    const topSkills = useMemo(() => {
        const counts = {};
        jobs.forEach(j => {
            j.skills_required?.forEach(s => {
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
                const exp = job.experience_level;
                if (exp == null) {
                    matchesExperience = selectedExperience === 'Not Specified';
                } else if (selectedExperience === 'Fresher') {
                    matchesExperience = exp === 0 || String(exp).toLowerCase() === 'fresher';
                } else {
                    const minYearsMatch = selectedExperience.match(/(\d+)\+/);
                    if (minYearsMatch) {
                        const minYears = parseInt(minYearsMatch[1], 10);
                        const expNum = parseInt(exp, 10);
                        matchesExperience = (!isNaN(expNum) && expNum >= minYears) || String(exp) === selectedExperience;
                    } else {
                        matchesExperience = String(exp) === selectedExperience;
                    }
                }
            }

            const matchesCategory = selectedCategory === 'All Categories' ||
                (job.category || 'Uncategorized') === selectedCategory;

            const matchesSkills = selectedSkills.length === 0 ||
                selectedSkills.every(s => job.skills_required?.includes(s));

            return matchesSearch && matchesLocation && matchesExperience && matchesCategory && matchesSkills;
        });
    }, [jobs, searchTerm, selectedLocation, selectedExperience, selectedCategory, selectedSkills]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(20);
    }, [searchTerm, selectedLocation, selectedSkills]);
    
    // Auto-match on load for seekers
    useEffect(() => {
        if (isAuthenticated && role === ROLES.SEEKER && matchedJobs === null && !isMatching) {
            handleMatchJobs();
        }
    }, [isAuthenticated, role]);

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
            // Mock API or actual API
            const result = await matchAllJobs();
            // result could be list of objects with { id, title, company_name, match_score, ... }
            if (Array.isArray(result) && result.length > 0) {
                setMatchedJobs(result);
            } else {
                setMatchedJobs([]);
            }
        } catch (err) {
            console.error('Match failed', err);
            // Simulate incomplete profile scenario conditionally based on status
            if (err.response?.status === 400 || err.response?.status === 403) {
                setMatchError('incomplete_profile');
                setMatchedJobs([]);
            } else {
                setMatchedJobs([]); // Fallback to "no matches" for this assignment
            }
        } finally {
            setIsMatching(false);
        }
    };

    const hasFilters = searchTerm || 
        selectedLocation !== 'All Locations' || 
        selectedExperience !== 'All Experience' || 
        selectedCategory !== 'All Categories' || 
        selectedSkills.length > 0;

    if (loading) return <Loader fullScreen variant="logo" />;

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            {/* Minimalist Header Section */}
            <header className="relative z-20 pt-24 pb-12 px-6">
                {/* Refined Background Accent */}
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-zinc-50 to-transparent pointer-events-none opacity-50" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-zinc-100 shadow-sm">
                            <Sparkles size={12} className="text-zinc-400" />
                            Market Feed
                        </div>
                        <h1 className="text-7xl md:text-8xl font-sans font-bold mb-8 tracking-tight text-zinc-900">
                            Opportunities
                        </h1>
                        <p className="text-zinc-500 max-w-2xl mx-auto text-xl mb-12 leading-relaxed font-medium">
                            Access the latest job listings and career opportunities across our global network.
                        </p>
                    </motion.div>

                    {/* Neu-Minimalist Search Bar & Filters */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col gap-6">
                            {/* Search Input Row - Refined Pill */}
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="relative flex-1 group">
                                    <Search size={22} className="absolute left-7 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search roles, companies, or skills..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-16 pr-8 py-6 bg-white border border-zinc-100 rounded-[32px] text-zinc-900 font-semibold text-base placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-black/5 shadow-[0_4px_32px_rgba(0,0,0,0.02)] transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Options Row - Floating Selects */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Location Dropdown */}
                                <div className="relative flex-1">
                                    <button
                                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                                        className="w-full px-6 py-4 bg-white text-zinc-900 border border-zinc-100 rounded-2xl text-xs font-bold flex justify-between items-center hover:bg-zinc-50 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <MapPin size={16} className="text-zinc-400 shrink-0" />
                                            <span className="truncate">{selectedLocation}</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isLocationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 5 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl p-2 max-h-64 overflow-y-auto backdrop-blur-xl"
                                            >
                                                {locations.map(loc => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => {
                                                            setSelectedLocation(loc);
                                                            setIsLocationOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${selectedLocation === loc ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
                                                    >
                                                        {loc}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Experience Dropdown */}
                                <div className="relative flex-1">
                                    <button
                                        onClick={() => setIsExperienceOpen(!isExperienceOpen)}
                                        className="w-full px-6 py-4 bg-white text-zinc-900 border border-zinc-100 rounded-2xl text-xs font-bold flex justify-between items-center hover:bg-zinc-50 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-zinc-400 shrink-0 font-bold tracking-tighter">EXP</span>
                                            <span className="truncate">{selectedExperience}</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isExperienceOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isExperienceOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 5 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl p-2 max-h-64 overflow-y-auto backdrop-blur-xl"
                                            >
                                                {experiences.map(exp => (
                                                    <button
                                                        key={exp}
                                                        onClick={() => {
                                                            setSelectedExperience(exp);
                                                            setIsExperienceOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${selectedExperience === exp ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
                                                    >
                                                        {exp}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Category Dropdown */}
                                <div className="relative flex-1">
                                    <button
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        className="w-full px-6 py-4 bg-white text-zinc-900 border border-zinc-100 rounded-2xl text-xs font-bold flex justify-between items-center hover:bg-zinc-50 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Tag size={16} className="text-zinc-400 shrink-0" />
                                            <span className="truncate">{selectedCategory}</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 5 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-zinc-100 rounded-2xl shadow-xl p-2 max-h-64 overflow-y-auto backdrop-blur-xl"
                                            >
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            setSelectedCategory(cat);
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${selectedCategory === cat ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-50'}`}
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

                        {/* Refined Skill Pills */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            {topSkills.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${selectedSkills.includes(skill)
                                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                        : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200 active:scale-[0.95]'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all"
                                >
                                    <X size={16} /> RESET
                                </button>
                            )}
                        </div>


                    </motion.div>
                </div>
            </header>

            {/* Content Container */}
            <main className="max-w-7xl mx-auto pt-8 pb-32 px-6">
                
                {/* 3. Matched Roles Section ABOVE Available Roles */}
                {matchedJobs !== null && (
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

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {visibleJobs.length > 0 ? (
                        visibleJobs.map(job => <JobCard key={job.id} job={job} isAuthenticated={isAuthenticated} />)
                    ) : (
                        <div className="col-span-full text-center py-32 bg-white rounded-[40px] border border-zinc-100 shadow-sm">
                            <div className="w-24 h-24 bg-zinc-50 rounded-[32px] grid place-items-center mx-auto mb-8">
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
