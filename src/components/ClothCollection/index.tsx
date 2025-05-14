'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { categories } from '@/lib/mockData';
import { CategoriesCollection } from '../categoriesCollection';

import image1 from '../../assets/images/mock/image12.png';
import image2 from '../../assets/images/mock/image8.png';
import image3 from '../../assets/images/mock/image11.png';
import image4 from '../../assets/images/mock/image7.png';
import image5 from '../../assets/images/mock/image9.png';
import image6 from '../../assets/images/mock/image10.png';
interface ProductCardProps {
  children: React.ReactNode;
  // image: StaticImageData;
}

const ProductCard = ({ children, image }: ProductCardProps) => (
  <Link
    href="/search"
    className="block h-full w-full p-3 rounded-xl md:bg-center bg-right md:rounded-2xl overflow-hidden"
    style={{
      backgroundColor: '#EFEDEC',
      backgroundImage: `url(${image.src})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <p className="font-bold md:text-2xl mb-2">{children}</p>
  </Link>
);

export const ClothCollection = () => {  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between py-4">
        <p className="text-[32px] font-bold">Обувь</p>
        <Link
          href="/search"
          className="flex items-center rounded-2xl cursor-pointer justify-center text-base bg-[#F2F2F2] text-black w-[96px] h-12 gap-1"
        >
          Все <ChevronRight className="text-4xl" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 grid-rows-4 md:grid-cols-6 md:grid-rows-2 h-[500px] gap-4">
        {/* Item 1 */}
        <div className="row-span-2 md:row-start-1 md:row-span-1 md:col-start-1">
          <ProductCard image={image1}>Футболки</ProductCard>
        </div>

        {/* Item 2 */}
        <div className="md:row-start-1 md:col-start-2">
          <ProductCard image={image2}>Свитшоты</ProductCard>
        </div>

        {/* Item 3 */}
        <div className="row-span-1 md:row-start-1 md:row-end-3 md:col-start-3 md:col-span-2">
          <ProductCard image={image3}>
            Верхняя <br /> одежда
          </ProductCard>
        </div>

        {/* Item 4 */}
        <div className="row-span-2 md:row-start-1 md:row-end-3 md:col-start-5 md:col-span-2">
          <ProductCard image={image4}>Худи</ProductCard>
        </div>

        {/* Item 5 */}
        <div className="md:row-start-2 md:col-start-1">
          <ProductCard image={image5}>
            Кепки <br /> и шапки
          </ProductCard>
        </div>

        {/* Item 6 */}
        <div className="md:row-start-2 md:col-start-2">
          <ProductCard image={image6}>Джинсы</ProductCard>
        </div>
      </div>

      {/* Categories on Desktop */}
      <div className="hidden md:block">
        <CategoriesCollection categories={categories} />
      </div>
    </div>
  );
};
