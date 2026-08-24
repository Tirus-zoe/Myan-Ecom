import { PromoBanner } from '../types';

export const initialBanners: PromoBanner[] = [
  // ====================================================
  // VENDOR 1: SMART LIVING CATALOG
  // ====================================================
  {
    id: 'b1',
    vendorId: 'vendor_smart_living',
    title: 'Modern Living Collection',
    subtitle: 'Crafted with premium Italian leather & solid oak',
    badge: '50% OFF SPECIAL',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'sofa',
    bgColor: 'from-emerald-800 to-teal-900',
  },
  {
    id: 'b2',
    vendorId: 'vendor_smart_living',
    title: 'Minimalist Studio Seating',
    subtitle: 'Ergonomic aesthetics for modern workspace',
    badge: 'NEW ARRIVALS',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'chair',
    bgColor: 'from-amber-800 to-orange-950',
  },

  // ====================================================
  // VENDOR 2: BELLA GLOW BEAUTY & CARE (Cosmetics)
  // ====================================================
  {
    id: 'bg-b1',
    vendorId: 'vendor_bella_glow',
    title: 'Glass Skin Radiance Sale',
    subtitle: 'Authentic Korean Beauty & Hydrating Centella Serums',
    badge: 'UP TO 30% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'suncare',
    bgColor: 'from-rose-700 to-pink-900',
  },
  {
    id: 'bg-b2',
    vendorId: 'vendor_bella_glow',
    title: 'Daily SPF Sun Protection',
    subtitle: 'Skin1004 & Round Lab Dewy Water-Fit Sunscreens',
    badge: 'BEST SELLER',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'suncare',
    bgColor: 'from-amber-600 to-rose-700',
  },
  {
    id: 'bg-b3',
    vendorId: 'vendor_bella_glow',
    title: 'Juicy Lip Glow & Overnight Masks',
    subtitle: 'Rom&nd Dewy Tints and Laneige Overnight Plump Care',
    badge: 'TRENDING',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'lipcare',
    bgColor: 'from-fuchsia-700 to-pink-950',
  },

  // ====================================================
  // VENDOR 3: KHIT THIT MEN & WOMEN WEAR (Fashion)
  // ====================================================
  {
    id: 'kt-b1',
    vendorId: 'vendor_khit_thit',
    title: 'Urban Season Drop 2026',
    subtitle: 'Heavyweight tees, washed denim & minimalist cuts',
    badge: 'NEW SEASON',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'tshirt',
    bgColor: 'from-blue-900 to-indigo-950',
  },
  {
    id: 'kt-b2',
    vendorId: 'vendor_khit_thit',
    title: 'Premium Linen & Oxford Shirts',
    subtitle: 'Cuban camp collar & tailored Oxford button-downs',
    badge: 'POPULAR CHOICE',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'shirt',
    bgColor: 'from-slate-800 to-slate-950',
  },
  {
    id: 'kt-b3',
    vendorId: 'vendor_khit_thit',
    title: 'Tactical Cargo & Outerwear',
    subtitle: 'Multi-pocket ripstop trousers and 14oz denim jackets',
    badge: 'LIMITED STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1000&auto=format&fit=crop&q=80',
    linkCategoryId: 'jacket',
    bgColor: 'from-emerald-900 to-slate-900',
  },
];
