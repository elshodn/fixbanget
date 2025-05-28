"use client";

import { useTelegramUser } from "@/hooks/use-telegram-user";

export function UserInfo() {
  const { userId, username, isLoading } = useTelegramUser();

  if (isLoading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Telegram foydalanuvchi:</h3>
      <p>
        <strong>User ID:</strong> {userId || "Mavjud emas"}
      </p>
      <p>
        <strong>Username:</strong> {username || "Mavjud emas"}
      </p>
    </div>
  );
}
