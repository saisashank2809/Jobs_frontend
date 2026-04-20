import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../../api/authApi';
import { getMyProfile } from '../../api/usersApi';
import { ROLES } from '../../utils/constants';
import { Briefcase, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
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
            const profile = await getMyProfile();
            
            if (profile.role === ROLES.ADMIN) {
                navigate('/admin/tower');
            } else if (profile.role === ROLES.PROVIDER) {
                navigate('/provider/listings');
            } else {
                navigate('/jobs');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#FBFBFB]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-white card border border-zinc-100 p-8 shadow-xl shadow-zinc-900/5"
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 card grid place-items-center mx-auto mb-4 shadow-sm">
                        <Briefcase size={28} className="text-zinc-400" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-zinc-100">
                        <Sparkles size={12} className="text-zinc-400" />
                        Network Access
                    </div>
                    <h1 className="text-3xl font-sans font-bold text-zinc-900 tracking-tight">Sign In</h1>
                    <p className="text-sm font-medium text-zinc-400 mt-2 tracking-wide leading-relaxed">Continue to Ottobon Market</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Email Node</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-5 py-3 bg-zinc-50/50 border border-zinc-100 rounded-2xl text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Password Access</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-5 py-3 pr-14 bg-zinc-50/50 border border-zinc-100 rounded-2xl text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all duration-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition-colors p-1"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xs font-bold text-rose-500 bg-rose-50/50 border border-rose-100 px-5 py-3 rounded-xl text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-zinc-900 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide hover:bg-zinc-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-30 shadow-lg shadow-zinc-900/10 mt-2"
                    >
                        {loading ? 'Authenticating...' : 'Establish Connection'}
                    </button>
                </form>

                <div className="flex flex-col items-center gap-3 mt-6 pb-2">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                        NEW HERE ?
                    </p>
                    <Link to="/register" className="text-base font-bold text-zinc-900 border-b-2 border-zinc-900 hover:pb-1 transition-all tracking-widest uppercase">
                        Sign Up
                    </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-50 flex justify-center">
                    <Link to="/admin/login" className="text-[9px] font-bold text-zinc-200 hover:text-zinc-400 transition-colors uppercase tracking-[0.2em]">
                        Administrative Portal
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;

