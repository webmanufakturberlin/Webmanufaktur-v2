import React, { useRef } from 'react';

const HolographicCard = ({ title, description, image }: { title: string, description: string, image?: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.setProperty('--bg-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--bg-y', `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--x', `50%`);
        card.style.setProperty('--y', `50%`);
        card.style.setProperty('--bg-x', '50%');
        card.style.setProperty('--bg-y', '50%');
    };

    return (
        <div
            className="relative w-full h-[400px] bg-[#1A1A1A] border border-[#333] transition-transform duration-200 ease-out overflow-hidden group cursor-none"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {image && (
                <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-luminosity" />
            )}
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 pointer-events-none">
                <h3 className="font-sans font-black text-3xl text-white tracking-tighter uppercase mb-2">
                    {title}
                </h3>
                <p className="font-mono text-[#CCFF00] text-sm">
                    {description}
                </p>
            </div>

            {/* Holographic Glow Overlay */}
            <div
                className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
                style={{
                    background: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(204, 255, 0, 0.4) 0%, transparent 50%)`
                }}
            />
            {/* Glitch/Holo line effect */}
            <div
                className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 mix-blend-overlay"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`,
                    backgroundPosition: `0 calc(var(--y, 50%) * -0.1)`
                }}
            />
        </div>
    );
};

export default HolographicCard;
