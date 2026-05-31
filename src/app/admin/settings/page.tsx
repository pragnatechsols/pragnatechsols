'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Shield, Plus, Trash2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function SettingsPage() {
  // Profile state
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Admin management state (super admin only)
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [canCreateMore, setCanCreateMore] = useState(false);
  const [additionalAdminsCount, setAdditionalAdminsCount] = useState(0);
  const [maxAdditionalAdmins, setMaxAdditionalAdmins] = useState(3);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Fetch current user profile
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.data);
        setName(data.data.name);
      }
    } catch {
      console.error('Failed to fetch profile');
    }
  }, []);

  // Fetch admins list (super admin only)
  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings/admins');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data.admins);
        setCanCreateMore(data.data.canCreateMore);
        setAdditionalAdminsCount(data.data.additionalAdminsCount);
        setMaxAdditionalAdmins(data.data.maxAdditionalAdmins);
      }
    } catch {
      // Not super admin or error
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchAdmins();
  }, [fetchProfile, fetchAdmins]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    setIsUpdatingProfile(true);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Profile updated successfully');
        fetchProfile();
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsUpdatingPassword(true);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to update password');
      }
    } catch {
      toast.error('Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminEmail || !newAdminPassword || !newAdminName) {
      toast.error('All fields are required');
      return;
    }

    if (newAdminPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsCreatingAdmin(true);
    
    try {
      const res = await fetch('/api/admin/settings/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newAdminEmail,
          password: newAdminPassword,
          name: newAdminName,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Admin created successfully');
        setNewAdminEmail('');
        setNewAdminPassword('');
        setNewAdminName('');
        setShowCreateForm(false);
        fetchAdmins();
      } else {
        toast.error(data.error || 'Failed to create admin');
      }
    } catch {
      toast.error('Failed to create admin');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/settings/admins?id=${adminId}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Admin deleted successfully');
        fetchAdmins();
      } else {
        toast.error(data.error || 'Failed to delete admin');
      }
    } catch {
      toast.error('Failed to delete admin');
    }
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <User className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
              <p className="text-sm text-gray-400">Update your profile information</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button 
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
              {currentUser?.role && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              )}
            </div>
          </form>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Lock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-gray-400">Change your password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-6 py-2 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </motion.div>

        {/* Admin Management - Super Admin Only */}
        {isSuperAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Admin Management</h2>
                  <p className="text-sm text-gray-400">
                    Manage admin users ({additionalAdminsCount}/{maxAdditionalAdmins} additional admins)
                  </p>
                </div>
              </div>
              {canCreateMore && !showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Admin
                </button>
              )}
            </div>

            {/* Create Admin Form */}
            {showCreateForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleCreateAdmin}
                className="mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600"
              >
                <h3 className="text-white font-medium mb-4">Create New Admin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Admin name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Min 8 characters"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isCreatingAdmin}
                    className="px-6 py-2 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewAdminEmail('');
                      setNewAdminPassword('');
                      setNewAdminName('');
                    }}
                    className="px-6 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}

            {/* Admins List */}
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${admin.role === 'super_admin' ? 'bg-yellow-500/20' : 'bg-slate-600'}`}>
                      {admin.role === 'super_admin' ? (
                        <Shield className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <UserCheck className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      admin.role === 'super_admin' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-slate-600 text-gray-300'
                    }`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                    {admin.role !== 'super_admin' && (
                      <button
                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {admins.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No admins found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
