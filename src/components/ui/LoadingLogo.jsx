import React from 'react';
import { Briefcase } from 'lucide-react';
import { cn } from "../../utils/cn";

/**
 * LoadingLogo - A brand-centric loader using the Ottobon/Jobs identity.
 * Features a pulsing Neo-Brutalist icon and subtle scale transitions.
 */
const LoadingLogo = ({ className = "" }) => {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
            {/* Pulsing Icon Square */}
            <div className="relative">
                {/* Outer Glow/Pulse Layer */}
                <div className="absolute inset-0 bg-black rounded-xl animate-ping opacity-20" />
                
                {/* Main Logo Square */}
                <div className="relative w-16 h-16 bg-black rounded-xl flex items-center justify-center animate-pulse shadow-2xl">
                    <Briefcase size={32} className="text-white" />
                </div>
            </div>

            {/* Typography with Suble Scale */}
            <div className="flex flex-col items-center gap-1 animate-bounce duration-[2000ms]">
                <span className="font-display font-black text-2xl tracking-tighter text-black uppercase">
                    Ottobon<span className="opacity-40">/</span>Jobs
                </span>
                <div className="flex gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-bounce delay-0" />
                    <div className="w-1.5 h-1.5 rounded-full bg-black/40 animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 rounded-full bg-black/10 animate-bounce delay-300" />
                </div>
            </div>
        </div>
    );
};

export default LoadingLogo;
