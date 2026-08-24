import { Order, ShopInfo } from '../types';

export function formatTelegramOrderMessage(order: Order, shopInfo: ShopInfo): string {
  const dateStr = new Date().toLocaleString();
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. 🛋️ ${item.productName}\n   • Qty: ${item.quantity} | Price: ${item.price.toLocaleString()} ${shopInfo.currencySymbol} = ${(
          item.price * item.quantity
        ).toLocaleString()} ${shopInfo.currencySymbol}${item.color ? `\n   • Color Option: ${item.color}` : ''}`
    )
    .join('\n');

  return `📦 *NEW ORDER RECEIVED* 📦
━━━━━━━━━━━━━━━━━━━━
🆔 *Order No:* \`#${order.orderNumber}\`
⏰ *Date:* ${dateStr}

👤 *CUSTOMER INFORMATION*
• *Name:* ${order.customerName}
• *Phone:* ${order.customerPhone}
• *City / Township:* ${order.city} - ${order.township}
• *Address:* ${order.addressDetail}

🛒 *ITEMS ORDERED (${order.items.length})*
${itemsText}

💰 *PAYMENT & SUMMARY*
• *Subtotal:* ${order.subtotal.toLocaleString()} ${shopInfo.currencySymbol}
• *Delivery Fee:* ${order.deliveryFee.toLocaleString()} ${shopInfo.currencySymbol}
• *Total Amount:* *${order.totalAmount.toLocaleString()} ${shopInfo.currencySymbol}*
• *Payment Method:* ${order.paymentMethod}
${order.paymentProofUrl ? '• *Slip Attached:* Yes ✅' : '• *Slip Attached:* None'}
${order.notes ? `\n📝 *Customer Notes:*\n"${order.notes}"` : ''}

━━━━━━━━━━━━━━━━━━━━
🏪 *Shop:* ${shopInfo.name} (${shopInfo.phone})`;
}

export async function sendTelegramOrder(order: Order, shopInfo: ShopInfo): Promise<{ success: boolean; error?: string }> {
  const message = formatTelegramOrderMessage(order, shopInfo);

  // If Bot Token and Chat ID are configured
  if (shopInfo.telegramSettings.botToken && shopInfo.telegramSettings.chatId) {
    try {
      const url = `https://api.telegram.org/bot${shopInfo.telegramSettings.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: shopInfo.telegramSettings.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();
      if (data.ok) {
        return { success: true };
      } else {
        console.warn('Telegram Bot API failed:', data);
        return { success: false, error: data.description || 'Failed to send to Telegram Bot' };
      }
    } catch (err: any) {
      console.error('Error sending Telegram API message:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true };
}

export function getTelegramShareUrl(order: Order, shopInfo: ShopInfo): string {
  const message = formatTelegramOrderMessage(order, shopInfo);
  const username = shopInfo.telegramSettings.channelUsername || 'smartcatalog_shop';
  // Strip '@' if present
  const cleanUser = username.replace(/^@/, '');
  return `https://t.me/${cleanUser}?text=${encodeURIComponent(message)}`;
}
