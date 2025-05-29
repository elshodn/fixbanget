// Telegram foydalanuvchi ma'lumotlarini olish

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Telegram Web App obyektini olish
export function getTelegramWebApp() {
  if (
    typeof window !== "undefined" &&
    window.Telegram &&
    window.Telegram.WebApp
  ) {
    return window.Telegram.WebApp;
  }
  return null;
}

// Telegram foydalanuvchi ma'lumotlarini olish
export function getTelegramUser(): TelegramUser | null {
  const webApp = getTelegramWebApp();

  if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
    return {
      id: webApp.initDataUnsafe.user.id,
      username: webApp.initDataUnsafe.user.username,
      first_name: webApp.initDataUnsafe.user.first_name,
      last_name: webApp.initDataUnsafe.user.last_name,
    };
  }

  return null;
}

// Faqat user ID ni olish
export function getTelegramUserId(): number | null {
  const user = getTelegramUser();
  return user ? user.id : null;
}

// Faqat username ni olish
export function getTelegramUsername(): string | null {
  const user = getTelegramUser();
  return user ? user.username || null : null;
}
