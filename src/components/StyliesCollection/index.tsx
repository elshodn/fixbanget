'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { styleData } from '@/lib/mockData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
// import Link from 'next/link';
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import katalogImage from '../../assets/images/katalog.png'; 

interface StyleItem {
  name: string;
  image: string;
  quantity: number;
}

export const StyliesCollection = () => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<any>(null);

  const router = useRouter();

  const handleSlideChange = (swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // const renderCatalogSlide = () => (
  //   <SwiperSlide>
  //     <Link
  //       href="/search"
  //       className="block relative group rounded-xl overflow-hidden h-64 sm:h-80 md:h-96 mx-1"
  //     >
  //       <div
  //         className="absolute inset-0 bg-[#EFEDEC] bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
  //         style={{ backgroundImage: `url(${katalogImage.src})` }}

  //       />
  //       <div className="relative z-10 w-full h-full flex flex-col justify-end p-3 bg-black/50">
  //         <div className="text-center flex flex-col justify-center h-full">
  //           <h1 className="text-[#FF385C] text-xl md:text-4xl font-extrabold">Каталог</h1>
  //           <h2 className="text-white text-2xl sm:text-3xl md:text-4xl mt-2 font-extrabold">2025</h2>
  //         </div>
  //         <Button className="bg-[#FF385C] w-full py-4 sm:py-5 md:py-7 text-lg sm:text-xl hover:bg-[#FF385C]/90">
  //           Открыть
  //         </Button>
  //       </div>
  //     </Link>
  //   </SwiperSlide>
  // );

  const renderProductSlide = (item: StyleItem, index: number) => (
    <SwiperSlide key={index}>
      <div
        onClick={() => router.push('/search')}
        className="block relative group rounded-xl overflow-hidden h-64 sm:h-80 md:h-96 mx-1 cursor-pointer"
      >
        <div
          className="absolute inset-0 bg-[#EFEDEC] bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${item.image})` }}
        />
        <div className="absolute px-2 bottom-3 left-3 right-3 h-14 sm:h-16 bg-white text-black hidden md:flex rounded-md items-center justify-between">
          <div>
            <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
            <p className="text-xs sm:text-sm opacity-80">{item.quantity} вещей</p>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push('/');
            }}
            className="flex justify-center items-center rounded-full bg-[#EFEFEF] w-7 h-7 sm:w-8 sm:h-8 hover:bg-[#DFDFDF]"
            aria-label={`View ${item.name}`}
          >
            <ChevronRight size={16} className="text-gray-700" />
          </div>
        </div>
      </div>
    </SwiperSlide>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Образы от стилиста</h1>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={2.3}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            900: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 3.5, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 20 },
            1400: { slidesPerView: 5, spaceBetween: 20 },
            1536: { slidesPerView: 6, spaceBetween: 24 },
          }}
          className="pb-10 sm:pb-12"
        >
          {/* {renderCatalogSlide()} */}
          {styleData.map((item, index) => renderProductSlide(item, index))}
        </Swiper>
        <button
          style={{ boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.3)' }}
          className={`hidden sm:flex product-carousel-prev cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full items-center justify-center transition-opacity duration-200 ${
            isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft size={18} className="sm:size-5" />
        </button>
        <button
          style={{ boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.3)' }}
          className={`hidden sm:flex product-carousel-next cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md items-center justify-center transition-opacity duration-200 ${
            isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight size={18} className="sm:size-5" />
        </button>
      </div>
    </div>
  );
};
