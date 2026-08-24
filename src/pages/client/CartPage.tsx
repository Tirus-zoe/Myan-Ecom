import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Trash2, Plus, Minus, ArrowLeft, CheckSquare, Square, ShoppingBag, ArrowRight, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CheckoutModal } from '../../components/client/CheckoutModal';
import { EditCartItemModal } from '../../components/client/EditCartItemModal';
import { CartItem } from '../../types';
import { getTheme } from '../../utils/theme';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    toggleCartItemSelect,
    selectAllCartItems,
    cartSelectedTotal,
    shopInfo,
  } = useStore();

  const navigate = useNavigate();
  const theme = getTheme(shopInfo.themeColor);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const allSelected = cart.length > 0 && cart.every((item) => item.selected);
  const selectedItems = cart.filter((item) => item.selected);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    setIsCheckoutOpen(true);
  };

  return (
    <div className="pb-32 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-3 mb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-bold text-gray-900">My Cart ({cart.length})</h1>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className={`w-16 h-16 ${theme.primaryLightBg} rounded-full flex items-center justify-center mx-auto ${theme.primaryText}`}>
            <ShoppingBag size={28} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Your Cart is Empty</h2>
            <p className="text-xs text-gray-500 mt-1">Explore our catalog and add items you like.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 ${theme.primaryBg} text-white rounded-2xl font-bold text-xs shadow-md ${theme.primaryHover} transition-colors`}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select All Toggle */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => selectAllCartItems(!allSelected)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700"
            >
              {allSelected ? (
                <CheckSquare size={18} className={theme.primaryText} />
              ) : (
                <Square size={18} className="text-gray-400" />
              )}
              <span>Select All Items ({selectedItems.length}/{cart.length})</span>
            </button>
          </div>

          {/* Items */}
          {cart.map((item) => {
            const unitPrice = item.selectedVariant?.price !== undefined ? item.selectedVariant.price : item.product.price;
            const lineTotal = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex items-center gap-3 transition-all hover:border-gray-200"
              >
                {/* Select Checkbox */}
                <button
                  onClick={() => toggleCartItemSelect(item.id)}
                  className={`text-gray-400 hover:${theme.primaryText} flex-shrink-0`}
                >
                  {item.selected ? (
                    <CheckSquare size={20} className={theme.primaryText} />
                  ) : (
                    <Square size={20} className="text-gray-300" />
                  )}
                </button>

                {/* Product Thumbnail */}
                <div
                  onClick={() => setEditingItem(item)}
                  className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer border border-gray-100"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3
                      onClick={() => setEditingItem(item)}
                      className="font-bold text-xs sm:text-sm text-gray-900 truncate cursor-pointer hover:underline"
                    >
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className={`p-1 text-gray-400 hover:${theme.primaryText} rounded-lg hover:bg-gray-50`}
                        title="Edit sub-items / size"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="text-gray-400 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50"
                        title="Delete item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Sub-item / Variant / Size / Color tags */}
                  <div className="flex flex-wrap items-center gap-1.5 my-1">
                    {item.selectedVariant && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.primaryLightBg} ${theme.primaryText}`}>
                        {item.selectedVariant.name}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="text-[10px] font-medium bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md">
                        Size: {item.selectedSize}
                      </span>
                    )}
                    {item.selectedColor && (
                      <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-200">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className={`font-extrabold text-xs sm:text-sm ${theme.primaryText}`}>
                      {lineTotal.toLocaleString()} {shopInfo.currencySymbol}
                    </span>

                    {/* Quantity adjustment */}
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold text-gray-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pricing Calculation Summary Box (Delivery Fee Removed per request, shown only at Checkout) */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2.5 mt-4">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Selected Items:</span>
              <span className="font-semibold text-gray-900">
                {selectedItems.reduce((acc, i) => acc + i.quantity, 0)} pcs ({selectedItems.length} lines)
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-sm">Subtotal:</span>
              <span className={`text-lg font-extrabold ${theme.primaryText}`}>
                {cartSelectedTotal.toLocaleString()} {shopInfo.currencySymbol}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 italic">
              * Delivery fee will be calculated at checkout based on your selected township.
            </p>
          </div>

          {/* Bottom Fixed Checkout Button */}
          <div className="pt-2">
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className={`w-full py-4 px-4 ${theme.primaryBg} ${theme.primaryHover} disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-2xl font-bold text-sm flex items-center justify-between shadow-lg transition-all`}
            >
              <span>Proceed to Checkout ({selectedItems.length})</span>
              <div className="flex items-center gap-1.5 font-extrabold">
                <span>{cartSelectedTotal.toLocaleString()} {shopInfo.currencySymbol}</span>
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Edit Cart Item Modal */}
      <EditCartItemModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={selectedItems.map((i) => {
          const unitPrice = i.selectedVariant?.price !== undefined ? i.selectedVariant.price : i.product.price;
          return {
            productId: i.product.id,
            productName: i.product.name,
            price: unitPrice,
            quantity: i.quantity,
            color: i.selectedColor,
            variantName: i.selectedVariant?.name,
            size: i.selectedSize,
            imageUrl: i.product.imageUrl,
          };
        })}
        subtotal={cartSelectedTotal}
        onOrderSuccess={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
