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

      {/* Dynamic Cursor Light (Smooth Tracking Radial Crimson Light) */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
          background: 'radial-gradient(circle, rgba(198,40,50,0.55) 0%, rgba(132,60,67,0.3) 45%, rgba(17,18,22,0.1) 70%, transparent 80%)',
        }}
      />

      {/* Floating Blurred Orbs Moving Slowly (Framer Motion Continuous Drift) */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[10%] left-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#C62832]/12 to-[#843C43]/8 blur-[160px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.95, 1.08, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-[40%] right-[10%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#843C43]/10 via-[#C62832]/8 to-[#18191F]/20 blur-[170px]"
      />

      <motion.div
        animate={{
          x: [0, 35, -40, 0],
          y: [0, -30, 25, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[75%] left-[20%] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#581C20]/15 to-[#18191F]/30 blur-[160px]"
      />

      {/* Crisp Grid Pattern with Vignette Fade */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
};

export default MouseGlow;
