import { TelegramInit } from "./telegram-init";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      {/* Telegram Web App initializatsiyasi */}
      <TelegramInit />

      <h1 className="text-2xl font-bold mb-4">Telegram Web App E-commerce</h1>

      {/* Asosiy kontent */}
      <div className="py-4">
        <p>Telegram Web App orqali e-commerce ilovasi</p>
      </div>
    </main>
  );
}
