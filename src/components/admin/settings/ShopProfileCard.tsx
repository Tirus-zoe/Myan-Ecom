import React, { useState } from 'react';
import { Store, Save, Check, Image as ImageIcon, Share2, Send } from 'lucide-react';
import { ShopInfo } from '../../../types';
import { getTheme } from '../../../utils/theme';

interface ShopProfileCardProps {
  shopInfo: ShopInfo;
  onSave: (updated: ShopInfo) => void;
}

export const ShopProfileCard: React.FC<ShopProfileCardProps> = ({ shopInfo, onSave }) => {
  const [info, setInfo] = useState<ShopInfo>(shopInfo);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const activeTheme = getTheme(info.themeColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(info);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <form
      id="sec-branding"
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-4 scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
          <Store size={16} className={activeTheme.primaryText} />
          <span>2. Store Profile, Logo & Info (ဆိုင်အချက်အလက်)</span>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 ${activeTheme.primaryBg} ${activeTheme.primaryHover} text-white rounded-xl font-bold flex items-center gap-1 shadow-sm transition-all`}
        >
          {savedSuccess ? <Check size={14} /> : <Save size={14} />}
          <span>{savedSuccess ? 'Saved to Store!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Store Name & Tagline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-gray-700 block mb-1">Store Name (ဆိုင်အမည်) *</label>
          <input
            type="text"
            required
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-bold text-sm"
            placeholder="e.g. Smart Living Catalog"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1">Tagline (ကြွေးကြော်သံ / အညွှန်း)</label>
          <input
            type="text"
            value={info.tagline}
            onChange={(e) => setInfo({ ...info, tagline: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
            placeholder="e.g. Premium Furniture, Lifestyle & Decor"
          />
        </div>
      </div>

      {/* Store Logo URL & Preview */}
      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-2">
        <label className="font-semibold text-gray-700 block">Store Logo Image URL (ဆိုင် Logo ပုံ Link)</label>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
            {info.logoUrl ? (
              <img src={info.logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} className="text-gray-400" />
            )}
          </div>
          <input
            type="text"
            placeholder="https://images.unsplash.com/... or image link"
            value={info.logoUrl || ''}
            onChange={(e) => setInfo({ ...info, logoUrl: e.target.value })}
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl focus:border-emerald-600 font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Store Description */}
      <div>
        <label className="font-semibold text-gray-700 block mb-1">Store Description (ဆိုင်အကြောင်း ဖော်ပြချက်)</label>
        <textarea
          rows={2}
          value={info.description}
          onChange={(e) => setInfo({ ...info, description: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
          placeholder="Introduce your store to customers..."
        />
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="font-semibold text-gray-700 block mb-1">Phone Number (ဖုန်းနံပါတ်)</label>
          <input
            type="text"
            value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
            placeholder="09 789 123 456"
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700 block mb-1">Email Address</label>
          <input
            type="email"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
            placeholder="hello@smartcatalog.shop"
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700 block mb-1">Currency Symbol</label>
          <input
            type="text"
            value={info.currencySymbol}
            onChange={(e) => setInfo({ ...info, currencySymbol: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-bold"
            placeholder="Ks"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="font-semibold text-gray-700 block mb-1">Opening Hours (ဆိုင်ဖွင့်ချိန်)</label>
          <input
            type="text"
            value={info.openingHours}
            onChange={(e) => setInfo({ ...info, openingHours: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
            placeholder="Mon - Sun: 9:00 AM - 7:30 PM"
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700 block mb-1">City / Region</label>
          <input
            type="text"
            value={info.city}
            onChange={(e) => setInfo({ ...info, city: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
            placeholder="Yangon, Myanmar"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">Store Address (ဆိုင်လိပ်စာအပြည့်အစုံ)</label>
        <input
          type="text"
          value={info.address}
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600"
          placeholder="No. 124, Pyay Road, Kamayut Township, Yangon"
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 block mb-1">Google Maps Embed URL (မြေပုံ Link)</label>
        <input
          type="text"
          value={info.mapEmbedUrl}
          onChange={(e) => setInfo({ ...info, mapEmbedUrl: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-mono text-[10px]"
          placeholder="https://www.google.com/maps/embed?..."
        />
      </div>

      {/* Social Media Links */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <span className="font-bold text-gray-800 flex items-center gap-1.5">
          <Share2 size={14} className={activeTheme.primaryText} />
          <span>Social & Messaging Links (လူမှုကွန်ရက် လင့်ခ်များ)</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-gray-600 block mb-0.5">Facebook Page URL</label>
            <input
              type="text"
              value={info.socials.facebook || ''}
              onChange={(e) => setInfo({ ...info, socials: { ...info.socials, facebook: e.target.value } })}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-600 block mb-0.5">Telegram Channel / Link</label>
            <input
              type="text"
              value={info.socials.telegram || ''}
              onChange={(e) => setInfo({ ...info, socials: { ...info.socials, telegram: e.target.value } })}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
              placeholder="https://t.me/..."
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-600 block mb-0.5">Viber Contact</label>
            <input
              type="text"
              value={info.socials.viber || ''}
              onChange={(e) => setInfo({ ...info, socials: { ...info.socials, viber: e.target.value } })}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
              placeholder="viber://chat?number=+95..."
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-600 block mb-0.5">TikTok Profile</label>
            <input
              type="text"
              value={info.socials.tiktok || ''}
              onChange={(e) => setInfo({ ...info, socials: { ...info.socials, tiktok: e.target.value } })}
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl"
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </div>
      </div>

      {/* Telegram Notifications Config */}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-sky-600">
          <Send size={14} />
          <span>Telegram Order Dispatcher Settings (အော်ဒါပို့ဆောင်ရေး Bot)</span>
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1">Telegram Channel / User Handle (@username)</label>
          <input
            type="text"
            placeholder="e.g. smartcatalog_shop"
            value={info.telegramSettings.channelUsername || ''}
            onChange={(e) =>
              setInfo({
                ...info,
                telegramSettings: { ...info.telegramSettings, channelUsername: e.target.value },
              })
            }
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Bot Token (Optional)</label>
            <input
              type="text"
              placeholder="123456:ABC-DEF1234..."
              value={info.telegramSettings.botToken || ''}
              onChange={(e) =>
                setInfo({
                  ...info,
                  telegramSettings: { ...info.telegramSettings, botToken: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-mono text-[10px]"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Chat ID (Optional)</label>
            <input
              type="text"
              placeholder="-100123456789"
              value={info.telegramSettings.chatId || ''}
              onChange={(e) =>
                setInfo({
                  ...info,
                  telegramSettings: { ...info.telegramSettings, chatId: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 font-mono text-[10px]"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
