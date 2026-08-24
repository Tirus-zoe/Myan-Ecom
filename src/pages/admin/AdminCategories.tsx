import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { DynamicIcon } from '../../components/common/DynamicIcon';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Armchair');
  const [imageUrl, setImageUrl] = useState('');

  const openAdd = () => {
    setName('');
    setIcon('Armchair');
    setImageUrl('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80');
    setIsAdding(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setImageUrl(cat.imageUrl || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      addCategory({
        name,
        icon,
        imageUrl: imageUrl || undefined,
      });
      setIsAdding(false);
    } else if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name,
        icon,
        imageUrl: imageUrl || undefined,
      });
      setEditingCategory(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Categories ({categories.length})
        </h2>
        <button
          onClick={openAdd}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow"
        >
          <Plus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <DynamicIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-gray-900">{cat.name}</h3>
                  <span className="text-[11px] text-gray-500">{count} products assigned</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete category "${cat.name}"?`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {(isAdding || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900">
                {isAdding ? 'Add Category' : 'Edit Category'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingCategory(null);
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Icon Name (Lucide)</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-medium"
                >
                  <option value="Armchair">Armchair (Sofa)</option>
                  <option value="Chair">Chair</option>
                  <option value="Table">Table / Desk</option>
                  <option value="Layers">Cabinet / Layers</option>
                  <option value="Lamp">Lamp / Decor</option>
                  <option value="ShoppingBag">Shopping Bag</option>
                  <option value="Bed">Bed / Bedroom</option>
                  <option value="Sparkles">Sparkles / Special</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow mt-2"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
