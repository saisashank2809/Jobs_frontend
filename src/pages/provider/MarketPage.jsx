import { useState, useEffect } from 'react';
import { getMarketIntelligence } from '../../api/analyticsApi';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Briefcase, Globe, Zap, Sparkles } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { motion } from 'framer-motion';

// Professional Palette
const COLORS = ['#313851', '#C2CBD3', '#F6F3ED'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/80 backdrop-blur-xl border border-zinc-100 shadow-xl rounded-2xl px-4 py-3 text-zinc-900">
                <p className="text-[10px] font-bold mb-2 uppercase tracking-widest text-zinc-400">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                        {entry.name}: <span className="font-extrabold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const MarketPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getMarketIntelligence();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch market stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader fullScreen variant="logo" />;
    if (!stats) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-[32px] grid place-items-center mb-6">
                <Zap size={32} className="text-zinc-200" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2 uppercase tracking-tighter">Signal Lost</h3>
            <p className="text-zinc-400 text-sm font-medium">Market data is currently unreachable.</p>
        </div>
    );

    const { total_jobs, top_skills, salary_trends, top_companies, work_styles, experience_levels } = stats;

    return (
        <div className="min-h-screen pt-8 pb-12 px-6 md:px-10 max-w-[1600px] mx-auto bg-[#FBFBFB] overflow-x-hidden">
            {/* Minimalist Header */}
            <header className="relative z-10 pt-6 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-zinc-100 shadow-sm">
                        <Sparkles size={11} className="text-zinc-400" />
                        Market Insights
                    </div>
                    <h1 className="text-3xl font-sans font-bold mb-4 tracking-tight text-zinc-900">
                        Analytics
                    </h1>
                    <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed font-medium">
                        Real-time streaming intelligence from the Ottobon network. Verified opportunities, zero noise.
                    </p>
                </motion.div>
            </header>

            <main className="space-y-10 pb-20">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={<Briefcase size={20} />} label="Total Listings" value={total_jobs} delay={0} />
                    <StatCard icon={<TrendingUp size={20} />} label="Top Skill" value={top_skills[0]?.name || "N/A"} sub={`${top_skills[0]?.count || 0} listings`} delay={0.05} />
                    <StatCard icon={<DollarSign size={20} />} label="Salary Peak" value={`$${(salary_trends[0]?.avg_max / 1000).toFixed(0)}k`} sub={salary_trends[0]?.role || "N/A"} delay={0.1} />
                    <StatCard icon={<Globe size={20} />} label="Remote Presence" value={`${((work_styles?.find(w => w.name === 'Remote')?.value || 0) / total_jobs * 100).toFixed(0)}%`} sub="Global Distribution" delay={0.15} />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skills Bar Chart */}
                    <ChartCard title="Skill Demand">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={top_skills} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#313851" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#C2CBD3" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name" type="category" width={100}
                                    tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                                    stroke="transparent"
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#000', fillOpacity: 0.02 }} />
                                <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 8, 8, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Salary Trends */}
                    <ChartCard title="Salary Trends">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={salary_trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                                <XAxis
                                    dataKey="role"
                                    tick={{ fontSize: 9, fill: '#71717a', fontWeight: 600 }}
                                    interval={0} axisLine={false} tickLine={false} height={60}
                                />
                                <YAxis
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                    stroke="transparent"
                                    tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#000', fillOpacity: 0.02 }} />
                                <Bar dataKey="avg_max" radius={[8, 8, 0, 0]} barSize={24}>
                                    {salary_trends.map((entry, index) => {
                                        const isPeak = entry.avg_max === Math.max(...salary_trends.map(item => item.avg_max));
                                        return <Cell key={`cell-${index}`} fill={isPeak ? '#C2CBD3' : '#313851'} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Work Style Pie */}
                    <ChartCard title="Employment Types">
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={work_styles} cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="white"
                                        strokeWidth={2}
                                    >
                                        {work_styles?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Experience Radar */}
                    <ChartCard title="Experience Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={experience_levels}>
                                <PolarGrid stroke="#e4e4e7" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="transparent" tick={false} />
                                <Radar name="Density" dataKey="A" stroke="#313851" strokeWidth={2} fill="rgba(194, 203, 211, 0.25)" fillOpacity={1} />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value, sub, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
        className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-500 overflow-hidden relative group"
    >
        <div className="absolute top-0 right-0 w-20 h-20 bg-zinc-50 rounded-bl-[48px] transition-transform duration-500 group-hover:scale-110 -z-0" />
        
        <div className="relative z-10">
            <div className="w-10 h-10 bg-white border border-zinc-100 text-zinc-900 rounded-xl grid place-items-center mb-4 shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-xl font-bold text-zinc-900 leading-none tracking-tight">{value}</h3>
                {sub && <p className="text-[10px] font-medium text-zinc-400 mt-2">{sub}</p>}
            </div>
        </div>
    </motion.div>
);

const ChartCard = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-500"
    >
        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 border-b border-zinc-50 pb-3">
            {title}
        </h3>
        {children}
    </motion.div>
);

export default MarketPage;

