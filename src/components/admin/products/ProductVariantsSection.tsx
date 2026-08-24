import React, { useState } from 'react';
import { ProductVariant, ShopInfo } from '../../../types';
import { Plus, Trash2, Layers } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

interface ProductVariantsSectionProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  shopInfo: ShopInfo;
}

export const ProductVariantsSection: React.FC<ProductVariantsSectionProps> = ({
  variants,
  onChange,
  shopInfo,
}) => {
  const theme = getTheme(shopInfo.themeColor);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState<string>('');

  const handleAddVariant = () => {
    if (!newVarName.trim()) return;
    const v: ProductVariant = {
      id: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newVarName.trim(),
      price: newVarPrice ? Number(newVarPrice) : undefined,
      inStock: true,
    };
    onChange([...variants, v]);
    setNewVarName('');
    setNewVarPrice('');
  };

  const handleRemoveVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  return (
    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-800 flex items-center gap-1.5">
          <Layers size={14} className={theme.primaryText} />
          <span>Sub-items / Types / Sizes (ခွဲခြားရွေးချယ်စရာများ)</span>
        </label>
        <span className="text-[10px] text-gray-500 font-medium">{variants.length} added</span>
      </div>

      {variants.length > 0 && (
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {variants.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-200 text-xs"
            >
              <span className="font-semibold text-gray-800">{v.name}</span>
              <div className="flex items-center gap-2">
                {v.price ? (
                  <span className={`font-bold ${theme.primaryText}`}>
                    {v.price.toLocaleString()} {shopInfo.currencySymbol}
                  </span>
                ) : (
                  <span className="text-gray-400 text-[10px]">Base price</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(v.id)}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Sub-item name (e.g. 2-Seater / Extra Large)"
          value={newVarName}
          onChange={(e) => setNewVarName(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl"
        />
        <input
          type="number"
          placeholder="Price"
          value={newVarPrice}
          onChange={(e) => setNewVarPrice(e.target.value)}
          className="w-20 px-2 py-1.5 bg-white border border-gray-200 rounded-xl text-center"
        />
        <button
          type="button"
          onClick={handleAddVariant}
          className={`px-3 py-1.5 ${theme.primaryBg} text-white font-bold rounded-xl flex items-center gap-1`}
        >
          <Plus size={12} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
