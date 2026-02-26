"use client";

import { FloatingTags } from "@/components/ui/floating-tags";
import { GLSLHills } from "@/components/ui/glsl-hills";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";
import { StatsSection } from "@/components/sections/StatsSection";
import { PathToHired } from "@/components/sections/PathToHired";
import { FeaturedJobs } from "@/components/sections/FeaturedJobs";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function HomeClient() {
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
                            href="/signup"
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

            <div id="path-to-hired">
                <PathToHired />
            </div>

            {/* Padded Content Sections */}
            <div className="relative z-10 px-4 md:px-12 lg:px-20 space-y-20 mb-20">
                <div id="stats">
                    <StatsSection />
                </div>
                <div id="benefits">
                    <BenefitsSection />
                </div>
                <div id="featured-jobs">
                    <FeaturedJobs />
                </div>
                <div id="categories">
                    <CategoriesSection />
                </div>
            </div>

            <div id="footer">
                <Footer />
            </div>
        </main>
    );
}
