'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, MessageSquarePlus, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { TaskWithNotes, TaskStatus, TaskPriority } from '@/types';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
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

export default function TeamTasksPage() {
  const [tasks, setTasks] = useState<TaskWithNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team/tasks');
      const data = await res.json();
      if (data.success) setTasks(data.data);
      else toast.error(data.error || 'Failed to load tasks');
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    setBusyId(taskId);
    try {
      const res = await fetch(`/api/team/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchTasks();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setBusyId(null);
    }
  };

  const handleAddNote = async (taskId: string) => {
    const note = (noteDrafts[taskId] || '').trim();
    if (!note) return;
    setBusyId(taskId);
    try {
      const res = await fetch(`/api/team/tasks/${taskId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        toast.success('Note added');
        setNoteDrafts((p) => ({ ...p, [taskId]: '' }));
        fetchTasks();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add note');
      }
    } catch {
      toast.error('Failed to add note');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Tasks</h1>
        <p className="text-gray-400 mt-1">Update status and add notes on your assigned tasks</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] text-gray-400">
          <ClipboardList className="w-12 h-12 mb-4" />
          <p>No tasks assigned to you yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
                      {STATUS_OPTIONS.find((s) => s.value === task.status)?.label || task.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && <p className="text-sm text-gray-400 mb-2">{task.description}</p>}
                  {task.due_date && (
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Due {formatDate(task.due_date)}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Status</label>
                  <select
                    value={task.status}
                    disabled={busyId === task.id}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className="px-3 py-2 bg-[#5e3a9e] border border-[#6d47b0] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 pt-4 border-t border-[#5e3a9e]">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Notes</h4>
                {task.notes.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {task.notes.map((n) => (
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
                              {n.author_type === 'admin' ? 'Admin' : 'You/Team'} · {formatRelativeTime(n.created_at)}
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
                  <div className="relative flex-1">
                    <MessageSquarePlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={noteDrafts[task.id] || ''}
                      onChange={(e) => setNoteDrafts((p) => ({ ...p, [task.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNote(task.id))}
                      placeholder="Add a note..."
                      className="w-full pl-9 pr-4 py-2 bg-[#5e3a9e] border border-[#6d47b0] rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <button
                    onClick={() => handleAddNote(task.id)}
                    disabled={busyId === task.id || !(noteDrafts[task.id] || '').trim()}
                    className="px-4 py-2 bg-amber-500 text-[#3d2063] rounded-lg font-medium hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
