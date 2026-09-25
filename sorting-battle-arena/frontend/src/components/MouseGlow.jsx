import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const MouseGlow = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    let animationFrame;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Noise Texture Overlay for Rich Film Grain */}
      <div className="noise-overlay" />

      {/* Dynamic Cursor Light (Smooth Tracking Radial Light) */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[150px] opacity-20 transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate(${mousePos.x - 325}px, ${mousePos.y - 325}px)`,
          background: 'radial-gradient(circle, rgba(59,130,246,0.7) 0%, rgba(139,92,246,0.45) 45%, rgba(16,185,129,0.15) 70%, transparent 80%)',
        }}
      />

      {/* Floating Blurred Orbs Moving Slowly (Framer Motion Continuous Drift) */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[10%] left-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-blue-600/15 to-cyan-500/10 blur-[150px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 60, 0],
          y: [0, 40, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[35%] right-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-600/15 via-pink-600/10 to-indigo-600/10 blur-[160px]"
      />

      <motion.div
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[65%] left-[25%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/10 to-teal-500/10 blur-[150px]"
      />

      {/* Crisp Grid Pattern with Vignette Fade */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
};

export default MouseGlow;
