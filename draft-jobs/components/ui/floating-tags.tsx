"use client";

import { useEffect, useRef, useCallback } from "react";

interface FloatingTag {
    id: number;
    label: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseVx: number;
    baseVy: number;
    variant: "filled" | "outlined" | "ghost";
    size: "sm" | "md" | "lg";
    opacity: number;
    el?: HTMLDivElement | null;
}

const TAG_LABELS = [
    "Infosys",
    "TCS",
    "Wipro",
    "Reliance",
    "Google",
    "Microsoft",
    "Amazon",
    "Apple",
    "Flipkart",
    "Zoho",
    "Freshworks",
    "Razorpay",
    "CRED",
    "Swiggy",
    "Zomato",
    "PhonePe",
    "Paytm",
    "Bangalore",
    "Mumbai",
    "Hyderabad",
    "Pune",
    "Delhi NCR",
    "Chennai",
    "San Francisco",
    "New York",
    "London",
    "Singapore",
    "Dubai",
    "Berlin",
    "Tokyo",
    "Toronto",
];

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function createTag(id: number, width: number, height: number, minY: number): FloatingTag {
    const index = id % TAG_LABELS.length;
    const isCompany = index < 17; // First 17 items are companies
    const sizes: FloatingTag["size"][] = ["sm", "md", "lg"];
    const bvx = randomBetween(-0.6, 0.6) || 0.3;
    const bvy = randomBetween(-0.6, 0.6) || 0.3;

    return {
        id,
        label: TAG_LABELS[index],
        x: randomBetween(50, width - 200),
        y: randomBetween(minY, height - 50),
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
        variant: isCompany ? "filled" : "outlined",
        size: sizes[Math.floor(Math.random() * sizes.length)],
        opacity: isCompany ? randomBetween(0.8, 1) : randomBetween(0.4, 0.8),
    };
}

const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
};

const variantClasses = {
    filled:
        "bg-black text-white shadow-md hover:bg-primary hover:text-primary-foreground hover:ring-2 hover:ring-black/30 hover:shadow-lg hover:scale-105",
    outlined:
        "bg-transparent border border-black/20 text-black/70 hover:bg-black hover:text-white hover:border-black hover:ring-2 hover:ring-black/20 hover:scale-105",
    ghost:
        "bg-black/5 text-black/50 hover:bg-black hover:text-white hover:ring-2 hover:ring-black/20 hover:shadow-lg hover:scale-105",
};

interface FloatingTagsProps {
    tagCount?: number;
    className?: string;
    minY?: number;
}

export function FloatingTags({ tagCount = 28, className, minY = 250 }: FloatingTagsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<FloatingTag[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0, active: false });

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
        };
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current.active = false;
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const { width, height } = container.getBoundingClientRect();

        // Create tags
        tagsRef.current = Array.from({ length: tagCount }, (_, i) =>
            createTag(i, width, height, minY)
        );

        // Build DOM elements
        const fragment = document.createDocumentFragment();
        tagsRef.current.forEach((tag) => {
            const el = document.createElement("div");
            el.className = `absolute rounded-md font-medium whitespace-nowrap select-none cursor-pointer transition-colors transition-shadow duration-200 ${sizeClasses[tag.size]} ${variantClasses[tag.variant]}`;
            el.textContent = tag.label;
            el.style.opacity = String(tag.opacity);
            el.style.willChange = "transform";
            el.style.transform = `translate3d(${tag.x}px, ${tag.y}px, 0)`;
            tag.el = el;
            fragment.appendChild(el);
        });
        container.appendChild(fragment);

        // Listen for mouse
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        const animate = () => {
            const { width: w, height: h } = container.getBoundingClientRect();
            const mouse = mouseRef.current;

            for (const tag of tagsRef.current) {
                let targetVx = tag.baseVx;
                let targetVy = tag.baseVy;

                // React to mouse
                if (mouse.active) {
                    const dx = tag.x - mouse.x;
                    const dy = tag.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist / 400);

                    if (dist > 0) {
                        targetVx += (dx / dist) * influence * 3.5;
                        targetVy += (dy / dist) * influence * 3.5;
                    }
                }

                // Smooth lerp velocity
                tag.vx += (targetVx - tag.vx) * 0.05;
                tag.vy += (targetVy - tag.vy) * 0.05;

                tag.x += tag.vx;
                tag.y += tag.vy;

                // Bounce off edges
                if (tag.x <= 0 || tag.x >= w - 150) {
                    tag.baseVx = -tag.baseVx;
                    tag.x = Math.max(0, Math.min(tag.x, w - 150));
                }
                if (tag.y <= minY || tag.y >= h - 40) {
                    tag.baseVy = -tag.baseVy;
                    tag.y = Math.max(minY, Math.min(tag.y, h - 40));
                }

                // Direct DOM update — no React re-render
                if (tag.el) {
                    tag.el.style.transform = `translate3d(${tag.x}px, ${tag.y}px, 0)`;
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            // Clean up DOM
            tagsRef.current.forEach((tag) => tag.el?.remove());
        };
    }, [tagCount, handleMouseMove, handleMouseLeave, minY]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-auto ${className ?? ""}`}
        />
    );
}
