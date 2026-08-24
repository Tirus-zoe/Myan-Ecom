import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SuperAdminLoginProps {
  onSuccess?: () => void;
}

export const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({ onSuccess }) => {
  const { loginSuperAdmin } = useAuth();
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('super123456');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginSuperAdmin(username, password);
      setIsLoading(false);
      if (ok) {
        onSuccess?.();
      } else {
        setError('Invalid super admin credentials. (Default: superadmin / super123456)');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/40 rounded-2xl mx-auto flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Super Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-Vendor & Domain Management</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Super Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="superadmin"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 space-y-1">
            <div className="font-medium text-slate-300">Default Demo Credentials:</div>
            <div className="flex justify-between">
              <span>Username: <span className="text-indigo-300 font-mono">superadmin</span></span>
              <span>Password: <span className="text-indigo-300 font-mono">super123456</span></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            {isLoading ? 'Verifying...' : 'Login to Super Admin'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <a
            href="/vendor"
            className="text-slate-300 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5" />
            Vendor Admin
          </a>
          <a
            href="/"
            className="text-slate-300 hover:text-indigo-300 transition-colors"
          >
            Go to Storefront →
          </a>
        </div>
      </div>
    </div>
  );
};
