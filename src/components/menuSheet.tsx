'use client'

import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type MenuSheetProps = {
  navLinks: { href: string; label: string }[];
  whatsappIcon: string;
  telegramIcon: string;
  instagramIcon: string;
  tiktokIcon: string;
  navbar: string;
};

export default function MenuSheet({
  navLinks,
  whatsappIcon,
  telegramIcon,
  instagramIcon,
  tiktokIcon,
  navbar,
}: MenuSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="cursor-pointer text-2xl" />
      </SheetTrigger>
      <SheetContent side="left" className="min-w-full bg-[#1B1B1B] text-white flex-row">
        <DialogHeader className="sr-only">
          <DialogTitle>Navigation Menu</DialogTitle>
          <DialogDescription>Main navigation links and contact information</DialogDescription>
        </DialogHeader>

        <div className="w-full mt-8 md:w-7/12 relative flex justify-center items-center">
          <div className="w-full md:w-8/12 space-y-2 p-10 md:p-0 flex flex-col h-full md:h-auto">
            <div className="md:hidden flex">
              <Link
                href="/profile"
                className="cursor-pointer flex gap-4 items-center text-xl md:text-3xl font-semibold hover:text-gray-300"
              >
                <SheetClose className="cursor-pointer">Профиль</SheetClose>
              </Link>
            </div>

            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block text-xl md:text-3xl font-bold hover:text-gray-300"
              >
                <SheetClose className="cursor-pointer">{link.label.toLowerCase()}</SheetClose>
              </Link>
            ))}

            <div className="flex items-center gap-8 my-3 md:my-8">
              <Image className="w-4 md:w-6" src={whatsappIcon} alt="WhatsApp" />
              <Image className="w-4 md:w-6" src={telegramIcon} alt="Telegram" />
              <Image className="w-4 md:w-6" src={instagramIcon} alt="Instagram" />
              <Image className="w-4 md:w-6" src={tiktokIcon} alt="TikTok" />
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
  );
}
