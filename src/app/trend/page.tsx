'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import trendHeader from '@/assets/images/trendHeader.png';
import trendHeader2 from '@/assets/images/trendHeader2.png';
import { Button } from '@/components/ui/button';
import BrendImagesCollection from '@/components/home/brendImagesCollection';
import { TelegramChannels } from '@/components/telegram/TelegramChannels';
import NewProducts from '@/components/newProducts';
import  Collections  from '@/components/collections';

const Trend = () => {
  return (
    <div className="overflow-x-hidden mt-20">
      <div
        className="w-full h-96 md:h-[470px]"
        style={{ background: `url(${trendHeader.src}) center/cover` }}
      >
        <div className="flex justify-center items-center h-full bg-black/20 px-4 sm:px-6">
          <div className="text-white w-full md:w-10/12 lg:w-9/12">
            <div className="w-full md:w-max">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-normal text-left">
                МОДНЫЕ ЛИНЕЙКИ БРЕНДОВОЙ ОДЕЖДЫ 2025 ГОДА
              </h1>
              <div className="border border-white w-full my-3 sm:my-4 md:my-5"></div>
            </div>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-left mt-4">
              UniqFlo в Поднебесной
            </p>
            <Link href="/measurements" className="flex">
              <Button className="bg-[#FF385C] text-white text-base sm:text-lg md:text-xl font-normal py-3 sm:py-4 md:py-6 px-6 sm:px-8 md:px-10 my-6 sm:my-8 md:my-10">
                Оставить заявку
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-11/12 sm:w-10/12 md:w-8/12 mx-auto py-6 sm:py-8 md:py-10">
        <h3 className="my-4 sm:my-5 md:my-7 text-lg sm:text-xl md:text-xl font-bold">
          UniqFlo в Поднебесной: Охота за Модными Тенденциями
        </h3>
        <p className="text-sm sm:text-base font-normal">
          Коллектив UniqFlo в неустанном поиске элегантности и трендов embarked на увлекательное
          путешествие в эпицентр фэшн-индустрии - Китайскую Народную Республику. Мы неуклонно
          придерживаемся принципа, чтобы каждый предмет гардероба, включенный в наш каталог, был не
          просто модным, но и соответствовал премиальным критериям качества. Не пропустите
          возможность модернизировать свою коллекцию одежды вместе UniqFlo, каждый квартал
          организуется приобретение новинок, оставьте заявку и присоединитесь к телеграмм-каналу,
          чтобы быть в курсе всех обновлений!
        </p>
      </div>

      {/* Gradient Image Section */}
      <div
        className="h-auto min-h-[300px] sm:h-[360px] md:h-[440px] w-full my-6 sm:my-8 md:my-10 bg-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(90deg, #FFE5D2 10.1%, rgba(255, 255, 255, 0) 75%), url(${trendHeader2.src})`,
        }}
      >
        <div className="w-full md:w-1/2 flex justify-center md:justify-end h-full items-center px-4 sm:px-6">
          <div className="w-full sm:w-10/12 md:w-8/12 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-left">
              Самые жаркие тренды прямиком из Поднебесной!
            </h1>
            <p className="text-sm sm:text-base font-normal text-left">
              Вступайте в наше сообщество в Telegram, чтобы первыми узнавать о свежих коллекциях,
              уникальных предложениях непосредственно из Китайской Республики! Исследовать актуальные
              поступления из Страны Дракона Батон преводяшый.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button className="bg-[#FF385C] w-full sm:w-max text-white text-base sm:text-lg md:text-xl font-normal py-6 md:py-8 px-6 sm:px-10 md:px-12">
                Ознакомиться с новыми <br className="inline" /> поступлениями из Китая
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Component Sections */}
      <NewProducts />
      <Collections />
      <h1 className="text-center font-bold text-xl md:text-3xl">Все бренды</h1>
      <BrendImagesCollection />
      <Link href="/search" className="flex justify-center">
        <Button className="bg-[#FF385C] text-2xl font-normal p-5">посмотреть все бренды</Button>
      </Link>
      <TelegramChannels />
    </div>
  );
};

export default Trend;
