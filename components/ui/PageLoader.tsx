import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../../stores/weatherStore';

interface PageLoaderProps {
    isLoading: boolean;
}

export default function PageLoader({ isLoading }: PageLoaderProps) {
    const isNight = useWeatherStore(s => s.isNight);
    const [dots, setDots] = useState('');

    // Animated dots for the loading text
    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);
        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
                    className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden ${
                        isNight ? 'bg-[#050510]' : 'bg-[#f8fafc]'
                    }`}
                >
                    {/* Glowing background orb */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className={`absolute w-96 h-96 rounded-full blur-[100px] pointer-events-none ${
                            isNight ? 'bg-indigo-600/20' : 'bg-blue-300/30'
                        }`}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo / Spinner construct */}
                        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                            {/* Outer spinning ring */}
                            <motion.svg 
                                className="absolute inset-0 w-full h-full" 
                                viewBox="0 0 100 100"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            >
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke={isNight ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 
                                    strokeWidth="1" 
                                />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke={isNight ? '#ffffff' : '#000000'} 
                                    strokeWidth="2" 
                                    strokeDasharray="40 260"
                                    strokeLinecap="round"
                                />
                            </motion.svg>

                            {/* Inner pulsing ring */}
                            <motion.svg 
                                className="absolute w-16 h-16" 
                                viewBox="0 0 100 100"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                            >
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke={isNight ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} 
                                    strokeWidth="1" 
                                    strokeDasharray="10 20"
                                />
                                <circle 
                                    cx="50" cy="50" r="48" 
                                    fill="none" 
                                    stroke="url(#gradient)" 
                                    strokeWidth="2" 
                                    strokeDasharray="100 200"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="50%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#f97316" />
                                    </linearGradient>
                                </defs>
                            </motion.svg>

                            {/* Center dot/logo mark */}
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className={`w-3 h-3 rounded-full ${isNight ? 'bg-white' : 'bg-gray-900'} shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
                            />
                        </div>

                        {/* Brand Name */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`text-xl font-black tracking-[0.2em] uppercase ${isNight ? 'text-white' : 'text-gray-900'}`}
                        >
                            WebManufaktur
                        </motion.h2>

                        {/* Loading Status */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className={`mt-4 text-sm font-mono tracking-widest flex items-center ${isNight ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            <span>Synthesizing Berlin</span>
                            <span className="inline-block w-4 left-0 absolute relative">{dots}</span>
                        </motion.div>
                    </div>

                    {/* Progress Bar Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
