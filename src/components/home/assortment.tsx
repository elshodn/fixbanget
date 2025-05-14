"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import image from '../../assets/images/erasebg-transformed.png';

export const Assortment: React.FC = () => {
  return (
    <div className="text-center relative bg-gradient-to-b from-[#ccc8c5] to-white pt-10 md:pt-0">
      <h1 className="text-6xl sm:text-8xl md:text-[150px] xl:text-[300px] top-10 absolute w-full text-white font-playfair leading-none">
        UNICFLO
      </h1>
      <div className="flex mx-auto w-11/12 relative z-10 gap-4 lg:gap-0">
        <div className="relative w-1/3 xl:w-full lg:w-auto mx-auto lg:mx-0">
          <Image
            src={image.src}
            alt="Assortment"
            width={600}
            height={600}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center lg:items-end w-1/2 md:w-full pb-10 lg:pb-0">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-medium text-right">
            Весь ассортимент
          </h1>
          <div className="pt-5 flex items-center justify-end gap-2 sm:gap-4">
            <Button className="bg-transparent border border-black px-6 sm:px-8 md:px-10 text-black text-[10px] sm:text-base font-semibold hover:text-white hover:bg-black transition-colors w-1/2 md:w-1/2">
              Для неё
            </Button>
            <Button className="bg-transparent border border-black px-6 sm:px-8 md:px-10 text-black text-[10px] sm:text-base font-semibold hover:text-white hover:bg-black transition-colors w-1/2 md:w-1/2">
              Для него
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
