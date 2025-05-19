"use client";
import { cn } from "@/lib/utils";
import AllButton from "./all-button";
import Link from "next/link";

export type Product = {
  id: number;
  name: string;
  image: string;
  rotate?: boolean;
  scale?: boolean;
};

interface Props {
  title?: string;
  product: Product[];
}

const Collection: React.FC<Props> = ({ product, title }) => {
  // Mahsulot indeksiga qarab col-span qiymatini aniqlash
  const getColSpan = (index: number, totalItems: number) => {
    // Agar oxirgi element va mahsulotlar soni toq bo'lsa
    if (index === totalItems - 1 && totalItems % 2 !== 0) {
      return "col-span-5"; // Oxirgi element uchun to'liq kenglik
    }

    // Boshqa holatlar uchun ketma-ketlik: 3,2,2,3,3,2,2,3,...
    const position = index % 4;
    if (position === 0 || position === 3) {
      return "col-span-3";
    } else {
      return "col-span-2";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between py-4 items-center">
        <p className="text-xl md:text-[32px] font-bold">{title}</p>
        <AllButton route="/search" />
      </div>
      <div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          {product.map((item, index) => (
            <Link
              href="/search"
              key={index}
              className={cn(getColSpan(index, product.length), "w-full h-36")}
            >
              <div
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
                className={cn(
                  getColSpan(index, product.length),
                  "p-2 bg-contain bg-no-repeat bg-right-bottom bg-[#EFEDEC] w-full h-full rounded-3xl shadow"
                )}
              >
                <p
                  className={`text-base  ml-2 mt-2 md:text-2xl font-bold z-10 ${
                    item.name == "Нижнее бельё и одежда для дома" ? "w-1/2" : ""
                  }`}
                >
                  {item.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;

// "use client";
// import React from "react";
// import AllButton from "./all-button";

// interface Props {
//   title?: string;
//   product: {
//     id: number;
//     name: string;
//     image: string;
//     rotate?: boolean;
//     scale?: boolean;
//   }[];
// }

// function Collection({ product, title }: Props) {
//   return (
//     <div className="container mx-auto px-4 py-8 relative">
//       <div className="flex justify-between py-4 items-center">
//         <p className="text-xl md:text-[32px] font-bold">{title}</p>
//         <AllButton route="/search" />
//       </div>
//       <div>
//         <div className="grid grid-cols-5 gap-4 mb-4">
//           <div className="col-span-3 p-2 bg-[url(/famousc/kiyim.png)]  bg-right bg-contain bg-no-repeat border w-full h-36 rounded-3xl shadow">
//             <p className="text-base ml-2 mt-2 md:text-2xl font-bold z-10 relative">
//               Одежда
//             </p>
//           </div>
//           <div className="col-span-2 p-2 bg-[url(/famousc/obuvcha2.png)]  bg-right bg-contain bg-no-repeat border w-full h-36 rounded-3xl shadow">
//             <p className="text-base ml-2 mt-2 md:text-2xl font-bold z-10 relative">
//               Обувь
//             </p>
//           </div>
//           <div className="col-span-2 p-2 bg-[url(/famousc/soat.png)]  bg-right bg-contain bg-no-repeat border w-full h-36 rounded-3xl shadow">
//             <p className="text-base ml-2 mt-2 md:text-2xl font-bold z-10 relative">
//               Часы
//             </p>
//           </div>
//           <div className="col-span-3 p-2 bg-[url(/famousc/achki.png)]  bg-right bg-contain bg-no-repeat border w-full h-36 rounded-3xl shadow">
//             <p className="text-base ml-2 mt-2 md:text-2xl font-bold z-10 relative">
//               Аксессуары
//             </p>
//           </div>
//           <div className="col-span-5 p-2 bg-[url(/famousc/sumki.png)]  bg-right bg-contain bg-no-repeat border w-full h-36 rounded-3xl shadow">
//             <p className="text-base ml-2 mt-2 md:text-2xl font-bold z-10 relative">
//               Сумки
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Collection;
