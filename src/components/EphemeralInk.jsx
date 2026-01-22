import React, { useEffect, useRef } from 'react';

const EphemeralInk = () => {
    const canvasRef = useRef(null);
    const points = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const addPoint = (e) => {
            points.current.push({
                x: e.clientX,
                y: e.clientY,
                life: 1.0,
                id: Date.now()
            });
        };

        window.addEventListener('mousemove', addPoint);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const themeAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent-gold').trim() || '#D4AF37';

            points.current = points.current.filter(p => p.life > 0.01);

            if (points.current.length > 2) {
                for (let i = 1; i < points.current.length; i++) {
                    const p1 = points.current[i - 1];
                    const p2 = points.current[i];

                    p1.life -= 0.005; // Fade over time

                    ctx.beginPath();
                    ctx.strokeStyle = themeAccent;
                    ctx.lineWidth = 4 * p1.life;
                    ctx.globalAlpha = 0.2 * p1.life;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', addPoint);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[1] pointer-events-none opacity-60 transition-opacity duration-1000"
        />
    );
};

export default EphemeralInk;
