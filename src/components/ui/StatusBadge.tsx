'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'enquiry' | 'lead' | 'application' | 'priority';
  className?: string;
}

const enquiryColors: Record<string, string> = {
  new_enquiry: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  lead: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  in_talks: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  converted: 'bg-green-500/20 text-green-400 border-green-500/30',
  spam: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const leadColors: Record<string, string> = {
  new_lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contacted: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  in_discussion: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  proposal_sent: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  converted: 'bg-green-500/20 text-green-400 border-green-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const applicationColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shortlisted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  interview_scheduled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  hired: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const statusLabels: Record<string, string> = {
  // Enquiry
  new_enquiry: 'New Enquiry',
  in_talks: 'In Talks',
  // Lead
  new_lead: 'New Lead',
  in_discussion: 'In Discussion',
  proposal_sent: 'Proposal Sent',
  // Application
  interview_scheduled: 'Interview',
  // Priority
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function StatusBadge({ status, variant = 'enquiry', className }: StatusBadgeProps) {
  let colorMap = enquiryColors;
  
  switch (variant) {
    case 'lead':
      colorMap = leadColors;
      break;
    case 'application':
      colorMap = applicationColors;
      break;
    case 'priority':
      colorMap = priorityColors;
      break;
    default:
      colorMap = enquiryColors;
  }

  const color = colorMap[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const label = statusLabels[status] || status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
