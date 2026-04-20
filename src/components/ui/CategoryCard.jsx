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
                "bg-white rounded-[2.5rem] p-8",
                "transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)",
                "hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/5"
            )}
            tabIndex={0}
            role="button"
            aria-label={`Browse ${name} jobs`}
        >
            <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container - Subtle & Minimal */}
                <div className={cn(
                    "w-16 h-16 rounded-3xl bg-zinc-50 flex items-center justify-center mb-10",
                    "transition-all duration-700 group-hover:bg-black group-hover:text-white group-hover:rotate-[10deg]"
                )}>
                    <Icon strokeWidth={1.5} className="w-7 h-7" />
                </div>
                
                {/* Text Content */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight group-hover:text-black transition-colors">
                        {name}
                    </h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] transition-all duration-500 group-hover:text-zinc-600">
                        {count}
                    </p>
                </div>

                {/* Refined CTA - Asymmetrical underline */}
                <div className="mt-12 flex items-center gap-3">
                    <div className="h-[2px] w-8 bg-zinc-100 group-hover:w-16 group-hover:bg-black transition-all duration-700" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-black transition-colors">
                        Explore Field
                    </span>
                </div>
            </div>
        </div>
    );
}
