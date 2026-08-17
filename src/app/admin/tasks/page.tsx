'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, ClipboardList, Edit, Trash2, Calendar, User, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { Task, TeamMember, TaskStatus, TaskPriority, TaskNote } from '@/types';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const statusStyles: Record<TaskStatus, string> = {
  open: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-amber-500/20 text-amber-400',
  done: 'bg-green-500/20 text-green-400',
};

const priorityStyles: Record<TaskPriority, string> = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-gray-500/20 text-gray-400',
};

const initialFormState = {
  title: '',
  description: '',
  assignee_id: '',
  status: 'open' as TaskStatus,
  priority: 'medium' as TaskPriority,
  due_date: '',
};

export default function TasksAdminPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Notes thread state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchNotes = useCallback(async (taskId: string) => {
    setNotesLoading(true);
    try {
      const res = await fetch(`/api/admin/tasks/${taskId}/notes`);
      const data = await res.json();
      if (data.success) setNotes(data.data);
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  }, []);

  const toggleNotes = (taskId: string) => {
    if (expandedId === taskId) {
      setExpandedId(null);
      setNotes([]);
    } else {
      setExpandedId(taskId);
      setNoteDraft('');
      setNotes([]);
      fetchNotes(taskId);
    }
  };

  const handleAddAdminNote = async (taskId: string) => {
    const note = noteDraft.trim();
    if (!note) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/tasks/${taskId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        setNoteDraft('');
        fetchNotes(taskId);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add note');
      }
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/team?active_only=true&limit=100');
      const data = await res.json();
      if (data.success) setTeam(data.data);
    } catch {
      // non-fatal
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(assigneeFilter && { assignee_id: assigneeFilter }),
      });
      const res = await fetch(`/api/admin/tasks?${params}`);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, assigneeFilter]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const resetForm = () => {
    setFormData(initialFormState);
    setSelected(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const assignee = team.find((t) => t.id === formData.assignee_id);
      const payload = {
        title: formData.title,
        description: formData.description || null,
        assignee_id: formData.assignee_id || null,
        assignee_name: assignee ? assignee.name : null,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      };
      const url = selected ? `/api/admin/tasks/${selected.id}` : '/api/admin/tasks';
      const method = selected ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(selected ? 'Task updated' : 'Task created');
        setShowFormModal(false);
        resetForm();
        fetchTasks();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save task');
      }
    } catch {
      toast.error('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (t: Task) => {
    setSelected(t);
    setFormData({
      title: t.title,
      description: t.description || '',
      assignee_id: t.assignee_id || '',
      status: t.status,
      priority: t.priority,
      due_date: t.due_date ? t.due_date.slice(0, 10) : '',
    });
    setShowFormModal(true);
    setActionMenuId(null);
  };

  const handleQuickStatus = async (t: Task, status: TaskStatus) => {
    try {
      const res = await fetch(`/api/admin/tasks/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchTasks();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/tasks/${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Task deleted');
        fetchTasks();
        setShowDeleteModal(false);
        setSelected(null);
      }
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400 mt-1">Assign and track internal tasks for your team</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowFormModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[150px]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[160px]"
        >
          <option value="">All Assignees</option>
          {team.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] text-gray-400">
            <ClipboardList className="w-12 h-12 mb-4" />
            <p>No tasks found</p>
            <button onClick={() => { resetForm(); setShowFormModal(true); }} className="mt-4 text-amber-400 hover:text-amber-300">
              Create your first task
            </button>
          </div>
        ) : (
          tasks.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] hover:border-[#6d47b0] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{t.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[t.status]}`}>
                      {STATUS_OPTIONS.find((s) => s.value === t.status)?.label || t.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[t.priority]}`}>
                      {t.priority}
                    </span>
                  </div>
                  {t.description && <p className="text-sm text-gray-400 mb-2">{t.description}</p>}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {t.assignee_name || 'Unassigned'}
                    </span>
                    {t.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due {formatDate(t.due_date)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">Updated {formatRelativeTime(t.updated_at)}</span>
                    <button
                      onClick={() => toggleNotes(t.id)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {expandedId === t.id ? 'Hide notes' : 'Notes'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Quick status change */}
                  <select
                    value={t.status}
                    onChange={(e) => handleQuickStatus(t, e.target.value as TaskStatus)}
                    className="px-3 py-2 bg-[#5e3a9e] border border-[#6d47b0] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === t.id ? null : t.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#5e3a9e] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {actionMenuId === t.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#4f2e88] rounded-xl border border-[#5e3a9e] shadow-xl z-10">
                        <button onClick={() => handleEdit(t)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2 rounded-t-xl">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => { setSelected(t); setShowDeleteModal(true); setActionMenuId(null); }}
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-[#5e3a9e] flex items-center gap-2 rounded-b-xl"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes thread */}
              {expandedId === t.id && (
                <div className="mt-4 pt-4 border-t border-[#5e3a9e]">
                  {notesLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-amber-500" />
                    </div>
                  ) : notes.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {notes.map((n) => (
                        <div key={n.id} className="flex gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-none ${
                              n.author_type === 'admin'
                                ? 'bg-purple-500/30 text-purple-200'
                                : 'bg-amber-500/30 text-amber-200'
                            }`}
                          >
                            {n.author_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{n.author_name}</span>
                              <span className="text-xs text-gray-500">
                                {n.author_type === 'admin' ? 'Admin' : 'Team'} · {formatRelativeTime(n.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{n.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-4">No notes yet.</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAdminNote(t.id))}
                      placeholder="Add a note..."
                      className="flex-1 px-4 py-2 bg-[#5e3a9e] border border-[#6d47b0] rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleAddAdminNote(t.id)}
                      disabled={addingNote || !noteDraft.trim()}
                      className="px-4 py-2 bg-amber-500 text-[#3d2063] rounded-lg font-medium hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); resetForm(); }}
        title={selected ? 'Edit Task' : 'Create New Task'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Site inspection at VIT-AP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Task details..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Assign To</label>
            <select
              value={formData.assignee_id}
              onChange={(e) => setFormData((p) => ({ ...p, assignee_id: e.target.value }))}
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Unassigned</option>
              {team.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}{t.role ? ` — ${t.role}` : ''}
                </option>
              ))}
            </select>
            {team.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">
                No active team members yet. Add members in the Team section to assign tasks.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as TaskStatus }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as TaskPriority }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {PRIORITY_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData((p) => ({ ...p, due_date: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-[#5e3a9e]">
            <button
              type="button"
              onClick={() => { setShowFormModal(false); resetForm(); }}
              className="flex-1 px-4 py-3 bg-[#5e3a9e] text-white rounded-xl font-medium hover:bg-[#6d47b0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : selected ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelected(null); }}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
