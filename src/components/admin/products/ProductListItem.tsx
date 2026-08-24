import React from 'react';
import { Product, ShopInfo } from '../../../types';
import { Edit2, Trash2, Check, X, Flame } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

interface ProductListItemProps {
  product: Product;
  shopInfo: ShopInfo;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleStock: (id: string) => void;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  shopInfo,
  onEdit,
  onDelete,
  onToggleStock,
}) => {
  const theme = getTheme(shopInfo.themeColor);

  return (
    <div className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-gray-300 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative border border-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isBestSeller && (
            <span className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded-md text-[8px] font-bold">
              <Flame size={10} />
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{product.name}</h4>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-gray-100 text-gray-600">
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className={`font-bold text-xs ${theme.primaryText}`}>
              {product.price.toLocaleString()} {shopInfo.currencySymbol}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} {shopInfo.currencySymbol}
              </span>
            )}
            <span className="text-[10px] text-gray-400">| Stock: {product.stockCount}</span>
            {product.variants && product.variants.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md">
                {product.variants.length} types
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => onToggleStock(product.id)}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-colors ${
            product.inStock
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
          }`}
        >
          {product.inStock ? <Check size={10} /> : <X size={10} />}
          <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </button>

        <button
          onClick={() => onEdit(product)}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 size={13} />
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
