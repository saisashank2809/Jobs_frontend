import { useState, useEffect, useMemo } from 'react';
import { getJobFeed } from '../../api/jobsApi';
import JobCard from '../../components/ui/JobCard';
import Loader from '../../components/ui/Loader';
import { Search, Sparkles, MapPin, Tag, X, ChevronDown, Filter, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const JobFeedPage = () => {
    const { isAuthenticated } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);

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
                // Natively clean job list so filters match generated JobCards
                const cleanedData = data.map((job, index) => {
                    let loc = job.location || 'Remote';
                    let t = job.title || '';
                    const cities = ['BANGALORE', 'BENGALURU', 'HYDERABAD', 'PUNE', 'MUMBAI', 'DELHI', 'INDIA', 'NEW YORK', 'KARNATAKA'];
                    for (const city of cities) {
                        const idx = t.toUpperCase().indexOf(city);
                        if (idx > 10) { 
                            let extracted = t.substring(idx).trim();
                            extracted = extracted.replace(/India.*/i, 'India');
                            extracted = extracted.replace(/Karnataka.*/i, 'Karnataka');
                            loc = extracted;
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

    const hasFilters = searchTerm || 
        selectedLocation !== 'All Locations' || 
        selectedExperience !== 'All Experience' || 
        selectedCategory !== 'All Categories' || 
        selectedSkills.length > 0;

    if (loading) return <Loader fullScreen variant="logo" />;

    return (
        <div className="min-h-screen bg-white">
            {/* Monochrome Header Section */}
            <header className="relative z-20 py-16 px-6 border-b border-gray-100">
                {/* Minimal Grid Pattern Overlay */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-black shadow-lg shadow-black/10">
                            <Sparkles size={12} className="text-white" />
                            Curated Feed
                        </div>
                        <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 tracking-tighter">
                            <span className="text-black inline-block">THE</span>
                            <span className="text-gray-400 inline-block px-1">/</span>
                            <span className="text-black inline-block">MARKET</span>
                        </h1>
                        <p className="text-gray-500 max-w-xl mx-auto text-lg mb-12 leading-relaxed font-medium">
                            Real-time streaming intelligence from the Ottobon network.
                            Strictly verified opportunities.
                        </p>
                    </motion.div>

                    {/* High-Contrast Search Bar & Filters */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-5xl mx-auto mt-10"
                    >
                        <div className="flex flex-col gap-4">
                            {/* Search Input Row */}
                            <div className="relative w-full group">
                                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-black group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    placeholder="SEARCH POSITIONS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-16 pr-8 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 placeholder:uppercase placeholder:tracking-widest"
                                />
                            </div>

                            {/* Options Row */}
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Location Dropdown */}
                                <div className="relative flex-1">
                                    <button
                                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                                        className="w-full px-6 py-4 bg-black text-white border-2 border-black rounded-xl text-[11px] font-bold flex justify-between items-center hover:bg-gray-900 shadow-xl shadow-black/5 transition-all uppercase tracking-widest"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <MapPin size={14} className="text-gray-400 shrink-0" />
                                            <span className="truncate">{selectedLocation}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-white transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isLocationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 5, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-black rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto"
                                            >
                                                {locations.map(loc => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => {
                                                            setSelectedLocation(loc);
                                                            setIsLocationOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-widest ${selectedLocation === loc ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
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
                                        className="w-full px-6 py-4 bg-black text-white border-2 border-black rounded-xl text-[11px] font-bold flex justify-between items-center hover:bg-gray-900 shadow-xl shadow-black/5 transition-all uppercase tracking-widest"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <span className="text-gray-400 shrink-0">EXP</span>
                                            <span className="truncate">{selectedExperience}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-white transition-transform ${isExperienceOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isExperienceOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 5, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-black rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto"
                                            >
                                                {experiences.map(exp => (
                                                    <button
                                                        key={exp}
                                                        onClick={() => {
                                                            setSelectedExperience(exp);
                                                            setIsExperienceOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-widest ${selectedExperience === exp ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
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
                                        className="w-full px-6 py-4 bg-black text-white border-2 border-black rounded-xl text-[11px] font-bold flex justify-between items-center hover:bg-gray-900 shadow-xl shadow-black/5 transition-all uppercase tracking-widest"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Tag size={14} className="text-gray-400 shrink-0" />
                                            <span className="truncate">{selectedCategory}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-white transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 5, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-black rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto"
                                            >
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            setSelectedCategory(cat);
                                                            setIsCategoryOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-widest ${selectedCategory === cat ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
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

                        {/* Monochrome Skill Pills */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-[0.3em] mr-4 opacity-40">
                                <Filter size={14} /> FILTER BY
                            </div>
                            {topSkills.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black border-2 transition-all duration-200 uppercase tracking-widest ${selectedSkills.includes(skill)
                                        ? 'bg-black border-black text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-black hover:border-black active:scale-[0.95]'
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black text-black border-2 border-transparent hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                                >
                                    <X size={14} /> RESET ALL
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Grid Container */}
            <main className="max-w-7xl mx-auto py-20 px-6">
                <div className="flex justify-between items-center mb-12 border-b-2 border-black pb-4">
                    <h2 className="text-2xl font-display font-black text-black uppercase tracking-tighter">
                        {filtered.length} AVAILABLE ROLES
                    </h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}
                    </span>
                    <div className="h-px bg-black flex-1 mx-8 hidden md:block opacity-10" />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {visibleJobs.length > 0 ? (
                        visibleJobs.map(job => <JobCard key={job.id} job={job} isAuthenticated={isAuthenticated} />)
                    ) : (
                        <div className="col-span-full text-center py-24 bg-white rounded-3xl border-4 border-black border-dotted">
                            <div className="w-20 h-20 bg-black rounded-3xl grid place-items-center mx-auto mb-6 shadow-2xl">
                                <Search size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-display font-black text-black uppercase tracking-widest mb-2">Null Result</h3>
                            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Broaden your parameters to reveal opportunities.</p>
                        </div>
                    )}
                </div>

                {/* View More Button */}
                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mt-16"
                    >
                        <button
                            onClick={() => setVisibleCount(prev => prev + 20)}
                            className="group flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20"
                        >
                            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                            View More ({filtered.length - visibleCount} remaining)
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default JobFeedPage;
