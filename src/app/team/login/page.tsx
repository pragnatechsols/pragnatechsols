'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ToastProvider from '@/components/ui/ToastProvider';

export default function TeamLoginPage() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/team/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('If that email is registered, a code has been sent.');
        setStep('code');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/team/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Login successful!');
        router.push('/team');
      } else {
        toast.error(data.error || 'Invalid or expired code');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mb-4">
              <span className="text-[#3d2063] font-bold text-2xl">P</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Team Login</h1>
            <p className="text-gray-400 mt-2">
              {step === 'email'
                ? 'Enter your email to receive a login code'
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#4f2e88] border border-[#5e3a9e] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#3d2063] rounded-xl font-semibold hover:from-amber-500 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Login Code'}
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                  Login Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="code"
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

              <motion.button
                type="submit"
                disabled={isLoading || code.length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#3d2063] rounded-xl font-semibold hover:from-amber-500 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Use a different email
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
