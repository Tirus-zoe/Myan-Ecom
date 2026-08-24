import React, { useState } from 'react';
import { Globe, Check, Copy, ExternalLink, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { ShopInfo } from '../../../types';

interface CustomDomainCardProps {
  shopInfo: ShopInfo;
  onSave: (updated: ShopInfo) => Promise<void>;
}

export const CustomDomainCard: React.FC<CustomDomainCardProps> = ({ shopInfo, onSave }) => {
  const [domain, setDomain] = useState(shopInfo.customDomain || '');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveDomain = async () => {
    setIsSaving(true);
    try {
      const cleanDomain = domain.trim().toLowerCase();
      await onSave({
        ...shopInfo,
        customDomain: cleanDomain || undefined,
        domainStatus: cleanDomain ? 'active' : 'not_configured',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="sec-domain" className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Globe size={17} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Custom Domain Connection</h3>
            <p className="text-[10px] text-gray-500">Connect your own brand domain (e.g. shop.mybrand.com)</p>
          </div>
        </div>

        {shopInfo.customDomain && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              shopInfo.domainStatus === 'active'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {shopInfo.domainStatus === 'active' ? (
              <ShieldCheck size={12} className="text-emerald-600" />
            ) : (
              <Clock size={12} className="text-amber-600" />
            )}
            {shopInfo.domainStatus === 'active' ? 'Connected' : 'Pending DNS'}
          </span>
        )}
      </div>

      {/* Input */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold text-gray-700">
          Your Domain Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="shop.yourbrand.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none font-mono text-xs text-gray-800"
          />
          <button
            onClick={handleSaveDomain}
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-colors shrink-0 shadow-xs"
          >
            {isSaving ? 'Saving...' : 'Update Domain'}
          </button>
        </div>
        {saveSuccess && (
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <Check size={13} /> Domain setting saved successfully!
          </p>
        )}
      </div>

      {/* DNS Records Box */}
      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2.5">
        <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-indigo-600" />
          DNS Record Instructions (Cloudflare / Namecheap / GoDaddy)
        </div>

        {/* CNAME */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              CNAME Record (Subdomain)
            </span>
            <button
              onClick={() => copyToClipboard('cname.smartcatalog.shop', 'cname')}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-[10px]"
            >
              {copiedType === 'cname' ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
              {copiedType === 'cname' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-600">
            <div>Host: <span className="text-slate-900 font-semibold">shop</span></div>
            <div>Target: <span className="text-slate-900 font-semibold">cname.smartcatalog.shop</span></div>
          </div>
        </div>

        {/* A Record */}
        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              A Record (Apex Domain)
            </span>
            <button
              onClick={() => copyToClipboard('34.149.208.55', 'a_record')}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 text-[10px]"
            >
              {copiedType === 'a_record' ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
              {copiedType === 'a_record' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-600">
            <div>Host: <span className="text-slate-900 font-semibold">@</span></div>
            <div>IP: <span className="text-slate-900 font-semibold">34.149.208.55</span></div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 leading-normal">
          • Auto-provisioned SSL certificate enabled for all verified custom domains.
        </p>
      </div>

      {/* Test Link if active */}
      {shopInfo.customDomain && (
        <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-xs">
          <div>
            <div className="font-semibold text-[11px]">Preview via Custom Domain Query</div>
            <div className="text-[10px] text-emerald-700 font-mono">/?domain={shopInfo.customDomain}</div>
          </div>
          <a
            href={`/?domain=${shopInfo.customDomain}`}
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 text-[10px]"
          >
            Visit <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
};
