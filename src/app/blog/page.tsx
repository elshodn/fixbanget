'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import youtubeblogimage from '@/assets/images/youtubeblogimage.png';
import telegramblogimage from '@/assets/images/telegramblogimage.png';
import instagramblogimage from '@/assets/images/instagramblogimage.png';
import { TelegramChannels } from '@/components/telegram/TelegramChannels';

const Blog: React.FC = () => {
  const blogArray = [
    {
      id: 1,
      title: 'YouTube',
      image: youtubeblogimage,
      link: '',
    },
    {
      id: 2,
      title: 'Instagram',
      image: instagramblogimage,
      link: '',
    },
    {
      id: 3,
      title: 'Telegram',
      image: telegramblogimage,
      link: '',
    },
  ];

  return (
    <div>
      <div className="w-11/12 mx-auto my-10 md:my-20">
        <p className="text-[#8D8D9A] text-[14px]">
          <Link href="/">Главная страница</Link> | Блог
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal py-6 md:py-10">Блог</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 md:gap-7">
          {blogArray.map((item) => (
            <div
              key={item.id}
              className="w-full sm:w-1/2 lg:w-1/3 bg-[#EFEDEC] rounded-[20px] p-4 sm:p-5 h-[350px] sm:h-[400px] md:h-[500px] flex flex-col justify-between mb-4 sm:mb-0"
            >
              <h1 className="text-[#222222] text-xl sm:text-2xl font-bold">{item.title}</h1>
              <div className="flex justify-center sm:justify-end mt-4 sm:mt-0">
                <Image
                  src={item.image}
                  alt={`${item.title} icon`}
                  className="w-3/4 sm:w-1/2 h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <TelegramChannels />
    </div>
  );
};

export default Blog;
