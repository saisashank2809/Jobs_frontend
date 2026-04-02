import { FloatingTags } from '../../components/landing/FloatingTags';
import { GLSLHills } from '../../components/landing/GLSLHills';
import { InteractiveRobotSpline } from '../../components/landing/InteractiveRobotSpline';
import { StatsSection } from '../../components/landing/StatsSection';
import { PathToHired } from '../../components/landing/PathToHired';
import { FeaturedJobs } from '../../components/landing/FeaturedJobs';
import { CategoriesSection } from '../../components/landing/CategoriesSection';
import { BenefitsSection } from '../../components/landing/BenefitsSection';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { Link } from 'react-router-dom';

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function LandingPage() {
    const scrollToJobs = () => {
        const el = document.getElementById('categories');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <div className="relative flex h-dvh w-full flex-col items-center overflow-hidden">
                <GLSLHills />
                <FloatingTags className="z-[1]" />
                
                {/* Visual Transition Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/20 to-transparent z-20 pointer-events-none" />

                {/* Hero Text — top portion */}
                <div className="pointer-events-none absolute z-10 mt-12 space-y-6 text-center">
                    <h1 className="text-6xl font-semibold whitespace-pre-wrap drop-shadow-lg text-black">
                        <span className="text-5xl font-thin italic">
                            Land Your Dream Job <br />
                        </span>
                        Search, Prepare, Land.
                    </h1>
                    <p className="text-sm text-black/60 drop-shadow-md" style={{ fontSize: 'large' }}>
                        We help you find the perfect job that matches your skills and interests.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-8 pointer-events-auto">
                        <Link
                            to="/register"
                            className="animated-button cursor-pointer"
                        >
                            <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                            </svg>
                            <span className="text">Get Started</span>
                            <span className="circle" />
                            <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                            </svg>
                        </Link>
                        <button
                            onClick={scrollToJobs}
                            className="animated-button cursor-pointer"
                        >
                            <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                            </svg>
                            <span className="text">Explore Jobs</span>
                            <span className="circle" />
                            <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 3D Robot — below the text */}
                <div className="absolute bottom-[-60px] left-0 right-0 z-[2] h-[60%] grayscale" style={{ clipPath: 'inset(0 0 60px 0)' }}>
                    <InteractiveRobotSpline
                        scene={ROBOT_SCENE_URL}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <div id="path-to-hired" className="section-optimize">
                <PathToHired />
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
            </div>

            <div id="footer">
                <LandingFooter />
            </div>
        </main>
    );
}
