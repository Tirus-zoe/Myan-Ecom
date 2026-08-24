import React, { useState } from 'react';
import { Search, ShoppingBag, MapPin, X, ShieldCheck, Globe, ChevronDown, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTheme } from '../../utils/theme';
import { StoreSwitcherTabs } from './StoreSwitcherTabs';

export const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, cartCount, shopInfo, vendors, activeVendor, setActiveVendorBySlug } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = getTheme(shopInfo.themeColor);
  const [showVendorSwitcher, setShowVendorSwitcher] = useState(false);

  const isClientView = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/vendor') && !location.pathname.startsWith('/superadmin');

  const handleSelectVendor = (slug: string) => {
    setActiveVendorBySlug(slug);
    setShowVendorSwitcher(false);
    navigate(`/?store=${slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 pt-3 pb-3">
      {/* Top greeting and actions */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {shopInfo.logoUrl ? (
            <img
              src={shopInfo.logoUrl}
              alt={shopInfo.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm shrink-0"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${theme.primaryBg} flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0`}>
              {shopInfo.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            {/* Vendor Switcher Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowVendorSwitcher(!showVendorSwitcher)}
                className="flex items-center gap-1 group text-left max-w-full"
              >
                <h1 className="text-sm font-bold text-gray-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">
                  {shopInfo.name}
                </h1>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 shrink-0" />
              </button>

              {showVendorSwitcher && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowVendorSwitcher(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-gray-700">
                    <div className="px-2.5 py-1.5 font-bold text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                      Switch Storefront
                    </div>
                    <div className="py-1 space-y-0.5 max-h-52 overflow-y-auto">
                      {vendors.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => handleSelectVendor(v.slug)}
                          className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-colors ${
                            activeVendor.id === v.id
                              ? 'bg-gray-100 font-bold text-gray-900'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <div className="truncate">
                            <div className="truncate text-xs">{v.shopName}</div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {v.customDomain || `/${v.slug}`}
                            </div>
                          </div>
                          {activeVendor.id === v.id && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1.5 border-t border-gray-100 mt-1 flex flex-col gap-1">
                      <a
                        href="/vendor"
                        className="p-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5" />
                        Vendor Admin Login
                      </a>
                      <a
                        href="/superadmin"
                        className="p-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                        Super Admin Portal
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium truncate">
              {shopInfo.customDomain ? (
                <span className="text-indigo-600 font-mono text-[10px] flex items-center gap-0.5 truncate">
                  <Globe className="w-3 h-3 shrink-0" />
                  {shopInfo.customDomain}
                </span>
              ) : (
                <>
                  <MapPin size={12} className={theme.primaryText} />
                  <span className="truncate">{shopInfo.city}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/vendor')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-gray-900 text-white hover:bg-black transition-all shadow-xs"
          >
            <ShieldCheck size={13} />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      {isClientView && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items, categories, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-gray-100 hover:bg-gray-100/80 focus:bg-white text-xs text-gray-900 rounded-2xl border border-transparent focus:border-indigo-500 focus:outline-none transition-all placeholder:text-gray-400 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Direct Store Switcher Tabs */}
          <StoreSwitcherTabs />
        </div>
      )}
    </header>
  );
};
