import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PromoBanner } from '../../types';
import { Plus, Edit2, Trash2, X, Sparkles } from 'lucide-react';

export const AdminBanners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, categories } = useStore();
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('50% OFF SPECIAL');
  const [imageUrl, setImageUrl] = useState('');
  const [linkCategoryId, setLinkCategoryId] = useState('');

  const openAdd = () => {
    setTitle('Modern Luxury Living');
    setSubtitle('Special discount this week');
    setBadge('PROMO');
    setImageUrl('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop&q=80');
    setLinkCategoryId(categories[0]?.id || '');
    setIsAdding(true);
  };

  const openEdit = (b: PromoBanner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setBadge(b.badge);
    setImageUrl(b.imageUrl);
    setLinkCategoryId(b.linkCategoryId || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      addBanner({
        title,
        subtitle,
        badge,
        imageUrl,
        linkCategoryId: linkCategoryId || undefined,
      });
      setIsAdding(false);
    } else if (editingBanner) {
      updateBanner({
        ...editingBanner,
        title,
        subtitle,
        badge,
        imageUrl,
        linkCategoryId: linkCategoryId || undefined,
      });
      setEditingBanner(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Promo Banners ({banners.length})
        </h2>
        <button
          onClick={openAdd}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow"
        >
          <Plus size={14} />
          <span>Add Banner</span>
        </button>
      </div>

      <div className="space-y-3">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
          >
            <div className="relative h-28 w-full bg-gray-100">
              <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold bg-emerald-600 w-fit px-2 py-0.5 rounded-full mb-1">
                  {banner.badge}
                </span>
                <h3 className="font-bold text-xs line-clamp-1">{banner.title}</h3>
                <p className="text-[11px] text-gray-200 line-clamp-1">{banner.subtitle}</p>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between bg-white text-xs">
              <span className="text-gray-500 text-[11px]">
                Links to: <strong className="text-gray-800">{banner.linkCategoryId || 'General'}</strong>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(banner)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this promo banner?')) {
                      deleteBanner(banner.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Banner Modal */}
      {(isAdding || editingBanner) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-gray-900">
                {isAdding ? 'Add Promo Banner' : 'Edit Banner'}
              </h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingBanner(null);
                }}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Badge Text</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Link Category</label>
                <select
                  value={linkCategoryId}
                  onChange={(e) => setLinkCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
                >
                  <option value="">None (General)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow mt-2"
              >
                Save Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
