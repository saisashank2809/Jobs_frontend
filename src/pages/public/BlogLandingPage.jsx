import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import Loader from '../../components/ui/Loader';
import { BookOpen, Calendar, ArrowRight, Sparkles, TrendingUp, Cpu, Globe, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_POSTS = [
    {
        id: 'mock-1',
        title: "The Death of 'Entry Level': Why Juniors Need to Specialize",
        summary: "Generalist roles are vanishing. Here's why picking a niche like Rust, AI Ops, or Web3 Security is your only survival strategy in 2026.",
        published_at: new Date('2026-02-18').toISOString(),
        image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        icon: <Cpu size={32} />,
        category: "Career Strategy"
    },
    {
        id: 'mock-2',
        title: "Salary Shock: Remote vs. On-Site Paygaps Widening",
        summary: "Our latest data shows a 15% premium for hybrid roles over fully remote. Companies are paying for presence. Is it worth the commute?",
        published_at: new Date('2026-02-17').toISOString(),
        image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
        icon: <DollarSign size={32} />,
        category: "Market Data"
    },
    {
        id: 'mock-3',
        title: "Big 4 Campus Watch: Finance Titans Rebooting Hiring",
        summary: "Deloitte and KPMG are scrapping GPA filters for skills-based assessments. Here's how to hack their new AI-screening process.",
        published_at: new Date('2026-02-15').toISOString(),
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        icon: <TrendingUp size={32} />,
        category: "Enterprise"
    },
    {
        id: 'mock-4',
        title: "AI-Proof Your Resume: Keywords That Trigger Parsing",
        summary: "Stop writing for humans. Your first reader is a bot. We analyzed 50k rejected resumes to find the 'kill words' you must avoid.",
        published_at: new Date('2026-02-14').toISOString(),
        image_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
        icon: <Cpu size={32} />,
        category: "Tactical"
    },
    {
        id: 'mock-5',
        title: "The Rise of 'Fractional' Engineering Roles",
        summary: "Why work for one boss? The top 5% of engineers are now holding 3+ fractional roles simultaneously. Welcome to the 'Super-Freelancer' era.",
        published_at: new Date('2026-02-10').toISOString(),
        image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        icon: <Globe size={32} />,
        category: "Future of Work"
    },
];

const BlogLandingPage = () => {
    const { user } = useAuth();
    const { posts, loading, generating, handleGenerate } = useBlogPosts();

    const displayPosts = [...(posts || []), ...MOCK_POSTS].slice(0, 6);

    if (loading) return <Loader fullScreen variant="logo" />;

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen pt-16 pb-24 px-8 max-w-7xl mx-auto bg-white">
            <header className="mb-16 pb-10 border-b-4 border-black">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-7xl font-display font-black text-black tracking-tighter uppercase leading-none"
                        >
                            Market <span className="opacity-40 italic">Signals</span>
                        </motion.h1>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-4">
                            Ottobon Intelligence Network / Unfiltered Analysis
                        </p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-black text-white px-8 py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.25em] hover:bg-gray-800 transition-all flex items-center gap-3 disabled:opacity-30 shadow-2xl"
                        >
                            {generating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {generating ? "Initializing Synthesis..." : "Generate Signal"}
                        </button>
                    )}
                </div>
            </header>

            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayPosts.map((post, index) => (
                    <motion.div key={post.id} variants={item} className="group h-full">
                        <div className="bg-white rounded-[32px] border-4 border-black overflow-hidden flex flex-col h-full hover:shadow-[16px_16px_0px_rgba(0,0,0,1)] transition-all duration-500 active:scale-[0.98]">
                            {/* Image with Grayscale Overlay */}
                            <div className="h-56 bg-gray-100 overflow-hidden relative border-b-4 border-black">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-700" />
                                ) : (
                                    <div className="h-full grid place-items-center text-black/10">
                                        {post.icon || <BookOpen size={48} />}
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg border border-black shadow-lg">
                                    {post.category || "ANALYSIS"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-10 flex flex-col flex-1 bg-white">
                                <div className="flex items-center gap-2 text-[9px] font-black text-black/30 mb-4 uppercase tracking-widest">
                                    <Calendar size={12} />
                                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                </div>

                                <h2 className="font-display font-black text-2xl text-black leading-[1.1] mb-5 uppercase tracking-tighter group-hover:italic transition-all">
                                    {post.title}
                                </h2>

                                <p className="text-[11px] font-medium text-black/60 mb-10 flex-1 line-clamp-3 uppercase tracking-wider leading-relaxed">
                                    {post.summary || "Click to decrypt full signal..."}
                                </p>

                                <Link to={`/blogs/${post.slug || post.id}`} className="mt-auto">
                                    <button className="w-full bg-black text-white py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl">
                                        Read Analysis <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default BlogLandingPage;
