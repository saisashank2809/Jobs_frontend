import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../../api/blogApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loader from '../../components/ui/Loader';
import { ArrowLeft, Calendar, Share2, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const data = await getBlogPost(slug);
                setPost(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch post", err);
                setError("Protocol Error: Signal Terminal.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return <Loader fullScreen variant="logo" />;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#FBFBFB]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-xl bg-white border border-zinc-100 p-8 rounded-[32px] shadow-2xl shadow-zinc-900/5">
                <AlertCircle size={64} className="mx-auto mb-10 text-zinc-300" />
                <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Signal Null</h1>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.4em] mb-12 italic">{error}</p>
                <Link to="/blogs" className="inline-block bg-zinc-900 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10">
                    Return to Feed
                </Link>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 md:px-10 bg-[#FBFBFB] overflow-x-hidden">
            <article className="max-w-4xl mx-auto">
                <Link to="/blogs" className="inline-flex items-center gap-3 text-[11px] font-bold text-zinc-400 hover:text-zinc-900 mb-16 transition-all uppercase tracking-[0.3em]">
                    <ArrowLeft size={16} /> Return to Intel
                </Link>

                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-20 text-center pb-20 border-b border-zinc-100"
                >
                    <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-zinc-500 mb-10 bg-zinc-50 inline-flex px-8 py-2.5 rounded-full border border-zinc-100 shadow-sm uppercase tracking-widest">
                        <Calendar size={14} className="text-zinc-300" />
                        <span>{new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="mx-2 opacity-20">|</span>
                        <span>ANALYSIS_CORE</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-sans font-bold mb-16 tracking-tight text-zinc-900 leading-[1.1]">
                        {post.title}
                    </h1>
                    {post.image_url && (
                        <div className="relative rounded-[56px] overflow-hidden border border-zinc-100 shadow-2xl shadow-zinc-900/5">
                            <img src={post.image_url} alt={post.title} className="w-full h-[600px] object-cover opacity-90 brightness-110" />
                            <div className="absolute inset-0 bg-zinc-900/5" />
                        </div>
                    )}
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="prose prose-zinc prose-lg md:prose-xl max-w-none 
                    prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
                    prose-p:text-zinc-600 prose-p:font-medium prose-p:leading-[1.8]
                    prose-li:text-zinc-600 prose-li:font-medium
                    prose-strong:text-zinc-900 prose-strong:font-bold
                    prose-a:text-zinc-900 prose-a:font-bold prose-a:no-underline hover:prose-a:underline transition-all
                    prose-blockquote:border-l-4 prose-blockquote:border-zinc-900 prose-blockquote:bg-zinc-50 prose-blockquote:py-10 prose-blockquote:px-12 prose-blockquote:not-italic prose-blockquote:rounded-[32px] prose-blockquote:text-zinc-900 prose-blockquote:font-medium prose-blockquote:text-xl
                "
                >
                    {post.description && (
                        <div className="text-lg md:text-xl font-medium text-zinc-600 leading-[1.8] tracking-tight border-l-4 border-zinc-900 pl-8 md:pl-10 py-4 mb-12">
                            {post.description}
                        </div>
                    )}
                    
                    {post.summary && post.summary !== post.description && (
                        <div className={`text-[17px] md:text-lg font-medium text-zinc-500 leading-relaxed tracking-tight ${!post.description ? 'border-l-4 border-zinc-900 pl-8 md:pl-10 py-4' : 'mb-12'}`}>
                            {post.summary}
                        </div>
                    )}
                    
                    {post.content && (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    )}
                    
                    {(!post.content && !post.description && !post.summary) && (
                        <p className="italic text-zinc-400">*Signal contains no textual decryption.*</p>
                    )}

                    {post.url && (
                        <div className="mt-16 p-8 bg-zinc-50 border border-zinc-100 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 not-prose">
                            <div>
                                <h3 className="font-bold text-zinc-900 text-xl m-0 tracking-tight">Access External Signal</h3>
                                <p className="text-sm font-medium text-zinc-500 m-0 mt-2">This intel is an automated extraction. Proceed to the root source to decrypt the full context.</p>
                            </div>
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 no-underline">
                                Authenticate via {post.domain || 'Source'} <ExternalLink size={16} />
                            </a>
                        </div>
                    )}
                </motion.div>

                <div className="mt-32 p-8 bg-white border border-zinc-100 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-zinc-900/5">
                    <div>
                        <p className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
                            <Sparkles size={24} className="text-zinc-900" /> Signal Sync
                        </p>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-3">Transmit intel to your external network.</p>
                    </div>
                    <button className="flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-95">
                        <Share2 size={20} /> Transmit Intel
                    </button>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;
