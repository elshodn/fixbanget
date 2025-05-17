import React from "react";
import { brendImages } from "../../assets/images/brendImages/index";
import Image, { StaticImageData } from "next/image";

type BrendImage = {
  img: StaticImageData;
  id: number;
  alt?: string;
};

const BrendImagesCollection: React.FC = () => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-2">
        {brendImages.map((item: BrendImage, index) => (
          <div
            className="flex justify-center items-center rounded-lg p-2 sm:p-3 md:p-4 border border-[#EEEEEE] hover:border-gray-300 transition-colors"
            key={item.id}
          >
            <Image
              className="object-contain w-full h-6"
              src={item.img}
              alt={item.alt || `Brand ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrendImagesCollection;
