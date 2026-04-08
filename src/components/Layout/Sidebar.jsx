import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Briefcase, User, MessageSquare, LayoutDashboard, PlusCircle, Search, Upload, Newspaper, TrendingUp, BookOpen, Radio, Bookmark } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { role } = useAuth();
    if (!role) return null;

    const links = [
        { to: '/jobs', label: 'Feed', icon: Search, roles: [ROLES.SEEKER, ROLES.PROVIDER, ROLES.ADMIN], category: 'Discover' },
        { to: '/saved', label: 'Saved', icon: Bookmark, roles: [ROLES.SEEKER], category: 'Discover' },
        { to: '/profile', label: 'Identity', icon: User, roles: [ROLES.SEEKER], category: 'Discover' },
        { to: '/courses', label: 'Courses', icon: BookOpen, roles: [ROLES.SEEKER], category: 'Prepare' },
        { to: '/mock-interview', label: 'Mock Interview', icon: Radio, roles: [ROLES.SEEKER], category: 'Prepare' },
        { to: '/chat', label: 'Direct', icon: MessageSquare, roles: [ROLES.SEEKER], category: 'Prepare' },
        { to: '/provider/create', label: 'Publish', icon: PlusCircle, roles: [ROLES.PROVIDER], category: 'Manage' },
        { to: '/provider/listings', label: 'Registry', icon: Briefcase, roles: [ROLES.PROVIDER], category: 'Manage' },
        { to: '/market-intelligence', label: 'Analytics', icon: TrendingUp, roles: [ROLES.PROVIDER, ROLES.SEEKER], category: 'Insight' },
        { to: '/blogs', label: 'Blogs', icon: Newspaper, roles: [ROLES.SEEKER, ROLES.PROVIDER, ROLES.ADMIN], category: 'Insight' },
        { to: '/admin/tower', label: 'Command', icon: LayoutDashboard, roles: [ROLES.ADMIN], category: 'System' },
        { to: '/admin/ingest', label: 'Ingestion', icon: Upload, roles: [ROLES.ADMIN], category: 'System' },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(role));
    if (filteredLinks.length === 0) return null;

    // Dynamically group links by their category
    const groupedLinks = filteredLinks.reduce((acc, link) => {
        if (!acc[link.category]) acc[link.category] = [];
        acc[link.category].push(link);
        return acc;
    }, {});

    return (
        <aside className="fixed left-8 top-32 bottom-8 w-64 glass-panel z-40 overflow-y-auto p-8 hidden md:flex flex-col gap-10 rounded-[32px] border-none shadow-2xl shadow-black/5">
            <div className="pb-6 border-b border-zinc-100/50 mb-4 flex items-center justify-between px-2">
                <p className="text-[9px] font-black text-zinc-300 tracking-[0.4em] uppercase">
                    Repository
                </p>
                <div className="w-2 h-2 bg-black rounded-full breathing-pulse" />
            </div>

            <div className="flex flex-col gap-6">
                {Object.entries(groupedLinks).map(([category, items], cIdx) => (
                    <div key={category} className="flex flex-col gap-1">
                        <h4 className="text-[9px] font-black text-zinc-400 tracking-[0.2em] uppercase px-4 mb-2">
                            {category}
                        </h4>
                        <div className="flex flex-col gap-1">
                            {items.map((link, i) => (
                                <motion.div
                                    key={link.to}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: (cIdx * 0.1) + (i * 0.03)
                                    }}
                                >
                                    <NavLink
                                        to={link.to}
                                        className={({ isActive }) => `
                                            flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-700 text-[10px] font-black uppercase tracking-widest
                                            ${isActive
                                                ? 'bg-black text-white shadow-2xl shadow-black/20'
                                                : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'
                                            }
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                                    <span className={isActive ? 'font-semibold' : ''}>{link.label}</span>
                                                </div>
                                            </>
                                        )}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                <div className="bg-zinc-50/50 p-6 rounded-[32px] border border-white/50 flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                        <span className="text-[9px] font-black text-black uppercase tracking-[0.2em]">Active</span>
                    </div>
                    <div className="text-[8px] font-black text-zinc-300 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-700">SIG_INT_04</div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
