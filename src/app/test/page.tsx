"use client"
import { getTelegramUserId } from "@/lib/telegram";
import React from "react";

export const TestPage = () => {
  const telegramID = getTelegramUserId();
  return (
    <div className="size-24 bg-red-300 text-2xl font-bold ">
      Telegram user id {telegramID}
    </div>
  );
};
