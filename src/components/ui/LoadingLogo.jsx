import React from 'react';
import { Briefcase } from 'lucide-react';
import { cn } from "../../utils/cn";

/**
 * LoadingLogo - A brand-centric loader using the Ottobon/Jobs identity.
 * Features a pulsing Neo-Brutalist icon and subtle scale transitions.
 */
const LoadingLogo = ({ className = "" }) => {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-8", className)}>
            {/* Minimalist Pulse Container */}
            <div className="relative">
                {/* Soft Outer Glow */}
                <div className="absolute inset-0 bg-zinc-900 rounded-2xl animate-ping opacity-5 scale-125" />
                
                {/* Main Logo Square - Neu-Minimalist */}
                <div className="relative w-20 h-20 bg-zinc-900 card flex items-center justify-center shadow-2xl shadow-zinc-900/20">
                    <Briefcase size={40} className="text-white" />
                </div>
            </div>

            {/* Typography - Refined */}
            <div className="flex flex-col items-center gap-2">
                <span className="font-sans font-bold text-3xl tracking-tight text-zinc-900">
                    Ottobon<span className="text-zinc-200 font-light mx-1">|</span>Jobs
                </span>

                <div className="flex gap-2.5 mt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-100" />
                </div>
            </div>
        </div>
    );
};

export default LoadingLogo;
