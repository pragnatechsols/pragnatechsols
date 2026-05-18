'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

interface DashboardStats {
  enquiries: {
    new_count: number;
    lead_count: number;
    in_talks_count: number;
    converted_count: number;
    spam_count: number;
    total_active: number;
  };
  leads: {
    new_lead_count: number;
    contacted_count: number;
    in_discussion_count: number;
    proposal_sent_count: number;
    converted_count: number;
    lost_count: number;
    total_leads: number;
    pending_leads: number;
  };
  applications: {
    new_count: number;
    shortlisted_count: number;
    interview_count: number;
    rejected_count: number;
    hired_count: number;
    total_applications: number;
  };
  jobs: {
    active_jobs: number;
    total_jobs: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here&apos;s an overview of your business.</p>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Enquiries"
          value={stats?.enquiries.total_active || 0}
          icon={<MessageSquare className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Active Leads"
          value={stats?.leads.pending_leads || 0}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.jobs.active_jobs || 0}
          icon={<Briefcase className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          title="Applications"
          value={stats?.applications.total_applications || 0}
          icon={<FileText className="w-6 h-6" />}
          color="green"
        />
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiries Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-yellow-400" />
            Enquiries Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">New</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.enquiries.new_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">In Talks</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.enquiries.in_talks_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Converted</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.enquiries.converted_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Spam</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.enquiries.spam_count || 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Leads Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-yellow-400" />
            Leads Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">New Leads</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.leads.new_lead_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">In Discussion</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.leads.in_discussion_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Converted</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.leads.converted_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">Lost</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats?.leads.lost_count || 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Applications Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            Applications Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">New</p>
              <p className="text-2xl font-bold text-blue-400">{stats?.applications.new_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Shortlisted</p>
              <p className="text-2xl font-bold text-purple-400">{stats?.applications.shortlisted_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Interview</p>
              <p className="text-2xl font-bold text-yellow-400">{stats?.applications.interview_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Hired</p>
              <p className="text-2xl font-bold text-green-400">{stats?.applications.hired_count || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{stats?.applications.rejected_count || 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Jobs Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-yellow-400" />
            Jobs Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Active Jobs</p>
              <p className="text-3xl font-bold text-green-400">{stats?.jobs.active_jobs || 0}</p>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-gray-400">Total Jobs</p>
              <p className="text-3xl font-bold text-white">{stats?.jobs.total_jobs || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
