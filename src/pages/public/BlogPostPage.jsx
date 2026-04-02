import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../../api/blogApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loader from '../../components/ui/Loader';
import { ArrowLeft, Calendar, Share2, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_CONTENT = {
    'mock-1': {
        title: "The Death of 'Entry Level': Why Juniors Need to Specialize",
        content: `
# The Generalist is Dead. Long Live the Specialist.

It used to be enough to know "React and Node." In 2026, that resume gets you filtered out by the first AI screen. 

## The Data Doesn't Lie
We analyzed 1.2 million job postings from the last 6 months. 
- **Generic "Full Stack Developer" roles:** Down 45% YoY.
- **Specialized roles (e.g., "Systems Engineer", "AI/ML Ops"):** Up 210%.

## Why is this happening?
AI coding assistants have democratized basic CRUD app creation. A junior dev with an AI tool can now output the same volume of boilerplate code as a mid-level dev from 2023. 

Companies no longer pay for boilerplate. They pay for **edge cases, performance optimization, and architectural decisions**.

## Action Plan
1. **Pick a Niche:** Don't just learn "Python". Learn "Python for High-Frequency Trading".
2. **Build Hard Things:** Stop building To-Do lists. Build a custom database engine. Build a compiler.
3. **Show Your Work:** Your GitHub graph is your new resume.
        `,
        image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        published_at: new Date('2026-02-18').toISOString(),
    },
    'mock-2': {
        title: "Salary Shock: Remote vs. On-Site Paygaps Widening",
        content: `
# The Cost of Comfort

We all love working in our pajamas. But it might be costing you $30,000 a year.

## The Pay Gap
Our internal salary data reveals a startling trend for Q1 2026:
- **On-Site / Hybrid Roles:** Avg. Salary $145,000
- **Fully Remote Roles:** Avg. Salary $115,000

That's a **26% premium** for showing up to the office.

## Validating Presence
Employers are effectively taxing remote work. They view on-site presence as a "premium feature", correlating it with higher engagement.

## What should you do?
If you're optimized for income, consider a hybrid role. If you're optimized for lifestyle, be prepared to accept the "Remote Tax".
        `,
        image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
        published_at: new Date('2026-02-17').toISOString(),
    }
};

const BlogPostPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                if (MOCK_CONTENT[slug]) {
                    setPost(MOCK_CONTENT[slug]);
                    setLoading(false);
                    return;
                }
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
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-xl bg-white border-4 border-black p-12 rounded-[32px] shadow-[16px_16px_0px_#000]">
                <AlertCircle size={64} className="mx-auto mb-8 text-black" />
                <h1 className="text-4xl font-display font-black text-black uppercase tracking-tighter mb-4">Signal Null</h1>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mb-12 italic">{error}</p>
                <Link to="/blogs" className="inline-block bg-black text-white px-10 py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">
                    Return to Feed
                </Link>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen pt-16 pb-24 px-8 bg-white">
            <article className="max-w-4xl mx-auto">
                <Link to="/blogs" className="inline-flex items-center gap-3 text-[10px] font-black text-black/40 hover:text-black mb-12 transition-all uppercase tracking-[0.3em]">
                    <ArrowLeft size={16} /> Return to Intel
                </Link>

                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 text-center pb-16 border-b-4 border-black"
                >
                    <div className="flex items-center justify-center gap-3 text-[9px] font-black text-white mb-8 bg-black inline-flex px-6 py-2 rounded-lg border border-black shadow-lg uppercase tracking-widest">
                        <Calendar size={12} />
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        <span className="mx-2 opacity-30">|</span>
                        <span>OTTOBON_SIG_INT</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-black mb-12 tracking-tighter text-black leading-tight uppercase">
                        {post.title}
                    </h1>
                    {post.image_url && (
                        <div className="relative rounded-[40px] overflow-hidden border-4 border-black shadow-[24px_24px_0px_rgba(0,0,0,0.05)]">
                            <img src={post.image_url} alt={post.title} className="w-full h-[500px] object-cover grayscale brightness-90 contrast-125" />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    )}
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    className="prose prose-neutral prose-2xl max-w-none 
                    prose-headings:font-display prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-black prose-headings:uppercase
                    prose-p:text-black/80 prose-p:font-medium prose-p:leading-relaxed prose-p:uppercase prose-p:text-sm prose-p:tracking-wider
                    prose-li:text-black/80 prose-li:font-medium prose-li:uppercase prose-li:text-xs prose-li:tracking-widest
                    prose-strong:text-black prose-strong:font-black prose-strong:underline
                    prose-a:text-black prose-a:font-black prose-a:underline hover:prose-a:opacity-50 transition-opacity
                    prose-blockquote:border-l-8 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:py-10 prose-blockquote:px-12 prose-blockquote:not-italic prose-blockquote:rounded-3xl prose-blockquote:text-black prose-blockquote:font-black prose-blockquote:uppercase prose-blockquote:text-xl
                "
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </motion.div>

                <div className="mt-24 pt-12 border-t-8 border-black flex flex-col md:flex-row justify-between items-center gap-10 bg-white rounded-[40px] border-4 border-black p-12 shadow-[20px_20px_0px_#000]">
                    <div>
                        <p className="font-display font-black text-2xl text-black uppercase tracking-tighter flex items-center gap-3">
                            <Sparkles size={24} /> SIGNAL_SYNC_SUCCESS
                        </p>
                        <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] mt-2">Transmit intel to your network node.</p>
                    </div>
                    <button className="flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl active:scale-95">
                        <Share2 size={24} /> Transmit Intel
                    </button>
                </div>
            </article>
        </div>
    );
};

export default BlogPostPage;
