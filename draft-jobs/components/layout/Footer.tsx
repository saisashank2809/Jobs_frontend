"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Brand Logo */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter">ottobon.</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <ul className="space-y-4">
                        {[
                            { label: "Explore Jobs", href: "/jobs" },
                            { label: "Discover Companies", href: "/companies" },
                            { label: "Browse Collections", href: "/collections" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="space-y-4">
                        {[
                            { label: "For Job Seekers", href: "/signup" },
                            { label: "For Employers", href: "/employers/signup" },
                            { label: "Sign up", href: "/signup" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="space-y-4">
                        {[
                            { label: "Directory", href: "/directory" },
                            { label: "Conferences", href: "/conferences" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <ul className="space-y-4">
                        {[
                            { label: "FAQs", href: "/faqs" },
                            { label: "About Us", href: "/about" },
                            { label: "Contact Us", href: "/contact" },
                        ].map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="text-white/60 hover:text-white transition-colors text-sm font-medium">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/50 font-medium">
                    <div className="flex gap-6">
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Legal Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
