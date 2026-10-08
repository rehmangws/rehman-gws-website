import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import {
  signInAdminWithEmail,
  signInWithGoogle,
  resetAdminPassword,
} from '../lib/firebase';
import { ActiveView } from './Navbar';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onNavigate: (view: ActiveView) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('rehmanglobal.contact@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your Admin Email and Password.');
      return;
    }

    setLoading(true);
    try {
      await signInAdminWithEmail(email, password, rememberMe);
      onLoginSuccess();
    } catch (err: any) {
      const code = err?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        setErrorMsg(
          'Invalid email or password. You may also sign in with your authorized Google Admin account below.'
        );
      } else {
        setErrorMsg(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setResetSuccessMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle(rememberMe);
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Google Admin authentication was cancelled or failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your Admin Email address to receive a reset link.');
      return;
    }

    setLoading(true);
    try {
      await resetAdminPassword(email);
      setResetSuccessMsg(
        `Password reset instructions have been sent to ${email.trim()}.`
      );
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          'Unable to send password reset email. Verify your admin email address.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-brand-hero bg-subtle-grid flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>

        <div className="brand-glass-card rounded-2xl p-7 sm:p-9 border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A66FF] via-[#38BDF8] to-[#F59E0B]" />

          {/* Original REHMAN GWS Logo */}
          <div className="flex flex-col items-center text-center mb-7">
            <BrandLogo size="header" showText={false} showUploadHelper={false} />
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A66FF]/15 border border-[#0A66FF]/35 text-[11px] font-semibold text-[#38BDF8]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>REHMAN GWS · Private Executive Portal</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white mt-3">
              {forgotPasswordMode ? 'Admin Password Recovery' : 'Admin Sign In'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {forgotPasswordMode
                ? 'Enter your authorized admin email to receive a password reset link.'
                : 'Restricted access for authorized REHMAN GWS management personnel only.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSuccessMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{resetSuccessMsg}</span>
            </div>
          )}

          {!forgotPasswordMode ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rehmanglobal.contact@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050811]/90 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-semibold text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordMode(true);
                      setErrorMsg(null);
                      setResetSuccessMsg(null);
                    }}
                    className="text-[11px] font-medium text-[#38BDF8] hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-11 py-2.5 bg-[#050811]/90 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-[#050811] text-[#0A66FF] focus:ring-[#0A66FF]"
                  />
                  <span>Remember Me</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  TLS Encrypted
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 bg-[#0A66FF] hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-[0_0_25px_-5px_rgba(10,102,255,0.65)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-500">
                  Or Verified Google Admin
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-xl text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In with Google Workspace / Admin Account</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-admin-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Authorized Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rehmanglobal.contact@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050811]/90 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 bg-[#0A66FF] hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setForgotPasswordMode(false);
                  setErrorMsg(null);
                  setResetSuccessMsg(null);
                }}
                className="w-full py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Back to Admin Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
