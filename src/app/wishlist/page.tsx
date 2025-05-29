"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import { useWishlistStore } from "@/stores/wishlist-store";

const Wishlist = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [removingProductIds, setRemovingProductIds] = useState<number[]>([]);

  // Wishlist store'dan ma'lumotlarni olish
  const {
    wishlistItems,
    isLoading,
    fetchWishlist,
    toggleWishlistItem,
    clearWishlist,
    telegramId,
  } = useWishlistStore();

  // Component mount bo'lganda wishlist ma'lumotlarini olish
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Mahsulotni wishlistdan o'chirish
  const handleRemoveItem = async (productId: number) => {
    // Agar mahsulot allaqachon o'chirilayotgan bo'lsa, qayta so'rov yubormaymiz
    if (removingProductIds.includes(productId)) return;

    // O'chirilayotgan mahsulotlar ro'yxatiga qo'shamiz
    setRemovingProductIds((prev) => [...prev, productId]);

    try {
      await toggleWishlistItem(productId);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении товара из списка желаний",
        variant: "destructive",
      });
    } finally {
      // O'chirilgan mahsulotni ro'yxatdan olib tashlaymiz
      setRemovingProductIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Barcha mahsulotlarni wishlistdan o'chirish
  const handleDeleteAll = async () => {
    if (isRemoving || wishlistItems.length === 0) return;

    setIsRemoving(true);
    try {
      // Barcha mahsulotlarni o'chirish uchun so'rovlar
      const removePromises = wishlistItems.map((product) =>
        toggleWishlistItem(product.id)
      );
      await Promise.all(removePromises);

      toast({
        title: "Успешно",
        description: "Все товары удалены из списка желаний",
      });
    } catch (error) {
      console.error("Error removing all items from wishlist:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении товаров из списка желаний",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Wishlist bo'sh yoki yo'qligini tekshirish
  const hasItems = wishlistItems.length > 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <h1 className="font-semibold text-xl sm:text-3xl md:text-4xl">
          Мой список желаний
        </h1>
        {hasItems && (
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className="text-[#F04438] hover:bg-transparent font-medium text-sm sm:text-base"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Удалить все
          </Button>
        )}
      </div>

      {hasItems ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden transition-shadow hover:shadow-lg rounded-lg"
            >
              <button
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full hover:bg-white cursor-pointer transition-colors"
                onClick={() => handleRemoveItem(product.id)}
                aria-label="Remove from wishlist"
                disabled={removingProductIds.includes(product.id) || isRemoving}
              >
                {removingProductIds.includes(product.id) ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#F04438]" />
                ) : (
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#F04438] fill-[#F04438]" />
                )}
              </button>

              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      fill
                      src={product.images[0].image || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {product.brand?.name || ""}
                  </p>
                  <h3 className="font-medium text-base sm:text-lg line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="font-semibold text-base sm:text-lg mt-1 sm:mt-2">
                    {product.discount_price ? (
                      <>
                        <span className="text-[#F04438]">
                          {Number(product.price) -
                            Number(product.discount_price)}{" "}
                          ₽
                        </span>{" "}
                        <span className="line-through text-gray-500 text-sm">
                          {product.price} ₽
                        </span>
                      </>
                    ) : (
                      `${product.price} ₽`
                    )}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto py-10 sm:py-20">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#F04438]" />
          </div>
          <h1 className="text-[#1B1B1B] text-xl sm:text-2xl font-semibold capitalize mt-4">
            Пустой список желаний
          </h1>
          <p className="text-[#8D8D8D] font-normal text-sm sm:text-base px-4 sm:px-0">
            В вашем списке желаний нет ни одного товара.
          </p>
          <Link href="/products" className="inline-block w-full sm:w-auto">
            <Button className="bg-[#FF385C] w-full sm:w-64 font-semibold text-base mt-4">
              Продолжить покупки
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
