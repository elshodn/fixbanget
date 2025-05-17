'use client';

import { categories } from '@/lib/mockData';

import image1 from '@/assets/images/mock/odejda.png';
import image2 from '@/assets/images/mock/shoess.png';
import image3 from '@/assets/images/mock/watches.png';
import image4 from '@/assets/images/mock/glasses.png';
import image5 from '@/assets/images/mock/sumki.png';

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CategoriesCollection } from "../categoriesCollection";
import { categoriesAccessories } from "@/lib/mockData";


export const ClothCollection: React.FC = () => {
  return (
    <div className="container mx-auto px-8 py-8 relative">
      <div className="flex justify-between py-4 items-center">
        <p className="text-xl md:text-[32px] font-bold">Аксессуары</p>
        <Link
          href="/search"
          className="flex items-center rounded-2xl cursor-pointer justify-center text-base bg-[#F2F2F2] text-black w-[96px] h-12 gap-1"
        >
          Все <ChevronRight className="text-4xl" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        {["Одежда","Обувь","Часы","Аксессуары","Сумки"].map((item, index) => (
          <Link
            href="/search"
            key={index}
            className={"grow min-w-1/3 h-[112px]"}
          >
            <div className="bg-[#EFEDEC] flex  justify-between  h-full p-1 md:p-5 rounded-3xl">
              <p className="text-[12px] ml-2 mt-2 md:text-2xl font-bold">
                {item}
              </p>
              <div className="relative w-1/2 h-[80%] self-end">
                <Image
                  src={item === "Одежда" ? image1 : item === "Обувь" ? image2 : item === "Часы" ? image3 : item === "Аксессуары" ? image4 : image5}
                  alt={item}
                  priority
                  fill
                  className={`object-contain transition-all ${item === "Аксессуары"?" rotate-y-180":""}`}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden md:block">
        <CategoriesCollection categories={categoriesAccessories} />
      </div>
    </div>
  );
};
