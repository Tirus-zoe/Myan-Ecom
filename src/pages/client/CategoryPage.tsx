import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryPills } from '../../components/client/CategoryPills';
import { ProductCard } from '../../components/client/ProductCard';
import { ProductDetailModal } from '../../components/client/ProductDetailModal';
import { CheckoutModal } from '../../components/client/CheckoutModal';
import { ArrowUpDown, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { Product } from '../../types';

export const CategoryPage: React.FC = () => {
  const { products, categories, activeCategory, setActiveCategory } = useStore();
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular' | 'in-stock'>('default');
  const [directCheckoutItem, setDirectCheckoutItem] = useState<{
    product: Product;
    quantity: number;
    color?: string;
  } | null>(null);

  const selectedCatObj = categories.find((c) => c.id === activeCategory);

  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Filter by active category
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'in-stock') {
      list = list.filter((p) => p.inStock);
    }

    return list;
  }, [products, activeCategory, sortBy]);

  const handleQuickOrder = (product: Product) => {
    setDirectCheckoutItem({ product, quantity: 1, color: product.colors?.[0] });
  };

  return (
    <div className="pb-24 px-4 max-w-md mx-auto">
      {/* Category selector row */}
      <CategoryPills showTitle={false} />

      {/* Header and Filter Control */}
      <div className="flex items-center justify-between my-3 px-1">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            {activeCategory === 'all' ? 'All Catalog Items' : selectedCatObj?.name || 'Category'}
          </h2>
          <p className="text-xs text-gray-500">{displayedProducts.length} items found</p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1.5 rounded-2xl shadow-sm text-xs font-medium text-gray-700">
          <ArrowUpDown size={13} className="text-emerald-700" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none outline-none font-semibold text-gray-800 cursor-pointer"
          >
            <option value="default">Default Sort</option>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="in-stock">In-Stock Only</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-6 border border-gray-100 mt-2">
          <p className="text-gray-500 text-sm font-medium">No items found in this category.</p>
          <button
            onClick={() => setActiveCategory('all')}
            className="mt-3 px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl"
          >
            View All Categories
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-1">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickOrder={handleQuickOrder} />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        onDirectCheckout={(prod, qty, col) => {
          setDirectCheckoutItem({ product: prod, quantity: qty, color: col });
        }}
      />

      {/* Checkout Modal */}
      {directCheckoutItem && (
        <CheckoutModal
          isOpen={!!directCheckoutItem}
          onClose={() => setDirectCheckoutItem(null)}
          items={[
            {
              productId: directCheckoutItem.product.id,
              productName: directCheckoutItem.product.name,
              price: directCheckoutItem.product.price,
              quantity: directCheckoutItem.quantity,
              color: directCheckoutItem.color,
              imageUrl: directCheckoutItem.product.imageUrl,
            },
          ]}
          subtotal={directCheckoutItem.product.price * directCheckoutItem.quantity}
          onOrderSuccess={() => setDirectCheckoutItem(null)}
        />
      )}
    </div>
  );
};
