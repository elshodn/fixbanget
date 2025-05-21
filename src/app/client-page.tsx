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
import { fetchCategories } from "@/lib/api";

// Fetcher function for SWR

export default function HomeClient() {
  const { gender } = useGender();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const [categoriesData] = Promise.all([await fetchCategories(gender)]);
    };
  }, []);

  // Fetch data using SWR

  //   const { data: recentPurchases, isLoading: isRecentLoading } = useSWR(
  //     `/api/products/recent-purchases`,
  //     fetcher
  //   );

  //   const { data: odejdaData, isLoading: isOdejdaLoading } = useSWR(
  //     `/api/products/odejda?gender=${gender}`,
  //     fetcher
  //   );

  //   const { data: viewedProducts, isLoading: isViewedLoading } = useSWR(
  //     `/api/products/viewed`,
  //     fetcher
  //   );

  //   const { data: accessoriesData, isLoading: isAccessoriesLoading } = useSWR(
  //     `/api/products/accessories?gender=${gender}`,
  //     fetcher
  //   );

  //   const { data: likedProducts, isLoading: isLikedLoading } = useSWR(
  //     `/api/products/liked`,
  //     fetcher
  //   );

  // Refetch data when gender changes
  useEffect(() => {
    // SWR will automatically revalidate when the URL changes
  }, [gender]);

  return (
    <>
      <div className="min-h-screen bg-white home">
        <main className="container mx-auto px-4 py-8">
          <SelectGender />
          <Header />
        </main>

        {/* {isFamousLoading ? (
          <CollectionSkeleton />
        ) : (
          <Collection product={famousData || []} title={"Популярный Продукт"} />
        )}

        {isObuvLoading ? (
          <CollectionSkeleton />
        ) : (
          <Collection product={obuvData || []} title={"Обувь"} />
        )} */}

        {/* {isRecentLoading ? (
          <CarouselSkeleton />
        ) : (
          <ProductCarousel
            title="Последний покупки"
            product={recentPurchases || []}
          />
        )}

        {isOdejdaLoading ? (
          <CollectionSkeleton />
        ) : (
          <Collection product={odejdaData || []} title={"Одежда"} />
        )}

        {isViewedLoading ? (
          <CarouselSkeleton />
        ) : (
          <ProductCarousel title="Посмотрели" product={viewedProducts || []} />
        )}

        {isAccessoriesLoading ? (
          <CollectionSkeleton />
        ) : (
          <Collection product={accessoriesData || []} title={"Аксессуары"} />
        )} */}

        <StyliesCollection />

        {/* {isLikedLoading ? (
          <CarouselSkeleton />
        ) : (
          <ProductCarousel title="Лайкнули" product={likedProducts || []} />
        )} */}

        <Assortment />
        <BrendImagesCollection />
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
