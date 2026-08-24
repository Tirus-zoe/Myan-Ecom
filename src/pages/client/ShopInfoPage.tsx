import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { getTheme } from '../../utils/theme';

export const ShopInfoPage: React.FC = () => {
  const { shopInfo } = useStore();
  const theme = getTheme(shopInfo.themeColor);
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(shopInfo.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialsList = [
    {
      name: 'Telegram',
      url: shopInfo.socials.telegram || (shopInfo.telegramSettings?.channelUsername ? `https://t.me/${shopInfo.telegramSettings.channelUsername}` : ''),
      color: 'bg-[#24A1DE] text-white',
      icon: Send,
      label: 'Join Channel / Chat',
    },
    {
      name: 'Facebook Page',
      url: shopInfo.socials.facebook,
      color: 'bg-[#1877F2] text-white',
      icon: MessageCircle,
      label: 'Visit Facebook',
    },
    {
      name: 'Viber Community',
      url: shopInfo.socials.viber,
      color: 'bg-[#7360F2] text-white',
      icon: Phone,
      label: 'Chat on Viber',
    },
    {
      name: 'TikTok',
      url: shopInfo.socials.tiktok,
      color: 'bg-black text-white',
      icon: Share2,
      label: 'Follow TikTok',
    },
    {
      name: 'Instagram',
      url: shopInfo.socials.instagram,
      color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white',
      icon: ExternalLink,
      label: 'Follow Instagram',
    },
  ].filter((s) => !!s.url);

  return (
    <div className="pb-24 px-4 max-w-md mx-auto space-y-4">
      {/* Header Banner */}
      <div className={`bg-gradient-to-br ${theme.bgGradient} text-white rounded-3xl p-6 shadow-md mt-2 relative overflow-hidden`}>
        <div className="flex items-center gap-3.5 mb-3">
          {shopInfo.logoUrl ? (
            <img
              src={shopInfo.logoUrl}
              alt={shopInfo.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 bg-white/10 shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center ring-2 ring-white/20">
              <Store size={28} className="text-white" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-extrabold">{shopInfo.name}</h1>
            <p className="text-xs text-white/90 mt-0.5 font-medium">{shopInfo.tagline}</p>
          </div>
        </div>
        <p className="text-xs text-white/80 mt-2 leading-relaxed">{shopInfo.description}</p>
      </div>

      {/* Quick Contact & Working Hours */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3.5">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Contact & Location</h2>

        <div className="flex items-start gap-3 text-xs">
          <MapPin size={18} className={`${theme.primaryText} flex-shrink-0 mt-0.5`} />
          <div>
            <span className="font-semibold text-gray-900 block">Address</span>
            <p className="text-gray-600 mt-0.5 leading-relaxed">{shopInfo.address}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <Phone size={18} className={`${theme.primaryText} flex-shrink-0`} />
            <div>
              <span className="font-semibold text-gray-900 block">Phone</span>
              <span className="text-gray-600 font-mono">{shopInfo.phone}</span>
            </div>
          </div>
          <button
            onClick={handleCopyPhone}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
            title="Copy phone"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs pt-2 border-t border-gray-50">
          <Clock size={18} className={`${theme.primaryText} flex-shrink-0`} />
          <div>
            <span className="font-semibold text-gray-900 block">Opening Hours</span>
            <p className="text-gray-600 mt-0.5">{shopInfo.openingHours}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs pt-2 border-t border-gray-50">
          <Mail size={18} className={`${theme.primaryText} flex-shrink-0`} />
          <div>
            <span className="font-semibold text-gray-900 block">Email Support</span>
            <p className="text-gray-600 mt-0.5">{shopInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Interactive Map Embed */}
      {shopInfo.mapEmbedUrl && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Store Location Map</h2>
          <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <iframe
              src={shopInfo.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop location"
            />
          </div>
        </div>
      )}

      {/* Social Media Links */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Connect With Us</h2>
        <div className="grid grid-cols-1 gap-2">
          {socialsList.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className={`p-3 rounded-xl flex items-center justify-between transition-opacity hover:opacity-90 ${social.color}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} />
                  <span className="text-xs font-bold">{social.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
                  <span>{social.label}</span>
                  <ExternalLink size={13} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
