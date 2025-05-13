import React from 'react';
import { brendImages } from '../../assets/images/brendImages/index';

type BrendImage = {
  img: string;
  alt?: string;
};

const BrendImagesCollection: React.FC = () => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4">
          {brendImages.map((item: BrendImage, index: number) => (
            <div
              className="flex justify-center items-center rounded-lg p-2 sm:p-3 md:p-4 border border-[#EEEEEE] hover:border-gray-300 transition-colors"
              key={index}
            >
              <img
                className="object-contain w-full h-6"
                src={item.img}
                alt={item.alt || `Brand ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrendImagesCollection;
