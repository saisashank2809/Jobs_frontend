import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from "../../utils/cn";

/**
 * JobFlipCard - A high-performance 3D flip card optimized for 60fps.
 * Front: Basic job details.
 * Back: Direct CTA for immediate application.
 */
export function JobFlipCard({ job }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const navigate = useNavigate();

    return (
        <div 
            className="group h-[320px] [perspective:1200px]"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <motion.div
                className="relative w-full h-full [transform-style:preserve-3d]"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 220, damping: 25 }}
            >
                {/* Front Side: Clean job details */}
                <div className={cn(
                    "absolute inset-0 [backface-visibility:hidden]",
                    "bg-[#F6F3ED] rounded-2xl border border-[#313851]/14 p-8",
                    "group-hover:border-[#313851]/30 transition-colors duration-500",
                    "flex flex-col shadow-sm"
                )}>
                    <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl bg-[#313851]/[0.06] text-[#313851]",
                        )}>
                            {job.logo}
                        </div>
                        {job.global && (
                            <div className="flex items-center gap-1.5 bg-[#313851]/[0.06] px-3 py-1.5 rounded-full border border-[#313851]/14">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#313851] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#313851]">
                                    Global
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5 mb-8">
                        <h3 className="text-xl font-medium text-[#313851] tracking-tight">
                            {job.role}
                        </h3>
                        <p className="text-sm font-medium text-[#313851]/85 tracking-wide">{job.company}</p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-4 border-t border-[#313851]/14 pt-6">
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#313851]/65 uppercase tracking-widest">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] font-bold text-[#313851]/65 uppercase tracking-widest">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.type}
                        </div>
                    </div>
                </div>

                {/* Back Side: Focused CTA */}
                <div className={cn(
                    "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    "bg-[#313851] border border-[#C2CBD3]/[0.14] rounded-2xl p-8",
                    "flex flex-col items-center justify-center text-center space-y-6 shadow-xl"
                )}>
                    <div className="space-y-2">
                        <h4 className="text-[#F6F3ED] text-lg font-medium tracking-tight">Ready to apply?</h4>
                        <p className="text-[#F6F3ED]/85 text-xs font-medium max-w-[180px]">
                            Join the team at {job.company} and start your next career chapter.
                        </p>
                    </div>
                    
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/register');
                        }}
                        className={cn(
                            "w-full py-4 bg-[#C2CBD3] text-[#313851] text-xs font-black uppercase tracking-[0.2em]",
                            "rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
                            "shadow-[0_15px_35px_rgba(194,203,211,0.15)] flex items-center justify-center gap-2"
                        )}
                    >
                        Apply Now
                        <ExternalLink className="w-3 h-3" />
                    </button>
                    
                    <div className="pt-2">
                        <p className="text-[10px] text-[#F6F3ED]/65 font-medium">
                            Missing skills? <a href="/ottolearn" className="text-[#C2CBD3] hover:underline">Learn on our Course Platform</a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
