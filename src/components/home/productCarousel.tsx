'use client';

import { Heart, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLikeStore } from '@/stores/likeStore'; // update path as needed
// import type { Product } from '@/types'; // if types are used

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
  };
};

export const ProductCarouselCard = ({ product }: Props) => {
  const toggleLike = useLikeStore((state) => state.toggleLike);
  const isLiked = useLikeStore((state) => state.likedProducts.includes(product.id));
  const router = useRouter();

  const handleProductClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;

    router.push(`/detailCard/${product.name}`);
    window.scrollTo(0, 0);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleLike(product.id);
  };

  return (
    <div
      className="w-full min-h-60 mb-2 relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
      onClick={handleProductClick}
    >
      <button
        onClick={handleLikeClick}
        className={`absolute cursor-pointer top-1 left-1 z-10 p-2 rounded-full transition-colors duration-200 ${
          isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
      >
        <Heart
          size={20}
          className={isLiked ? 'fill-current' : 'fill-none'}
        />
      </button>

      <div className="h-36 overflow-hidden flex justify-center items-center">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="w-11/12 h-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-1">
        <div className="flex items-end gap-3">
          <span className={`text-[20px] font-bold ${product.oldPrice ? "text-[#FF3A5C]" : "text-gray-900"}`}>
            {product.price} ₽
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">{product.oldPrice} ₽</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <p className="bg-[#3E3E3E] text-white p-0.5 rounded-sm w-16">0 ₽x 2</p>
          <p>в сплит</p>
        </div>
        <div>
          <p className="text-sm py-2 font-medium">{product.name}</p>
          <p className="text-[#656565] flex items-center gap-1">24 дня · <Zap size={16} /> 16 дней</p>
        </div>
      </div>
    </div>
  );
};
