'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { styleData } from '@/lib/mockData';
import { Heart } from 'lucide-react';

interface Product {
  id: number;
  name: String;
  image: String; 
}

const Collections: React.FC = () => {
  const initialData: Product[] = styleData.slice(0, 6);
  const [likedItems, setLikedItems] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (id: number) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  console.log(initialData[0].image);
  
  return (
    <div className="my-14 w-11/12 mx-auto">
      <h1 className="text-center text-3xl font-bold mb-6">Коллекция 2025</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {initialData.map((item, index) => (
          <div className="relative" key={index}>
            <button
              onClick={() => toggleLike(item.id)}
              className={`absolute cursor-pointer top-3 right-3 z-10 p-2 rounded-full transition-colors duration-200 ${
                likedItems[item.id]
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-400 hover:text-red-500'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart
                size={20}
                className={likedItems[item.id] ? 'fill-current' : 'fill-none'}
              />
            </button>

            <div className="bg-[#EFEDEC] h-72 relative">
              <img
                src={item.image}
                alt={item.name}
                fill
                className="object-contain w-full h-full"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* <Image src={item.image} /> */}
            </div>

            <p className="text-center text-base font-normal pt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
