import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category, ShopInfo } from '../../../types';
import { X, Flame } from 'lucide-react';
import { getTheme } from '../../../utils/theme';
import { ProductVariantsSection } from './ProductVariantsSection';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  shopInfo: ShopInfo;
  onSave: (productData: {
    name: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    category: string;
    description: string;
    imageUrl: string;
    stockCount: number;
    inStock: boolean;
    colors: string[];
    sizes?: string[];
    variants?: ProductVariant[];
    isBestSeller: boolean;
    isPopular: boolean;
  }) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
  shopInfo,
  onSave,
}) => {
  const theme = getTheme(shopInfo.themeColor);

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(100);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [category, setCategory] = useState(categories[0]?.id || 'sofa');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stockCount, setStockCount] = useState<number>(10);
  const [inStock, setInStock] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [colorsInput, setColorsInput] = useState('#D97706, #1E293B');
  const [sizesInput, setSizesInput] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || 0);
      setDiscountPercent(product.discountPercent || 0);
      setCategory(product.category);
      setDescription(product.description);
      setImageUrl(product.imageUrl);
      setStockCount(product.stockCount);
      setInStock(product.inStock);
      setIsBestSeller(!!product.isBestSeller);
      setIsPopular(!!product.isPopular);
      setColorsInput(product.colors ? product.colors.join(', ') : '');
      setSizesInput(product.sizes ? product.sizes.join(', ') : '');
      setVariants(product.variants ? [...product.variants] : []);
    } else {
      setName('');
      setPrice(100);
      setOriginalPrice(150);
      setDiscountPercent(33);
      setCategory(categories[0]?.id || 'sofa');
      setDescription('Modern minimalist furniture crafted with high durability.');
      setImageUrl('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80');
      setStockCount(10);
      setInStock(true);
      setIsBestSeller(false);
      setIsPopular(true);
      setColorsInput('#D97706, #1E293B');
      setSizesInput('');
      setVariants([]);
    }
  }, [product, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = colorsInput.split(',').map((c) => c.trim()).filter(Boolean);
    const sizes = sizesInput.split(',').map((s) => s.trim()).filter(Boolean);

    onSave({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent: discountPercent ? Number(discountPercent) : undefined,
      category,
      description,
      imageUrl,
      stockCount: Number(stockCount),
      inStock: Number(stockCount) > 0 && inStock,
      colors,
      sizes: sizes.length > 0 ? sizes : undefined,
      variants: variants.length > 0 ? variants : undefined,
      isBestSeller,
      isPopular,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-gray-900 text-base">
            {product ? 'Edit Product (ပစ္စည်းပြင်ဆင်ရန်)' : 'Add New Product (ပစ္စည်းအသစ်ထည့်ရန်)'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Product Name (အမည်) *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-semibold"
              placeholder="e.g. Minimalist Leather Sofa"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Base Price ({shopInfo.currencySymbol}) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-bold"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Original Price</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Discount %</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Category (အမျိုးအစား)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Stock Quantity (လက်ကျန်)</label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-bold"
              />
            </div>
          </div>

          {/* Sub-items / Variants Section Component */}
          <ProductVariantsSection
            variants={variants}
            onChange={setVariants}
            shopInfo={shopInfo}
          />

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Image URL (ဓာတ်ပုံလင့်ခ်)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-mono text-[10px]"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Description (ဖော်ပြချက်)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Colors (Hex / Comma)</label>
              <input
                type="text"
                value={colorsInput}
                onChange={(e) => setColorsInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[10px]"
                placeholder="#D97706, #1E293B"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Sizes (Comma separated)</label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
                placeholder="Small, Medium, Large"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="font-semibold text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded text-amber-600"
              />
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Flame size={12} className="text-amber-500" /> Best Seller
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="font-semibold text-gray-700">Popular</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 ${theme.primaryBg} ${theme.primaryHover} text-white rounded-xl font-bold shadow-md transition-all`}
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
