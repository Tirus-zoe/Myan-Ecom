import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Settings,
  Store,
  RotateCcw,
  Palette,
  Truck,
  CreditCard,
  Database,
  Sliders,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCategories } from './AdminCategories';
import { AdminBanners } from './AdminBanners';
import { AdminSettings } from './AdminSettings';
import { useNavigate } from 'react-router-dom';
import { getTheme } from '../../utils/theme';

export const AdminLayout: React.FC = () => {
  const { orders, products, resetAllData, shopInfo, vendors, activeVendor, setActiveVendorBySlug } = useStore();
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'orders' | 'categories' | 'banners'>('settings');
  const [isStoreSelectOpen, setIsStoreSelectOpen] = useState(false);
  const navigate = useNavigate();
  const theme = getTheme(shopInfo.themeColor);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const tabs = [
    {
      id: 'settings',
      label: 'Shop & Settings',
      sublabel: 'Themes, Logo, Deli, Pay',
      icon: Sliders,
      highlight: true,
    },
    {
      id: 'products',
      label: 'Products',
      sublabel: `${products.length} items & Sub-items`,
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
      sublabel: 'Category list',
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
        {/* Top Admin Bar */}
        <div className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {shopInfo.logoUrl ? (
                <img
                  src={shopInfo.logoUrl}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover border border-gray-700 bg-white/10"
                />
              ) : (
                <div className={`w-8 h-8 rounded-lg ${theme.primaryBg} flex items-center justify-center font-bold text-sm text-white`}>
                  AD
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>Admin Panel</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${theme.primaryBg} text-white`}>
                    PRO
                  </span>
                </h1>
                <span className="text-[11px] text-gray-400 truncate block max-w-[170px]">
                  {shopInfo.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo catalog data to default?')) {
                    resetAllData();
                  }
                }}
                title="Reset Sample Data"
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                <RotateCcw size={15} />
              </button>

              <button
                onClick={() => navigate('/')}
                className={`px-3 py-1.5 rounded-xl ${theme.primaryBg} ${theme.primaryHover} text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all`}
              >
                <Store size={14} />
                <span>Store View</span>
              </button>
            </div>
          </div>

          {/* Quick Shop Switcher Bar in Admin */}
          {vendors && vendors.length > 1 && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold shrink-0 mr-1">
                Shop:
              </span>
              {vendors.map((v) => {
                const isCur = activeVendor?.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveVendorBySlug(v.slug)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                      isCur
                        ? 'bg-white text-gray-900 font-bold shadow'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {v.logoUrl ? (
                      <img src={v.logoUrl} alt="" className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full bg-gray-600 text-[9px] flex items-center justify-center text-white">
                        {v.shopName.charAt(0)}
                      </span>
                    )}
                    <span className="truncate max-w-[130px]">{v.shopName}</span>
                    {isCur && <Sparkles size={11} className="text-amber-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
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
