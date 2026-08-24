import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const StoreSwitcherTabs: React.FC = () => {
  const { vendors, activeVendor, setActiveVendorBySlug } = useStore();

  if (vendors.length <= 1) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1 mb-2 px-0.5">
      <div className="flex items-center gap-1.5 min-w-max">
        {vendors.map((v) => {
          const isActive = activeVendor.id === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActiveVendorBySlug(v.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm font-semibold'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80 shadow-2xs'
              }`}
            >
              {v.logoUrl ? (
                <img
                  src={v.logoUrl}
                  alt={v.shopName}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center text-[9px] font-bold">
                  {v.shopName.charAt(0)}
                </span>
              )}
              <span className="truncate max-w-[140px]">{v.shopName}</span>
              {isActive && <Sparkles size={11} className="text-amber-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
