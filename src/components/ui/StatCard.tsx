'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
}

const colorClasses = {
  default: 'glass-card',
  blue: 'bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm',
  green: 'bg-green-500/10 border border-green-500/30 backdrop-blur-sm',
  yellow: 'bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm',
  red: 'bg-red-500/10 border border-red-500/30 backdrop-blur-sm',
  purple: 'bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm',
};

const iconColors = {
  default: 'text-gray-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  yellow: 'text-amber-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-xl',
        colorClasses[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-sm mt-2',
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl bg-[#5e3a9e]/50', iconColors[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
