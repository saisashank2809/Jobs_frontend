import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, User, Briefcase, Search } from 'lucide-react';
import { supabase } from '../../api/client';

const Navbar = () => {
    const { user, role, profile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 h-16 glass-panel border-b border-zinc-100 flex-shrink-0">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Logo - Refined Branding */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-black rounded-xl grid place-items-center group-hover:rotate-[10deg] transition-all duration-700 shadow-2xl shadow-black/20">
                        <Briefcase size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-black flex items-center">
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
                                className="pl-12 pr-6 py-2.5 bg-zinc-100/50 border-none rounded-full text-[10px] font-black uppercase tracking-widest text-black placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all duration-700 w-72"
                            />
                        </div>
                    </div>
                )}

                {/* User Actions */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <Link 
                                to="/profile"
                                className="flex items-center gap-3 bg-white/50 pl-1.5 pr-4 py-1.5 rounded-full hover:bg-white transition-all duration-700 shadow-sm hover:shadow-xl hover:shadow-black/5 border border-white/50"
                            >
                                <div className="w-7 h-7 bg-black rounded-full overflow-hidden flex items-center justify-center text-white ring-2 ring-white/50">
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
                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-all duration-300"
                                title="Logout"
                            >
                                <LogOut size={16} />
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
