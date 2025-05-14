"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import imageCategory from "@/assets/images/mock/imageCategory.png";

interface Category {
  name: string;
  slug?: string; 
}

interface CategoriesCollectionProps {
  categories: Category[];
}

export const CategoriesCollection: React.FC<CategoriesCollectionProps> = ({
  categories,
}) => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 py-5">
        {categories.map((item, index) => (
          <Link
            href="/"
            key={index}
            className="flex border items-center gap-0.5 md:gap-2 px-1 md:px-2 rounded-xl md:rounded-2xl"
          >
            <Image
              src={imageCategory}
              alt={item.name}
              className="object-contain w-12 h-12"
            />
            <p className="text-[8px] md:text-base">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
