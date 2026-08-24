import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomeBannerSlider } from '../../components/client/HomeBannerSlider';
import { CategoryPills } from '../../components/client/CategoryPills';
import { ProductCard } from '../../components/client/ProductCard';
import { ProductDetailModal } from '../../components/client/ProductDetailModal';
import { CheckoutModal } from '../../components/client/CheckoutModal';
import { Sparkles, Flame, ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';

export const HomePage: React.FC = () => {
  const { products, searchQuery, shopInfo } = useStore();
  const navigate = useNavigate();

  const [directCheckoutItem, setDirectCheckoutItem] = useState<{
    product: Product;
    quantity: number;
    color?: string;
  } | null>(null);

  // Filter products by search if query exists
  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const bestSellers = products.filter((p) => p.isBestSeller);
  const popularProducts = products.filter((p) => p.isPopular);

  const handleQuickOrder = (product: Product) => {
    setDirectCheckoutItem({ product, quantity: 1, color: product.colors?.[0] });
  };

  return (
    <div className="pb-24 px-4 max-w-md mx-auto">
      {/* If search query is active, show search results */}
      {searchQuery ? (
        <div className="pt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">
              Search Results for "{searchQuery}" ({filteredProducts.length})
            </h2>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-6 border border-gray-100">
              <p className="text-gray-500 text-sm">No items found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickOrder={handleQuickOrder} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Promo Banner Slider */}
          <HomeBannerSlider />

          {/* Categories Horizontal Selector */}
          <CategoryPills showTitle={true} navigateToCategoryPage={true} />

          {/* Best Seller Section */}
          {bestSellers.length > 0 && (
            <section className="my-4">
              <div className="flex items-center justify-between mb-2.5 px-1">
                <div className="flex items-center gap-1.5">
                  <Flame size={18} className="text-rose-500 fill-rose-500" />
                  <h2 className="text-base font-bold text-gray-900">Best Sellers</h2>
                </div>
                <button
                  onClick={() => navigate('/categories')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                >
                  <span>More</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {bestSellers.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} onQuickOrder={handleQuickOrder} />
                ))}
              </div>
            </section>
          )}

          {/* Popular Products / All Catalog Items */}
          <section className="my-4">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={18} className="text-amber-500" />
                <h2 className="text-base font-bold text-gray-900">Popular Products</h2>
              </div>
              <button
                onClick={() => navigate('/categories')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View All ({products.length})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {popularProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} onQuickOrder={handleQuickOrder} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        onDirectCheckout={(prod, qty, col) => {
          setDirectCheckoutItem({ product: prod, quantity: qty, color: col });
        }}
      />

      {/* Instant Checkout Modal */}
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
