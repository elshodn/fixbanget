'use client';

import { useEffect, useState } from "react";
import {
  Menu,
  Heart,
  ShoppingBag,
  Search,
  X,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import telegramIcon from "@/assets/images/telegramIcon.png";
import whatsappIcon from "@/assets/images/whatsappIcon.png";
import instagramIcon from "@/assets/images/instagramIcon.png";
import tiktokIcon from "@/assets/images/tiktokIcon.png";
import navbar from "@/assets/images/navbar.png";
import Link from "next/link";
import Image from "next/image";
import { LoginSheet } from "@/components/home/LoginSheet";
import { useLikeStore } from "../../stores/likeStore";
import { useAuthStore } from "../../stores/authStore";
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { styleData } from "@/lib/mockData";

interface CartItem {
  image: string;
  title: string;
  name: string;
  price: number;
  quantity: number;
  oldPrice?: number;
}

export function Navbar() {
  const [cartData, setCartData] = useState(
    styleData.slice(0, 3).map((item) => ({ ...item, quantity: 1 }))
  );
  const hasItems = cartData.length > 0;
  const [deleteAll, setDeleteAll] = useState<boolean>(hasItems);

  const updateQuantity = (index: number, change: number) => {
    setCartData((prev) => {
      const updated = [...prev];
      const newQuantity = updated[index].quantity + change;

      if (newQuantity <= 0) {
        return updated.filter((_, i) => i !== index);
      }

      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  useEffect(() => {
    setDeleteAll(cartData.length > 0);
  }, [cartData]);

  const deleteItem = (index: number) => {
    setCartData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    setCartData([]);
  };

  const navLinks = [
    { label: "Мужское", href: "/search" },
    { label: "Женское", href: "/search" },
    { label: "Unicflo в Китае", href: "/trend" },
    { label: "Копия или реплика", href: "/brend" },
    { label: "Замеры", href: "/measurements" },
    { label: "Доставка и Оплата", href: "/delivery" },
    { label: "Блог", href: "/blog" },
    { label: "Свизатся с нами", href: "/contact" },
  ];

  const likedCount = useLikeStore((state) => state.likedProducts.length);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  return (
    <nav className="bg-[#1B1B1B] text-white shadow-lg">
      <div className="pb-3 pt-5">
        <div className="w-full h-0.5 bg-black"></div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex w-1/3 items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Menu className="cursor-pointer text-2xl" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="min-w-full bg-[#1B1B1B] text-white flex-row"
              >
                <DialogHeader className="sr-only">
                  <DialogTitle>Navigation Menu</DialogTitle>
                  <DialogDescription>
                    Main navigation links and contact information
                  </DialogDescription>
                </DialogHeader>

                <div className="w-full mt-8 md:w-7/12 relative flex justify-center items-center">
                  <div className="w-full md:w-8/12 space-y-2 p-10 md:p-0 flex flex-col h-full md:h-auto">
                    <div className="md:hidden flex">
                      {isLoggedIn ? (
                        <Link
                          href="/profile"
                          className="cursor-pointer flex gap-4 items-center text-xl md:text-3xl font-semibold hover:text-gray-300"
                        >
                          <SheetClose className="cursor-pointer">
                            Профиль
                          </SheetClose>
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          className="cursor-pointer flex gap-4 items-center text-xl md:text-3xl font-semibold hover:text-gray-300"
                        >
                          <SheetClose className="cursor-pointer">
                            Войти
                          </SheetClose>
                        </Link>
                      )}
                    </div>

                    {navLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        className="block text-xl md:text-3xl font-bold hover:text-gray-300"
                      >
                        <SheetClose className="cursor-pointer">
                          {link.label.toLowerCase()}
                        </SheetClose>
                      </Link>
                    ))}

                    <div className="flex items-center gap-8 my-3 md:my-8">
                      <Image
                        className="w-4 md:w-6"
                        src={whatsappIcon}
                        alt="WhatsApp"
                      />
                      <Image
                        className="w-4 md:w-6"
                        src={telegramIcon}
                        alt="Telegram"
                      />
                      <Image
                        className="w-4 md:w-6"
                        src={instagramIcon}
                        alt="Instagram"
                      />
                      <Image
                        className="w-4 md:w-6"
                        src={tiktokIcon}
                        alt="TikTok"
                      />
                    </div>

                    <p className="text-xl md:text-2xl">+0 (000) 000-00-00</p>
                    <p className="text-xl md:text-2xl">0000@example.ru</p>

                    <div className="absolute right-5 top-5">
                      <SheetClose asChild>
                        <X className="cursor-pointer" size={40} />
                      </SheetClose>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 w-5/12 hidden md:block">
                  <Image src={navbar} alt="Navbar visual" />
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center ml-4">
              <Search className="text-gray-400" />
              <Input
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Поиск продукта"
                type="search"
              />
            </div>
          </div>

          <Link href="/" className="w-1/3 flex justify-center space-x-6">
            <p className="text-2xl font-medium">Unicflo</p>
          </Link>

          <div className="flex w-1/3 items-center justify-end space-x-5">
            <div className="hidden md:flex gap-2">
              <Image
                src={telegramIcon}
                className="w-6 h-6 object-contain"
                alt="telegramIcon"
              />
              Telegram app
            </div>

            <Link href="/wishlist" className="relative cursor-pointer">
              <Heart className="h-5 w-5" />
              {likedCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {likedCount}
                </div>
              )}
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <button className="cursor-pointer">
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent className="min-w-full md:min-w-[440px]">
                <SheetHeader className="relative pb-0">
                  <SheetClose className="absolute right-5 top-2 md:top-5">
                    <X />
                  </SheetClose>

                  <SheetTitle className="flex border-b justify-between items-end pt-2 mt-5 md:pt-7 pb-2">
                    <span className="text-[#1B1B1B] font-semibold text-xl">Ваша корзина</span>
                    <button
                      className="text-[#F04438] font-semibold text-base cursor-pointer"
                      onClick={handleDeleteAll}
                      disabled={!deleteAll}
                    >
                      Clear all
                    </button>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Ваши выбранные товары и итоговая сумма
                  </SheetDescription>
                </SheetHeader>

                <div className="px-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                  {cartData.length > 0 ? (
                    cartData.map((item, index) => (
                      <div key={index} className="flex gap-2 py-3 h-40 border-b">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="h-full object-cover rounded-md"
                          width={100}
                          height={160}
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-[14px] font-medium text-[#1B1B1BB2]">Весенняя коллекция</p>
                            <h2 className="text-[#1B1B1B] text-base font-semibold">{item.name}</h2>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border rounded">
                              <button
                                className="px-2 py-1 cursor-pointer"
                                onClick={() => updateQuantity(index, -1)}
                              >−</button>
                              <span>{item.quantity}</span>
                              <button
                                className="px-2 py-1 cursor-pointer"
                                onClick={() => updateQuantity(index, 1)}
                              >+</button>
                            </div>
                            <div className="flex gap-2 items-baseline">
                              {item.oldPrice && (
                                <p className="text-[#1B1B1BB2] text-[14px] font-semibold line-through">
                                  ${item.oldPrice}
                                </p>
                              )}
                              <p className="text-[#1B1B1B] text-base font-extrabold">${item.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center space-y-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto py-10 sm:py-20">
                      <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                      <h1 className="text-[#1B1B1B] text-xl sm:text-2xl font-semibold capitalize mt-4">пустая корзина</h1>
                      <p className="text-[#8D8D8D] font-normal text-sm sm:text-base px-4 sm:px-0">
                        В вашей корзине нет товаров.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 pt-1 md:pt-4 border-t">
                  <div className="flex justify-between items-center text-[#1B1B1B] font-bold text-xl">
                    <h1>Итого</h1>
                    <h1>
                      ${cartData.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                    </h1>
                  </div>
                  <p className="text-[#1B1B1BB2] font-medium text-[12px] md:text-sm mt-1">
                    Налоги и стоимость доставки будут рассчитаны при оформлении заказа.
                  </p>
                  <div className="flex flex-col-reverse sm:flex-row gap-1 md:gap-3 mt-2 md:mt-6">
                    <SheetClose asChild className="w-full md:w-1/2">
                      <Link href="/cart">
                        <Button className="w-full border border-black bg-white text-black py-5 font-semibold">
                          Посмотреть корзину
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild className="w-full md:w-1/2">
                      <Link href="/checkout">
                        <Button className="w-full bg-[#FF385C] py-5 font-semibold">
                          Проверить
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex">
              {isLoggedIn ? (
                <Link href="/profile" className="cursor-pointer">
                  <UserRound className="h-5 w-5" />
                </Link>
              ) : (
                <LoginSheet />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}