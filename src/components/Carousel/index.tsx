"use client"

import { SwiperSlide, Swiper } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/navigation"
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ProductCarouselCard } from "./ProductCarouselCard"



export const ProductCarousel: React.FC<any> = ({ product }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative group">
      <div className="flex justify-between items-center py-2 md:py-4">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold">Только что купили</p>
        <Link
          href="/search"
          className="flex items-center rounded-xl md:rounded-2xl cursor-pointer justify-center text-sm md:text-base bg-[#F2F2F2] text-black w-[80px] md:w-[96px] h-8 md:h-12 gap-1"
        >
          Все <ChevronRight className="text-2xl md:text-4xl" />
        </Link>
      </div>
      <div className="w-full px-1">
        <Swiper
          slidesPerView={2}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 5000,
          }}
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: ".product-carousel-next",
            prevEl: ".product-carousel-prev",
          }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 15,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 15,
            },
            1536: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
          }}
        >
            {product.map((product: Product) => (
            <SwiperSlide className="mb-3" key={product.id}>
              <ProductCarouselCard product={product} />
            </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <button
        style={{ boxShadow: "0px 1px 7px 0px rgba(0,0,0,0.3)" }}
        className="product-carousel-prev cursor-pointer absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        style={{ boxShadow: "0px 1px 7px 0px rgba(0,0,0,0.3)" }}
        className="product-carousel-next cursor-pointer absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  )
}
