import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { 
    Search, 
    Bookmark, 
    User, 
    BookOpen, 
    Radio, 
    MessageSquare, 
    TrendingUp, 
    Newspaper, 
    LayoutDashboard,
    LogOut,
    ChevronRight,
    Briefcase,
    PlusCircle,
    ClipboardList,
    Upload
} from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { supabase } from '../../api/client';

const Sidebar = () => {
    const { role } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();

    if (!role) return null;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

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
    
    const groupedLinks = filteredLinks.reduce((acc, link) => {
        if (!acc[link.category]) acc[link.category] = [];
        acc[link.category].push(link);
        return acc;
    }, {});

    return (
        <aside 
            className="sidebar fixed left-0 top-0 h-screen z-[1000] flex flex-col p-3 transition-[width] duration-[0.25s] ease-[cubic-bezier(0.4,0,0.2,1)] rounded-r-lg will-change-[width] transform translate-z-0 shadow-[4px_0_12px_-2px_rgba(49,56,81,0.15)] overflow-hidden"
            style={{ backgroundColor: '#313851', color: '#F6F3ED' }}
        >
            <style>
                {`
                    .sidebar { width: 70px; transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
                    .sidebar:hover { width: 260px; }
                    .header-and-content { transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1); margin-left: 70px; }
                    .sidebar:hover + .header-and-content, .sidebar:hover ~ .header-and-content { margin-left: 260px; }
                    .top-arrow { position: absolute; top: 16px; right: 16px; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(246, 243, 237, 0.1); border: none; color: #F6F3ED; cursor: pointer; padding: 6px; border-radius: 6px; z-index: 10; }
                    .sidebar:hover .top-arrow { transform: rotate(180deg); }
                    .sidebar-nav { padding-top: 68px; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    .nav-item { position: relative; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; white-space: nowrap; }
                    .nav-item:hover { background-color: rgba(194, 203, 211, 0.18) !important; border-radius: 8px; }
                    .nav-item:hover::before { content: ''; position: absolute; left: -12px; top: 50%; transform: translateY(-50%); width: 4px; height: 28px; background: #C2CBD3; border-radius: 0 4px 4px 0; }
                    .sidebar-item-active { background-color: #C2CBD3 !important; color: #313851 !important; font-weight: 700; }
                    .nav-text { opacity: 0; visibility: hidden; transition: opacity 0.2s ease; margin-left: 12px; font-size: 13px; letter-spacing: 0.02em; }
                    .sidebar:hover .nav-text { opacity: 1; visibility: visible; }
                    .nav-icon { width: 24px; height: 24px; min-width: 24px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; }
                    .nav-item:hover .nav-icon { transform: scale(1.08); color: #F6F3ED; }
                    .sidebar-item-active::before { content: ''; position: absolute; left: -12px; top: 50%; transform: translateY(-50%); width: 4px; height: 28px; background: #313851; border-radius: 0 4px 4px 0; }
                    .category-label { height: 0; opacity: 0; visibility: hidden; transition: all 0.2s ease; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(246, 243, 237, 0.4); margin: 0; overflow: hidden; }
                    .sidebar:hover .category-label { height: auto; opacity: 1; visibility: visible; margin: 12px 0 4px 12px; }
                    .sidebar-nav { transition: gap 0.2s ease; gap: 4px !important; }
                    .sidebar:hover .sidebar-nav { gap: 8px !important; }
                `}
            </style>

            <button className="top-arrow">
                <ChevronRight size={18} />
            </button>

            <nav className="sidebar-nav no-scrollbar flex-1 flex flex-col overflow-x-hidden overflow-y-auto pr-1">
                {Object.entries(groupedLinks).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-1 mb-1">
                        <div className="category-label">{category}</div>
                        {items.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `
                                    nav-item p-2.5 rounded-md w-full border-none transition-all duration-300 overflow-hidden
                                    ${isActive ? 'sidebar-item-active' : ''}
                                `}
                            >
                                <div className="nav-icon">
                                    <link.icon size={24} strokeWidth={2} />
                                </div>
                                <div className="flex items-center justify-between flex-1 pr-2">
                                    <span className="nav-text font-bold">{link.label}</span>
                                    {link.to.includes('interview-reviews') && unreadCount > 0 && (
                                        <span className="nav-text px-2 py-0.5 bg-red-500 text-white text-[9px] rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="border-t border-[#C2CBD3]/20 pt-3 mt-3 flex flex-col gap-2">
                <button 
                    title="Logout"
                    onClick={handleLogout}
                    className="nav-item p-3 rounded-lg w-full border-none bg-red-500/15 text-[#F6F3ED] cursor-pointer"
                >
                    <div className="nav-icon">
                        <LogOut size={24} />
                    </div>
                    <span className="nav-text font-bold uppercase tracking-widest text-[10px]">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
