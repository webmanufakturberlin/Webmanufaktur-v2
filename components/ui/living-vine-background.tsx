import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../../i18n";
import { Sparkles, X, MessageSquare } from "lucide-react";

interface LivingVineBackgroundProps {
    children?: React.ReactNode;
    vineColor?: string;
    branchColor?: string;
    maxBranchLength?: number;
    className?: string;
    isHomeView?: boolean;
}

const LivingVineBackground: React.FC<LivingVineBackgroundProps> = ({
    children,
    vineColor = "rgba(16, 185, 129, 0.8)",
    branchColor = "rgba(16, 185, 129, 0.6)",
    maxBranchLength = 50,
    className = "",
    isHomeView = true,
}) => {
    const { t } = useI18n();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameIdRef = useRef<number>(0);
    const mousePosRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
    const pathHistoryRef = useRef<{ x: number, y: number }[]>([]);
    const branchesRef = useRef<any[]>([]);

    // Interaction tracking
    const [showPopup, setShowPopup] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const interactionTimeRef = useRef<number>(0);
    const lastMouseMoveRef = useRef<number>(Date.now());
    const isActiveRef = useRef<boolean>(false);

    // Detect mobile — skip canvas on small screens for performance
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    }, []);

    // Reset interaction timer when leaving home view
    useEffect(() => {
        if (!isHomeView) {
            interactionTimeRef.current = 0;
            isActiveRef.current = false;
        }
    }, [isHomeView]);

    useEffect(() => {
        // Skip canvas animation entirely on mobile
        if (isMobile) return;

        let destroyed = false;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        class Branch {
            points: { x: number, y: number }[];
            life: number;
            angle: number;
            speed: number;
            length: number;

            constructor(x: number, y: number) {
                this.points = [{ x, y }];
                this.life = 1;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 1.5 + 0.5;
                this.length = 0;
            }
            update() {
                if (this.length >= maxBranchLength) {
                    this.life -= 0.02;
                    return;
                }
                this.angle += (Math.random() - 0.5) * 0.2;
                const last = this.points[this.points.length - 1];
                const newX = last.x + Math.cos(this.angle) * this.speed;
                const newY = last.y + Math.sin(this.angle) * this.speed;
                this.points.push({ x: newX, y: newY });
                this.length++;
            }
            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (let i = 1; i < this.points.length; i++) {
                    ctx.lineTo(this.points[i].x, this.points[i].y);
                }
                ctx.strokeStyle = branchColor.replace(/[\d.]+\)$/g, `${this.life * 0.4})`);
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
            pathHistoryRef.current.push({ ...mousePosRef.current });
            if (pathHistoryRef.current.length > 100) pathHistoryRef.current.shift();

            if (Math.random() > 0.95) {
                branchesRef.current.push(new Branch(e.clientX, e.clientY));
            }

            const now = Date.now();
            const timeDiff = now - lastMouseMoveRef.current;

            // Check if mouse is within the actual hero section bounds
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                const heroRect = heroSection.getBoundingClientRect();
                const inHero = (
                    e.clientY >= heroRect.top &&
                    e.clientY <= heroRect.bottom &&
                    e.clientX >= heroRect.left &&
                    e.clientX <= heroRect.right
                );

                if (timeDiff < 200 && inHero) {
                    isActiveRef.current = true;
                } else {
                    isActiveRef.current = false;
                }
            } else {
                isActiveRef.current = false;
            }
            lastMouseMoveRef.current = now;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        // Creativity popup timer — 20s of active interaction required
        const timer = setInterval(() => {
            if (isActiveRef.current && isHomeView && !hasTriggered) {
                interactionTimeRef.current += 1;
                if (interactionTimeRef.current >= 20) {
                    setShowPopup(true);
                    setHasTriggered(true);
                    isActiveRef.current = false;
                }
            } else if (!hasTriggered) {
                interactionTimeRef.current = Math.max(0, interactionTimeRef.current - 1);
            }
        }, 1000);

        const animate = () => {
            if (destroyed) return;
            // Skip expensive drawing when hero is fully covered by content
            if (window.scrollY > window.innerHeight * 1.5) {
                animationFrameIdRef.current = requestAnimationFrame(animate);
                return;
            }
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.fillRect(0, 0, width, height);

            if (pathHistoryRef.current.length > 1) {
                ctx.beginPath();
                ctx.moveTo(pathHistoryRef.current[0].x, pathHistoryRef.current[0].y);
                for (let i = 1; i < pathHistoryRef.current.length; i++) {
                    ctx.lineTo(pathHistoryRef.current[i].x, pathHistoryRef.current[i].y);
                }
                ctx.strokeStyle = vineColor;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            branchesRef.current = branchesRef.current.filter((b) => b.life > 0);
            for (const branch of branchesRef.current) {
                branch.update();
                branch.draw();
            }

            animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            destroyed = true;
            clearInterval(timer);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameIdRef.current);
        };
    }, [vineColor, branchColor, maxBranchLength, hasTriggered, isMobile]);

    const scrollToContact = () => {
        setShowPopup(false);
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div
            className={`relative min-h-screen w-full overflow-hidden bg-white ${className}`}
            style={{ backgroundColor: "#ffffff" }}
        >
            {/* Only render canvas on desktop */}
            {!isMobile && (
                <canvas ref={canvasRef} className="fixed inset-0 block h-full w-full z-0 pointer-events-none" />
            )}

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 10 }}
                        className="fixed bottom-10 right-4 sm:right-10 z-[100] w-[90%] sm:w-auto max-w-sm"
                    >
                        <div className="relative group p-5 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-2xl border border-emerald-100 shadow-lg overflow-hidden">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-ink hover:bg-gray-100 rounded-full transition-all"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex items-start gap-3 relative z-10">
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                                    <Sparkles size={20} />
                                </div>
                                <div className="flex-1 pr-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        {t('creativity.message')}
                                    </p>
                                    <button
                                        onClick={scrollToContact}
                                        className="px-4 py-2 bg-ink text-white rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                                    >
                                        <MessageSquare size={14} />
                                        {t('creativity.action')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 w-full">{children}</div>
        </div>
    );
};

export default LivingVineBackground;
