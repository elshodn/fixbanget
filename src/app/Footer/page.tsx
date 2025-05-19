import React from "react";

import telegram from "@/assets/images/telegramIcon.png";
import instagram from "@/assets/images/instagramIcon.png";
import youtube from "@/assets/images/youtubeIcon.png";
import logo from "@/assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black mt-20">
      <div className="flex w-11/12 mx-auto md:w-full items-center p-4">
        <div className="flex gap-2 items-center w-1/3">
          <Image
            className="w-7 object-cover"
            src={telegram}
            alt="Telegram Icon"
          />
          <Image
            className="w-7 object-cover"
            src={instagram}
            alt="Instagram Icon"
          />
          <Image
            className="w-7 object-cover"
            src={youtube}
            alt="YouTube Icon"
          />
        </div>
        <div className="w-1/3 flex justify-center">
          <Image
            className="object-contain"
            src={logo}
            alt="Company Logo"
            loading="lazy"
          />
        </div>
      </div>
      <div className="flex w-11/12 mx-auto md:w-full mb-4">
        <div className="p-2 pt-4 w-1/3 space-y-1">
          <Link href="/brend" className="text-white text-sm font-bold">
            Магазин
          </Link>
          <Link href="/search" className="text-sm font-bold text-gray-500">
            Мужское
          </Link>
          <Link href="/search" className="text-sm font-bold text-gray-500">
            Женское
          </Link>
          <Link href="/trend" className="text-sm font-bold text-gray-500">
            Unicflo в Китае
          </Link>
          <Link
            href="/measurements"
            className="text-sm font-bold text-gray-500"
          >
            Замеры
          </Link>
          <Link href="/delivery" className="text-sm font-bold text-gray-500">
            Доставка и Оплата
          </Link>
          <Link href="/blog" className="text-sm font-bold text-gray-500">
            Блог
          </Link>
          <Link href="/contact" className="text-sm font-bold text-gray-500">
            Связаться с нами
          </Link>
        </div>
      </div>
      <div className="w-11/12 mx-auto md:w-full flex flex-col md:flex-row p-3 gap-4 font-medium text-base border-t-4 md:border-t-0">
        <p className="text-white">© 2025 ООО «Unicflo»</p>
        <p className="text-gray-700">Карта сайта</p>
        <p className="text-gray-700">Политика конфиденциальности</p>
        <p className="text-gray-700">Оферта</p>
      </div>
    </footer>
  );
};

export default Footer;
