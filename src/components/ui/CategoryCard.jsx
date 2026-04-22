import React from 'react';
import { cn } from "../../utils/cn";

/**
 * CategoryCard - A premium, neumorphic interactive card.
 * Features a "pressed" hover effect and a dynamic, rotating SVG background.
 */
export function CategoryCard({ name, icon: Icon, onClick }) {
    return (
        <div
            onClick={onClick}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            className={cn(
                "group relative overflow-hidden cursor-pointer",
                "bg-[#313851]/[0.06] backdrop-blur-xl rounded-[2.5rem] p-8",
                "border border-[#313851]/[0.07]",
                "transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)",
                "hover:shadow-2xl hover:shadow-[#313851]/5 hover:-translate-y-2 hover:border-[#313851]/[0.14]",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#313851]/10"
            )}
            tabIndex={0}
            role="button"
            aria-label={`Browse ${name} jobs`}
        >
            <div className="relative z-10 flex flex-col h-full">
                {/* Icon Container - Subtle & Minimal */}
                <div className={cn(
                    "w-16 h-16 rounded-3xl bg-[#313851]/[0.06] border border-[#313851]/[0.14] flex items-center justify-center mb-10 text-[#313851]",
                    "transition-all duration-700 group-hover:bg-[#313851] group-hover:text-[#F6F3ED] group-hover:rotate-[10deg]"
                )}>
                    <Icon strokeWidth={1.5} className="w-7 h-7" />
                </div>
                
                {/* Text Content */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-medium text-[#313851] tracking-tight leading-tight transition-colors">
                        {name}
                    </h3>
                </div>

                {/* Refined CTA - Asymmetrical underline */}
                <div className="mt-12 flex items-center gap-3">
                    <div className="h-[2px] w-8 bg-[#313851]/20 group-hover:w-16 group-hover:bg-[#313851] transition-all duration-700" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#313851]/65 group-hover:text-[#313851] transition-colors">
                        Explore Field
                    </span>
                </div>
            </div>
        </div>
    );
}
