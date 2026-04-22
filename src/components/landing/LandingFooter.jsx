import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="pt-24 pb-12 border-t border-[#F6F3ED]/10 bg-[#313851]">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Brand Logo */}
                <div className="mb-16">
                    <Link to="/" className="flex items-center gap-3 group w-fit">
                        <div
                            className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition-all duration-500 bg-[#C2CBD3]"
                        >
                            <Briefcase size={20} className="text-[#313851]" />
                        </div>
                        <span
                            className="font-medium text-2xl tracking-tighter uppercase text-[#F6F3ED]"
                            style={{
                                fontFamily: "'Inter', system-ui, sans-serif",
                            }}
                        >
                            Ottobon<span className="opacity-30">/</span>Jobs
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {[
                        [
                            { label: "Explore Jobs", to: "/jobs" },
                            { label: "Discover Companies", to: "/jobs" },
                            { label: "Browse Collections", to: "/jobs" },
                        ],
                        [
                            { label: "For Job Seekers", to: "/register" },
                            { label: "For Employers", to: "/register" },
                            { label: "Sign up", to: "/register" },
                        ],
                        [
                            { label: "Directory", to: "/jobs" },
                            { label: "Conferences", to: "/jobs" },
                        ],
                        [
                            { label: "FAQs", to: "/jobs" },
                            { label: "About Us", to: "/jobs" },
                            { label: "Contact Us", to: "/jobs" },
                        ],
                    ].map((col, ci) => (
                        <ul key={ci} className="space-y-4">
                            {col.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        to={item.to}
                                        className="text-sm font-medium transition-all text-[#F6F3ED]/85 hover:text-[#C2CBD3]"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div
                    className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium border-t border-[#F6F3ED]/10 text-[#F6F3ED]/65"
                >
                    <div className="flex gap-6">
                        {['Cookies Policy', 'Legal Terms', 'Privacy Policy'].map(t => (
                            <span
                                key={t}
                                className="cursor-pointer transition-all hover:text-[#F6F3ED]"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <span>© {new Date().getFullYear()} Ottobon Jobs. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
