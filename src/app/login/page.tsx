"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { motion } from 'framer-motion';
import { Cpu, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function LoginPage() {
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'VENDOR' | 'ADMIN'>('BUYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      if (isResetMode) {
        await resetPassword(email);
        setSuccess('A verification password reset link has been dispatched to your email.');
        setIsResetMode(false);
      } else {
        const success = await login(email, role);
        if (!success) {
          setError('Invalid credentials.');
        }
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle(role);
    } catch (err) {
      setError('Failed to authenticate with Google.');
      setLoading(false);
    }
  };

  // Helper to autofill roles for evaluation
  const setDemoCredentials = (type: 'buyer' | 'vendor' | 'admin') => {
    if (type === 'buyer') {
      setEmail('buyer@procure.ai');
      setRole('BUYER');
    } else if (type === 'vendor') {
      setEmail('vendor@procure.ai');
      setRole('VENDOR');
    } else {
      setEmail('admin@procure.ai');
      setRole('ADMIN');
    }
    setPassword('••••••••');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative grid-bg">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center space-x-2 justify-center mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center">
            <Cpu className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold dark:text-white">
            Procure<span className="text-brand-600 dark:text-brand-400 font-extrabold">AI</span>
          </span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {isResetMode ? 'Reset Password' : 'Sign in to platform'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Or{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">
            register a new enterprise account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-4 sm:px-10 rounded-3xl mx-4 sm:mx-0">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-455">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-455">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Role selection tab (only if not reset mode) */}
            {!isResetMode && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target Role Dashboard</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                  {(['BUYER', 'VENDOR', 'ADMIN'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        role === r
                          ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-900 dark:text-brand-400'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Password (only if not reset mode) */}
            {!isResetMode && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>
            )}

            {isResetMode && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
                >
                  Return to sign in
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl font-semibold shadow hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer pt-3"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{isResetMode ? 'Send Reset Link' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Social Sign-in Divider */}
          {!isResetMode && (
            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
              >
                {/* Simulated Google Logo */}
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google Account</span>
              </button>
            </div>
          )}

          {/* Quick evaluation tool */}
          {!isResetMode && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 text-center">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-brand-500/10 text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase mb-3">
                <Sparkles className="w-3 h-3 mr-0.5 animate-spin" /> Demo Quick Autofills
              </span>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setDemoCredentials('buyer')}
                  className="px-2.5 py-1 rounded bg-slate-150 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  Buyer Profile
                </button>
                <button
                  onClick={() => setDemoCredentials('vendor')}
                  className="px-2.5 py-1 rounded bg-slate-150 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  Vendor Profile
                </button>
                <button
                  onClick={() => setDemoCredentials('admin')}
                  className="px-2.5 py-1 rounded bg-slate-150 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  Platform Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
