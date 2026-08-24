import React, { useState } from 'react';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { QuickAddModal } from './QuickAddModal';
import { getTheme } from '../../utils/theme';

interface ProductCardProps {
  product: Product;
  onQuickOrder?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, shopInfo, isWishlisted, toggleWishlist } = useStore();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const theme = getTheme(shopInfo.themeColor);
  const wishlisted = isWishlisted ? isWishlisted(product.id) : false;

  const handleOpenQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setShowQuickAdd(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleWishlist) {
      toggleWishlist(product.id);
    }
  };

  return (
    <>
      <div
        id={`product-card-${product.id}`}
        onClick={() => setSelectedProduct(product)}
        className="group relative bg-white rounded-3xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
      >
        {/* Image and Badges */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-2.5">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/85 hover:bg-white backdrop-blur-md text-gray-400 hover:text-rose-500 transition-colors shadow-xs z-10"
          >
            <Heart
              size={15}
              className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}
            />
          </button>

          {/* Stock Status Pill */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.inStock ? (
              <span className={`${theme.badgeBg} backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
                In Stock ({product.stockCount})
              </span>
            ) : (
              <span className="bg-rose-500/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}

            {product.discountPercent && product.discountPercent > 0 && (
              <span className="bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm w-fit">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Sold / Rating tag */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-white/60">({product.soldCount} sold)</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`font-bold text-gray-900 text-sm line-clamp-1 group-hover:${theme.primaryText} transition-colors`}>
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
          </div>

          {/* Variants / Sub-items preview hint if any */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1 overflow-hidden">
              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md truncate">
                {product.variants.length} options available
              </span>
            </div>
          )}

          {/* Pricing and Add To Cart Button */}
          <div className="mt-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-baseline justify-between gap-1 mb-2">
              <span className={`text-sm sm:text-base font-extrabold ${theme.primaryText} whitespace-nowrap`}>
                {product.price.toLocaleString()} {shopInfo.currencySymbol}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through whitespace-nowrap">
                  {product.originalPrice.toLocaleString()} {shopInfo.currencySymbol}
                </span>
              )}
            </div>

            <button
              id={`add-to-cart-btn-${product.id}`}
              type="button"
              onClick={handleOpenQuickAdd}
              disabled={!product.inStock}
              className={`w-full py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                !product.inStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `${theme.primaryBg} text-white ${theme.primaryHover} active:scale-98 hover:shadow`
              }`}
              title="Add to Cart"
            >
              <ShoppingBag size={13} className="shrink-0" />
              <span className="whitespace-nowrap">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal Popup */}
      <QuickAddModal
        product={product}
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </>
  );
};
