'use client';

import { motion } from 'framer-motion';

// Circuit background pattern component
export function CircuitPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="circuit-grid"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Horizontal and vertical lines */}
          <path
            d="M 40 0 L 40 25 M 40 55 L 40 80 M 0 40 L 25 40 M 55 40 L 80 40"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-yellow-500/10"
          />
          {/* Connection nodes */}
          <circle cx="40" cy="40" r="2" className="fill-yellow-500/20" />
          <circle cx="40" cy="25" r="1.5" className="fill-indigo-500/20" />
          <circle cx="40" cy="55" r="1.5" className="fill-indigo-500/20" />
          <circle cx="25" cy="40" r="1.5" className="fill-indigo-500/20" />
          <circle cx="55" cy="40" r="1.5" className="fill-indigo-500/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-grid)" />
    </svg>
  );
}

// Animated wire lines component
export function AnimatedWires({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wireGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0" />
          <stop offset="50%" stopColor="#eab308" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wireGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Animated wire paths */}
      <motion.path
        d="M -100 100 Q 200 50 400 100 T 800 80 T 1200 120 T 1600 90"
        stroke="url(#wireGradient1)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
      />
      <motion.path
        d="M -100 300 Q 150 350 400 280 T 800 320 T 1200 260 T 1600 310"
        stroke="url(#wireGradient2)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, delay: 0.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
      />
    </svg>
  );
}

// Electrical node decoration
export function ElectricalNode({
  className = '',
  size = 'md',
  animated = true,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={`relative ${className}`}>
      {animated && (
        <motion.div
          className={`absolute ${sizes[size]} bg-yellow-500/30 rounded-full`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div
        className={`${sizes[size]} bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full`}
        style={{
          boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)',
        }}
      />
    </div>
  );
}

// Glowing line separator
export function GlowingLine({
  className = '',
  direction = 'horizontal',
}: {
  className?: string;
  direction?: 'horizontal' | 'vertical';
}) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={`relative ${isHorizontal ? 'w-full h-px' : 'w-px h-full'} ${className}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-${isHorizontal ? 'r' : 'b'} from-transparent via-yellow-500/50 to-transparent`}
      />
      <motion.div
        className={`absolute ${isHorizontal ? 'w-20 h-full' : 'w-full h-20'} bg-gradient-to-${isHorizontal ? 'r' : 'b'} from-transparent via-yellow-400 to-transparent`}
        animate={{
          [isHorizontal ? 'x' : 'y']: ['0%', '500%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0.6 }}
      />
    </div>
  );
}

// Section divider with circuit theme
export function CircuitDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-16 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0" />
            <stop offset="20%" stopColor="#eab308" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#eab308" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="url(#dividerGradient)"
          strokeWidth="1"
        />
        {/* Center node */}
        <circle cx="50%" cy="50%" r="4" fill="#eab308" opacity="0.5" />
        <circle cx="50%" cy="50%" r="2" fill="#eab308" />
        {/* Side nodes */}
        <circle cx="25%" cy="50%" r="2" fill="#6366f1" opacity="0.5" />
        <circle cx="75%" cy="50%" r="2" fill="#6366f1" opacity="0.5" />
      </svg>
    </div>
  );
}

// Floating particles background
// Using seeded pseudo-random to avoid hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export function FloatingParticles({
  className = '',
  count = 20,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => {
        // Use index-based seeded random for consistent server/client values
        const left = seededRandom(i * 3 + 1) * 100;
        const top = seededRandom(i * 3 + 2) * 100;
        const duration = 3 + seededRandom(i * 3 + 3) * 2;
        const delay = seededRandom(i * 3 + 4) * 2;
        
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}

// Energy flow line (for connecting elements)
export function EnergyFlowLine({
  className = '',
  points,
}: {
  className?: string;
  points: string;
}) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0" />
          <stop offset="50%" stopColor="#eab308" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={points}
        stroke="url(#flowGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />
    </svg>
  );
}
