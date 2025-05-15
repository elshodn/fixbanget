import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronRight, Zap, Gem } from "lucide-react";
import Link from "next/link";
import { useLikeStore } from "@/stores/likeStore";

type StyledData = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  oldPrice?: number;
};

type CatalogsProps = {
  title: string;
  desc: string;
  product: StyledData[];
  link: string;
  linkButtonTitle: string;
};

export const Catalogs: React.FC<CatalogsProps> = ({
  title,
  desc,
  product,
  link,
  linkButtonTitle,
}) => {
  const toggleLike = useLikeStore((state) => state.toggleLike);
  const isLiked = useLikeStore((state) => state.isLiked);

  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialLikes: Record<string, boolean> = {};
    product?.forEach((p) => {
      initialLikes[String(p.id)] = isLiked(String(p.id));
    });
    setLocalLikes(initialLikes);
  }, [product]);

  const handleLike = (productId: string) => {
    setLocalLikes((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    toggleLike(productId);
  };

  return (
    <div className="p-2 md:p-6 w-11/12 mx-auto my-14">
      <div className="text-center mb-8">
        <h1 className="text-xl mb-3 md:text-3xl font-bold">{title}</h1>
        <p className="text-gray-600 mx-auto w-full md:w-2/3 text-[12px] md:text-base">
          {desc}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {product?.map((product) => (
          <Card
            key={product.id}
            className="relative gap-0 overflow-hidden group border-none shadow-none"
          >
            <button
              onClick={() => handleLike(String(product.id))}
              aria-label={
                localLikes[String(product.id)]
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className={`absolute cursor-pointer top-3 left-3 z-10 p-2 rounded-full transition-colors duration-200 ${
                localLikes[String(product.id)]
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart
                size={20}
                className={localLikes[String(product.id)] ? "fill-current" : "fill-none"}
              />
            </button>

            <CardHeader className="h-36 overflow-hidden flex justify-center items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </CardHeader>

            <CardContent className="p-0 m-0">
              <div className="flex items-end gap-3">
                <span
                  className={`text-[20px] font-bold ${
                    product.oldPrice ? "text-[#FF3A5C]" : "text-gray-900"
                  }`}
                >
                  {product.price} ₽
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.oldPrice} ₽
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium mt-1">
                <p className="bg-[#3E3E3E] text-white p-0.5 rounded-sm w-16">
                  0 ₽x 2
                </p>
                <p>в сплит</p>
              </div>

              <div className="mt-2">
                <p className="text-sm py-1 font-medium">{product.name}</p>
                <p className="text-[#656565] flex items-center gap-1">
                  <Gem className="text-[#FF3A5C]" size={16} /> 24 дня ·{" "}
                  <Zap size={16} /> 16 дней
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center mt-6">
        <Link href={link}>
          <Button className="gap-2">
            {linkButtonTitle} <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};
