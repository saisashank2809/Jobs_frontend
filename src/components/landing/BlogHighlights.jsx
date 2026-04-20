import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../../hooks/useBlogPosts';

const MOCK_FALLBACKS = [
    {
        id: 'f1',
        title: "The Future of AI in Recruitment",
        summary: "How neural networks are reshaping the way founders find talent in 2026.",
        published_at: new Date().toISOString(),
        category: "Technology"
    },
    {
        id: 'f2',
        title: "Landing a Dream Job at Swiggy",
        summary: "Insider tips on cracking the Swiggy interview from our community members.",
        published_at: new Date().toISOString(),
        category: "Career"
    },
    {
        id: 'f3',
        title: "How Skill Signals Are Changing Hiring",
        summary: "Why verified work, interview readiness, and sharper matching are becoming the new baseline.",
        published_at: new Date().toISOString(),
        category: "Hiring"
    }
];

export function BlogHighlights() {
    const { posts } = useBlogPosts(3);
    const displayPosts = posts?.length > 0 ? posts.slice(0, 3) : MOCK_FALLBACKS;

    return (
        <section className="py-28 px-6 md:px-12 lg:px-20 border-t border-[#C2CBD3]/60" style={{ backgroundColor: '#F6F3ED' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="section-label mb-4">Market Intelligence</p>
                        <h2
                            className="font-extrabold leading-tight tracking-tight"
                            style={{
                                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                                fontSize: 'clamp(2rem, 4vw, 3rem)',
                                color: '#313851',
                                fontStyle: 'normal',
                            }}
                        >
                            Latest Signals
                        </h2>
                        <p
                            className="mt-4 max-w-xl font-medium leading-8"
                            style={{ color: 'rgba(49, 56, 81, 0.65)', fontSize: '1rem' }}
                        >
                            Clear hiring trends, company insights, and career moves for candidates who want a sharper edge.
                        </p>
                    </div>
                    <Link
                        to="/blogs"
                        className="inline-flex items-center justify-center gap-3 rounded-lg border border-[#C2CBD3] bg-white px-5 py-3 text-sm font-semibold text-[#313851] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#313851] hover:shadow-md"
                    >
                        Explore Blogs <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Equal-height clean white cards grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
                    {displayPosts.map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="landing-card group flex flex-col p-6"
                            style={{ minHeight: '320px' }}
                        >
                            {/* Meta */}
                            <div className="mb-5 flex flex-wrap items-center gap-3" style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(49, 56, 81, 0.45)' }}>
                                <span className="inline-flex items-center gap-1.5">
                                    <TrendingUp size={12} style={{ color: '#313851' }} />
                                    {post.category || post.domain || 'Analysis'}
                                </span>
                                <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#C2CBD3', display: 'inline-block' }} />
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    {new Date(post.created_at || post.published_at).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Title */}
                            <h3
                                className="mb-4 font-semibold leading-snug tracking-tight"
                                style={{
                                    fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
                                    fontSize: '1.1rem',
                                    color: '#313851',
                                    fontStyle: 'normal',
                                }}
                            >
                                {post.title}
                            </h3>

                            {/* Summary */}
                            <p
                                className="flex-1 font-medium leading-7 line-clamp-4"
                                style={{ fontSize: '0.9rem', color: 'rgba(49, 56, 81, 0.62)' }}
                            >
                                {post.summary || post.abstract || (post.content ? post.content.substring(0, 150) + "..." : "Full signal decryption available for verified operators.")}
                            </p>

                            {/* CTA */}
                            <Link to={`/blogs/${post.slug || post.id}`} className="mt-6">
                                <span
                                    className="inline-flex items-center gap-2 font-semibold transition-transform duration-300 group-hover:translate-x-1"
                                    style={{ fontSize: '0.875rem', color: '#313851' }}
                                >
                                    Read full signal <ArrowRight size={15} />
                                </span>
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
