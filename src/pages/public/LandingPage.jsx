import { GLSLHills } from '../../components/landing/GLSLHills';
import { InteractiveRobotSpline } from '../../components/landing/InteractiveRobotSpline';
import { StatsSection } from '../../components/landing/StatsSection';
import { PathToHired } from '../../components/landing/PathToHired';
import { FeaturedJobs } from '../../components/landing/FeaturedJobs';
import { CategoriesSection } from '../../components/landing/CategoriesSection';
import { BenefitsSection } from '../../components/landing/BenefitsSection';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { MockInterviewSection } from '../../components/landing/MockInterviewSection';
import { BlogHighlights } from '../../components/landing/BlogHighlights';
import { UpskillSection } from '../../components/landing/UpskillSection';
import { Link } from 'react-router-dom';

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function LandingPage() {
    const scrollToCategories = () => {
        const el = document.getElementById('categories');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="bg-[#F6F3ED]">
            {/* ── Hero Section ─────────────────────────── */}
            <div className="relative flex h-dvh w-full flex-col items-center overflow-hidden bg-[#313851]">
                <div className="pointer-events-none absolute inset-0">
                    <GLSLHills />
                </div>

                {/* Gradient fade into next section */}
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#F6F3ED] via-[#F6F3ED]/20 to-transparent z-20 pointer-events-none" />

                {/* ── Hero Content ───────────────────── */}
                <div className="absolute z-30 top-0 left-0 right-0 flex flex-col items-center pt-24 px-6">
                    {/* Eyebrow label */}
                    <p className="text-[#F6F3ED]/65 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                        The best companies are looking for proven talent.
                    </p>

                    {/* Main headline */}
                    <h1
                        className="hero-headline text-center font-medium leading-[1.1] tracking-tight max-w-4xl"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <span className="text-[#F6F3ED]">Your skills, your career, </span>
                        <span className="bg-gradient-to-r from-[#F6F3ED] to-[#C2CBD3] bg-clip-text text-transparent">
                            zero friction.
                        </span>
                    </h1>

                    {/* Sub-headline */}
                    <p
                        className="hero-subheadline text-center font-medium max-w-2xl"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                            color: 'rgba(246, 243, 237, 0.85)',
                            marginBottom: '2.5rem',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Access exclusive roles, track your applications, and step into the career you've been building toward.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/jobs"
                            className="px-8 py-4 bg-[#C2CBD3] text-[#313851] rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(194,203,211,0.3)]"
                        >
                            Browse Open Roles
                        </Link>
                        <button
                            onClick={scrollToCategories}
                            className="px-8 py-4 border border-[#C2CBD3] text-[#C2CBD3] rounded-xl font-bold transition-all hover:bg-[#C2CBD3]/10"
                        >
                            Explore Categories
                        </button>
                    </div>
                </div>

                {/* 3D Robot — bottom portion */}
                <div
                    className="hero-robot absolute bottom-[-50px] left-0 right-0 z-[2] h-[55%] opacity-90"
                    style={{ 
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)',
                        maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 100%)'
                    }}
                >
                    <InteractiveRobotSpline
                        scene={ROBOT_SCENE_URL}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <div id="stats" className="section-optimize">
                <StatsSection />
            </div>

            <div id="path-to-hired" className="section-optimize">
                <PathToHired />
            </div>

            <div id="featured-jobs" className="section-optimize">
                <FeaturedJobs />
            </div>

            <div id="upskill" className="section-optimize">
                <UpskillSection />
            </div>

            <div id="benefits" className="section-optimize">
                <BenefitsSection />
            </div>

            <div id="categories" className="section-optimize">
                <CategoriesSection />
            </div>

            <div id="mock-interview" className="section-optimize">
                <MockInterviewSection />
            </div>

            <div id="blog-highlights" className="section-optimize">
                <BlogHighlights />
            </div>

            <div id="footer">
                <LandingFooter />
            </div>
        </main>
    );
}
