"use client";

import { useEffect, useState } from "react";

export default function PageLoader({ children }: { children: React.ReactNode }) {
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [startTime] = useState(Date.now());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Hide body scroll while loading
    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isLoading]);

    useEffect(() => {
        const minLoadTime = 5000; // Minimum 5 seconds
        let animationFrame: number;
        let isPageLoaded = false;

        // Simulate progress animation
        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const minProgress = Math.min((elapsed / minLoadTime) * 100, 95);

            setProgress((prev) => {
                if (isPageLoaded && prev >= 100) {
                    return 100;
                }
                if (isPageLoaded) {
                    return Math.min(prev + 10, 100);
                }
                return Math.max(prev, minProgress);
            });

            if (progress < 100) {
                animationFrame = requestAnimationFrame(updateProgress);
            }
        };

        animationFrame = requestAnimationFrame(updateProgress);

        const handleLoad = () => {
            isPageLoaded = true;
            const elapsed = Date.now() - startTime;

            if (elapsed >= minLoadTime) {
                setProgress(100);
                setTimeout(() => setIsLoading(false), 500);
            } else {
                const remainingTime = minLoadTime - elapsed;
                setTimeout(() => {
                    setProgress(100);
                    setTimeout(() => setIsLoading(false), 500);
                }, remainingTime);
            }
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('load', handleLoad);
        };
    }, [startTime, progress]);

    return (
        <>
            {/* Loader Overlay */}
            {(isLoading || !isMounted) && (
                <div
                    className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#eeeeee] transition-opacity duration-500 ${!isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <div className="card bg-white p-8 border shadow-large max-w-md w-full mx-4">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                                Just a second...
                            </h1>
                        </div>

                        <div className="mb-4">
                            <div className="w-full h-4 bg-neutral-100 border-2 border-black relative overflow-hidden">
                                <div
                                    className="h-full bg-black transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-2xl font-bold text-black">
                                {Math.round(progress)}%
                            </p>
                            <p className="text-sm text-neutral-500 mt-1">
                                Loading...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content - Hidden until loaded */}
            <div
                style={{
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 1s ease-in-out',
                    transitionDelay: '300ms',
                    visibility: isLoading ? 'hidden' : 'visible'
                }}
            >
                {children}
            </div>
        </>
    );
}
