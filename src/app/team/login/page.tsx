'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ToastProvider from '@/components/ui/ToastProvider';

type Mode = 'password' | 'code' | 'forgot';

export default function TeamLoginPage() {
  const [mode, setMode] = useState<Mode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (payload: Record<string, string>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/team/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Login successful!');
        router.push('/team');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  const handleCodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, code });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/team/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('If that email is registered, a reset link has been sent.');
        setMode('password');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const subtitle =
    mode === 'password'
      ? 'Sign in with your email and password'
      : mode === 'code'
        ? 'Enter your email and the code from your admin'
        : 'Enter your email to receive a reset link';

  return (
    <div className="min-h-screen bg-[#3d2063] flex items-center justify-center px-4">
      <ToastProvider />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#2e1a52] rounded-2xl border border-[#4f2e88] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-4">
              <span className="text-[#3d2063] font-bold text-2xl">P</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Team Login</h1>
            <p className="text-gray-400 mt-2">{subtitle}</p>
          </div>

          {/* Email is common to all modes */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <EmailField email={email} setEmail={setEmail} />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <SubmitButton isLoading={isLoading} label="Sign In" />
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setMode('code')} className="text-gray-400 hover:text-white flex items-center gap-1">
                  <KeyRound className="w-4 h-4" /> Use admin code
                </button>
                <button type="button" onClick={() => setMode('forgot')} className="text-amber-400 hover:text-amber-300">
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {mode === 'code' && (
            <form onSubmit={handleCodeLogin} className="space-y-6">
              <EmailField email={email} setEmail={setEmail} />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Login Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white text-center text-2xl tracking-[0.4em] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="000000"
                  />
                </div>
              </div>
              <SubmitButton isLoading={isLoading || code.length !== 6} label="Sign In with Code" />
              <BackLink onClick={() => { setMode('password'); setCode(''); }} label="Back to password login" />
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-6">
              <EmailField email={email} setEmail={setEmail} />
              <SubmitButton isLoading={isLoading} label="Send Reset Link" />
              <BackLink onClick={() => setMode('password')} label="Back to login" />
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function EmailField({ email, setEmail }: { email: string; setEmail: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-12 pr-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          placeholder="you@example.com"
        />
      </div>
    </div>
  );
}

function SubmitButton({ isLoading, label }: { isLoading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#3d2063] rounded-xl font-semibold hover:from-amber-500 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Please wait...' : label}
    </motion.button>
  );
}

function BackLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}
