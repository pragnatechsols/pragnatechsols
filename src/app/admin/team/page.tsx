'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, UserCog, Edit, Trash2, Eye, EyeOff, Mail, KeyRound, IdCard, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { TeamMember } from '@/types';

const initialFormState = {
  name: '',
  email: '',
  employee_id: '',
  role: '',
  is_active: true,
};

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Login-code modal state
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeMember, setCodeMember] = useState<TeamMember | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [generatingCode, setGeneratingCode] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', ...(search && { search }) });
      const res = await fetch(`/api/admin/team?${params}`);
      const data = await res.json();
      if (data.success) setMembers(data.data);
    } catch {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const resetForm = () => {
    setFormData(initialFormState);
    setSelected(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const url = selected ? `/api/admin/team/${selected.id}` : '/api/admin/team';
      const method = selected ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(selected ? 'Team member updated' : 'Team member added');
        setShowFormModal(false);
        resetForm();
        fetchMembers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save team member');
      }
    } catch {
      toast.error('Failed to save team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (m: TeamMember) => {
    setSelected(m);
    setFormData({
      name: m.name,
      email: m.email || '',
      employee_id: m.employee_id || '',
      role: m.role || '',
      is_active: m.is_active,
    });
    setShowFormModal(true);
    setActionMenuId(null);
  };

  const handleGenerateCode = async (m: TeamMember) => {
    setActionMenuId(null);
    setCodeMember(m);
    setGeneratedCode('');
    setShowCodeModal(true);
    setGeneratingCode(true);
    try {
      const res = await fetch(`/api/admin/team/${m.id}/login-code`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedCode(data.data.code);
      } else {
        toast.error(data.error || 'Failed to generate code');
        setShowCodeModal(false);
      }
    } catch {
      toast.error('Failed to generate code');
      setShowCodeModal(false);
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const handleToggleActive = async (m: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/team/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !m.is_active }),
      });
      if (res.ok) {
        toast.success(m.is_active ? 'Member deactivated' : 'Member activated');
        fetchMembers();
      }
    } catch {
      toast.error('Failed to update team member');
    }
    setActionMenuId(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/team/${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Team member deleted');
        fetchMembers();
        setShowDeleteModal(false);
        setSelected(null);
      }
    } catch {
      toast.error('Failed to delete team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <p className="text-gray-400 mt-1">Manage internal staff who can be assigned tasks</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowFormModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] text-gray-400">
            <UserCog className="w-12 h-12 mb-4" />
            <p>No team members yet</p>
            <button onClick={() => { resetForm(); setShowFormModal(true); }} className="mt-4 text-amber-400 hover:text-amber-300">
              Add your first team member
            </button>
          </div>
        ) : (
          members.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] hover:border-[#6d47b0] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#3d2063] font-bold flex-none">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{m.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          m.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {m.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      {m.role && <span>{m.role}</span>}
                      {m.employee_id && (
                        <span className="flex items-center gap-1">
                          <IdCard className="w-4 h-4" />
                          {m.employee_id}
                        </span>
                      )}
                      {m.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {m.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActionMenuId(actionMenuId === m.id ? null : m.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#5e3a9e] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {actionMenuId === m.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#4f2e88] rounded-xl border border-[#5e3a9e] shadow-xl z-10">
                      <button onClick={() => handleEdit(m)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2 rounded-t-xl">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => handleToggleActive(m)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2">
                        {m.is_active ? (<><EyeOff className="w-4 h-4" /> Deactivate</>) : (<><Eye className="w-4 h-4" /> Activate</>)}
                      </button>
                      <button onClick={() => handleGenerateCode(m)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2">
                        <KeyRound className="w-4 h-4" /> Generate login code
                      </button>
                      <button
                        onClick={() => { setSelected(m); setShowDeleteModal(true); setActionMenuId(null); }}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-[#5e3a9e] flex items-center gap-2 rounded-b-xl"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); resetForm(); }}
        title={selected ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. Ravi Kumar"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="name@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Used to sign in to the team portal.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Employee ID</label>
              <input
                type="text"
                value={formData.employee_id}
                onChange={(e) => setFormData((p) => ({ ...p, employee_id: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. EMP-1024 (optional)"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Site Engineer"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="tm_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
              className="w-4 h-4 rounded border-[#6d47b0] text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="tm_is_active" className="text-sm text-gray-300">Active (available for task assignment)</label>
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
              {isSubmitting ? 'Saving...' : selected ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelected(null); }}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message="Are you sure? They will be unassigned from any tasks."
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />

      {/* Login code modal */}
      <Modal
        isOpen={showCodeModal}
        onClose={() => { setShowCodeModal(false); setCodeMember(null); setGeneratedCode(''); }}
        title="Team Login Code"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-300">
            Share this one-time code with{' '}
            <span className="font-medium text-white">{codeMember?.name}</span> if they didn&apos;t
            receive the email. They enter it at <span className="text-amber-400">/team/login</span>{' '}
            after typing their email ({codeMember?.email}). It expires in 10 minutes.
          </p>

          {generatingCode ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl p-4">
              <span className="text-3xl font-bold tracking-[0.4em] text-amber-400">{generatedCode}</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 px-3 py-2 bg-[#6d47b0] hover:bg-[#7d55c0] text-white rounded-lg text-sm transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => { setShowCodeModal(false); setCodeMember(null); setGeneratedCode(''); }}
              className="px-4 py-2 bg-[#5e3a9e] text-white rounded-lg font-medium hover:bg-[#6d47b0] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
