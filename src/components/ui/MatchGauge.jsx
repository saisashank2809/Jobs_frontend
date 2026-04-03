import { Target, Star, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const MatchGauge = ({ score, skillsScore, interestsScore, aspirationsScore }) => {
    // Colors logic
    const getColor = (val) => {
        if (val >= 75) return '#22c55e'; // Green
        if (val >= 50) return '#eab308'; // Yellow
        if (val >= 25) return '#f97316'; // Orange
        return '#ef4444'; // Red
    };

    const mainColor = getColor(score);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-white rounded-[2rem] p-8 border-2 border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 w-full relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/5 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-10 items-center justify-between relative z-10 w-full">
                
                {/* Main Gauge */}
                <div className="flex flex-col items-center justify-center shrink-0">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background track */}
                            <circle
                                cx="80" cy="80" r={radius}
                                stroke="#f3f4f6" strokeWidth="12" fill="transparent"
                            />
                            {/* Animated progress */}
                            <motion.circle
                                cx="80" cy="80" r={radius}
                                stroke={mainColor} strokeWidth="12" fill="transparent"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-display font-black text-black tracking-tighter" style={{ color: mainColor }}>{score}%</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Match</span>
                        </div>
                    </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="flex-1 w-full space-y-6 shrink-0">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-widest">
                                <Briefcase size={14} className="text-gray-400" />
                                Skills Align
                            </div>
                            <span className="text-xs font-black">{skillsScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full rounded-full bg-black"
                                initial={{ width: 0 }}
                                animate={{ width: `${skillsScore}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-widest">
                                <Star size={14} className="text-gray-400" />
                                Interests Align
                            </div>
                            <span className="text-xs font-black">{interestsScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full rounded-full bg-black"
                                initial={{ width: 0 }}
                                animate={{ width: `${interestsScore}%` }}
                                transition={{ duration: 1, delay: 0.4 }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-widest">
                                <Target size={14} className="text-gray-400" />
                                Aspirations Align
                            </div>
                            <span className="text-xs font-black">{aspirationsScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full rounded-full bg-black/60"
                                initial={{ width: 0 }}
                                animate={{ width: `${aspirationsScore}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchGauge;
