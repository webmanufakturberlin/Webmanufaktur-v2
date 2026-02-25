import React, { useEffect, useRef } from 'react';

export const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scrollY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Floating particles
    const particles: { x: number; y: number; r: number; vx: number; vy: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 5000,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.3 + 0.05,
      });
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Grid that moves with scroll (parallax)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      const offsetY = -(scrollY * 0.15) % gridSize;
      const offsetX = -(scrollY * 0.03) % gridSize;

      for (let x = offsetX; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = offsetY; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Floating particles (move with scroll)
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = 5000;
        if (p.y > 5000) p.y = -10;

        const screenY = p.y - scrollY * 0.4;
        if (screenY < -20 || screenY > h + 20) return;

        ctx.beginPath();
        ctx.arc(p.x, screenY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();
      });

      // Accent gradient blobs (slow drift)
      const t = Date.now() * 0.0001;
      const blobX1 = w * 0.2 + Math.sin(t) * 100;
      const blobY1 = h * 0.3 + Math.cos(t * 0.7) * 80 - scrollY * 0.05;
      const grad1 = ctx.createRadialGradient(blobX1, blobY1, 0, blobX1, blobY1, w * 0.35);
      grad1.addColorStop(0, 'rgba(99, 102, 241, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const blobX2 = w * 0.8 + Math.cos(t * 1.3) * 120;
      const blobY2 = h * 0.7 + Math.sin(t * 0.9) * 100 - scrollY * 0.03;
      const grad2 = ctx.createRadialGradient(blobX2, blobY2, 0, blobX2, blobY2, w * 0.3);
      grad2.addColorStop(0, 'rgba(168, 85, 247, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white" aria-hidden="true">
      {/* Canvas animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
};