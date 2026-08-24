import { PaymentAccount } from '../types';

export const initialPaymentAccounts: PaymentAccount[] = [
  // ====================================================
  // VENDOR 1: SMART LIVING CATALOG
  // ====================================================
  {
    id: 'pa-sl-1',
    vendorId: 'vendor_smart_living',
    name: 'KBZPay (KPay)',
    accountName: 'U Kyaw Swar (Smart Living)',
    accountNumber: '09789123456',
    color: '#005BBB',
    iconName: 'Smartphone',
  },
  {
    id: 'pa-sl-2',
    vendorId: 'vendor_smart_living',
    name: 'WavePay',
    accountName: 'U Kyaw Swar (Smart Living)',
    accountNumber: '09789123456',
    color: '#FFCC00',
    iconName: 'Zap',
  },
  {
    id: 'pa-sl-3',
    vendorId: 'vendor_smart_living',
    name: 'AYA Pay / AYA Bank',
    accountName: 'Smart Living Catalog Co.',
    accountNumber: '200192839210',
    color: '#ED1C24',
    iconName: 'Building2',
  },

  // ====================================================
  // VENDOR 2: BELLA GLOW BEAUTY & CARE (Cosmetics)
  // ====================================================
  {
    id: 'pa-bg-1',
    vendorId: 'vendor_bella_glow',
    name: 'KBZPay (KPay)',
    accountName: 'Daw Khin Hnin (Bella Glow)',
    accountNumber: '09450888999',
    color: '#005BBB',
    iconName: 'Smartphone',
  },
  {
    id: 'pa-bg-2',
    vendorId: 'vendor_bella_glow',
    name: 'WavePay',
    accountName: 'Bella Glow Beauty Care',
    accountNumber: '09450888999',
    color: '#FFCC00',
    iconName: 'Zap',
  },
  {
    id: 'pa-bg-3',
    vendorId: 'vendor_bella_glow',
    name: 'CB Pay',
    accountName: 'Bella Glow Beauty Store',
    accountNumber: '001293849102',
    color: '#107C41',
    iconName: 'CreditCard',
  },
  {
    id: 'pa-bg-4',
    vendorId: 'vendor_bella_glow',
    name: 'AYA Pay',
    accountName: 'Daw Khin Hnin',
    accountNumber: '09450888999',
    color: '#ED1C24',
    iconName: 'Building2',
  },

  // ====================================================
  // VENDOR 3: KHIT THIT FASHION (Clothing)
  // ====================================================
  {
    id: 'pa-kt-1',
    vendorId: 'vendor_khit_thit',
    name: 'KBZPay (KPay)',
    accountName: 'U Min Thant (Khit Thit)',
    accountNumber: '09970111222',
    color: '#005BBB',
    iconName: 'Smartphone',
  },
  {
    id: 'pa-kt-2',
    vendorId: 'vendor_khit_thit',
    name: 'WavePay',
    accountName: 'Khit Thit Clothing Mandalay',
    accountNumber: '09970111222',
    color: '#FFCC00',
    iconName: 'Zap',
  },
  {
    id: 'pa-kt-3',
    vendorId: 'vendor_khit_thit',
    name: 'AYA Pay / AYA Bank',
    accountName: 'Khit Thit Men & Women Wear',
    accountNumber: '09970111222',
    color: '#ED1C24',
    iconName: 'Building2',
  },
];
