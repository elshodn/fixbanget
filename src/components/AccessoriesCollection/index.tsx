"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CategoriesCollection } from "../categoriesCollection";
import { categoriesAccessories } from "@/lib/mockData";

// Har bir mahsulot elementining interfeysi
interface ProductItem {
  name: string;
  image: string;
  slug?: string; // optional if you want dynamic routes later
}

// Props interfeysi
interface AccessoriesCollectionProps {
  product: ProductItem[];
}

export const AccessoriesCollection: React.FC<AccessoriesCollectionProps> = ({
  product,
}) => {
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

      <div className="grid grid-cols-12 lg:grid-cols-7 grid-rows-2 md:grid-rows-1 gap-4">
        {product.slice(0, 5).map((item, index) => (
          <Link
            href="/search"
            key={index}
            className={
              index < 2 ? "col-span-6 lg:col-span-2" : "col-span-4 lg:col-span-1"
            }
          >
            <div className="bg-[#EFEDEC] md:h-80 p-1 md:p-5 rounded-3xl">
              <p className="text-[10px] ml-2 mt-2 md:text-2xl font-bold">
                {item.name}
              </p>
              <div className="relative w-full md:h-full aspect-square">
                <Image
                  src={item.image}
                  alt={item.name}
                  priority
                  fill
                  className="object-contain transition-all hover:scale-105"
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
