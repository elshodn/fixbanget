import React from 'react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
export const AboutContainer: React.FC = () => {
  return (
    <div className="relative w-full my-8 md:my-14 h-auto min-h-[300px] md:h-[440px]">
      <div 
        className="absolute inset-0 bg-center bg-cover"
        style={{ 
          backgroundImage: `linear-gradient(90deg, #FFE5D2 10.1%, rgba(255, 255, 255, 0) 75%), url(${'/chinaImage.png'})` 
        }}
      />
      
      <div className="relative w-full md:w-1/2 flex justify-center md:justify-end h-full">
        <div className="w-full md:w-10/12 lg:w-7/12 flex justify-end h-full">
          <div className="flex flex-col justify-evenly h-full p-4 sm:p-6 gap-4 sm:gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium">
              Все новости в нашем телеграм канале
            </h1>
            <p className="text-sm sm:text-base">
              Вступайте в наше сообщество в Telegram, чтобы первыми узнавать о свежих коллекциях, 
              уникальных предложениях непосредственно из Китайской Республики! Исследовать 
              актуальные поступления из Страны Дракона Батон преводяшый.
            </p>
            <Link href="/contact">
              <Button className="w-10/12 md:w-9/12 bg-[#FF385C] py-6 md:py-8 text-lg sm:text-xl">
                Подписаться на канал
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
