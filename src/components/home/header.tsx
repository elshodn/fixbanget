import Image from "next/image";
import image1 from "../../assets/images/mock/image1.png";
import image2 from "../../assets/images/mock/image2.png";
import image3 from "../../assets/images/mock/image3.png";
import image4 from "../../assets/images/mock/image4.png";
import image5 from "../../assets/images/mock/image5.png";
import image6 from "../../assets/images/mock/image6.png";
import { ChevronRight } from "lucide-react";
import Link from 'next/link';

const ProductCard = ({ children, image }) => (
  <Link href="/search" className={`block h-full w-full p-3 rounded-2xl overflow-hidden bg-[#EFEDEC] relative`}>
    <p className="font-bold text-sm md:text-2xl mb-2 whitespace-nowrap absolute z-10">{children}</p>
    <Image 
      src={image} 
      className="object-contain w-full h-full md:h-[calc(100%-50px)] md:static absolute top-0" 
      alt="" 
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  </Link>
);

export const Header = () => {
  return (
    <>
      <div className="flex justify-between py-4 items-center">
        <p className="md:text-[32px] font-bold">Обувь</p>
        <Link href="/search" className="flex items-center rounded-xl md:rounded-2xl cursor-pointer justify-center text-base bg-[#F2F2F2] text-black p-2 md:p-0 md:w-[96px] md:h-12 gap-1">
          Все <ChevronRight className="text-4xl" />
        </Link>
      </div>
      <div className="grid grid-cols-6 grid-rows-2 gap-4 min-h-[500px]">
        <div className="col-span-4 md:col-span-2 md:row-span-2 min-h-[100px] md:min-h-[250px]">
          <ProductCard image={image1}>Кроссовки <br />и кеды</ProductCard>
        </div>
        <div className="col-span-2 md:col-span-2 md:row-span-2 min-h-[100px] md:min-h-[250px]">
          <ProductCard image={image2}>Обувь для <br />спорта</ProductCard>
        </div>
        <div className="col-span-2 md:col-span-1 min-h-[150px]">
          <ProductCard image={image3}>Кастомные <br />кроссовки</ProductCard>
        </div>
        <div className="col-span-4 md:col-span-1 min-h-[150px]">
          <ProductCard image={image4}>Ботинки</ProductCard>
        </div>
        <div className="col-span-3 md:col-span-1 min-h-[150px]">
          <ProductCard image={image6}>Тапки</ProductCard>
        </div>
        <div className="col-span-3 md:col-span-1 min-h-[150px]">
          <ProductCard image={image5}>Сапоги</ProductCard>
        </div>
      </div>
    </>
  );
};