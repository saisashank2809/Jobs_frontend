import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../api/authApi';
import { getMyProfile } from '../../api/usersApi';
import { Shield, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROLES } from '../../utils/constants';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signIn(email, password);
            // After successful sign in, check role
            const profile = await getMyProfile();

            if (profile.role === ROLES.ADMIN) {
                navigate('/admin/tower');
            } else {
                setError('Access Denied: Administrative privileges required.');
            }
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-[#111] card border border-white/10 p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />

                <div className="text-center mb-12 relative z-10">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 card grid place-items-center mx-auto mb-8 shadow-xl">
                        <Shield size={32} className="text-white" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-white/5">
                        <Lock size={12} className="text-indigo-400" />
                        Admin Gateway
                    </div>
                    <h1 className="text-4xl font-sans font-black text-white tracking-tighter uppercase mb-2">System Access</h1>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Administrative Authentication Required</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Staff ID / Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-sm placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-white/5 transition-all duration-300"
                            placeholder="admin@system.internal"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Access Token / Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-6 py-4 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold text-sm placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-white/5 transition-all duration-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors p-1"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-6 py-4 rounded-xl text-center uppercase tracking-widest"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-200 active:scale-[0.98] transition-all duration-300 disabled:opacity-30 shadow-xl mt-4"
                    >
                        {loading ? 'Authenticating...' : 'Authorize Login'}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center relative z-10">
                    <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to User Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
