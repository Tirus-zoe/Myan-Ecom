import React, { useState } from 'react';
import { Store, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

interface VendorLoginProps {
  onSuccess?: () => void;
}

export const VendorLogin: React.FC<VendorLoginProps> = ({ onSuccess }) => {
  const { loginVendor } = useAuth();
  const { vendors, setActiveVendorBySlug } = useStore();
  const [username, setUsername] = useState('vendor1');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginVendor(username, password, vendors);
      setIsLoading(false);
      if (res.success) {
        // Also sync active vendor slug in store context
        const matched = vendors.find(
          (v) => v.username.toLowerCase() === username.trim().toLowerCase()
        );
        if (matched) {
          setActiveVendorBySlug(matched.slug);
        }
        onSuccess?.();
      } else {
        setError(res.message || 'Invalid username or password');
      }
    }, 400);
  };

  const handleQuickSelect = (v: typeof vendors[0]) => {
    setUsername(v.username);
    setPassword(v.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500/40 rounded-2xl mx-auto flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Vendor Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Products, Orders & Storefront</p>
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
              Vendor Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="vendor username"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Quick Select Demo Accounts */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-400">
              Quick Select Demo Vendor:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {vendors.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleQuickSelect(v)}
                  className={`p-2 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                    username === v.username
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                      : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {v.logoUrl ? (
                      <img src={v.logoUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-[10px] flex items-center justify-center text-white">
                        {v.shopName.charAt(0)}
                      </span>
                    )}
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{v.shopName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">user: {v.username}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                    Select
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            {isLoading ? 'Signing in...' : 'Sign In to Vendor Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <a
            href="/superadmin"
            className="text-slate-300 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Super Admin
          </a>
          <a
            href="/"
            className="text-slate-300 hover:text-emerald-300 transition-colors"
          >
            Storefront →
          </a>
        </div>
      </div>
    </div>
  );
};
