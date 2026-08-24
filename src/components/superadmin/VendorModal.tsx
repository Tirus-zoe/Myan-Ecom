import React, { useState, useEffect } from 'react';
import { X, Globe, Lock, User, Store, Phone, Palette, Sparkles, Check } from 'lucide-react';
import { Vendor, ColorTheme } from '../../types';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendorData: any) => Promise<void>;
  initialVendor?: Vendor | null;
}

const THEME_OPTIONS: { value: ColorTheme; label: string; bg: string }[] = [
  { value: 'emerald', label: 'Emerald Green', bg: 'bg-emerald-500' },
  { value: 'rose', label: 'Rose Pink', bg: 'bg-rose-500' },
  { value: 'blue', label: 'Ocean Blue', bg: 'bg-blue-500' },
  { value: 'amber', label: 'Warm Amber', bg: 'bg-amber-500' },
  { value: 'purple', label: 'Royal Purple', bg: 'bg-purple-500' },
  { value: 'teal', label: 'Teal Cyan', bg: 'bg-teal-500' },
  { value: 'orange', label: 'Vibrant Orange', bg: 'bg-orange-500' },
  { value: 'slate', label: 'Classic Slate', bg: 'bg-slate-700' },
];

export const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVendor,
}) => {
  const [shopName, setShopName] = useState('');
  const [slug, setSlug] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [domainStatus, setDomainStatus] = useState<'active' | 'pending' | 'not_configured'>('active');
  const [themeColor, setThemeColor] = useState<ColorTheme>('emerald');
  const [phone, setPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialVendor) {
      setShopName(initialVendor.shopName);
      setSlug(initialVendor.slug);
      setUsername(initialVendor.username);
      setPassword(initialVendor.password);
      setCustomDomain(initialVendor.customDomain || '');
      setDomainStatus(initialVendor.domainStatus || (initialVendor.customDomain ? 'active' : 'not_configured'));
      setThemeColor(initialVendor.themeColor);
      setPhone(initialVendor.phone || '');
      setLogoUrl(initialVendor.logoUrl || '');
      setTagline(initialVendor.tagline || '');
      setStatus(initialVendor.status);
    } else {
      setShopName('');
      setSlug('');
      setUsername('');
      setPassword('password123');
      setCustomDomain('');
      setDomainStatus('active');
      setThemeColor('emerald');
      setPhone('');
      setLogoUrl('');
      setTagline('');
      setStatus('active');
    }
    setError(null);
  }, [initialVendor, isOpen]);

  // Auto slug generation from shop name for new vendors
  const handleShopNameChange = (val: string) => {
    setShopName(val);
    if (!initialVendor) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
      if (!username) {
        setUsername(generated.replace(/-/g, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !slug.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all required fields (Shop Name, Slug, Username, Password)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        ...(initialVendor ? { id: initialVendor.id, createdAt: initialVendor.createdAt } : {}),
        shopName: shopName.trim(),
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        customDomain: customDomain.trim() ? customDomain.trim().toLowerCase() : undefined,
        domainStatus: customDomain.trim() ? domainStatus : 'not_configured',
        themeColor,
        phone: phone.trim(),
        logoUrl: logoUrl.trim(),
        tagline: tagline.trim(),
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save vendor account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {initialVendor ? 'Edit Vendor Account' : 'Create New Vendor'}
            </h2>
            <p className="text-xs text-slate-500">
              {initialVendor ? 'Update shop details & custom domain' : 'Setup store access & credentials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Shop Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Shop Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={shopName}
                onChange={(e) => handleShopNameChange(e.target.value)}
                placeholder="e.g. Bella Glow Cosmetics"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          {/* URL Slug */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Store URL Slug <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="bg-slate-100 text-slate-500 px-2.5 py-2 border border-r-0 border-slate-200 rounded-l-xl font-mono text-[11px]">
                /?store=
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bella-glow"
                className="w-full px-3 py-2 border border-slate-200 rounded-r-xl focus:border-indigo-500 focus:outline-none font-mono text-slate-800"
                required
              />
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vendor Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="bellaglow"
                  className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:border-indigo-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vendor Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:border-indigo-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Custom Domain Option */}
          <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                Connect Custom Domain
              </label>
              <span className="text-[10px] text-indigo-600 font-medium">Optional</span>
            </div>

            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="e.g. shop.bellaglow.com or bellabeauty.store"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-indigo-500 focus:outline-none font-mono text-slate-800"
            />

            {customDomain.trim() && (
              <div className="flex items-center gap-3 pt-1">
                <label className="text-[11px] text-slate-600">Domain Status:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDomainStatus('active')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                      domainStatus === 'active'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Active / Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainStatus('pending')}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                      domainStatus === 'pending'
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Pending DNS
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Color Picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              Storefront Theme Accent
            </label>
            <div className="grid grid-cols-4 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setThemeColor(opt.value)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    themeColor === opt.value
                      ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${opt.bg}`} />
                  <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center">
                    {opt.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Phone & Logo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09 123 456 789"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white font-medium"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Logo Image URL (Optional)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-[11px]"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
            >
              {isSubmitting ? 'Saving...' : initialVendor ? 'Update Vendor' : 'Create Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
