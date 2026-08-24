import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, Star } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getTheme } from '../../utils/theme';

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart, shopInfo } = useStore();
  const theme = getTheme(shopInfo.themeColor);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedColor(product.colors?.[0]);
      setSelectedVariant(product.variants?.[0]);
      setSelectedSize(product.sizes?.[0]);
      setJustAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentUnitPrice = selectedVariant?.price !== undefined ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant?.originalPrice !== undefined ? selectedVariant.originalPrice : product.originalPrice;
  const totalPrice = currentUnitPrice * quantity;

  const handleConfirmAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity, selectedColor, selectedVariant, selectedSize);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
              <ShoppingBag size={17} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Add to Cart</h2>
              <p className="text-[11px] text-gray-500">ရွေးချယ်ထားသော ပစ္စည်းကို ခြင်းထဲထည့်မည်</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Product Header Card */}
          <div className="flex gap-3.5 bg-gray-50/90 p-3.5 rounded-2xl border border-gray-100">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
                  {product.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-base font-extrabold ${theme.primaryText}`}>
                  {currentUnitPrice.toLocaleString()} {shopInfo.currencySymbol}
                </span>
                {currentOriginalPrice && currentOriginalPrice > currentUnitPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {currentOriginalPrice.toLocaleString()} {shopInfo.currencySymbol}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  product.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {product.inStock ? `In Stock (${product.stockCount})` : 'Out of Stock'}
                </span>
                <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Items / Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Select Option / Sub-Item (အမျိုးအစား ရွေးရန်):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const vPrice = v.price !== undefined ? v.price : product.price;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? `${theme.primaryBorder} ${theme.primaryLightBg} ring-2 ${theme.primaryRing}`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-gray-900 block truncate">{v.name}</span>
                        <span className={`text-[11px] font-extrabold ${theme.primaryText}`}>
                          {vPrice.toLocaleString()} {shopInfo.currencySymbol}
                        </span>
                      </div>
                      {isSelected && <Check size={14} className={theme.primaryText} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Select Size (အရွယ်အစား ရွေးရန်):
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? `${theme.primaryBg} text-white ${theme.primaryBorder} shadow-sm scale-105`
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Select Color (အရောင် ရွေးရန်):
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full border-2 transition-all shadow-sm ${
                        isSelected
                          ? 'border-gray-900 ring-2 ring-gray-400 scale-110'
                          : 'border-white hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Stepper */}
          <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-600 block">Quantity (အရေအတွက်)</span>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !product.inStock}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40 shadow-sm"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-base text-gray-900 w-7 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 99, q + 1))}
                  disabled={!product.inStock || quantity >= (product.stockCount || 99)}
                  className={`w-8 h-8 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center ${theme.primaryHover} disabled:opacity-40 shadow-sm`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-gray-500 block">Subtotal</span>
              <span className={`text-base font-extrabold ${theme.primaryText}`}>
                {totalPrice.toLocaleString()} {shopInfo.currencySymbol}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Add Button - Fixed Sticky at Bottom */}
        <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm sticky bottom-0 z-10 shrink-0 shadow-lg">
          <button
            type="button"
            onClick={handleConfirmAddToCart}
            disabled={!product.inStock}
            className={`w-full py-4 px-5 rounded-2xl font-bold text-sm flex items-center justify-between shadow-lg transition-all ${
              !product.inStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white scale-[0.99]'
                : `${theme.primaryBg} text-white ${theme.primaryHover}`
            }`}
          >
            {justAdded ? (
              <div className="flex items-center justify-center gap-2 w-full">
                <Check size={20} />
                <span>Added to Cart! (ခြင်းထဲထည့်ပြီးပါပြီ)</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} />
                  <span>Add to Cart ({quantity} pcs)</span>
                </div>
                <div className="font-extrabold text-base">
                  {totalPrice.toLocaleString()} {shopInfo.currencySymbol}
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
