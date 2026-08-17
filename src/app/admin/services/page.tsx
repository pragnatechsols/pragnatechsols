'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, LayoutGrid, Edit, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { SERVICE_ICON_OPTIONS, SERVICE_GRADIENT_OPTIONS, getServiceIcon } from '@/lib/service-icons';
import type { Service } from '@/types';

const initialFormState = {
  title: '',
  slug: '',
  short_desc: '',
  description: '',
  features: [] as string[],
  icon_name: 'bolt',
  icon_image_url: '' as string,
  icon_cloudinary_id: '' as string,
  gradient: 'from-amber-400 to-orange-500',
  sort_order: 0,
  is_active: true,
};

type IconMode = 'preset' | 'image';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState<Service | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [featureInput, setFeatureInput] = useState('');
  const [iconMode, setIconMode] = useState<IconMode>('preset');
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', ...(search && { search }) });
      const res = await fetch(`/api/admin/services?${params}`);
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const resetForm = () => {
    setFormData(initialFormState);
    setSelected(null);
    setFeatureInput('');
    setIconMode('preset');
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (f: string) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((x) => x !== f) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'services');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData((prev) => ({
          ...prev,
          icon_image_url: data.data.url,
          icon_cloudinary_id: data.data.publicId,
        }));
        toast.success('Image uploaded');
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
      // If preset mode, drop any uploaded image so the preset icon is used.
      const payload = {
        ...formData,
        sort_order: Number(formData.sort_order) || 0,
        icon_image_url: iconMode === 'image' ? formData.icon_image_url || null : null,
        icon_cloudinary_id: iconMode === 'image' ? formData.icon_cloudinary_id || null : null,
      };
      const url = selected ? `/api/admin/services/${selected.id}` : '/api/admin/services';
      const method = selected ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(selected ? 'Service updated' : 'Service created');
        setShowFormModal(false);
        resetForm();
        fetchServices();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save service');
      }
    } catch {
      toast.error('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (s: Service) => {
    setSelected(s);
    setFormData({
      title: s.title,
      slug: s.slug || '',
      short_desc: s.short_desc || '',
      description: s.description || '',
      features: s.features || [],
      icon_name: s.icon_name || 'bolt',
      icon_image_url: s.icon_image_url || '',
      icon_cloudinary_id: s.icon_cloudinary_id || '',
      gradient: s.gradient || 'from-amber-400 to-orange-500',
      sort_order: s.sort_order || 0,
      is_active: s.is_active,
    });
    setIconMode(s.icon_image_url ? 'image' : 'preset');
    setShowFormModal(true);
    setActionMenuId(null);
  };

  const handleToggleActive = async (s: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !s.is_active }),
      });
      if (res.ok) {
        toast.success(s.is_active ? 'Service hidden' : 'Service published');
        fetchServices();
      }
    } catch {
      toast.error('Failed to update service');
    }
    setActionMenuId(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/services/${selected.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Service deleted');
        fetchServices();
        setShowDeleteModal(false);
        setSelected(null);
      }
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Services Management</h1>
          <p className="text-gray-400 mt-1">Manage the services shown on your website</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search services..."
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
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] text-gray-400">
            <LayoutGrid className="w-12 h-12 mb-4" />
            <p>No services found</p>
            <button onClick={() => { resetForm(); setShowFormModal(true); }} className="mt-4 text-amber-400 hover:text-amber-300">
              Create your first service
            </button>
          </div>
        ) : (
          services.map((s) => {
            const IconComp = getServiceIcon(s.icon_name);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-[#4f2e88]/50 rounded-xl border border-[#5e3a9e] hover:border-[#6d47b0] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center flex-none`}>
                      {s.icon_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.icon_image_url} alt={s.title} className="w-7 h-7 object-contain" />
                      ) : (
                        <IconComp className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {s.is_active ? 'Active' : 'Hidden'}
                        </span>
                        <span className="text-xs text-gray-500">#{s.sort_order}</span>
                      </div>
                      <p className="text-sm text-gray-400">{s.short_desc}</p>
                      {s.features && s.features.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">{s.features.length} features</p>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === s.id ? null : s.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#5e3a9e] rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {actionMenuId === s.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#4f2e88] rounded-xl border border-[#5e3a9e] shadow-xl z-10">
                        <button onClick={() => handleEdit(s)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2 rounded-t-xl">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => handleToggleActive(s)} className="w-full px-4 py-3 text-left text-sm text-white hover:bg-[#5e3a9e] flex items-center gap-2">
                          {s.is_active ? (<><EyeOff className="w-4 h-4" /> Hide</>) : (<><Eye className="w-4 h-4" /> Publish</>)}
                        </button>
                        <button
                          onClick={() => { setSelected(s); setShowDeleteModal(true); setActionMenuId(null); }}
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-[#5e3a9e] flex items-center gap-2 rounded-b-xl"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); resetForm(); }}
        title={selected ? 'Edit Service' : 'Create New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. Career-related services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Slug (auto if blank)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="e.g. career-services"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
            <input
              type="text"
              value={formData.short_desc}
              onChange={(e) => setFormData((p) => ({ ...p, short_desc: e.target.value }))}
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="One-line summary shown under the title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Full service description..."
            />
          </div>

          {/* Icon selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="radio" checked={iconMode === 'preset'} onChange={() => setIconMode('preset')} className="text-amber-500 focus:ring-amber-500" />
                Preset icon
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="radio" checked={iconMode === 'image'} onChange={() => setIconMode('image')} className="text-amber-500 focus:ring-amber-500" />
                Upload image
              </label>
            </div>
            {iconMode === 'preset' ? (
              <select
                value={formData.icon_name}
                onChange={(e) => setFormData((p) => ({ ...p, icon_name: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {SERVICE_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <div className="border-2 border-dashed border-[#6d47b0] rounded-xl p-4 flex items-center gap-4">
                {formData.icon_image_url ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.icon_image_url} alt="icon" className="w-14 h-14 object-contain rounded-lg bg-white p-1" />
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, icon_image_url: '', icon_cloudinary_id: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}
                <label className="cursor-pointer flex items-center gap-2 text-amber-400 hover:text-amber-300">
                  <Upload className="w-5 h-5" />
                  {uploading ? 'Uploading...' : formData.icon_image_url ? 'Replace image' : 'Upload image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gradient</label>
              <select
                value={formData.gradient}
                onChange={(e) => setFormData((p) => ({ ...p, gradient: e.target.value }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {SERVICE_GRADIENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort Order</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="flex-1 px-4 py-2 bg-[#5e3a9e] border border-[#6d47b0] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Add a feature..."
              />
              <button type="button" onClick={handleAddFeature} className="px-4 py-2 bg-[#6d47b0] text-white rounded-lg hover:bg-[#7d55c0] transition-colors">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((f) => (
                <span key={f} className="flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                  {f}
                  <button type="button" onClick={() => handleRemoveFeature(f)} className="hover:text-amber-200">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="svc_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
              className="w-4 h-4 rounded border-[#6d47b0] text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="svc_is_active" className="text-sm text-gray-300">Active (visible on services page)</label>
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
              {isSubmitting ? 'Saving...' : selected ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelected(null); }}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service? It will be removed from the website."
        confirmText="Delete"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}
