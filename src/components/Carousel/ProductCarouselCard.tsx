"use client";

import type React from "react";

import { Heart, ImageIcon, Zap } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

interface ProductCarouselCardProps {
  product: Product;
}

export const ProductCarouselCard: React.FC<ProductCarouselCardProps> = ({
  product,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const toggleWishlistItem = useWishlistStore(
    (state) => state.toggleWishlistItem
  );
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );
  const isLoading = useWishlistStore((state) => state.isLoading);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product.id);
  };

  return (
    <div>
      <div className="w-full min-h-60 mb-2 relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 group">
        <button
          onClick={handleToggleWishlist}
          disabled={isLoading}
          className={`absolute cursor-pointer top-1 left-1 z-10 p-2 rounded-full transition-colors duration-200 ${
            isInWishlist
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-500"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart
            size={20}
            className={isInWishlist ? "fill-current" : "fill-none"}
          />
        </button>
        <Link href={`/products/${product.slug}`}>
          <div>
            <div className="h-36 overflow-hidden relative flex justify-center items-center">
              {isImageLoading && !imageError && (
                <Skeleton className="w-full h-full absolute inset-0" />
              )}

              {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
              ) : (
                <Image
                  alt={product?.name || "Product"}
                  src={
                    product.images[0]?.image ||
                    "/placeholder.svg?height=144&width=200&query=product"
                  }
                  priority
                  className={`object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105 ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  fill
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setIsImageLoading(false);
                    setImageError(true);
                  }}
                />
              )}
            </div>
            <div className="px-3 pb-2">
              <div className="p-1 ">
                <div className="flex items-end gap-3">
                  <span
                    className={`text-[9px] sm:text-sm lg:text-lg font-bold ${
                      product.discount_price
                        ? "text-[#FF3A5C]"
                        : "text-gray-900"
                    }`}
                  >
                    {Math.round(
                      Number(product.price) -
                        Number(product.discount_price || 0)
                    )}{" "}
                    ₽
                  </span>
                  {product.discount_price && (
                    <span className="text-[7px] sm:text-sm lg:text-lg text-gray-500 line-through">
                      {product.price} ₽
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <p className="bg-[#3E3E3E] text-white px-1 text-[7px] sm:text-sm lg:text-lg p-0.5 rounded-sm ">
                  {product.discount_price !== null &&
                  !isNaN(Number(product.price)) &&
                  !isNaN(Number(product.discount_price))
                    ? Math.round(
                        (Number(product.price) -
                          Number(product.discount_price)) /
                          2
                      ) + " ₽x 2"
                    : ""}
                </p>
                <p>в сплит</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-sm lg:text-lg py-2 font-medium ">
                  {product.name}
                </p>
                <p className="text-[#656565] flex items-center gap-1 text-[10px] sm:text-sm lg:text-lg">
                  {product.shipping_methods[0]?.min_days || "-"} дня ·{" "}
                  <Zap size={16} />{" "}
                  {product.shipping_methods[0]?.max_days || "-"} дней
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

// import { Heart, ImageIcon, Zap } from "lucide-react";
// import { useLikeStore } from "@/stores/likeStore";
// import Link from "next/link";
// import { Skeleton } from "../ui/skeleton";
// import Image from "next/image";

// interface ProductCarouselCardProps {
//   product: Product;
// }

// export const ProductCarouselCard: React.FC<ProductCarouselCardProps> = ({
//   product,
// }) => {
//   console.log(product.images[0].image);

//   const toggleLike = useLikeStore(
//     (state: { toggleLike: (id: string) => void }) => state.toggleLike
//   );
//   const isLiked = useLikeStore((state: { likedProducts: string[] }) =>
//     state.likedProducts.includes(product.id.toString())
//   );

//   return (
//     <div>
//       <div className="w-full min-h-60 mb-2 relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 group">
//         <button
//           onClick={() => toggleLike(product.id.toString())}
//           className={`absolute cursor-pointer top-1 left-1 z-10 p-2 rounded-full transition-colors duration-200 ${
//             isLiked
//               ? "text-red-500 fill-red-500"
//               : "text-gray-400 hover:text-red-500"
//           }`}
//         >
//           <Heart size={20} className={isLiked ? "fill-current" : "fill-none"} />
//         </button>
//         <Link href={`/products/${product.slug}`}>
//           <div>
//             <div className="h-36 overflow-hidden relative flex justify-center items-center">
//               <Image
//                 alt={product?.name || "Product"}
//                 src={product.images[0].image}
//                 priority
//                 className="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105"
//                 fill
//               />
//               {/* <ImageIcon className="w-15 absolute" />
//               <Skeleton className="w-11/12 h-full object-contain transition-transform duration-300 hover:scale-105" /> */}
//             </div>
//             <div className="px-3 pb-2">
//               <div className="p-1 ">
//                 <div className="flex  items-end gap-3">
//                   <span
//                     className={`text-[9px] sm:text-sm lg:text-lg font-bold ${
//                       product.discount_price
//                         ? "text-[#FF3A5C]"
//                         : "text-gray-900"
//                     }`}
//                   >
//                     {Math.round(
//                       Number(product.price) - Number(product.discount_price)
//                     )}{" "}
//                     ₽
//                   </span>
//                   {product.discount_price && (
//                     <span className="text-[7px] sm:text-sm lg:text-lg text-gray-500 line-through">
//                       {product.price} ₽
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-[11px] font-medium">
//                 <p className="bg-[#3E3E3E] text-white px-1 text-[7px] sm:text-sm lg:text-lg p-0.5 rounded-sm ">
//                   {product.discount_price !== null &&
//                   !isNaN(Number(product.price)) &&
//                   !isNaN(Number(product.discount_price))
//                     ? Math.round(
//                         (Number(product.price) -
//                           Number(product.discount_price)) /
//                           2
//                       ) + " ₽x 2"
//                     : ""}
//                 </p>
//                 <p>в сплит</p>
//               </div>
//               <div>
//                 <p className="text-[10px] sm:text-sm lg:text-lg py-2 font-medium ">
//                   {product.name}
//                 </p>
//                 <p className="text-[#656565] flex items-center gap-1 text-[10px] sm:text-sm lg:text-lg">
//                   {product.shipping_methods[0].min_days} дня · <Zap size={16} />{" "}
//                   {product.shipping_methods[0].max_days} дней
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };
