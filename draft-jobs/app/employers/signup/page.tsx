"use client";

import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function EmployerSignupPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Left Side - Visual/Brand */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#FFF0F0] p-12 text-black relative overflow-hidden">
                <div className="z-10">
                    <Link href="/" className="flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-8 w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-serif font-bold italic">Ottobon</h1>
                </div>

                <div className="z-10 space-y-6 max-w-md">
                    <h2 className="text-5xl font-serif leading-tight">
                        Build your dream <br />
                        team today.
                    </h2>
                    <p className="text-black/60 text-lg">
                        Access a curated pool of top-tier talent and streamline your hiring process with our AI-powered tools.
                    </p>
                </div>

                <div className="z-10 text-sm text-black/40">
                    © {new Date().getFullYear()} Ottobon Group.
                </div>

                {/* Abstract Visual Shape */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD6D6] rounded-full blur-3xl pointer-events-none opacity-50" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
                <div className="max-w-md w-full space-y-8">
                    <div className="md:hidden mb-8">
                        <Link href="/" className="flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                        <h1 className="text-3xl font-serif font-bold italic mb-2">Ottobon</h1>
                    </div>

                    <div className="text-center">
                        <div className="inline-block p-3 rounded-full bg-[#FFF0F0] mb-4">
                            <Building2 className="w-6 h-6 text-[#D9304F]" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-black mb-2">Hire with Ottobon</h2>
                        <p className="text-black/60">
                            Already have a company account?{" "}
                            <Link href="/employers/login" className="text-black font-semibold underline hover:text-black/80">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-black mb-1">Company Name</label>
                            <input
                                type="text"
                                id="company"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                placeholder="Acme Inc."
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Work Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <button className="w-full bg-black text-white font-bold rounded-xl py-3 hover:bg-black/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl">
                            Start Hiring
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-black/60 text-sm">
                            Looking for a job?{" "}
                            <Link href="/signup" className="text-black font-semibold hover:underline">
                                Sign up as a Job Seeker
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
