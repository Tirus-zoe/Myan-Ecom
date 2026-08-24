import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Sliders,
  Store,
  RotateCcw,
  LogOut,
  Globe,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AdminProducts } from '../admin/AdminProducts';
import { AdminOrders } from '../admin/AdminOrders';
import { AdminCategories } from '../admin/AdminCategories';
import { AdminBanners } from '../admin/AdminBanners';
import { AdminSettings } from '../admin/AdminSettings';
import { VendorLogin } from '../../components/vendor/VendorLogin';
import { getTheme } from '../../utils/theme';

export const VendorLayout: React.FC = () => {
  const { currentVendor, isVendorAuthenticated, logoutVendor } = useAuth();
  const { orders, products, resetAllData, shopInfo, setActiveVendorBySlug } = useStore();
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'orders' | 'categories' | 'banners'>('settings');

  // Synchronize active vendor slug in store context when vendor logs in
  useEffect(() => {
    if (currentVendor?.slug) {
      setActiveVendorBySlug(currentVendor.slug);
    }
  }, [currentVendor?.slug, setActiveVendorBySlug]);

  if (!isVendorAuthenticated || !currentVendor) {
    return <VendorLogin />;
  }

  const theme = getTheme(currentVendor.themeColor || shopInfo.themeColor);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const tabs = [
    {
      id: 'settings',
      label: 'Shop & Settings',
      sublabel: 'Domain, Themes, Deli',
      icon: Sliders,
      highlight: true,
    },
    {
      id: 'products',
      label: 'Products',
      sublabel: `${products.length} items & variants`,
      icon: Package,
      count: products.length,
    },
    {
      id: 'orders',
      label: 'Orders',
      sublabel: 'Customer Orders',
      icon: ShoppingBag,
      count: pendingOrdersCount,
      alert: pendingOrdersCount > 0,
    },
    {
      id: 'categories',
      label: 'Categories',
      sublabel: 'Catalog tags',
      icon: Grid,
    },
    {
      id: 'banners',
      label: 'Banners',
      sublabel: 'Promo sliders',
      icon: ImageIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-emerald-200 pb-20">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative flex flex-col">
        {/* Top Vendor App Bar */}
        <div className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {currentVendor.logoUrl || shopInfo.logoUrl ? (
                <img
                  src={currentVendor.logoUrl || shopInfo.logoUrl}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover border border-gray-700 bg-white/10 shrink-0"
                />
              ) : (
                <div className={`w-8 h-8 rounded-lg ${theme.primaryBg} flex items-center justify-center font-bold text-xs text-white shrink-0`}>
                  {currentVendor.shopName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-sm font-bold leading-tight flex items-center gap-1.5 truncate">
                  <span className="truncate">{currentVendor.shopName}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${theme.primaryBg} text-white shrink-0`}>
                    VENDOR
                  </span>
                </h1>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 truncate">
                  {currentVendor.customDomain ? (
                    <span className="text-indigo-400 font-mono flex items-center gap-0.5 truncate">
                      <Globe className="w-2.5 h-2.5" />
                      {currentVendor.customDomain}
                    </span>
                  ) : (
                    <span className="truncate">/{currentVendor.slug}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`/?store=${currentVendor.slug}`}
                target="_blank"
                rel="noreferrer"
                className={`px-2.5 py-1.5 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white text-xs font-semibold flex items-center gap-1 shadow transition-all`}
              >
                <Store size={13} />
                <span>Store</span>
              </a>

              <button
                onClick={logoutVendor}
                title="Logout"
                className="p-1.5 rounded-xl bg-gray-800 hover:bg-rose-900/40 text-gray-300 hover:text-rose-400 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar with Clear Badges */}
        <div className="bg-white border-b border-gray-200 px-3 py-2.5 sticky top-[53px] z-20 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-2xl text-xs font-bold flex-shrink-0 transition-all ${
                    isActive
                      ? `${theme.primaryBg} text-white shadow-md scale-[1.02]`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          tab.alert
                            ? 'bg-rose-500 text-white animate-pulse'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-normal mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                    {tab.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 flex-1">
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'banners' && <AdminBanners />}
        </div>
      </div>
    </div>
  );
};
