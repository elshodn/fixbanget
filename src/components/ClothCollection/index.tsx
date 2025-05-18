'use client';

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CategoriesCollection } from "../categoriesCollection";
import { categoriesAccessories } from "@/lib/mockData";

interface Props {
  title: string;
  product: {
    id: number;
    name: string;
    image: string;
    rotate?: boolean;
  }[];
}

export const ClothCollection: React.FC<Props> = ({title,product}) => {
  return (
    <div className="container mx-auto px-8 py-8 relative">
      <div className="flex justify-between py-4 items-center">
        <p className="text-xl md:text-[32px] font-bold">{title}</p>
        <Link
          href="/search"
          className="flex items-center rounded-2xl cursor-pointer justify-center text-base bg-[#F2F2F2] text-black w-[96px] h-12 gap-1"
        >
          Все <ChevronRight className="text-4xl" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        {product.map((item, index) => (
          <Link
            href="/search"
            key={index}
            className={"grow min-w-1/3 h-[112px]"}
          >
            <div className="bg-[#EFEDEC]  relative   h-full overflow-hidden p-1 md:p-5 rounded-3xl">
              <p className="text-[12px] ml-2 mt-2 md:text-2xl font-bold z-10 relative">
                {item.name}
              </p>
              <div className="absolute w-full h-[80%] bottom-0 left-4 self-end ">
                <Image

                  src={item.image}
                  alt={item.name}
                  priority
                  fill
                  className={`object-contain transition-all ${item.rotate ? "rotate-y-180":""}`}
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
