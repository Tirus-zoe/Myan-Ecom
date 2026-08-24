import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Edit3 } from 'lucide-react';
import { CartItem, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getTheme } from '../../utils/theme';

interface EditCartItemModalProps {
  item: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCartItemModal: React.FC<EditCartItemModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { updateCartItem, shopInfo } = useStore();
  const theme = getTheme(shopInfo.themeColor);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setSelectedColor(item.selectedColor);
      setSelectedVariant(item.selectedVariant);
      setSelectedSize(item.selectedSize);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const product = item.product;
  const currentUnitPrice = selectedVariant?.price !== undefined ? selectedVariant.price : product.price;
  const totalPrice = currentUnitPrice * quantity;

  const handleSave = () => {
    updateCartItem(item.id, {
      quantity,
      selectedColor,
      selectedVariant,
      selectedSize,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl ${theme.primaryLightBg} ${theme.primaryText} flex items-center justify-center`}>
              <Edit3 size={16} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Edit Cart Item</h2>
              <p className="text-[11px] text-gray-500">ရွေးချယ်ထားသော ပစ္စည်းကို ပြင်ဆင်မည်</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Item Header */}
          <div className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm truncate">{product.name}</h3>
              <p className="text-[11px] text-gray-500 capitalize">{product.category}</p>
              <div className={`mt-1 font-extrabold text-sm ${theme.primaryText}`}>
                {currentUnitPrice.toLocaleString()} {shopInfo.currencySymbol}
              </div>
            </div>
          </div>

          {/* Sub-Items / Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">
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
                        <span className="font-semibold text-gray-900 block truncate">{v.name}</span>
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
              <label className="font-bold text-gray-700 block">
                Select Size (အရွယ်အစား):
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
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
              <label className="font-bold text-gray-700 block">
                Select Color (အရောင်):
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
              <span className="font-semibold text-gray-600 block">Quantity (အရေအတွက်)</span>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-base text-gray-900 w-7 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 99, q + 1))}
                  className={`w-8 h-8 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center ${theme.primaryHover}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="font-semibold text-gray-500 block">Total</span>
              <span className={`text-base font-extrabold ${theme.primaryText}`}>
                {totalPrice.toLocaleString()} {shopInfo.currencySymbol}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm grid grid-cols-2 gap-2 sticky bottom-0 z-10 shrink-0 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-4 rounded-2xl font-bold text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`py-3.5 px-4 rounded-2xl font-bold text-xs text-white ${theme.primaryBg} ${theme.primaryHover} shadow-md transition-all flex items-center justify-center gap-1.5`}
          >
            <Check size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
