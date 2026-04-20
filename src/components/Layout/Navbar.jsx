import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { LogOut, User, Briefcase, Search, Bell, Trash2, Clock } from 'lucide-react';
import { supabase } from '../../api/client';
import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, role, profile } = useAuth();
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-6 left-8 right-8 z-50 h-20 glass-panel rounded-[32px] border-none shadow-2xl shadow-black/5">
            <div className="h-full px-8 flex items-center justify-between">
                {/* Logo - Refined Branding */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-black rounded-2xl grid place-items-center group-hover:rotate-[10deg] transition-all duration-700 shadow-2xl shadow-black/20">
                        <Briefcase size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-black flex items-center">
                        Ottobon<span className="text-zinc-300 font-light mx-1">|</span>Jobs
                    </span>
                </Link>

                {/* Center Search - Minimalist Pill */}
                {user && (
                    <div className="hidden md:flex items-center">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search size={14} className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="pl-12 pr-6 py-3 bg-zinc-100/50 border-none rounded-full text-[10px] font-black uppercase tracking-widest text-black placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all duration-700 w-96"
                            />
                        </div>
                    </div>
                )}

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 relative leading-none ${isNotifOpen ? 'bg-zinc-100 text-black' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-14 right-0 w-80 glass-panel border-none shadow-2xl overflow-hidden p-0 rounded-[32px]"
                                        >
                                            <div className="p-6 border-b border-zinc-100 bg-white/50 flex items-center justify-between">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Notifications</h3>
                                                {notifications.length > 0 && (
                                                    <button 
                                                        onClick={clearAll}
                                                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                                        title="Clear all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                                                        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300">
                                                            <Bell size={20} />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Everything is up to date</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        {notifications.map((n) => (
                                                            <button
                                                                key={n.id}
                                                                onClick={() => {
                                                                    markAsRead(n.id);
                                                                    if (n.link) navigate(n.link);
                                                                    setIsNotifOpen(false);
                                                                }}
                                                                className={`p-6 text-left hover:bg-zinc-50/50 transition-all border-b border-zinc-50 last:border-0 relative group ${!n.isRead ? 'bg-zinc-50/30' : ''}`}
                                                            >
                                                                {!n.isRead && (
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                                                                )}
                                                                <div className="flex flex-col gap-1.5">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{n.type}</span>
                                                                        <div className="flex items-center gap-1.5 text-zinc-300 group-hover:text-zinc-400 transition-colors">
                                                                            <Clock size={10} />
                                                                            <span className="text-[8px] font-bold uppercase tracking-tighter">
                                                                                {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <h4 className="text-[11px] font-bold text-black group-hover:translate-x-1 transition-transform">{n.title}</h4>
                                                                    <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">{n.message}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link
                                to="/profile"
                                className="flex items-center gap-3 bg-white/50 pl-1 pr-5 py-1 rounded-full hover:bg-white transition-all duration-700 shadow-sm hover:shadow-xl hover:shadow-black/5 border border-white/50 h-10"
                            >
                                <div className="w-8 h-8 bg-black rounded-full overflow-hidden flex items-center justify-center text-white ring-2 ring-white/50">
                                    {(profile?.avatar_url || user?.user_metadata?.avatar_url) ? (
                                        <img
                                            src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                                            alt={profile?.full_name || 'User'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </div>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">
                                        {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                                    </span>
                                </div>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-all duration-300 leading-none"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <Link to="/login" className="px-5 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                                Access
                            </Link>
                            <Link to="/register" className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all duration-700 shadow-2xl shadow-black/20">
                                Join Network
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
