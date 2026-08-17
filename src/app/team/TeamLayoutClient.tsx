'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ClipboardList, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import ToastProvider from '@/components/ui/ToastProvider';
import Modal from '@/components/ui/Modal';

interface TeamMemberSession {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export default function TeamLayoutClient({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<TeamMemberSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Public team routes that must not be behind the auth gate.
  const isPublicTeamRoute = pathname === '/team/login' || pathname === '/team/reset-password';

  useEffect(() => {
    if (isPublicTeamRoute) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/team/auth/me');
        if (res.ok) {
          const data = await res.json();
          setMember(data.data);
        } else {
          router.push('/team/login');
        }
      } catch {
        router.push('/team/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicTeamRoute]);

  const handleLogout = async () => {
    await fetch('/api/team/auth/logout', { method: 'POST' });
    router.push('/team/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPw(true);
    try {
      const res = await fetch('/api/team/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Password updated');
        setShowPwModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch {
      toast.error('Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  if (isPublicTeamRoute) {
    return (
      <>
        <ToastProvider />
        {children}
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#3d2063] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3d2063]">
      <ToastProvider />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#2e1a52]/95 backdrop-blur-sm border-b border-[#4f2e88]">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-[#3d2063]" />
            </div>
            <span className="text-white font-semibold">Team Portal</span>
          </div>
          <div className="flex items-center gap-3">
            {member && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#3d2063] font-bold">
                  {member.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white leading-tight">{member.name}</p>
                  {member.role && <p className="text-xs text-gray-400 leading-tight">{member.role}</p>}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowPwModal(true)}
              className="p-2 text-gray-400 hover:text-amber-400 transition-colors"
              title="Change password"
            >
              <KeyRound className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>

      {/* Change password modal */}
      <Modal isOpen={showPwModal} onClose={() => setShowPwModal(false)} title="Change Password">
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#5e3a9e] border border-[#6d47b0] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Re-enter new password"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPwModal(false)}
              className="flex-1 px-4 py-3 bg-[#5e3a9e] text-white rounded-xl font-medium hover:bg-[#6d47b0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changingPw}
              className="flex-1 px-4 py-3 bg-amber-500 text-[#3d2063] rounded-xl font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {changingPw ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
