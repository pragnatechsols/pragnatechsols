'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  MessageSquare,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  Trash2,
  UserPlus,
  MessageCircle,
  Ban,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatRelativeTime } from '@/lib/utils';
import type { Enquiry, EnquiryStatus, EnquiryComment } from '@/types';

const statusOptions: { value: EnquiryStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new_enquiry', label: 'New Enquiry' },
  { value: 'lead', label: 'Lead' },
  { value: 'in_talks', label: 'In Talks' },
  { value: 'converted', label: 'Converted' },
  { value: 'spam', label: 'Spam' },
];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [comments, setComments] = useState<EnquiryComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/admin/enquiries?${params}`);
      const data = await res.json();

      if (data.success) {
        setEnquiries(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
      toast.error('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${status.replace('_', ' ')}`);
        fetchEnquiries();
        setActionMenuId(null);
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleMarkAsSpam = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_spam: true }),
      });

      if (res.ok) {
        toast.success('Marked as spam');
        fetchEnquiries();
        setActionMenuId(null);
      }
    } catch {
      toast.error('Failed to mark as spam');
    }
  };

  const handleDelete = async () => {
    if (!selectedEnquiry) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Enquiry deleted');
        fetchEnquiries();
        setShowDeleteModal(false);
        setSelectedEnquiry(null);
      }
    } catch {
      toast.error('Failed to delete enquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetailModal = async (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowDetailModal(true);

    // Fetch comments
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}/comments`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!selectedEnquiry || !newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newComment,
          admin_name: 'Admin', // TODO: Get from session
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Enquiries</h1>
          <p className="text-gray-400 mt-1">Manage customer enquiries and quote requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EnquiryStatus | '')}
            className="pl-12 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent cursor-pointer min-w-[180px]"
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
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p>No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {enquiries.map((enquiry) => (
                  <motion.tr
                    key={enquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                    onClick={() => openDetailModal(enquiry)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 font-bold">
                          {enquiry.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{enquiry.full_name}</p>
                          <p className="text-sm text-gray-400">{enquiry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{enquiry.service_interested}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={enquiry.status} variant="enquiry" />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{formatRelativeTime(enquiry.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActionMenuId(actionMenuId === enquiry.id ? null : enquiry.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {actionMenuId === enquiry.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-10">
                            <button
                              onClick={() => handleStatusChange(enquiry.id, 'lead')}
                              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-slate-700 flex items-center gap-2 rounded-t-xl"
                            >
                              <UserPlus className="w-4 h-4" />
                              Mark as Lead
                            </button>
                            <button
                              onClick={() => handleStatusChange(enquiry.id, 'in_talks')}
                              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-slate-700 flex items-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Mark as In Talks
                            </button>
                            <button
                              onClick={() => handleStatusChange(enquiry.id, 'converted')}
                              className="w-full px-4 py-3 text-left text-sm text-white hover:bg-slate-700 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Converted
                            </button>
                            <button
                              onClick={() => handleMarkAsSpam(enquiry.id)}
                              className="w-full px-4 py-3 text-left text-sm text-yellow-400 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Ban className="w-4 h-4" />
                              Mark as Spam
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEnquiry(enquiry);
                                setShowDeleteModal(true);
                                setActionMenuId(null);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 rounded-b-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
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
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
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
          setSelectedEnquiry(null);
          setComments([]);
        }}
        title="Enquiry Details"
        size="lg"
      >
        {selectedEnquiry && (
          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <User className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="text-white">{selectedEnquiry.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Mail className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white">{selectedEnquiry.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Phone className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-white">{selectedEnquiry.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Building className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Company</p>
                  <p className="text-white">{selectedEnquiry.company_name || '-'}</p>
                </div>
              </div>
            </div>

            {/* Service & Status */}
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm font-medium">
                {selectedEnquiry.service_interested}
              </span>
              <StatusBadge status={selectedEnquiry.status} variant="enquiry" />
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatRelativeTime(selectedEnquiry.created_at)}
              </span>
            </div>

            {/* Message */}
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Message</p>
              <p className="text-white whitespace-pre-wrap">{selectedEnquiry.message}</p>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-white font-medium mb-4">Internal Comments</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-sm">No comments yet</p>
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
                  placeholder="Add a comment..."
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEnquiry(null);
        }}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
