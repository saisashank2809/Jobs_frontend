import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveSessions } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Ear, AlertTriangle, RefreshCw, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ControlTowerPage = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSessions = async () => {
        setRefreshing(true);
        try {
            const data = await getActiveSessions();
            setSessions(data || []);
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleConnect = (e) => {
        e.preventDefault();
        if (!sessionId) return;
        navigate('/admin/helpdesk', { state: { sessionId } });
    };

    const activeAiCount = sessions.filter(s => s.status !== 'active_human').length;
    const humanCount = sessions.filter(s => s.status === 'active_human').length;

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-[1600px] mx-auto pt-8 pb-12 px-6 md:px-10 bg-[#FBFBFB] min-h-screen">
            <header className="mb-20 border-b border-zinc-100 pb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-900 card grid place-items-center shadow-lg shadow-zinc-900/20">
                            <Ear size={32} className="text-white" />
                        </div>
                        System Administration
                    </h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-6 ml-1">Session Monitoring & Administrative Control</p>
                </div>
                <button
                    onClick={fetchSessions}
                    disabled={refreshing}
                    className="p-5 bg-white border border-zinc-100 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-2xl transition-all shadow-sm disabled:opacity-30"
                >
                    <RefreshCw size={24} className={refreshing ? 'animate-spin' : ''} />
                </button>
            </header>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white border border-zinc-100 card p-8 shadow-xl shadow-zinc-900/5 h-full">
                        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                            <Shield size={16} className="text-zinc-900" /> Connect to Session
                        </h2>
                        <form onSubmit={handleConnect} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="UUID / SIGNAL_ID"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl p-5 text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all tracking-widest"
                            />
                            <button type="submit" className="bg-zinc-900 text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 transition-all">
                                Connect
                            </button>
                        </form>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="bg-zinc-900 card p-8 shadow-2xl shadow-zinc-900/20 h-full flex items-center justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="relative z-10">
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mb-3">Active Sessions</p>
                            <p className="text-6xl font-sans font-bold tracking-tighter">{activeAiCount}</p>
                        </div>
                        <div className="text-right relative z-10">
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mb-3 italic">Active Support</p>
                            <p className="text-6xl font-sans font-bold tracking-tighter opacity-100">{humanCount}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.5em] mb-10 ml-2 flex items-center gap-4">
                <div className="w-1.5 h-6 bg-zinc-900 rounded-full" /> Live Sessions
            </h2>

            <div className="space-y-6">
                {sessions.length === 0 && (
                    <div className="text-center py-20 bg-zinc-50 border border-zinc-100 card border-dashed">
                        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.4em]">No Live Sessions Found</p>
                    </div>
                )}

                {sessions.map((session, idx) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <div className="bg-white border border-zinc-100 card p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-2xl hover:shadow-zinc-900/5 transition-all duration-500 group">
                            <div className="flex gap-8 items-center flex-1">
                                <div className="relative">
                                    <div className={`w-3 h-3 rounded-full ${session.status === 'active_human' ? 'bg-zinc-900' : 'bg-zinc-100'}`} />
                                    {session.status === 'active_human' && (
                                        <div className="absolute inset-0 bg-zinc-900 rounded-full animate-ping opacity-20" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-2xl font-sans font-bold text-zinc-900 tracking-tight group-hover:text-zinc-600 transition-colors">
                                        {session.user?.full_name || session.user?.email || session.users_jobs?.full_name || 'Anonymous Guest'}
                                    </p>
                                    <p className="text-[10px] text-zinc-300 font-bold mt-2 uppercase tracking-[0.2em]">{session.id.slice(0, 18)}...</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-[0.2em] mb-1">Time Started</p>
                                    <span className="text-xs font-bold text-zinc-900 tabular-nums">
                                        {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate('/admin/helpdesk', { state: { sessionId: session.id } })}
                                    className="px-12 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
                                >
                                    Monitor
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ControlTowerPage;
