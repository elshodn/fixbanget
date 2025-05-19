"use client";
import { useState } from "react";
import { ProductCarousel } from "@/components/Carousel";
import { StyliesCollection } from "@/components/StyliesCollection";
import {
  famousData,
  products,
  odejda,
  accessoriesData,
  obuv,
} from "@/lib/mockData";
import { Header } from "@/components/home/header";
import { Assortment } from "../components/home/assortment";
import BrendImagesCollection from "../components/home/brendImagesCollection";
import AboutContainer from "../components/aboutContainer";
import { TelegramChannels } from "@/components/telegram/TelegramChannels";
import { Button } from "@/components/ui/button";
import Collection from "@/components/collection";

export default function Home() {
  const productCarousel = [...products];
  const [genderSwitch, setGenderSwitch] = useState<"man" | "woman">("man");
  return (
    <>
      <div className="min-h-screen bg-white home">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-stretch gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setGenderSwitch("man")}
              className={`${
                genderSwitch == "man" ? "bg-[#EEEDEB]" : "bg-white"
              } rounded-full`}
            >
              Для него
            </Button>
            <Button
              variant="outline"
              onClick={() => setGenderSwitch("woman")}
              className={`${
                genderSwitch == "woman" ? "bg-[#EEEDEB]" : "bg-white"
              } rounded-full`}
            >
              Для неё
            </Button>
          </div>
          <Header />
        </main>

        <Collection product={famousData} title={"Популярный Продукт"} />
        <Collection product={obuv} title={"Обувь"} />

        {/* <ClothCollection title={"Популярный Продукт"} product={famousData} /> */}
        {/* <ClothCollection title={"Обувь"} product={obuv} /> */}
        <ProductCarousel title="Последний покупки" product={productCarousel} />
        <Collection product={odejda} title={"Одежда"} />
        {/* <ClothCollection title={"Одежда"} product={odejda} /> */}
        <ProductCarousel title="Посмотрели" product={productCarousel} />
        <Collection product={accessoriesData} title={"Аксессуары"} />
        {/* <AccessoresCollection title={"Аксессуары"} product={accessoriesData} /> */}

        <StyliesCollection />

        <ProductCarousel title="Лайкнули" product={productCarousel} />
        <Assortment />
        <BrendImagesCollection />
        <AboutContainer />
        <TelegramChannels />
      </div>
    </>
  );
}
