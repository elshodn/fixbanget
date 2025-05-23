"use client";
import { useState, useEffect } from "react";
import { ProductCarousel } from "@/components/Carousel";
import { StyliesCollection } from "@/components/StyliesCollection";
import { Header } from "@/components/home/header";
import { Assortment } from "../components/home/assortment";
import BrendImagesCollection from "../components/home/brendImagesCollection";
import AboutContainer from "../components/aboutContainer";
import { TelegramChannels } from "@/components/telegram/TelegramChannels";
import { Button } from "@/components/ui/button";
import Collection from "@/components/collection";
import { Skeleton } from "@/components/ui/skeleton";
import { useGender } from "@/hooks/use-gender";
import SelectGender from "@/components/slelect-gender";
import { fetchBrands, fetchCategories } from "@/lib/api";

// Fetcher function for SWR

export default function HomeClient() {
  const { gender } = useGender();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const [categoriesData, brandsData] = await Promise.all([
        await fetchCategories(gender),
        await fetchBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
      // setObuvCategories(subcategoriesData);

      setLoading(false);
    };
    getCategories();
  }, [gender]);

  // const firstCtegory = categories[0]?.subcategories
  //   ? categories[0]?.subcategories
  //   : categories[1]?.subcategories;

  return (
    <>
      <div className="min-h-screen bg-white home">
        <main className="container mx-auto px-4 py-8">
          <SelectGender />
          <Header />
        </main>

        {loading ? (
          <CollectionSkeleton />
        ) : (
          <Collection
            category={categories || []}
            title={"Популярный Продукт"}
          />
        )}

        {loading ? (
          <CollectionSkeleton />
        ) : (
          <Collection
            titleId={categories[2]?.id}
            title={categories[2]?.name || "Обувь"}
            category={categories[2]?.subcategories || []}
          />
        )}

        {/* {loading ? (
          <CarouselSkeleton />
        ) : (
          <ProductCarousel
            title="Последний покупки"
            product={recentPurchases || []}
          />
        )} */}

        {loading ? (
          <CollectionSkeleton />
        ) : (
          <Collection
            titleId={categories[1]?.id}
            category={categories[1]?.subcategories || []}
            title={categories[1]?.name || "Обувь"}
          />
        )}

        {/* {loading ? (
          <CarouselSkeleton />
        ) : (
          <ProductCarousel title="Посмотрели" product={viewedProducts || []} />
        )} */}

        {loading ? (
          <CollectionSkeleton />
        ) : (
          <Collection
            titleId={categories[0]?.id}
            category={categories[0]?.subcategories || []}
            title={categories[0]?.name || categories[1]?.name || "Обувь"}
          />
        )}

        <StyliesCollection />

        {/* {isLikedLoading ? (
          <CarouselSkeleton />
        ) : (
          <ProductCarousel title="Лайкнули" product={likedProducts || []} />
        )} */}

        <Assortment />
        <BrendImagesCollection brands={brands} />
        <AboutContainer />
        <TelegramChannels />
      </div>
    </>
  );
}

// Skeleton loaders for loading states
function CollectionSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="flex space-x-4 overflow-hidden">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex-none w-64 space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>
    </div>
  );
}
