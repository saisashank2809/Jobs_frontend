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
import { Link } from 'react-router-dom';

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function LandingPage() {
    const scrollToJobs = () => {
        const el = document.getElementById('categories');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main style={{ backgroundColor: '#F6F3ED' }}>
            {/* ── Hero Section ─────────────────────────── */}
            <div className="relative flex h-dvh w-full flex-col items-center overflow-hidden">
                <div className="pointer-events-none">
                    <GLSLHills />
                </div>

                {/* Gradient fade into next section */}
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#313851] via-[#313851]/20 to-transparent z-20 pointer-events-none" />

                {/* ── Hero Content ───────────────────── */}
                <div className="absolute z-30 top-0 left-0 right-0 flex flex-col items-center pt-14 px-6">
                    {/* Eyebrow label */}
                    <p className="section-label mb-3 opacity-70">
                        Your career, elevated
                    </p>

                    {/* Main headline */}
                    <h1
                        className="hero-headline text-center font-extrabold leading-[1.0] tracking-tight"
                        style={{
                            fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(2rem, 5vw, 4rem)',
                            color: '#313851',
                            fontStyle: 'normal',
                            textShadow: '0 8px 32px rgba(246,243,237,0.5)',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Land Your Dream Job
                    </h1>

                    {/* Sub-headline */}
                    <p
                        className="hero-subheadline text-center font-semibold"
                        style={{
                            fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                            fontSize: 'clamp(1rem, 2vw, 1.35rem)',
                            color: 'rgba(49, 56, 81, 0.72)',
                            fontStyle: 'normal',
                            marginBottom: '0.75rem',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Search, Prepare, Land.
                    </p>

                    {/* Body copy */}
                    <p
                        className="hero-description text-center font-medium leading-relaxed max-w-md"
                        style={{
                            fontFamily: "'Inter', system-ui, sans-serif",
                            fontSize: '0.975rem',
                            color: 'rgba(49, 56, 81, 0.60)',
                            marginBottom: '1.5rem',
                        }}
                    >
                        We help you find the perfect job that matches your skills and interests.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="hero-cta hero-cta-primary hero-primary-btn"
                        >
                            Get Started
                        </Link>
                        <button
                            onClick={scrollToJobs}
                            className="hero-cta hero-cta-secondary"
                        >
                            Explore Jobs
                        </button>
                    </div>
                </div>

                {/* 3D Robot — bottom portion */}
                <div
                    className="hero-robot absolute bottom-[-100px] left-0 right-0 z-[2] h-[48%] grayscale opacity-85"
                    style={{ 
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)',
                        maskImage: 'linear-gradient(to bottom, black 0%, black 75%, transparent 100%)'
                    }}
                >
                    <InteractiveRobotSpline
                        scene={ROBOT_SCENE_URL}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <div id="path-to-hired" className="section-optimize">
                <PathToHired />
            </div>

            <div id="mock-interview-promo" className="section-optimize">
                <MockInterviewSection />
            </div>

            {/* Padded Content Sections */}
            <div className="relative z-10 px-4 md:px-12 lg:px-20 overflow-hidden section-optimize">
                <div id="stats" className="gpu-accelerate">
                    <StatsSection />
                </div>
                <div id="benefits" className="gpu-accelerate">
                    <BenefitsSection />
                </div>
                <div id="featured-jobs" className="gpu-accelerate">
                    <FeaturedJobs />
                </div>
                <div id="categories" className="gpu-accelerate">
                    <CategoriesSection />
                </div>
                <div id="blog-highlights" className="gpu-accelerate">
                    <BlogHighlights />
                </div>
            </div>

            <div id="footer">
                <LandingFooter />
            </div>
        </main>
    );
}
