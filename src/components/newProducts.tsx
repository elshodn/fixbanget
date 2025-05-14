'use client';

import React from 'react';
import Image from 'next/image';
import { newProductData } from '@/lib/mockData';

interface Product {
  title: string;
  desc: string;
  image: string;
}

const NewProducts: React.FC = () => {
  return (
    <div className="mx-auto px-0 sm:px-6 py-6 sm:py-8 lg:py-10 w-full sm:w-11/12 my-8 sm:my-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center">Наши новинки</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {newProductData.map((item, index) => (
          <div
            key={index}
            className="flex h-64 sm:h-72 md:h-80 bg-gradient-to-r from-[#EFEDEC] to-[white] overflow-hidden rounded-none sm:rounded-lg"
          >
            <div className="p-4 sm:p-5 md:p-6 flex-1 h-full flex flex-col justify-between sm:justify-evenly gap-2 sm:gap-3 md:gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#C88C555E] mb-2 sm:mb-3">
                  {item.title}
                </h1>
                <div className="h-1 sm:h-2 w-full bg-gradient-to-r from-[#C88C55] to-white"></div>
              </div>
              <p className="text-sm sm:text-base font-normal">{item.desc}</p>
            </div>
            <div className="flex-1 h-full relative min-h-[200px] sm:min-h-[250px] md:min-h-0">
              <Image
                src={item.image}
                alt={item.title}
                className="object-contain object-center p-2 sm:p-4"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
