import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="pt-16 pb-8 border-t" style={{ backgroundColor: '#313851', borderColor: 'rgba(194,203,211,0.12)' }}>
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Brand Logo */}
                <div className="mb-12">
                    <Link to="/" className="flex items-center gap-3 group w-fit">
                        <div
                            className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition-transform duration-500"
                            style={{ backgroundColor: '#F6F3ED' }}
                        >
                            <Briefcase size={20} style={{ color: '#313851' }} />
                        </div>
                        <span
                            className="font-black text-2xl tracking-tighter uppercase"
                            style={{
                                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                                color: '#F6F3ED',
                                fontStyle: 'normal',
                            }}
                        >
                            Ottobon<span style={{ opacity: 0.4 }}>/</span>Jobs
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
                                        className="text-sm font-medium transition-colors hover:opacity-100"
                                        style={{ color: 'rgba(194, 203, 211, 0.65)' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#F6F3ED'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(194, 203, 211, 0.65)'}
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
                    className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium border-t"
                    style={{ color: 'rgba(194, 203, 211, 0.45)', borderColor: 'rgba(194, 203, 211, 0.12)' }}
                >
                    <div className="flex gap-6">
                        {['Cookies Policy', 'Legal Terms', 'Privacy Policy'].map(t => (
                            <span
                                key={t}
                                className="cursor-pointer transition-colors"
                                onMouseEnter={e => e.currentTarget.style.color = '#F6F3ED'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(194, 203, 211, 0.45)'}
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
