'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { styleData } from '@/lib/mockData';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useLikeStore } from '@/stores/likeStore';
import Image from 'next/image';

const Wishlist = () => {
  const likedProducts = useLikeStore((state) => state.likedProducts);
  const toggleLike = useLikeStore((state) => state.toggleLike);

  const likedItems = styleData.filter((item) => likedProducts.includes(item.id));
  const hasItems = likedItems.length > 0;
  const [showEmptyState, setShowEmptyState] = useState(!hasItems);

  useEffect(() => {
    setShowEmptyState(!hasItems);
  }, [likedItems]);

  const handleDeleteAll = () => {
    likedProducts.forEach((id: Number) => toggleLike(id));
    setShowEmptyState(true);
  };

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10'>
      <div className='flex justify-between items-start sm:items-center mb-6 md:mb-8 gap-4'>
        <h1 className='font-semibold text-xl sm:text-3xl md:text-4xl'>Мой список желаний</h1>
        {hasItems && !showEmptyState && (
          <Button
            variant="ghost"
            onClick={handleDeleteAll}
            className="text-[#F04438] hover:bg-transparent font-medium text-sm sm:text-base"
          >
            Удалить все
          </Button>
        )}
      </div>

      {!showEmptyState && hasItems ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {likedItems.map((item) => (
            <div key={item.id} className="group relative overflow-hidden transition-shadow hover:shadow-lg rounded-lg">
              <button
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full hover:bg-white cursor-pointer transition-colors"
                onClick={() => toggleLike(item.id)}
                aria-label="Remove from wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#F04438] fill-[#F04438]" />
              </button>

              <Link href={`/product/${item.id}`} className="block">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-3 sm:p-4">
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">{item.stylist}</p>
                  <h3 className="font-medium text-base sm:text-lg line-clamp-1">{item.name}</h3>
                  <p className="font-semibold text-base sm:text-lg mt-1 sm:mt-2">{item.quantity} ₽</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center space-y-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto py-10 sm:py-20'>
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#F04438]" />
          </div>
          <h1 className="text-[#1B1B1B] text-xl sm:text-2xl font-semibold capitalize mt-4">Пустой список желаний</h1>
          <p className='text-[#8D8D8D] font-normal text-sm sm:text-base px-4 sm:px-0'>
            В вашем списке желаний нет ни одного товара.
          </p>
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button className="bg-[#FF385C] w-full sm:w-64 font-semibold text-base mt-4">
              Продолжить покупки
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
