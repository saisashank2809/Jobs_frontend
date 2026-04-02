import React from 'react';
import { cn } from "../../utils/cn";

/**
 * CategoryCard - A premium, neumorphic interactive card.
 * Features a "pressed" hover effect and a dynamic, rotating SVG background.
 */
export function CategoryCard({ name, icon: Icon, count, onClick }) {
    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            className={cn(
                "group relative overflow-hidden cursor-pointer",
                "bg-[#FDFDFD] rounded-[2rem] p-8 md:p-10",
                "border border-black/[0.02]",
                "shadow-[10px_10px_30px_rgba(0,0,0,0.02),-10px_-10px_30px_rgba(255,255,255,0.8)]",
                "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                "hover:translate-y-1.5 hover:shadow-[4px_4px_10px_rgba(0,0,0,0.01),-4px_-4px_10px_rgba(255,255,255,0.5)]",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/5"
            )}
            tabIndex={0}
            role="button"
            aria-label={`Browse ${name} jobs`}
        >
            {/* Spinning Blob SVG Background Layer */}
            <div className={cn(
                "absolute -top-16 -right-16 w-32 h-32 opacity-0",
                "transition-all duration-700 ease-in-out",
                "group-hover:opacity-100 group-hover:scale-[4] group-hover:top-1/2 group-hover:right-1/2 group-hover:translate-x-1/2 group-hover:-translate-y-1/2",
                "pointer-events-none z-0"
            )}>
                <div className="animate-spin-slow w-full h-full">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-black/[0.03]">
                        <path d="M44.7,-76.4C58.3,-69.2,70.1,-57.4,78.2,-43.3C86.3,-29.2,90.7,-12.8,89.5,3.2C88.3,19.2,81.5,34.8,71.4,47.8C61.3,60.8,47.9,71.2,32.7,77.3C17.5,83.4,0.5,85.2,-16.9,82.4C-34.3,79.5,-52.1,72.1,-65.4,59.8C-78.7,47.5,-87.5,30.3,-89.9,12.5C-92.3,-5.3,-88.3,-23.7,-79.6,-39C-70.9,-54.3,-57.5,-66.5,-42.6,-73C-27.7,-79.5,-13.8,-80.3,0.7,-81.4C15.2,-82.5,31.1,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container */}
                <div className={cn(
                    "w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8",
                    "shadow-[4px_4px_10px_rgba(0,0,0,0.02),-4px_-4px_10px_rgba(255,255,255,1)]",
                    "transition-all duration-500 group-hover:scale-110 group-hover:bg-black group-hover:text-white"
                )}>
                    <Icon className="w-6 h-6 transition-colors duration-500" />
                </div>

                {/* Text Content */}
                <div className="mt-auto space-y-1.5 transition-all duration-500 group-hover:opacity-10 group-hover:translate-y-4 group-hover:blur-sm">
                    <h3 className="text-xl font-bold text-black tracking-tight">{name}</h3>
                    <p className="text-sm font-semibold text-black/30 tracking-wide uppercase">{count}</p>
                </div>

                {/* Floating CTA Overlay */}
                <div className={cn(
                    "absolute bottom-0 left-0 w-full mb-8 opacity-0 translate-y-8 transition-all duration-500 delay-75",
                    "group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-2"
                )}>
                    <span className="text-xs font-black text-black uppercase tracking-[0.2em] ml-2">Open Listings</span>
                    <div className="h-px flex-1 bg-black/10" />
                    <Icon className="w-4 h-4 text-black/40" />
                </div>
            </div>
        </div>
    );
}
