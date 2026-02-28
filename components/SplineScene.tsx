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
    // Changing this key remounts the Spline component, replaying all load animations
    const [sceneKey, setSceneKey] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    // Track if the initial load has happened (don't remount on first appear)
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

        // Only freeze the animation if this is the initial background load
        if (!autoPlayRef.current) {
            app.stop();
        }

        hasLoadedOnce.current = true;
    }, []);

    // Replay button: restart the animation
    const handleReplay = useCallback(() => {
        setIsPlaying(true);
        autoPlayRef.current = true;
        setSceneKey((k) => k + 1);
        setTimeout(() => setIsPlaying(false), 3000);
    }, []);

    // 1. Preload the WebGL assets sequentially after the Hero page finishes its entrance (e.g. 3.5 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldLoadSpline(true);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    // 2. Play the animation ONLY when the section is in the viewport
    const isInView = useInView(sectionRef, { amount: 0.15 });

    useEffect(() => {
        if (isInView) {
            // When scrolling INTO the section, trigger the animation replay
            // (Only if it has already been preloaded in the background)
            if (hasLoadedOnce.current) {
                setIsPlaying(true);
                autoPlayRef.current = true;
                setSceneKey((k) => k + 1);
                setTimeout(() => setIsPlaying(false), 3000);
            }
        } else {
            // When scrolling OUT, reset to false so it can be re-triggered
            setIsPlaying(false);
        }
    }, [isInView]);

    if (isMobile) return null;

    return (
        <section
            ref={sectionRef}
            id="3d-showcase"
            className="relative z-10 py-24 md:py-32 overflow-hidden"
        >
            {/* Section header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 relative z-10">
                <Reveal width="100%">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-black/10 pb-8 mb-8">
                        <span className="text-blue-600 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" aria-hidden="true" />
                            {t('showcase.badge')}
                        </span>
                        <span className="text-gray-500 text-sm font-mono hidden md:block">{t('process.est')}</span>
                    </div>
                </Reveal>

                <Reveal variant="left">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-ink mb-6">
                        {t('showcase.headline1')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
                            {t('showcase.headline2')}
                        </span>
                    </h2>
                </Reveal>

                <Reveal delay={0.1} variant="blur">
                    <p className="text-lg text-gray-500 max-w-lg font-light leading-relaxed">
                        {t('showcase.desc')}
                    </p>
                </Reveal>
            </div>

            {/* 3D Spline Viewer with subtle background */}
            <div className="w-full h-[500px] md:h-[700px] lg:h-[800px] relative mx-auto max-w-7xl px-4 md:px-8">
                <div
                    className="w-full h-full rounded-3xl overflow-hidden border border-gray-200/60 shadow-xl relative"
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
                                key={sceneKey}
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

