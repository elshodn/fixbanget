"use client";

import { useEffect, useState } from "react";
import {
  getTelegramUser,
  getTelegramUserId,
  getTelegramUsername,
  type TelegramUser,
} from "@/lib/telegram";

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Telegram ma'lumotlarini olish
    const telegramUser = getTelegramUser();
    const telegramUserId = getTelegramUserId();
    const telegramUsername = getTelegramUsername();

    setUser(telegramUser);
    setUserId(telegramUserId);
    setUsername(telegramUsername);
    setIsLoading(false);
  }, []);

  return {
    user,
    userId,
    username,
    isLoading,
  };
}
