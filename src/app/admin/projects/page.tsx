'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, FolderKanban, Edit, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { Project } from '@/types';

const CATEGORY_OPTIONS = ['Commercial', 'Industrial', 'Educational', 'Infrastructure'];

const initialFormState = {
  title: '',
  works: [] as string[],
  category: 'Commercial',
  logo_url: '' as string,
  logo_cloudinary_id: '' as string,
  sort_order: 0,
  is_active: true,
};

export default function ProjectsAdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [workInput, setWorkInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', ...(search && { search }) });
      const res = await fetch(`/api/admin/projects?${params}`);
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    // Projects is a super-admin-only section. Verify role before loading;
    // bounce non-super admins back to the dashboard.
    const checkRole = async () => {
      try {
        const res = await fetch('/api/admin/auth/me');
        const data = await res.json();
        if (res.ok && data.data?.role === 'super_admin') {
          setAuthorized(true);
        } else {
          router.replace('/admin');
        }
      } catch {
        router.replace('/admin');
      }
    };
    checkRole();
  }, [router]);

  useEffect(() => {
    if (authorized) fetchProjects();
  }, [authorized, fetchProjects]);

  const resetForm = () => {
    setFormData(initialFormState);
    setSelected(null);
    setWorkInput('');
  };

  const handleAddWork = () => {
    if (workInput.trim() && !formData.works.includes(workInput.trim())) {
      setFormData((prev) => ({ ...prev, works: [...prev.works, workInput.trim()] }));
      setWorkInput('');
    }
  };

  const handleRemoveWork = (w: string) => {
    setFormData((prev) => ({ ...prev, works: prev.works.filter((x) => x !== w) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'projects');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev) => ({ ...prev, logo_url: data.data.url, logo_cloudinary_id: data.data.publicId }));
        toast.success('Logo uploaded');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        sort_order: Number(formData.sort_order) || 0,
        logo_url: formData.logo_url || null,
        logo_cloudinary_id: formData.logo_cloudinary_id || null,
      };
      const url = selected ? `/api/admin/projects/${selected.id}` : '/api/admin/projects';
      const method = selected ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(selected ? 'Project updated' : 'Project created');
        setShowFormModal(false);
        resetForm();
        fetchProjects();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save project');
      }
    } catch {
      toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (p: Project) => {
    setSelected(p);
    setFormData({
      title: p.title,
      works: p.works || [],
      category: p.category || 'Commercial',
      logo_url: p.logo_url || '',
      logo_cloudinary_id: p.logo_cloudinary_id || '',
      sort_order: p.sort_order || 0,
      is_active: p.is_active,
    });
    setShowFormModal(true);
    setActionMenuId(null);
  };

  const handleToggleActive = async (p: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      if (res.ok) {
        toast.success(p.is_active ? 'Project hidden' : 'Project published');
        fetchProjects();
      }
    } catch {
      toast.error('Failed to update project');
    }
    setActionMenuId(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/projects/${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted');
        fetchProjects();
        setShowDeleteModal(false);
        setSelected(null);
      }
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects Management</h1>
          <p className="text-gray-400 mt-1">Manage the client projects shown on your website</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowFormModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
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
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] text-gray-400">
            <FolderKanban className="w-12 h-12 mb-4" />
            <p>No projects found</p>
            <button onClick={() => { resetForm(); setShowFormModal(true); }} className="mt-4 text-amber-400 hover:text-amber-300">
              Create your first project
            </button>
          </div>
        ) : (
          projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] hover:border-[#6d47b0] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {p.logo_url ? (
                    <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center flex-none p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logo_url} alt={p.title} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[#5e3a9e] flex items-center justify-center flex-none">
                      <FolderKanban className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">{p.category}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Hidden'}
                      </span>
                      <span className="text-xs text-gray-500">#{p.sort_order}</span>
                    </div>
                    {p.works && p.works.length > 0 && (
                      <p className="text-sm text-gray-400">{p.works.join(' • ')}</p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActionMenuId(actionMenuId === p.id ? null : p.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#5e3a9e] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {actionMenuId === p.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#4f2e88] rounded-xl border border-[#5e3a9e] shadow-xl z-10">
                      <button onClick={() => handleEdit(p)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2 rounded-t-xl">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => handleToggleActive(p)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2">
                        {p.is_active ? (<><EyeOff className="w-4 h-4" /> Hide</>) : (<><Eye className="w-4 h-4" /> Publish</>)}
                      </button>
                      <button
                        onClick={() => { setSelected(p); setShowDeleteModal(true); setActionMenuId(null); }}
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
        title={selected ? 'Edit Project' : 'Create New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Client / Project Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. VIT-AP University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client Logo</label>
            <div className="border-2 border-dashed border-[#6d47b0] rounded-xl p-4 flex items-center gap-4">
              {formData.logo_url ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.logo_url} alt="logo" className="w-16 h-16 object-contain rounded-lg bg-white p-1" />
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, logo_url: '', logo_cloudinary_id: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null}
              <label className="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300">
                <Upload className="w-5 h-5" />
                {uploading ? 'Uploading...' : formData.logo_url ? 'Replace logo' : 'Upload logo'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Works */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Works Delivered</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={workInput}
                onChange={(e) => setWorkInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWork())}
                className="flex-1 px-4 py-2 bg-[#5e3a9e] border border-[#6d47b0] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Add a work item..."
              />
              <button type="button" onClick={handleAddWork} className="px-4 py-2 bg-[#6d47b0] text-white rounded-lg hover:bg-[#7d55c0] transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.works.map((w) => (
                <span key={w} className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                  {w}
                  <button type="button" onClick={() => handleRemoveWork(w)} className="hover:text-amber-200">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-[#6d47b0] text-amber-500 focus:ring-amber-500"
                />
                Active (visible on projects page)
              </label>
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
              disabled={isSubmitting || uploading}
              className="flex-1 px-4 py-3 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : selected ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelected(null); }}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? It will be removed from the website."
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
