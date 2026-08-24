import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DynamicIcon } from '../common/DynamicIcon';
import { useNavigate } from 'react-router-dom';

interface CategoryPillsProps {
  showTitle?: boolean;
  navigateToCategoryPage?: boolean;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  showTitle = true,
  navigateToCategoryPage = false,
}) => {
  const { categories, activeCategory, setActiveCategory, products } = useStore();
  const navigate = useNavigate();

  const handleSelect = (catId: string) => {
    setActiveCategory(catId);
    if (navigateToCategoryPage) {
      navigate('/categories');
    }
  };

  return (
    <div className="my-3">
      {showTitle && (
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-base font-bold text-gray-900">Category</h2>
          <button
            onClick={() => {
              setActiveCategory('all');
              navigate('/categories');
            }}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            See All
          </button>
        </div>
      )}

      {/* Horizontal Scrollable Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
        {/* All Button */}
        <button
          onClick={() => handleSelect('all')}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              activeCategory === 'all'
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-300 scale-105'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <DynamicIcon name="LayoutGrid" className="w-6 h-6" />
          </div>
          <span
            className={`text-xs font-medium tracking-tight ${
              activeCategory === 'all' ? 'text-emerald-800 font-bold' : 'text-gray-600'
            }`}
          >
            All
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                  isSelected
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-300 scale-105'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <DynamicIcon name={cat.icon} className="w-6 h-6" />
              </div>
              <span
                className={`text-xs font-medium tracking-tight line-clamp-1 max-w-[70px] text-center ${
                  isSelected ? 'text-emerald-800 font-bold' : 'text-gray-600'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
