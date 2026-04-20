import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    Search, 
    Bookmark, 
    User, 
    BookOpen, 
    Mic2, 
    MessageSquare, 
    TrendingUp, 
    Newspaper, 
    Settings, 
    LogOut,
    ChevronRight,
    Briefcase
} from 'lucide-react';
import { supabase } from '../../api/client';

const Sidebar = () => {
    const { role } = useAuth();
    const navigate = useNavigate();

    if (!role) return null;

    const navItems = [
        { to: '/jobs', title: 'Job Board', icon: Search },
        { to: '/saved', title: 'Saved Jobs', icon: Bookmark },
        { to: '/profile', title: 'My Profile', icon: User },
        { to: '/courses', title: 'Skills & Courses', icon: BookOpen },
        { to: '/mock-interview', title: 'Interview Prep', icon: Mic2 },
        { to: '/chat', title: 'Messages', icon: MessageSquare },
        { to: '/market-intelligence', title: 'Market Analytics', icon: TrendingUp },
        { to: '/blogs', title: 'Career Blog', icon: Newspaper },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <aside 
            className="sidebar fixed left-0 top-0 h-screen z-[1000] flex flex-col p-3 transition-[width] duration-[0.25s] ease-[cubic-bezier(0.4,0,0.2,1)] rounded-r-lg will-change-[width] transform translate-z-0 shadow-[4px_0_12px_-2px_rgba(49,56,81,0.15)] overflow-hidden"
            style={{ backgroundColor: '#313851', color: '#F6F3ED' }}
        >
            <style>
                {`
                    .sidebar {
                        width: 70px;
                        transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .sidebar:hover {
                        width: 260px;
                    }
                    
                    /* Top Header + Content Shift Logic */
                    .header-and-content {
                        transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                        margin-left: 70px;
                    }

                    .sidebar:hover + .header-and-content,
                    .sidebar:hover ~ .header-and-content {
                        margin-left: 260px;
                    }

                    .top-arrow {
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                        background: rgba(246, 243, 237, 0.1);
                        border: none;
                        color: #F6F3ED;
                        cursor: pointer;
                        padding: 6px;
                        border-radius: 6px;
                        z-index: 10;
                    }

                    .sidebar:hover .top-arrow {
                        transform: rotate(180deg);
                    }

                    .sidebar-nav {
                        padding-top: 68px;
                    }

                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    
                    /* Enterprise Hover Effect */
                    .nav-item {
                        position: relative;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        white-space: nowrap;
                    }
                    .nav-item:hover {
                        background-color: rgba(194, 203, 211, 0.18) !important;
                        border-radius: 8px;
                    }
                    .nav-item:hover::before {
                        content: '';
                        position: absolute;
                        left: -12px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 4px;
                        height: 28px;
                        background: #C2CBD3;
                        border-radius: 0 4px 4px 0;
                    }
                    .sidebar-item-active {
                        background-color: #C2CBD3 !important;
                        color: #313851 !important;
                        font-weight: 700;
                    }
                    .nav-text {
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.2s ease;
                        margin-left: 12px;
                        font-size: 13px;
                        letter-spacing: 0.02em;
                    }
                    .sidebar:hover .nav-text {
                        opacity: 1;
                        visibility: visible;
                    }
                    .nav-icon {
                        width: 24px;
                        height: 24px;
                        min-width: 24px;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .nav-item:hover .nav-icon {
                        transform: scale(1.08);
                        color: #F6F3ED;
                    }
                    /* Ensure Active state covers the accent bar if needed or stays consistent */
                    .sidebar-item-active::before {
                        content: '';
                        position: absolute;
                        left: -12px;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 4px;
                        height: 28px;
                        background: #313851;
                        border-radius: 0 4px 4px 0;
                    }
                `},StartLine:48,TargetContent:
            </style>

            {/* Top Arrow Button - Enterprise Positioning */}
            <button className="top-arrow">
                <ChevronRight size={18} />
            </button>

            <nav className="sidebar-nav no-scrollbar flex-1 flex flex-col gap-2 overflow-x-hidden overflow-y-auto pr-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        title={item.title}
                        className={({ isActive }) => `
                            nav-item p-2.5 rounded-md w-full border-none transition-all duration-300 overflow-hidden
                            ${isActive ? 'sidebar-item-active' : ''}
                        `}
                    >
                        <div className="nav-icon">
                            <item.icon size={24} strokeWidth={2} />
                        </div>
                        <span className="nav-text font-bold">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom section */}
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
