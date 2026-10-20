import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './LoginAnimatedBackground.css';

/**
 * Deterministic particle definitions
 * Pre-calculated to eliminate runtime calculations and ensure deterministic rendering
 */
const PARTICLES = [
  { id: 1, left: '68%', top: '75%', size: 3, driftX: 30, duration: 13, delay: 0, opacity: 0.5 },
  { id: 2, left: '74%', top: '60%', size: 2, driftX: -20, duration: 16, delay: 2, opacity: 0.4 },
  { id: 3, left: '82%', top: '80%', size: 4, driftX: 25, duration: 11, delay: 1, opacity: 0.6 },
  { id: 4, left: '88%', top: '45%', size: 2, driftX: -35, duration: 15, delay: 3, opacity: 0.35 },
  { id: 5, left: '60%', top: '55%', size: 3, driftX: 18, duration: 14, delay: 4, opacity: 0.45 },
  { id: 6, left: '79%', top: '35%', size: 2, driftX: 22, duration: 17, delay: 0.5, opacity: 0.3 },
  { id: 7, left: '92%', top: '70%', size: 3, driftX: -15, duration: 12, delay: 5, opacity: 0.5 },
  { id: 8, left: '70%', top: '25%', size: 2, driftX: 28, duration: 18, delay: 2.5, opacity: 0.35 },
  { id: 9, left: '55%', top: '82%', size: 2, driftX: -10, duration: 19, delay: 1.5, opacity: 0.25 },
  { id: 10, left: '85%', top: '20%', size: 3, driftX: 15, duration: 14, delay: 6, opacity: 0.4 },
  { id: 11, left: '65%', top: '40%', size: 2, driftX: -24, duration: 15, delay: 3.5, opacity: 0.3 },
  { id: 12, left: '77%', top: '90%', size: 4, driftX: 20, duration: 10, delay: 7, opacity: 0.55 },
  { id: 13, left: '48%', top: '65%', size: 2, driftX: -12, duration: 16, delay: 4.5, opacity: 0.2 },
  { id: 14, left: '94%', top: '30%', size: 3, driftX: 32, duration: 13, delay: 5.5, opacity: 0.35 },
];

/**
 * HV VERTEX ELECTRONICS — Cinematic Animated Login Background Component
 * 
 * Layers:
 * - Layer A: High-resolution cinematic industrial wallpaper + asymmetric dark navy contrast scrims
 * - Layer B: Pulsing emerald energy corona around the 3D HV emblem & central lightning spark
 * - Layer C: Precision circuit traces with flowing data pulses & nodal junctions
 * - Layer D: Restrained floating emerald dust particles
 * - Layer E: Metallic light sheen reflection sweep across emblem bevels
 */
export default function LoginAnimatedBackground() {
  const particles = useMemo(() => PARTICLES, []);

  return (
    <div className="hv-cinematic-bg-container" aria-hidden="true" role="presentation">
      {/* --------------------------------------------------------------------
          Layer A: Cinematic Background Image & Contrast Gradients
          -------------------------------------------------------------------- */}
      <div className="hv-cinematic-bg-stage">
        <img
          src="/hv-cinematic-bg.jpg"
          alt=""
          className="hv-cinematic-bg-img"
          loading="eager"
          decoding="async"
        />

        {/* Directional contrast gradient protecting the login card */}
        <div className="hv-cinematic-scrim-card" />

        {/* Volumetric softening scrim directly behind form bounds */}
        <div className="hv-cinematic-scrim-radial" />

        {/* Cinematic boundary vignette */}
        <div className="hv-cinematic-vignette" />

        {/* Micro-fine engineering grid */}
        <div className="hv-cinematic-grid" />

        {/* Blueprint coordinate markers */}
        <span className="hv-cinematic-crosshair tl">SYS.REF // 24.891°N 01.04</span>
        <span className="hv-cinematic-crosshair tr">GRID // HV-VERTEX.ELEC</span>
        <span className="hv-cinematic-crosshair br">PWR.STABLE // 99.98%</span>
      </div>

      {/* --------------------------------------------------------------------
          Layer B: Emerald Energy Pulse (HV Emblem Corona & Core)
          -------------------------------------------------------------------- */}
      <div className="hv-emblem-ambient-lamp" />

      <div className="hv-emblem-glow-anchor">
        {/* Outer volumetric halo aura */}
        <motion.div
          className="hv-emblem-energy-halo"
          animate={{
            opacity: [0.3, 0.72, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
          }}
        />

        {/* Core high-intensity lightning spark pulse */}
        <motion.div
          className="hv-emblem-energy-core"
          animate={{
            opacity: [0.35, 0.88, 0.35],
            scale: [0.98, 1.12, 0.98],
          }}
          transition={{
            duration: 4.6,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
            delay: 0.4,
          }}
        />
      </div>

      {/* --------------------------------------------------------------------
          Layer C: Precision Circuit Board Lines & Traveling Data Highlights
          -------------------------------------------------------------------- */}
      <svg
        className="hv-cinematic-circuit-svg"
        viewBox="0 0 1920 1080"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hvCircuitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Circuit Bus 1: Bottom right feeder trace */}
        <path
          d="M 1200 1080 L 1200 860 L 1340 720 L 1480 720 L 1520 680 L 1520 540"
          className="hv-circuit-base"
        />
        <path
          d="M 1200 1080 L 1200 860 L 1340 720 L 1480 720 L 1520 680 L 1520 540"
          className="hv-circuit-pulse-fast"
        />

        {/* Circuit Bus 2: Right lateral data trace */}
        <path
          d="M 1920 620 L 1760 620 L 1680 540 L 1540 540 L 1490 490"
          className="hv-circuit-base"
        />
        <path
          d="M 1920 620 L 1760 620 L 1680 540 L 1540 540 L 1490 490"
          className="hv-circuit-pulse-slow"
        />

        {/* Circuit Bus 3: Top-right angled power conduit */}
        <path
          d="M 1780 0 L 1780 180 L 1660 300 L 1520 300 L 1470 350"
          className="hv-circuit-base"
        />
        <path
          d="M 1780 0 L 1780 180 L 1660 300 L 1520 300 L 1470 350"
          className="hv-circuit-pulse-fast"
        />

        {/* Sub-circuit branches */}
        <path
          d="M 1340 720 L 1340 790 L 1410 860 L 1580 860"
          className="hv-circuit-base"
        />
        <path
          d="M 1680 540 L 1680 430 L 1740 370 L 1860 370"
          className="hv-circuit-base"
        />

        {/* Circuit Nodes (Junction terminals) */}
        <circle cx="1520" cy="540" r="3.5" className="hv-circuit-node" />
        <circle cx="1490" cy="490" r="3.5" className="hv-circuit-node" />
        <circle cx="1470" cy="350" r="3.5" className="hv-circuit-node" />
        <circle cx="1340" cy="720" r="2.5" className="hv-circuit-node" />
        <circle cx="1680" cy="540" r="2.5" className="hv-circuit-node" />
        <circle cx="1580" cy="860" r="2" className="hv-circuit-node" />
        <circle cx="1860" cy="370" r="2" className="hv-circuit-node" />
      </svg>

      {/* --------------------------------------------------------------------
          Layer D: Floating Energy Particles
          -------------------------------------------------------------------- */}
      <div className="hv-particles-field">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hv-energy-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--p-drift-x': `${p.driftX}px`,
              '--p-duration': `${p.duration}s`,
              '--p-delay': `${p.delay}s`,
              '--p-opacity': p.opacity,
            }}
          />
        ))}
      </div>

      {/* --------------------------------------------------------------------
          Layer E: Logo Light Sweep Reflection
          -------------------------------------------------------------------- */}
      <div className="hv-emblem-light-sweep-container">
        <div className="hv-emblem-light-beam" />
      </div>
    </div>
  );
}
