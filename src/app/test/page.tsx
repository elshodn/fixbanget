import { UserInfo } from "./user-info";

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Telegram Web App</h1>
      <UserInfo />
    </main>
  );
}
