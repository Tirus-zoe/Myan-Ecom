import React, { useState } from 'react';
import { X, Globe, Check, Copy, ShieldCheck, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { Vendor } from '../../types';

interface DomainSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSaveDomain: (vendorId: string, customDomain: string, status: 'active' | 'pending' | 'not_configured') => Promise<void>;
}

export const DomainSetupModal: React.FC<DomainSetupModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSaveDomain,
}) => {
  const [domain, setDomain] = useState(vendor?.customDomain || '');
  const [status, setStatus] = useState<'active' | 'pending' | 'not_configured'>(
    vendor?.domainStatus || 'active'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !vendor) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleVerifyAndSave = async () => {
    setIsVerifying(true);
    setTimeout(async () => {
      await onSaveDomain(vendor.id, domain.trim().toLowerCase(), domain.trim() ? 'active' : 'not_configured');
      setIsVerifying(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Custom Domain Setup</h2>
              <p className="text-[11px] text-slate-500">{vendor.shopName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Custom Domain Name
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. shop.mybrand.com or store.mybrand.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-slate-800 text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Supports both subdomains (e.g. shop.example.com) and apex domains (example.com).
            </p>
          </div>

          {/* DNS Configuration Instructions */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-3">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              DNS Records (Cloudflare / Namecheap / GoDaddy)
            </div>

            {/* Record 1: CNAME */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                  CNAME Record (Recommended)
                </span>
                <button
                  onClick={() => copyToClipboard('cname.smartcatalog.shop', 'cname')}
                  className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-[10px]"
                >
                  {copiedType === 'cname' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedType === 'cname' ? 'Copied' : 'Copy Value'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                <div>Host: <span className="text-slate-900 font-semibold">shop</span> or <span className="text-slate-900 font-semibold">@</span></div>
                <div>Target: <span className="text-slate-900 font-semibold">cname.smartcatalog.shop</span></div>
              </div>
            </div>

            {/* Record 2: A Record */}
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  A Record (Apex Domain)
                </span>
                <button
                  onClick={() => copyToClipboard('34.149.208.55', 'a_record')}
                  className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-[10px]"
                >
                  {copiedType === 'a_record' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedType === 'a_record' ? 'Copied' : 'Copy Value'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600">
                <div>Host: <span className="text-slate-900 font-semibold">@</span></div>
                <div>IP: <span className="text-slate-900 font-semibold">34.149.208.55</span></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1 leading-relaxed">
              <p>• SSL / TLS certificates are provisioned automatically via Let's Encrypt.</p>
              <p>• DNS propagation typically takes between 5 to 30 minutes.</p>
            </div>
          </div>

          {/* Test Link */}
          {domain.trim() && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900">
              <div>
                <div className="font-semibold">Simulated Custom Domain Route</div>
                <div className="text-[11px] text-emerald-700 font-mono">/?domain={domain.trim()}</div>
              </div>
              <a
                href={`/?domain=${domain.trim()}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-1 text-[11px]"
              >
                Test <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleVerifyAndSave}
            disabled={isVerifying}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-1.5 shadow-xs"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Verifying DNS...
              </>
            ) : (
              'Save & Apply'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
