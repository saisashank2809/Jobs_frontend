import { useEffect, useRef, useCallback } from "react";

const TAG_LABELS = ["CRED", "Pune", "Amazon", "Bangalore"];

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createTag(id, width, height, minY) {
    const index = id % TAG_LABELS.length;
    const isCompany = index % 2 === 0;
    const side = id % 2 === 0 ? "left" : "right";
    const tagWidth = 92;
    const centerGap = Math.min(width * 0.72, 980);
    const centerLeft = (width - centerGap) / 2;
    const centerRight = centerLeft + centerGap;
    const edgePadding = 28;
    const leftMax = Math.max(edgePadding, centerLeft - tagWidth - 18);
    const rightMin = Math.min(width - tagWidth - edgePadding, centerRight + 18);
    const safeBottom = Math.max(minY + 100, height - 220);
    const bvx = randomBetween(-0.12, 0.12) || 0.08;
    const bvy = randomBetween(-0.1, 0.1) || 0.06;

    return {
        id,
        label: TAG_LABELS[index],
        x: side === "left"
            ? randomBetween(edgePadding, leftMax)
            : randomBetween(rightMin, width - tagWidth - edgePadding),
        y: randomBetween(minY, safeBottom),
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
        side,
        variant: isCompany ? "filled" : "outlined",
        size: "sm",
        opacity: isCompany ? randomBetween(0.62, 0.76) : randomBetween(0.46, 0.62),
        el: null,
    };
}

const sizeClasses = {
    sm: "text-[11px] px-3 py-1.5",
    md: "text-xs px-3.5 py-2",
};

const variantClasses = {
    filled:
        "bg-[#313851] text-[#F6F3ED] shadow-[0_12px_32px_-24px_rgba(49,56,81,0.4)]",
    outlined:
        "bg-[#F6F3ED]/80 border border-[#C2CBD3] text-[#313851]/85 shadow-[0_12px_32px_-26px_rgba(49,56,81,0.3)] backdrop-blur-sm",
};

export function FloatingTags({ tagCount = 8, className, minY = 120 }) {
    const containerRef = useRef(null);
    const tagsRef = useRef([]);
    const animationRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0, active: false });

    const handleMouseMove = useCallback((e) => {
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

        tagsRef.current = Array.from({ length: tagCount }, (_, i) =>
            createTag(i, width, height, minY)
        );

        const fragment = document.createDocumentFragment();
        tagsRef.current.forEach((tag) => {
            const el = document.createElement("div");
            el.className = `absolute rounded-md font-medium whitespace-nowrap select-none transition-colors transition-shadow duration-200 ${sizeClasses[tag.size]} ${variantClasses[tag.variant]}`;
            el.textContent = tag.label;
            el.style.opacity = String(tag.opacity);
            el.style.willChange = "transform";
            el.style.transform = `translate3d(${tag.x}px, ${tag.y}px, 0)`;
            tag.el = el;
            fragment.appendChild(el);
        });
        container.appendChild(fragment);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        const animate = () => {
            const { width: w, height: h } = container.getBoundingClientRect();
            const mouse = mouseRef.current;
            const tagWidth = 92;
            const centerGap = Math.min(w * 0.72, 980);
            const centerLeft = (w - centerGap) / 2;
            const centerRight = centerLeft + centerGap;
            const edgePadding = 28;
            const leftMax = Math.max(edgePadding, centerLeft - tagWidth - 18);
            const rightMin = Math.min(w - tagWidth - edgePadding, centerRight + 18);
            const safeBottom = Math.max(minY + 100, h - 220);

            for (const tag of tagsRef.current) {
                let targetVx = tag.baseVx;
                let targetVy = tag.baseVy;

                if (mouse.active) {
                    const dx = tag.x - mouse.x;
                    const dy = tag.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist / 280);

                    if (dist > 0) {
                        targetVx += (dx / dist) * influence * 1.4;
                        targetVy += (dy / dist) * influence * 1.4;
                    }
                }

                tag.vx += (targetVx - tag.vx) * 0.05;
                tag.vy += (targetVy - tag.vy) * 0.05;

                tag.x += tag.vx;
                tag.y += tag.vy;

                const minX = tag.side === "left" ? edgePadding : rightMin;
                const maxX = tag.side === "left" ? leftMax : w - tagWidth - edgePadding;

                if (tag.x <= minX || tag.x >= maxX) {
                    tag.baseVx = -tag.baseVx;
                    tag.x = Math.max(minX, Math.min(tag.x, maxX));
                }
                if (tag.y <= minY || tag.y >= safeBottom) {
                    tag.baseVy = -tag.baseVy;
                    tag.y = Math.max(minY, Math.min(tag.y, safeBottom));
                }

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
            tagsRef.current.forEach((tag) => tag.el?.remove());
        };
    }, [tagCount, handleMouseMove, handleMouseLeave, minY]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
        />
    );
}
