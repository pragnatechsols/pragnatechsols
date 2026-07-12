'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export default function AnimatedButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}: AnimatedButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 overflow-hidden';
  
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-[#3d2063]',
    secondary: 'bg-[#4f2e88] hover:bg-[#5e3a9e] text-white border border-[#5e3a9e]',
    outline: 'bg-transparent hover:bg-amber-500/10 text-amber-400 border border-amber-500/50 hover:border-amber-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const buttonContent = (
    <>
      {/* Ripple effect background */}
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Glow effect for primary */}
      {variant === 'primary' && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/30 to-amber-400/0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </>
  );

  const hoverAnimation = disabled ? {} : { scale: 1.02, y: -2 };
  const tapAnimation = disabled ? {} : { scale: 0.98 };

  if (href && !disabled) {
    return (
      <Link href={href}>
        <motion.span
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
          className={combinedClassName}
        >
          {buttonContent}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={combinedClassName}
    >
      {buttonContent}
    </motion.button>
  );
}
