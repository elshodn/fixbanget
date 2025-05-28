"use client";

import { useEffect, useState } from "react";
import {
  getTelegramUserId,
  getTelegramUser,
  type TelegramUser,
} from "@/lib/telegram";

export function useTelegramAuth() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Telegram foydalanuvchi ma'lumotlarini olish
    const telegramUser = getTelegramUser();
    const userId = getTelegramUserId();

    if (telegramUser && userId) {
      setUser(telegramUser);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  return {
    user,
    userId: user?.id || null,
    isLoading,
    isAuthenticated,
  };
}
