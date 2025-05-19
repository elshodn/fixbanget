import { Heart, Image, Zap } from "lucide-react";
import { useLikeStore } from "@/stores/likeStore";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface ProductCarouselCardProps {
  product: Product;
}

export const ProductCarouselCard: React.FC<ProductCarouselCardProps> = ({
  product,
}) => {
  const toggleLike = useLikeStore(
    (state: { toggleLike: (id: string) => void }) => state.toggleLike
  );
  const isLiked = useLikeStore((state: { likedProducts: string[] }) =>
    state.likedProducts.includes(product.id.toString())
  );

  return (
    <div>
      <div className="w-full min-h-60 mb-2 relative overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 group">
        <button
          onClick={() => toggleLike(product.id.toString())}
          className={`absolute cursor-pointer top-1 left-1 z-10 p-2 rounded-full transition-colors duration-200 ${
            isLiked
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart size={20} className={isLiked ? "fill-current" : "fill-none"} />
        </button>
        <Link href={`/detailCard/${product.name}`}>
          <div className="h-36 overflow-hidden flex justify-center items-center">
            {/* <img
                            src={product.image}
                            alt={product.name}
                            className="w-11/12 h-full object-contain transition-transform duration-300 hover:scale-105"
                        /> */}
            <Image className="w-15 absolute" />
            <Skeleton className="w-11/12 h-full object-contain transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="px-3 pb-2">
            <div className="p-1 ">
              <div className="flex  items-end gap-3">
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
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <p className="bg-[#3E3E3E] text-white px-1 p-0.5 rounded-sm ">
                0 ₽x 2
              </p>
              <p>в сплит</p>
            </div>
            <div>
              <p className="text-sm py-2 font-medium">{product.name}</p>
              <p className="text-[#656565] flex items-center gap-1">
                24 дня · <Zap size={16} /> 16 дней
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
