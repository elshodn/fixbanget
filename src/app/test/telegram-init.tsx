"use client";

import { useEffect, useState } from "react";
import { getTelegramWebApp, getTelegramUserId } from "@/lib/telegram";

export function TelegramInit() {
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Telegram Web App tayyor bo'lganda
    const webApp = getTelegramWebApp();
    if (webApp) {
      // Web App ni ishga tushirish
      webApp.ready();

      // Foydalanuvchi ID sini olish
      const telegramUserId = getTelegramUserId();
      setUserId(telegramUserId);

      setIsReady(true);

      // Asosiy rangni o'rnatish
      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        webApp.themeParams.bg_color || "#ffffff"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-text-color",
        webApp.themeParams.text_color || "#000000"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-color",
        webApp.themeParams.button_color || "#2481cc"
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-text-color",
        webApp.themeParams.button_text_color || "#ffffff"
      );
    }
  }, []);

  // Debug ma'lumotlarini ko'rsatish (ishlab chiqarish muhitida o'chirib qo'yish kerak)
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-0 left-0 bg-black bg-opacity-70 text-white p-2 text-xs z-50">
        <p>Telegram Web App: {isReady ? "✅" : "❌"}</p>
        <p>User ID: {userId || "Not available"}</p>
      </div>
    );
  }

  return null;
}
