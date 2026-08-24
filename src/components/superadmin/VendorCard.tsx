import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  LogIn,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Key,
  Shield,
  Edit2,
  Trash2,
  Power,
  Copy,
  Check,
} from 'lucide-react';
import { Vendor } from '../../types';

interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
  onToggleStatus: (vendorId: string) => void;
  onConfigureDomain: (vendor: Vendor) => void;
  onImpersonate: (vendor: Vendor) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onEdit,
  onDelete,
  onToggleStatus,
  onConfigureDomain,
  onImpersonate,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyStoreUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/?store=${vendor.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all shadow-sm ${
        vendor.status === 'suspended'
          ? 'border-rose-200/80 bg-rose-50/20 opacity-80'
          : 'border-slate-200/90 hover:border-indigo-300'
      }`}
    >
      <div className="p-4">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {vendor.logoUrl ? (
              <img
                src={vendor.logoUrl}
                alt={vendor.shopName}
                className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-sm">
                {vendor.shopName.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 truncate">
                  {vendor.shopName}
                </h3>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    vendor.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      vendor.status === 'active' ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  />
                  {vendor.status === 'active' ? 'Active' : 'Suspended'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <span className="font-mono text-slate-600">/{vendor.slug}</span>
                {vendor.phone && <span>• {vendor.phone}</span>}
              </div>
            </div>
          </div>

          {/* Action toggle menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs text-slate-700">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(vendor);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    Edit Details
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onConfigureDomain(vendor);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Domain Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onToggleStatus(vendor.id);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Power
                      className={`w-3.5 h-3.5 ${
                        vendor.status === 'active' ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    />
                    {vendor.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(vendor.id);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Vendor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Custom Domain & Credentials Info */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
          {/* Custom Domain Badge */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100/80">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div className="truncate">
                {vendor.customDomain ? (
                  <span className="font-mono font-medium text-slate-800">
                    {vendor.customDomain}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">No custom domain linked</span>
                )}
              </div>
            </div>

            {vendor.customDomain ? (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0 ${
                  vendor.domainStatus === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {vendor.domainStatus === 'active' ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Clock className="w-3 h-3 text-amber-600" />
                )}
                {vendor.domainStatus === 'active' ? 'DNS Active' : 'DNS Pending'}
              </span>
            ) : (
              <button
                onClick={() => onConfigureDomain(vendor)}
                className="text-[11px] text-indigo-600 font-semibold hover:underline shrink-0"
              >
                + Connect
              </button>
            )}
          </div>

          {/* Login Credentials snippet */}
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Key className="w-3 h-3 text-slate-400" />
              <span>User: <span className="font-mono text-slate-700 font-medium">{vendor.username}</span></span>
            </div>
            <div className="text-slate-400">
              Pass: <span className="font-mono text-slate-600">{vendor.password}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <button
            onClick={() => onImpersonate(vendor)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
            Manage Shop
          </button>

          <a
            href={`/?store=${vendor.slug}`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            Live Store
          </a>
        </div>
      </div>
    </div>
  );
};
