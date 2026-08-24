import React, { useState } from 'react';
import { Truck, Edit2, Trash2 } from 'lucide-react';
import { DeliveryTownship, ShopInfo } from '../../../types';
import { getTheme } from '../../../utils/theme';

interface DeliveryRatesCardProps {
  townships: DeliveryTownship[];
  shopInfo: ShopInfo;
  onAddTownship: (t: Omit<DeliveryTownship, 'id'>) => void;
  onUpdateTownship: (t: DeliveryTownship) => void;
  onDeleteTownship: (id: string) => void;
}

export const DeliveryRatesCard: React.FC<DeliveryRatesCardProps> = ({
  townships,
  shopInfo,
  onAddTownship,
  onUpdateTownship,
  onDeleteTownship,
}) => {
  const activeTheme = getTheme(shopInfo.themeColor);
  const [newCity, setNewCity] = useState('Yangon');
  const [newTownshipName, setNewTownshipName] = useState('');
  const [newDeliveryFee, setNewDeliveryFee] = useState<number>(3000);
  const [editingTownship, setEditingTownship] = useState<DeliveryTownship | null>(null);

  const handleAddTownship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTownshipName.trim()) return;
    onAddTownship({
      city: newCity,
      township: newTownshipName.trim(),
      deliveryFee: Number(newDeliveryFee),
      estimatedDays: '1-2 Days',
    });
    setNewTownshipName('');
  };

  const handleSaveEditedTownship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTownship) return;
    onUpdateTownship(editingTownship);
    setEditingTownship(null);
  };

  return (
    <div id="sec-delivery" className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3 scroll-mt-24">
      <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm border-b border-gray-100 pb-2">
        <Truck size={16} className={activeTheme.primaryText} />
        <span>3. Delivery Rates & Townships (ပို့ဆောင်ခ နှင့် မြို့နယ်များ)</span>
      </div>

      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {townships.map((t) => (
          <div
            key={t.id}
            className="p-2.5 rounded-xl border border-gray-100 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
          >
            <div>
              <span className="font-bold text-gray-800">{t.township}</span>
              <span className="text-[11px] text-gray-500 ml-1.5">({t.city})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${activeTheme.primaryText}`}>
                {t.deliveryFee.toLocaleString()} {shopInfo.currencySymbol}
              </span>
              <button
                type="button"
                onClick={() => setEditingTownship(t)}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                title="Edit Rate"
              >
                <Edit2 size={12} />
              </button>
              <button
                type="button"
                onClick={() => onDeleteTownship(t.id)}
                className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100"
                title="Delete Township"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Township Inline Form */}
      {editingTownship && (
        <form onSubmit={handleSaveEditedTownship} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
          <span className="font-bold text-amber-900 block">Edit Delivery Rate</span>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={editingTownship.city}
              onChange={(e) => setEditingTownship({ ...editingTownship, city: e.target.value })}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl"
            />
            <input
              type="text"
              value={editingTownship.township}
              onChange={(e) => setEditingTownship({ ...editingTownship, township: e.target.value })}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl"
            />
            <input
              type="number"
              value={editingTownship.deliveryFee}
              onChange={(e) => setEditingTownship({ ...editingTownship, deliveryFee: Number(e.target.value) })}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingTownship(null)}
              className="px-3 py-1 bg-gray-200 rounded-xl text-gray-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-3 py-1 ${activeTheme.primaryBg} text-white rounded-xl font-bold`}
            >
              Save Rate
            </button>
          </div>
        </form>
      )}

      {/* Add Township Form */}
      <form onSubmit={handleAddTownship} className="pt-2 border-t border-gray-100 space-y-2">
        <span className="font-bold text-gray-800 block">+ Add New Township & Rate (မြို့နယ်နှင့် ပို့ဆောင်ခ အသစ်ထည့်ရန်)</span>
        <div className="grid grid-cols-3 gap-1.5">
          <input
            type="text"
            placeholder="City (e.g. Yangon)"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          />
          <input
            type="text"
            placeholder="Township name"
            value={newTownshipName}
            onChange={(e) => setNewTownshipName(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          />
          <input
            type="number"
            placeholder="Delivery Fee (Ks)"
            value={newDeliveryFee}
            onChange={(e) => setNewDeliveryFee(Number(e.target.value))}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 ${activeTheme.primaryBg} ${activeTheme.primaryHover} text-white font-bold rounded-xl shadow-sm`}
        >
          + Add Township
        </button>
      </form>
    </div>
  );
};
