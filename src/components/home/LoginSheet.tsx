'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import { Checkbox } from '@/components/ui/checkbox';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function LoginSheet() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      router.push('/profile');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="hidden md:block cursor-pointer hover:bg-gray-100">
          Войти
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:min-w-[450px] bg-white text-black">
        <div className="mt-8 p-6 relative">
          <SheetClose className="absolute z-10 bg-white right-4 top-4 rounded-sm ring-offset-background hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-6 w-6" />
          </SheetClose>

          <SheetHeader className="flex flex-col items-start mb-8">
            <SheetTitle className="text-2xl font-bold text-[#FF385C] w-max mx-auto">Unicflo</SheetTitle>
            <SheetDescription className="text-2xl font-bold mt-4">Добро пожаловать</SheetDescription>
          </SheetHeader>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Электронная почта</Label>
              <Input
                id="email"
                placeholder="Адрес электронной почты"
                className="bg-white border-gray-300 focus-visible:border-[#FF385C] focus-visible:ring-[#FF385C]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Введите пароль"
                  type={showPassword ? "text" : "password"}
                  className="bg-white border-gray-300 focus-visible:border-[#FF385C] focus-visible:ring-[#FF385C] pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border border-black checked:bg-[#FF385C]"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    setRememberMe(checked === true)
                  }
                />
                <label htmlFor="remember" className="text-gray-600">
                  Запомнить на 30 дней
                </label>
              </div>
              <SheetClose asChild>
                <Link href="/resetPassword" className="text-[#FF385C] hover:underline">
                  Забыли пароль
                </Link>
              </SheetClose>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-[#FF385C] hover:bg-[#E0314D] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Авторизоваться'}
            </Button>

            {/* Social Login */}
            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
              type="button"
              disabled={isLoading}
            >
              Продолжить с Google
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              У вас еще нет аккаунта?{' '}
              <SheetClose asChild>
                <Link
                  href="/register"
                  className="text-[#FF385C] font-medium hover:underline"
                >
                  Зарегистрируйтесь здесь
                </Link>
              </SheetClose>
            </p>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
