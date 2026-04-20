import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { Briefcase, User, MessageSquare, LayoutDashboard, PlusCircle, Search, Upload, Newspaper, TrendingUp, BookOpen, Radio, Bookmark, ClipboardList } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { role } = useAuth();
    const { unreadCount } = useNotifications();
    if (!role) return null;

    const links = [
        { to: '/jobs', label: 'Job Board', icon: Search, roles: [ROLES.SEEKER, ROLES.PROVIDER, ROLES.ADMIN], category: 'Jobs' },
        { to: '/saved', label: 'Saved Jobs', icon: Bookmark, roles: [ROLES.SEEKER], category: 'Jobs' },
        { to: '/profile', label: 'My Profile', icon: User, roles: [ROLES.SEEKER], category: 'Jobs' },
        { to: '/courses', label: 'Skills & Courses', icon: BookOpen, roles: [ROLES.SEEKER], category: 'Resources' },
        { to: '/mock-interview', label: 'Interview Prep', icon: Radio, roles: [ROLES.SEEKER], category: 'Resources' },
        { to: '/interview-reviews', label: 'Interview Reviews', icon: ClipboardList, roles: [ROLES.SEEKER], category: 'Resources' },
        { to: '/chat', label: 'Messages', icon: MessageSquare, roles: [ROLES.SEEKER], category: 'Resources' },
        { to: '/provider/create', label: 'Post a Job', icon: PlusCircle, roles: [ROLES.PROVIDER], category: 'Recruitment' },
        { to: '/provider/listings', label: 'My Listings', icon: Briefcase, roles: [ROLES.PROVIDER], category: 'Recruitment' },
        { to: '/market-intelligence', label: 'Market Analytics', icon: TrendingUp, roles: [ROLES.PROVIDER, ROLES.SEEKER], category: 'Insights' },
        { to: '/blogs', label: 'Career Blog', icon: Newspaper, roles: [ROLES.SEEKER, ROLES.PROVIDER, ROLES.ADMIN], category: 'Insights' },
        { to: '/admin/tower', label: 'Admin Dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN], category: 'Administrative' },
        { to: '/admin/interview-reviews', label: 'Interview Reviews', icon: ClipboardList, roles: [ROLES.ADMIN], category: 'Administrative' },
        { to: '/admin/ingest', label: 'Data Management', icon: Upload, roles: [ROLES.ADMIN], category: 'Administrative' },
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
                                                {link.to.includes('interview-reviews') && unreadCount > 0 && (
                                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-tighter transition-colors ${isActive ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                                        {unreadCount}
                                                    </span>
                                                )}
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
