'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Users,
  LayoutGrid,
  List,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/ui/StatusBadge';
import StatCard from '@/components/ui/StatCard';
import Modal from '@/components/ui/Modal';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import type { Lead, LeadStatus, LeadPriority, LeadNote } from '@/types';

const statusOptions: { value: LeadStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new_lead', label: 'New Lead' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'proposal_sent', label: 'Proposal Sent' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

const priorityOptions: { value: LeadPriority | ''; label: string }[] = [
  { value: '', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const kanbanColumns: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'new_lead', label: 'New Leads', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-cyan-500' },
  { id: 'in_discussion', label: 'In Discussion', color: 'bg-yellow-500' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'bg-orange-500' },
  { id: 'converted', label: 'Converted', color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<LeadPriority | ''>('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    converted: 0,
    pending: 0,
    lost: 0,
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: viewMode === 'kanban' ? '100' : '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
      });

      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();

      if (data.success) {
        setLeads(data.data);
        setTotalPages(data.totalPages);
        
        // Calculate stats
        const allLeads = data.data as Lead[];
        setStats({
          total: data.total,
          converted: allLeads.filter((l) => l.lead_status === 'converted').length,
          pending: allLeads.filter((l) => !['converted', 'lost'].includes(l.lead_status)).length,
          lost: allLeads.filter((l) => l.lead_status === 'lost').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, priorityFilter, viewMode]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_status: status, admin_name: 'Admin' }),
      });

      if (res.ok) {
        toast.success(`Status updated`);
        fetchLeads();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (id: string, priority: LeadPriority) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority, admin_name: 'Admin' }),
      });

      if (res.ok) {
        toast.success(`Priority updated`);
        fetchLeads();
      }
    } catch {
      toast.error('Failed to update priority');
    }
  };

  const openDetailModal = async (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`);
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note: newNote,
          admin_name: 'Admin',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes([data.data, ...notes]);
        setNewNote('');
        toast.success('Note added');
      }
    } catch {
      toast.error('Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter((lead) => lead.lead_status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-gray-400 mt-1">Manage and track your sales leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'kanban' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats.total} icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard title="Pending" value={stats.pending} icon={<Clock className="w-5 h-5" />} color="yellow" />
        <StatCard title="Converted" value={stats.converted} icon={<Users className="w-5 h-5" />} color="green" />
        <StatCard title="Lost" value={stats.lost} icon={<Users className="w-5 h-5" />} color="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | '')}
            className="pl-12 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer min-w-[160px]"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as LeadPriority | '')}
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer min-w-[140px]"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500" />
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-72">
              <div className="mb-4 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="text-white font-medium">{column.label}</h3>
                <span className="text-gray-400 text-sm">({getLeadsByStatus(column.id).length})</span>
              </div>
              <div className="space-y-3 min-h-[400px] p-2 bg-slate-800/30 rounded-xl">
                {getLeadsByStatus(column.id).map((lead) => (
                  <motion.div
                    key={lead.id}
                    layoutId={lead.id}
                    onClick={() => openDetailModal(lead)}
                    className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-yellow-500/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 text-sm font-bold">
                        {lead.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{lead.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{lead.company_name || lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <StatusBadge status={lead.priority} variant="priority" />
                      <span className="text-xs text-gray-400">{formatRelativeTime(lead.created_at)}</span>
                    </div>
                    {lead.follow_up_date && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400">
                        <Calendar className="w-3 h-3" />
                        Follow-up: {formatDate(lead.follow_up_date)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Users className="w-12 h-12 mb-4" />
              <p>No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Follow-up</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {leads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                      onClick={() => openDetailModal(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 font-bold">
                            {lead.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{lead.full_name}</p>
                            <p className="text-sm text-gray-400">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{lead.service_interested}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.lead_status} variant="lead" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={lead.priority} variant="priority" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">
                          {lead.follow_up_date ? formatDate(lead.follow_up_date) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination (Table View Only) */}
      {viewMode === 'table' && totalPages > 1 && (
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
          setSelectedLead(null);
          setNotes([]);
        }}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <User className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="text-white">{selectedLead.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Mail className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white">{selectedLead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Phone className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-white">{selectedLead.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl">
                <Building className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-gray-400">Company</p>
                  <p className="text-white">{selectedLead.company_name || '-'}</p>
                </div>
              </div>
            </div>

            {/* Status & Priority Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Status</label>
                <select
                  value={selectedLead.lead_status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  {statusOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Priority</label>
                <select
                  value={selectedLead.priority}
                  onChange={(e) => handlePriorityChange(selectedLead.id, e.target.value as LeadPriority)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                >
                  {priorityOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="text-white font-medium mb-4">Activity Timeline</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-400 text-sm">No activity yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-700/50 rounded-lg border-l-2 border-yellow-500">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-yellow-400">{note.admin_name}</span>
                        <span className="text-xs text-gray-400">{formatRelativeTime(note.created_at)}</span>
                      </div>
                      <p className="text-sm text-white">{note.note}</p>
                      {note.activity_type !== 'note' && (
                        <span className="text-xs text-gray-500 capitalize">{note.activity_type.replace('_', ' ')}</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Note */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isSubmitting}
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
