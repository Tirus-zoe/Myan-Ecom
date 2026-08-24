import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Store, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { getTheme } from '../../utils/theme';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, shopInfo, selectedProduct, currentCustomer } = useStore();
  const theme = getTheme(shopInfo.themeColor);

  // Auto-hide bottom bar when product detail modal is active
  if (selectedProduct) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/categories', label: 'Category', icon: LayoutGrid },
    { path: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { path: '/shop-info', label: 'Shop Info', icon: Store },
    { path: '/profile', label: currentCustomer ? 'Account' : 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-2xl px-3 py-2 flex items-center justify-around pointer-events-auto rounded-t-3xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              id={`nav-item-${item.label.toLowerCase()}`}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? `${theme.primaryText} font-semibold`
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <div
                className={`relative p-1 sm:p-1.5 rounded-xl transition-all ${
                  isActive ? `${theme.primaryLightBg} ${theme.primaryText} scale-105 sm:scale-110` : ''
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
