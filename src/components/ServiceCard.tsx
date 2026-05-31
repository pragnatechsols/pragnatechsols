'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export default function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  const CardContent = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-yellow-400/30 transition-all duration-300 overflow-hidden h-full"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Icon */}
        <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 transition-colors">
          <div className="text-yellow-400">{icon}</div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

        {/* Arrow indicator */}
        <div className="mt-6 flex items-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-medium">Learn more</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
