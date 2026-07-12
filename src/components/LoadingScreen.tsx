'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    // Hide loader after animation completes
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] bg-[#3d2063] flex items-center justify-center"
        >
          <div className="relative flex flex-col items-center">
            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h1 className="text-2xl font-bold text-white">
                Pragna <span className="text-amber-400">Techsols</span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">Engineering Excellence</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-48 h-1 bg-[#4f2e88] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Loading Text */}
            <motion.p
              className="text-gray-500 text-xs mt-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Powering up...
            </motion.p>
          </div>

          {/* Background circuit lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="circuit-pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 50 30 M 50 70 L 50 100 M 0 50 L 30 50 M 70 50 L 100 50"
                  stroke="#e0b044"
                  strokeWidth="0.5"
                  fill="none"
                />
                <circle cx="50" cy="50" r="3" fill="#e0b044" />
                <circle cx="50" cy="30" r="2" fill="#e0b044" />
                <circle cx="50" cy="70" r="2" fill="#e0b044" />
                <circle cx="30" cy="50" r="2" fill="#e0b044" />
                <circle cx="70" cy="50" r="2" fill="#e0b044" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>

          {/* Animated circuit lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M 0 200 Q 200 200 400 300 T 800 250 T 1200 350"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 0 500 Q 300 400 600 500 T 1000 450 T 1400 500"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0b044" stopOpacity="0" />
                <stop offset="50%" stopColor="#e0b044" stopOpacity="1" />
                <stop offset="100%" stopColor="#e0b044" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
