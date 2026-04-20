import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import Loader from '../../components/ui/Loader';
import { BookOpen, Calendar, ArrowRight, Sparkles, TrendingUp, Cpu, Globe, DollarSign, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogLandingPage = () => {
    const { user } = useAuth();
    const { posts, loading, generating, handleGenerate } = useBlogPosts(100);

    const displayPosts = posts || [];

    if (loading) return <Loader fullScreen variant="logo" />;

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto bg-[#FBFBFB]">
            <header className="mb-20 pb-12 border-b border-zinc-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl font-sans font-bold text-zinc-900 tracking-tight leading-[0.9]"
                        >
                            Market <span className="text-zinc-200">Signals</span>
                        </motion.h1>
                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-8 flex items-center gap-3">
                            <div className="w-8 h-[1px] bg-zinc-200" />
                            Intelligence Synthesis / Unfiltered Analysis
                        </div>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="bg-zinc-900 text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-3 disabled:opacity-30 shadow-xl shadow-zinc-900/10 active:scale-95"
                        >
                            {generating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            {generating ? "Synthesizing..." : "Generate Signal"}
                        </button>
                    )}
                </div>
            </header>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {displayPosts.map((post, index) => (
                    <motion.div key={post.id} variants={item} className="group h-full">
                        <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-zinc-900/5 transition-all duration-500 active:scale-[0.99]">
                            {/* Image Container */}
                            <div className="h-64 bg-zinc-50 overflow-hidden relative border-b border-zinc-100">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out opacity-90 group-hover:opacity-100" />
                                ) : (
                                    <div className="h-full grid place-items-center text-zinc-200">
                                        {post.icon || <BookOpen size={48} />}
                                    </div>
                                )}
                                <div className="absolute top-6 right-6 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                    {post.category || post.domain || "ANALYSIS"}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-300 mb-6 uppercase tracking-widest">
                                    <Calendar size={14} className="text-zinc-200" />
                                    <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                <h2 className="text-2xl font-bold text-zinc-900 leading-[1.2] mb-6 tracking-tight group-hover:text-zinc-600 transition-colors">
                                    {post.title}
                                </h2>

                                <p className="text-sm font-medium text-zinc-500 mb-10 flex-1 line-clamp-3 leading-relaxed">
                                    {post.summary || post.description || (post.content ? post.content.substring(0, 120) + "..." : "Click to decrypt full signal...")}
                                </p>

                                <Link to={`/blogs/${post.slug || post.id}`} className="mt-auto">
                                    <button className="w-full bg-white border border-zinc-100 text-zinc-900 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm group/btn">
                                        Open Signal <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
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
