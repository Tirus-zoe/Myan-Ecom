import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ColorTheme } from '../../types';
import { Palette, Store, Truck, CreditCard, Globe } from 'lucide-react';
import { getTheme } from '../../utils/theme';
import { ThemeSettingsCard } from '../../components/admin/settings/ThemeSettingsCard';
import { ShopProfileCard } from '../../components/admin/settings/ShopProfileCard';
import { DeliveryRatesCard } from '../../components/admin/settings/DeliveryRatesCard';
import { PaymentAccountsCard } from '../../components/admin/settings/PaymentAccountsCard';
import { CustomDomainCard } from '../../components/admin/settings/CustomDomainCard';
import { FirestoreDiagnosticCard } from '../../components/admin/settings/FirestoreDiagnosticCard';

export const AdminSettings: React.FC = () => {
  const {
    shopInfo,
    updateShopInfo,
    paymentAccounts,
    addPaymentAccount,
    updatePaymentAccount,
    deletePaymentAccount,
    townships,
    addTownship,
    updateTownship,
    deleteTownship,
    seedAllToFirestore,
    products,
  } = useStore();

  const activeTheme = getTheme(shopInfo.themeColor);

  const handleThemeChange = (tId: ColorTheme) => {
    updateShopInfo({ ...shopInfo, themeColor: tId });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-5 text-xs pb-16">
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => scrollToSection('sec-domain')}
          className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left flex items-center gap-2.5 shadow-sm transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Globe size={16} />
          </div>
          <div>
            <span className="font-bold text-gray-900 block text-[11px]">Custom Domain</span>
            <span className="text-[10px] text-gray-500">
              {shopInfo.customDomain || 'Connect domain'}
            </span>
          </div>
        </button>

        <button
          onClick={() => scrollToSection('sec-branding')}
          className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left flex items-center gap-2.5 shadow-sm transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Store size={16} />
          </div>
          <div>
            <span className="font-bold text-gray-900 block text-[11px]">Shop Info & Logo</span>
            <span className="text-[10px] text-gray-500">Logo နှင့် အချက်အလက်</span>
          </div>
        </button>

        <button
          onClick={() => scrollToSection('sec-themes')}
          className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left flex items-center gap-2.5 shadow-sm transition-all"
        >
          <div className={`w-8 h-8 rounded-xl ${activeTheme.primaryLightBg} ${activeTheme.primaryText} flex items-center justify-center`}>
            <Palette size={16} />
          </div>
          <div>
            <span className="font-bold text-gray-900 block text-[11px]">Color Themes</span>
            <span className="text-[10px] text-gray-500">အရောင် ၈ မျိုး</span>
          </div>
        </button>

        <button
          onClick={() => scrollToSection('sec-delivery')}
          className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl text-left flex items-center gap-2.5 shadow-sm transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Truck size={16} />
          </div>
          <div>
            <span className="font-bold text-gray-900 block text-[11px]">Delivery Rates</span>
            <span className="text-[10px] text-gray-500">{townships.length} မြို့နယ် ပို့ဆောင်ခ</span>
          </div>
        </button>
      </div>

      {/* 1. Custom Domain Manager Card */}
      <CustomDomainCard
        shopInfo={shopInfo}
        onSave={updateShopInfo}
      />

      {/* 2. Color Theme Customizer */}
      <ThemeSettingsCard
        themeColor={shopInfo.themeColor}
        onThemeChange={handleThemeChange}
      />

      {/* 3. Shop Profile, Branding & Contacts */}
      <ShopProfileCard
        shopInfo={shopInfo}
        onSave={updateShopInfo}
      />

      {/* 4. Delivery Townships & Rates */}
      <DeliveryRatesCard
        townships={townships}
        shopInfo={shopInfo}
        onAddTownship={addTownship}
        onUpdateTownship={updateTownship}
        onDeleteTownship={deleteTownship}
      />

      {/* 5. Payment Accounts Management */}
      <PaymentAccountsCard
        paymentAccounts={paymentAccounts}
        shopInfo={shopInfo}
        onAddPayment={addPaymentAccount}
        onUpdatePayment={updatePaymentAccount}
        onDeletePayment={deletePaymentAccount}
      />

      {/* 6. Firestore Database Diagnostic & Push Card */}
      <FirestoreDiagnosticCard
        productsCount={products.length}
        onSeedToFirestore={seedAllToFirestore}
      />
    </div>
  );
};

