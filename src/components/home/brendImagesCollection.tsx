"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";

interface Props {
  brands: Brand[];
}

const BrendImagesCollection: React.FC<Props> = ({ brands }) => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-2">
        {brands?.map((item, index) => (
          <div
            className="flex justify-center items-center rounded-lg p-2 sm:p-3 md:p-4 border border-[#EEEEEE] hover:border-gray-300 transition-colors"
            key={item.id}
          >
            {item?.logo ? (
              <Image
                className="object-contain w-full h-6"
                src={item.logo}
                width={100}
                height={100}
                alt={item?.name || `Brand ${index + 1}`}
                loading="lazy"
              />
            ) : (
              <div className="object-contain w-full h-6 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-4">
        <Button className="bg-[#FF385C] ">посмотреть все бренды</Button>
      </div>
    </div>
  );
};

export default BrendImagesCollection;
