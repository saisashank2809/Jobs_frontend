import { Suspense, lazy, useState, useEffect, useRef } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * Performance-tuned Spline Wrapper.
 * Uses Intersection Observer to only load/render the 3D scene when visible.
 */
export function InteractiveRobotSpline({ scene, className }) {
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsInView(true);
            },
            { threshold: 0.01, rootMargin: '200px' } // Load slightly before it enters
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={className}>
            {isInView ? (
                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center bg-transparent">
                            <div className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-neutral-200 h-10 w-10"></div>
                            </div>
                        </div>
                    }
                >
                    <Spline
                        scene={scene}
                        className="w-full h-full"
                    />
                </Suspense>
            ) : (
                <div className="w-full h-full bg-transparent" />
            )}
        </div>
    );
}
