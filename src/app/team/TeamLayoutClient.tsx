'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, ClipboardList } from 'lucide-react';
import ToastProvider from '@/components/ui/ToastProvider';

interface TeamMemberSession {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export default function TeamLayoutClient({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<TeamMemberSession | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/team/login') {
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
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/team/auth/logout', { method: 'POST' });
    router.push('/team/login');
  };

  if (pathname === '/team/login') {
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
    </div>
  );
}
