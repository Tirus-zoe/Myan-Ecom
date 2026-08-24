import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Plus, Search } from 'lucide-react';
import { getTheme } from '../../utils/theme';
import { ProductFormModal } from '../../components/admin/products/ProductFormModal';
import { ProductListItem } from '../../components/admin/products/ProductListItem';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    shopInfo,
  } = useStore();
  const theme = getTheme(shopInfo.themeColor);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productData,
      });
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600 font-medium"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className={`w-full sm:w-auto px-4 py-2 ${theme.primaryBg} ${theme.primaryHover} text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all`}
        >
          <Plus size={15} />
          <span>Add New Product (ပစ္စည်းအသစ်ထည့်)</span>
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-2">
        {filtered.map((p) => (
          <ProductListItem
            key={p.id}
            product={p}
            shopInfo={shopInfo}
            onEdit={handleOpenEdit}
            onDelete={deleteProduct}
            onToggleStock={toggleProductStock}
          />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400 text-xs">
            No products found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        shopInfo={shopInfo}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
