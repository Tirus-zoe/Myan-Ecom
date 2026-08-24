import React from 'react';
import { Palette, Check } from 'lucide-react';
import { ColorTheme } from '../../../types';
import { THEMES, getTheme } from '../../../utils/theme';

interface ThemeSettingsCardProps {
  themeColor: ColorTheme;
  onThemeChange: (tId: ColorTheme) => void;
}

export const ThemeSettingsCard: React.FC<ThemeSettingsCardProps> = ({
  themeColor,
  onThemeChange,
}) => {
  const activeTheme = getTheme(themeColor);

  return (
    <div id="sec-themes" className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3 scroll-mt-24">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Palette size={16} className={activeTheme.primaryText} />
          <span>1. Store Color Theme (ဆိုင်ပုံစံအရောင် ရွေးချယ်ရန်)</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${activeTheme.primaryLightBg} ${activeTheme.primaryText}`}>
          Active: {activeTheme.name}
        </span>
      </div>

      <p className="text-gray-600 text-[11px]">
        Choose the primary brand theme for your store. All buttons, pills, banners, badges, and headers will automatically update.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {Object.values(THEMES).map((t) => {
          const isSelected = themeColor === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onThemeChange(t.id)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? `${t.primaryBorder} ${t.primaryLightBg} ring-2 ${t.primaryRing} shadow-sm scale-[1.02]`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-4 rounded-full shadow-sm border border-white"
                    style={{ backgroundColor: t.primaryHex }}
                  />
                  <span
                    className="w-3 h-3 rounded-full shadow-sm border border-white -ml-2"
                    style={{ backgroundColor: t.secondaryHex }}
                  />
                </div>
                {isSelected && <Check size={14} className={t.primaryText} />}
              </div>
              <div>
                <span className="font-bold text-gray-900 text-xs block">{t.name}</span>
                <span className="text-[10px] text-gray-500 line-clamp-1">{t.myanmarName}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
