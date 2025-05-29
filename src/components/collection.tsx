"use client";
import { cn } from "@/lib/utils";
import AllButton from "./all-button";
import Link from "next/link";

interface Props {
  title?: string;
  titleId?: number;
  category: Subcategory[] | Category[];
}

const Collection: React.FC<Props> = ({ category, title, titleId }) => {
  const getColSpan = (index: number, totalItems: number) => {
    if (index === totalItems - 1 && totalItems % 2 !== 0) {
      return "col-span-5";
    }
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
        <AllButton
          route={`/products?${
            title === "Популярный Продукт" ? "" : "categories=" + titleId
          }`}
        />
      </div>
      <div>
        <div className="grid grid-cols-5 gap-4 mb-4">
          {category.map((item, index, categories) => (
            <div
              key={item.id}
              style={{
                backgroundImage: `url(${item?.image})`,
              }}
              className={cn(
                getColSpan(index, categories.length),
                "p-2 bg-contain bg-no-repeat bg-right-bottom bg-[#EFEDEC] w-full relative overflow-hidden h-36 rounded-3xl shadow"
              )}
            >
              <Link
                href={`/products?${
                  title == "Популярный Продукт"
                    ? "categories=" + item.id
                    : "subcategories=" + item.id
                }`}
                className={`text-base  ml-2 mt-2 md:text-2xl font-bold z-10 break-words `}
              >
                {item.name}
                <span className="inset-0 absolute  "></span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
