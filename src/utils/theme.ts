import { ColorTheme } from '../types';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  myanmarName: string;
  primaryHex: string;
  secondaryHex: string;
  lightHex: string;
  bgGradient: string;
  // Tailwind utility helper classes
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryBorder: string;
  primaryLightBg: string;
  primaryRing: string;
  badgeBg: string;
}

export const THEMES: Record<ColorTheme, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    myanmarName: 'မြစိမ်းရောင် (Emerald Green)',
    primaryHex: '#059669',
    secondaryHex: '#047857',
    lightHex: '#ECFDF5',
    bgGradient: 'from-emerald-800 via-emerald-900 to-teal-950',
    primaryBg: 'bg-emerald-700',
    primaryHover: 'hover:bg-emerald-800',
    primaryText: 'text-emerald-700',
    primaryBorder: 'border-emerald-600',
    primaryLightBg: 'bg-emerald-50',
    primaryRing: 'ring-emerald-200',
    badgeBg: 'bg-emerald-500/90',
  },
  rose: {
    id: 'rose',
    name: 'Rose Blossom',
    myanmarName: 'နှင်းဆီပန်းနုရောင် (Rose Pink / Beauty)',
    primaryHex: '#E11D48',
    secondaryHex: '#BE123C',
    lightHex: '#FFF1F2',
    bgGradient: 'from-rose-800 via-pink-900 to-rose-950',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600',
    primaryBorder: 'border-rose-500',
    primaryLightBg: 'bg-rose-50',
    primaryRing: 'ring-rose-200',
    badgeBg: 'bg-rose-500/90',
  },
  amber: {
    id: 'amber',
    name: 'Luxury Amber & Gold',
    myanmarName: 'ရွှေညိုရောင် (Warm Amber & Gold)',
    primaryHex: '#D97706',
    secondaryHex: '#B45309',
    lightHex: '#FFFBEB',
    bgGradient: 'from-amber-800 via-amber-900 to-stone-950',
    primaryBg: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    primaryText: 'text-amber-700',
    primaryBorder: 'border-amber-500',
    primaryLightBg: 'bg-amber-50',
    primaryRing: 'ring-amber-200',
    badgeBg: 'bg-amber-500/90',
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Blue',
    myanmarName: 'နီလာပြာရောင် (Royal Sapphire)',
    primaryHex: '#2563EB',
    secondaryHex: '#1D4ED8',
    lightHex: '#EFF6FF',
    bgGradient: 'from-blue-800 via-indigo-900 to-slate-950',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    primaryBorder: 'border-blue-500',
    primaryLightBg: 'bg-blue-50',
    primaryRing: 'ring-blue-200',
    badgeBg: 'bg-blue-500/90',
  },
  purple: {
    id: 'purple',
    name: 'Royal Violet',
    myanmarName: 'ခရမ်းရောင် (Royal Violet)',
    primaryHex: '#7C3AED',
    secondaryHex: '#6D28D9',
    lightHex: '#FAF5FF',
    bgGradient: 'from-purple-800 via-purple-900 to-slate-950',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryText: 'text-purple-600',
    primaryBorder: 'border-purple-500',
    primaryLightBg: 'bg-purple-50',
    primaryRing: 'ring-purple-200',
    badgeBg: 'bg-purple-500/90',
  },
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    myanmarName: 'လိမ္မော်ရောင် (Sunset Orange)',
    primaryHex: '#EA580C',
    secondaryHex: '#C2410C',
    lightHex: '#FFF7ED',
    bgGradient: 'from-orange-800 via-red-900 to-stone-950',
    primaryBg: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    primaryText: 'text-orange-600',
    primaryBorder: 'border-orange-500',
    primaryLightBg: 'bg-orange-50',
    primaryRing: 'ring-orange-200',
    badgeBg: 'bg-orange-500/90',
  },
  slate: {
    id: 'slate',
    name: 'Obsidian Minimalist',
    myanmarName: 'ကျောက်မီးသွေးနက်ရောင် (Dark Slate / Luxury)',
    primaryHex: '#334155',
    secondaryHex: '#1E293B',
    lightHex: '#F1F5F9',
    bgGradient: 'from-slate-800 via-slate-900 to-black',
    primaryBg: 'bg-slate-800',
    primaryHover: 'hover:bg-slate-900',
    primaryText: 'text-slate-800',
    primaryBorder: 'border-slate-700',
    primaryLightBg: 'bg-slate-100',
    primaryRing: 'ring-slate-300',
    badgeBg: 'bg-slate-700/90',
  },
  teal: {
    id: 'teal',
    name: 'Marine Teal',
    myanmarName: 'ရေပြာစိမ်းရောင် (Marine Teal)',
    primaryHex: '#0D9488',
    secondaryHex: '#0F766E',
    lightHex: '#F0FDFA',
    bgGradient: 'from-teal-800 via-teal-900 to-slate-950',
    primaryBg: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-600',
    primaryBorder: 'border-teal-500',
    primaryLightBg: 'bg-teal-50',
    primaryRing: 'ring-teal-200',
    badgeBg: 'bg-teal-500/90',
  },
};

export const getTheme = (themeName?: ColorTheme): ThemeConfig => {
  if (themeName && THEMES[themeName]) {
    return THEMES[themeName];
  }
  return THEMES.emerald;
};
