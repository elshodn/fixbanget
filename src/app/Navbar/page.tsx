"use client";

import { useEffect, useState } from "react";
import { Menu, Heart, ShoppingBag, Search, X, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import telegramIcon from "@/assets/images/telegramIcon.png";
import whatsappIcon from "@/assets/images/whatsappIcon.png";
import instagramIcon from "@/assets/images/instagramIcon.png";
import tiktokIcon from "@/assets/images/tiktokIcon.png";
import navbar from "@/assets/images/navbar.png";
import Link from "next/link";
import Image from "next/image";

import { useLikeStore } from "../../stores/likeStore";

import { styleData } from "@/lib/mockData";
import MenuSheet from "@/components/menuSheet";

interface CartItem {
  image: string;
  title: string;
  name: string;
  price: number;
  quantity: number;
  oldPrice?: number;
}

function Navbar() {
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

  return (
    <nav className="bg-[#1B1B1B] text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* LEFT SIDE (Desktop Menu + Search) */}
          <div className="hidden md:flex w-1/3 items-center space-x-2">
            {/* Menu Icon - Desktop only */}
            <div className="">
              <MenuSheet
                {...{
                  navLinks,
                  whatsappIcon: whatsappIcon.src,
                  telegramIcon: telegramIcon.src,
                  instagramIcon: instagramIcon.src,
                  tiktokIcon: tiktokIcon.src,
                  navbar: navbar.src,
                }}
              />
            </div>

            {/* Search (Desktop only) */}
            <div className="hidden md:flex items-center ml-4">
              <Search className="text-gray-400" />
              <Input
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Поиск продукта"
                type="search"
              />
            </div>
          </div>

          {/* CENTER LOGO */}
          <Link href="/" className="w-1/3 flex justify-center space-x-6">
            <p className="text-2xl font-medium">Unicflo</p>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex w-1/3 pt-1 justify-end space-x-5">
            {/* Telegram Label (Desktop only) */}
            <div className="hidden md:flex gap-2">
              <Image
                src={telegramIcon}
                className="w-6 h-6 object-contain"
                alt="telegramIcon"
              />
              Telegram app
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative cursor-pointer">
              <Heart className="" />
              {likedCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {likedCount}
                </div>
              )}
            </Link>
            <Link href="/cart" className="relative  cursor-pointer">
              <button className="cursor-pointer">
                <ShoppingBag className="" />
              </button>
            </Link>

            {/* Menu Icon - Mobile only (right side) */}
            <div className="md:hidden">
              <MenuSheet
                {...{
                  navLinks,
                  whatsappIcon: whatsappIcon.src,
                  telegramIcon: telegramIcon.src,
                  instagramIcon: instagramIcon.src,
                  tiktokIcon: tiktokIcon.src,
                  navbar: navbar.src,
                }}
              />
            </div>

            {/* Profile (desktop only) */}
            <div className="hidden md:flex">
              <Link href="/profile" className="cursor-pointer">
                <UserRound className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
