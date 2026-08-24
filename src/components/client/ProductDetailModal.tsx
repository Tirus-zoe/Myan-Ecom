import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, Plus, Minus, ShoppingBag, Check, Share2, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { getTheme } from '../../utils/theme';

interface ProductDetailModalProps {
  onDirectCheckout?: (product: Product, quantity: number, color?: string, variant?: ProductVariant, size?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ onDirectCheckout }) => {
  const { selectedProduct, setSelectedProduct, addToCart, shopInfo, cartCount } = useStore();
  const theme = getTheme(shopInfo.themeColor);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedImage(selectedProduct.imageUrl);
      setSelectedColor(selectedProduct.colors?.[0]);
      setSelectedVariant(selectedProduct.variants?.[0]);
      setSelectedSize(selectedProduct.sizes?.[0]);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const gallery = selectedProduct.galleryImages?.length
    ? selectedProduct.galleryImages
    : [selectedProduct.imageUrl];

  const currentUnitPrice = selectedVariant?.price !== undefined ? selectedVariant.price : selectedProduct.price;
  const currentOriginalPrice = selectedVariant?.originalPrice !== undefined ? selectedVariant.originalPrice : selectedProduct.originalPrice;
  const totalPrice = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    if (!selectedProduct.inStock) return;
    addToCart(selectedProduct, quantity, selectedColor, selectedVariant, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    if (!selectedProduct.inStock) return;
    if (onDirectCheckout) {
      onDirectCheckout(selectedProduct, quantity, selectedColor, selectedVariant, selectedSize);
    } else {
      addToCart(selectedProduct, quantity, selectedColor, selectedVariant, selectedSize);
      setSelectedProduct(null);
      navigate('/cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="font-bold text-gray-900 text-base">Product Details</h2>
          <button
            onClick={() => {
              setSelectedProduct(null);
              navigate('/cart');
            }}
            className="relative p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-700"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {/* Main Image */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
            <img
              src={selectedImage}
              alt={selectedProduct.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {/* Stock pill */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {selectedProduct.inStock ? (
                <span className={`${theme.badgeBg} backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
                  In Stock ({selectedProduct.stockCount} available)
                </span>
              ) : (
                <span className="bg-rose-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Out of Stock
                </span>
              )}
              {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
                <span className="bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow w-fit">
                  {selectedProduct.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === imgUrl ? `${theme.primaryBorder} ring-2 ${theme.primaryRing}` : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Metadata */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h1>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.primaryLightBg} ${theme.primaryText} uppercase tracking-wider`}>
                {selectedProduct.category}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={14} className={theme.primaryText} />
                <span>{selectedProduct.location || shopInfo.city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-900">{selectedProduct.rating} / 5</span>
                <span>({selectedProduct.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className={`font-semibold ${theme.primaryText}`}>{selectedProduct.soldCount} Sold</span>
            </div>
          </div>

          {/* Sub-Items / Variants (Admin Added) */}
          {selectedProduct.variants && selectedProduct.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Sub-Items / Options (အမျိုးအစား ရွေးရန်):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProduct.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const vPrice = v.price !== undefined ? v.price : selectedProduct.price;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all ${
                        isSelected
                          ? `${theme.primaryBorder} ${theme.primaryLightBg} ring-2 ${theme.primaryRing}`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">{v.name}</span>
                        <span className={`text-xs font-extrabold ${theme.primaryText}`}>
                          {vPrice.toLocaleString()} {shopInfo.currencySymbol}
                        </span>
                      </div>
                      {isSelected && <Check size={16} className={theme.primaryText} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes Selection */}
          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Available Sizes (အရွယ်အစား):
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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
          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
            <div>
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 block">
                Color Option (အရောင် ရွေးရန်):
              </label>
              <div className="flex items-center gap-2.5">
                {selectedProduct.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${
                      selectedColor === c
                        ? 'border-gray-900 ring-2 ring-gray-400 scale-110'
                        : 'border-white hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Description</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
          </div>

          {/* Quantity and Price Counter */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block font-medium">Quantity</span>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !selectedProduct.inStock}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-base text-gray-900 w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount || 99, q + 1))}
                  disabled={!selectedProduct.inStock || quantity >= (selectedProduct.stockCount || 99)}
                  className={`w-8 h-8 rounded-lg ${theme.primaryBg} text-white flex items-center justify-center ${theme.primaryHover} disabled:opacity-40`}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 block font-medium">Total Price</span>
              <span className={`text-lg font-extrabold ${theme.primaryText}`}>
                {totalPrice.toLocaleString()} {shopInfo.currencySymbol}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedProduct.inStock}
            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
              !selectedProduct.inStock
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white border-emerald-600'
                : `bg-white ${theme.primaryText} ${theme.primaryBorder} ${theme.primaryLightBg}`
            }`}
          >
            {addedAnimation ? <Check size={16} /> : <ShoppingBag size={16} />}
            <span>{addedAnimation ? 'Added!' : 'Add to Cart'}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!selectedProduct.inStock}
            className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all shadow-md ${
              !selectedProduct.inStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : `${theme.primaryBg} text-white ${theme.primaryHover}`
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
