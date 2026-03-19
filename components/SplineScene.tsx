import React, { Suspense, lazy, useCallback, useRef, useEffect, useState } from 'react';
import type { Application, SplineEvent } from '@splinetool/runtime';
import { Play } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useI18n } from '../i18n';
import { Reveal } from './Reveal';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SCENE_URL = 'https://prod.spline.design/e0Wohhek1j5tzjSg/scene.splinecode';

// --- Loading fallback ---
const LoadingFallback: React.FC = () => (
    <div className="flex items-center justify-center h-full rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-mono tracking-wider">Loading 3D Scene...</p>
        </div>
    </div>
);

// --- Exported section component ---
export const SplineSection: React.FC = () => {
    const { t } = useI18n();
    const sectionRef = useRef<HTMLDivElement>(null);
    // Reference to the actual 3D engine instance to trigger replays without reloading
    const splineApp = useRef<Application | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    // Track if the initial load has happened via state to trigger reactivity for autoplay
    const [isSplineLoaded, setIsSplineLoaded] = useState(false);
    const hasLoadedOnce = useRef(false);
    // Track if we should mount the Spline component (lazy load)
    const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
    // Track if the remount is meant to auto-play (when user scrolls to it)
    const autoPlayRef = useRef(false);
    // Hide entire section on mobile (Spline WebGL is too heavy)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    }, []);

    const handleLoad = useCallback((app: Application) => {
        // Transparent canvas background
        app.setBackgroundColor('rgba(0,0,0,0)');

        // Hide the scene's own dark grid and floor
        try {
            const grid = app.findObjectByName('Grid');
            if (grid) grid.visible = false;
            const base = app.findObjectByName('Base');
            if (base) base.visible = false;
        } catch (_) { }

        // Disable logo watermark render pass
        try {
            const pipeline = (app as any)?._renderer?.pipeline
                ?? (app as any)?._scene?.renderer?.pipeline;
            if (pipeline?.logoOverlayPass) {
                pipeline.logoOverlayPass.enabled = false;
            }
        } catch (_) { }

        // Save the app instance for programmatic playback later
        splineApp.current = app;

        // Only freeze the animation if this is the initial background load
        if (!autoPlayRef.current) {
            app.stop();
        }

        hasLoadedOnce.current = true;
        setIsSplineLoaded(true);
    }, []);

    // Replay button: restart the animation instantly via API
    const handleReplay = useCallback(() => {
        setIsPlaying(true);
        autoPlayRef.current = true;

        if (splineApp.current) {
            // Stop, reset to start, and play again natively
            splineApp.current.stop();
            splineApp.current.play();
        }

        setTimeout(() => setIsPlaying(false), 3000);
    }, []);

    // 1. "Slow and steady" — preload Spline at idle priority immediately on mount
    //    so it's fully ready before the user scrolls to this section
    useEffect(() => {
        if (shouldLoadSpline) return;
        if ('requestIdleCallback' in window) {
            const id = (window as any).requestIdleCallback(
                () => setShouldLoadSpline(true),
                { timeout: 3000 }
            );
            return () => (window as any).cancelIdleCallback(id);
        } else {
            const timer = setTimeout(() => setShouldLoadSpline(true), 500);
            return () => clearTimeout(timer);
        }
    }, [shouldLoadSpline]);

    // 2. Play the animation when the section enters viewport (bidirectional)
    const isInView = useInView(sectionRef, { amount: 0.15 });
    const hasPlayedOnce = useRef(false);

    useEffect(() => {
        if (isInView) {
            // Only trigger if we haven't played since entering this time
            if (!hasPlayedOnce.current) {
                // Fallback: trigger load if they jumped here without scrolling
                if (!shouldLoadSpline) {
                    setShouldLoadSpline(true);
                }

                // Only auto-play once the internal Spline onLoad has fired successfully
                if (isSplineLoaded) {
                    hasPlayedOnce.current = true;
                    setIsPlaying(true);
                    autoPlayRef.current = true;

                    if (splineApp.current) {
                        splineApp.current.stop();
                        splineApp.current.play();
                    }

                    setTimeout(() => setIsPlaying(false), 3000);
                }
            }
        } else {
            // Reset the lock when completely out of view so it plays again when re-entering
            hasPlayedOnce.current = false;
        }
    }, [isInView, shouldLoadSpline, isSplineLoaded]);

    if (isMobile) return null;

    return (
        <section
            ref={sectionRef}
            id="3d-showcase"
            className="relative z-10 py-24 md:py-32 overflow-hidden"
        >
            {/* Section header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 relative z-10">
                <Reveal width="100%" once>
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-black/10 pb-8 mb-8">
                        <span className="text-blue-600 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
                            {t('showcase.badge')}
                        </span>
                        <span className="text-gray-500 text-sm font-mono hidden md:block">{t('process.est')}</span>
                    </div>
                </Reveal>

                <Reveal variant="left" once>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-ink mb-6">
                        {t('showcase.headline1')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
                            {t('showcase.headline2')}
                        </span>
                    </h2>
                </Reveal>

                <Reveal delay={0.1} variant="blur" once>
                    <p className="text-lg text-gray-500 max-w-lg font-light leading-relaxed">
                        {t('showcase.desc')}
                    </p>
                </Reveal>
            </div>

            {/* 3D Spline Viewer with subtle background */}
            <div className="w-full h-[500px] md:h-[700px] lg:h-[800px] relative mx-auto max-w-7xl px-4 md:px-8">
                <div
                    className="w-full h-full rounded-[2rem] overflow-hidden bg-white/50 border border-gray-200 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15),0_0_40px_rgba(99,102,241,0.12)] relative z-10"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,246,255,0.7) 0%, rgba(238,232,255,0.5) 40%, rgba(255,237,225,0.4) 100%)',
                    }}
                >
                    {/* Replay animation button — top right */}
                    <button
                        onClick={handleReplay}
                        disabled={isPlaying}
                        aria-label="Play animation"
                        className={`
                            absolute top-4 right-4 z-20
                            flex items-center gap-2 px-4 py-2.5
                            rounded-xl border backdrop-blur-md
                            text-xs font-semibold uppercase tracking-wider
                            transition-all duration-300 cursor-pointer
                            ${isPlaying
                                ? 'bg-blue-500/20 border-blue-300/40 text-blue-600 scale-95'
                                : 'bg-white/70 border-gray-200/60 text-gray-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-105'
                            }
                        `}
                    >
                        <Play
                            size={14}
                            className={`${isPlaying ? 'animate-pulse' : ''}`}
                            fill={isPlaying ? 'currentColor' : 'none'}
                        />
                        {isPlaying ? 'Playing...' : 'Play'}
                    </button>

                    <Suspense fallback={<LoadingFallback />}>
                        {shouldLoadSpline ? (
                            <Spline
                                scene={SCENE_URL}
                                style={{ width: '100%', height: '100%' }}
                                onLoad={handleLoad}
                            />
                        ) : (
                            <LoadingFallback />
                        )}
                    </Suspense>
                </div>
            </div>
        </section>
    );
};

