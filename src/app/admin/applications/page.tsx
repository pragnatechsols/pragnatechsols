'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/ui/StatusBadge';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import type { JobApplication, ApplicationStatus, ApplicationComment, Job } from '@/types';

const statusOptions: { value: ApplicationStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

// Open resume in new tab using signed URL
async function openResume(applicationId: string) {
  try {
    const res = await fetch(`/api/admin/resume/${applicationId}`);
    const data = await res.json();
    if (data.success && data.url) {
      window.open(data.url, '_blank');
    } else {
      throw new Error('Failed to get resume URL');
    }
  } catch (error) {
    console.error('Error opening resume:', error);
    alert('Failed to open resume. Please try again.');
  }
}

// Download resume using signed URL
async function downloadResume(applicationId: string, filename: string) {
  try {
    const res = await fetch(`/api/admin/resume/${applicationId}`);
    const data = await res.json();
    if (data.success && data.url) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = data.url;
      link.download = filename || 'resume';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      throw new Error('Failed to get resume URL');
    }
  } catch (error) {
    console.error('Error downloading resume:', error);
    alert('Failed to download resume. Please try again.');
  }
}

interface ApplicationWithJob extends JobApplication {
  job: Job;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApp, setSelectedApp] = useState<ApplicationWithJob | null>(null);
  const [comments, setComments] = useState<ApplicationComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    shortlisted: 0,
    hired: 0,
  });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/applications?${params}`);
      const data = await res.json();

      if (data.success) {
        setApplications(data.data);
        setTotalPages(data.totalPages);

        // Calculate stats
        const allApps = data.data as ApplicationWithJob[];
        setStats({
          total: data.total,
          new: allApps.filter((a) => a.status === 'new').length,
          shortlisted: allApps.filter((a) => a.status === 'shortlisted').length,
          hired: allApps.filter((a) => a.status === 'hired').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Application deleted');
        fetchApplications();
      } else {
        toast.error('Failed to delete application');
      }
    } catch {
      toast.error('Failed to delete application');
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_name: 'Admin' }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${status.replace('_', ' ')}`);
        fetchApplications();
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status });
        }
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openDetailModal = async (app: ApplicationWithJob) => {
    setSelectedApp(app);
    setShowDetailModal(true);

    try {
      const res = await fetch(`/api/admin/applications/${app.id}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedApp || !newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          admin_name: 'Admin',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data.data, ...comments]);
        setNewComment('');
        toast.success('Comment added');
      }
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Applications</h1>
        <p className="text-gray-400 mt-1">Track and manage job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={stats.total} icon={<FileText className="w-5 h-5" />} color="blue" />
        <StatCard title="New" value={stats.new} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatCard title="Shortlisted" value={stats.shortlisted} icon={<User className="w-5 h-5" />} color="purple" />
        <StatCard title="Hired" value={stats.hired} icon={<User className="w-5 h-5" />} color="green" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | '')}
            className="pl-12 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer min-w-[180px]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FileText className="w-12 h-12 mb-4" />
            <p>No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Applied For</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Applied</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {applications.map((app) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                    onClick={() => openDetailModal(app)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 font-bold">
                          {app.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.full_name}</p>
                          <p className="text-sm text-gray-400">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{app.job?.title || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{app.years_of_experience} years</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} variant="application" />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{formatRelativeTime(app.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openResume(app.id)}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Resume"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadResume(app.id, app.resume_filename)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <div className="relative" data-dropdown>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === app.id ? null : app.id);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeDropdown === app.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDetailModal(app);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-white hover:bg-slate-700 flex items-center gap-2 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {(app.status === 'rejected' || app.status === 'hired') && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteApplication(app.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Application
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApp(null);
          setComments([]);
        }}
        title="Application Details"
        size="xl"
      >
        {selectedApp && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 text-2xl font-bold">
                  {selectedApp.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedApp.full_name}</h3>
                  <p className="text-gray-400">Applied for {selectedApp.job?.title}</p>
                </div>
              </div>
              <StatusBadge status={selectedApp.status} variant="application" />
            </div>

            {/* Contact & Job Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Mail className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white text-sm">{selectedApp.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Phone className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-white text-sm">{selectedApp.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="text-white text-sm">{selectedApp.current_location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Briefcase className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="text-white text-sm">{selectedApp.years_of_experience} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <User className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Current Company</p>
                  <p className="text-white text-sm">{selectedApp.current_company || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Notice Period</p>
                  <p className="text-white text-sm">{selectedApp.notice_period}</p>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            {selectedApp.portfolio_url && (
              <div className="p-4 bg-slate-700/50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Portfolio / LinkedIn</p>
                <a
                  href={selectedApp.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                >
                  {selectedApp.portfolio_url}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Why Hire */}
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Why should we hire you?</p>
              <p className="text-white whitespace-pre-wrap">{selectedApp.why_hire_you}</p>
            </div>

            {/* Resume */}
            <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
              <FileText className="w-8 h-8 text-yellow-400" />
              <div className="flex-1">
                <p className="text-white font-medium">{selectedApp.resume_filename}</p>
                <p className="text-sm text-gray-400">Resume</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openResume(selectedApp.id)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => downloadResume(selectedApp.id, selectedApp.resume_filename)}
                  className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Status Change */}
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(selectedApp.id, option.value as ApplicationStatus)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedApp.status === option.value
                        ? 'bg-yellow-500 text-slate-900'
                        : 'bg-slate-600 text-white hover:bg-slate-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-white font-medium mb-4">Internal Notes</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-sm">No notes yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-yellow-400">{comment.admin_name}</span>
                        <span className="text-xs text-gray-400">{formatRelativeTime(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-white">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
