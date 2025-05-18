"use client";
import { useState } from "react";
import { ProductCarousel } from "@/components/Carousel";
// import { Catalogs } from "@/components/Catalogs";
import { StyliesCollection } from "@/components/StyliesCollection";
import { ClothCollection } from "@/components/ClothCollection";
import { AccessoriesData, famousData, obuv, products, odejda } from "@/lib/mockData";
import { Header } from "@/components/home/header";
import { Assortment } from "../components/home/assortment"
import BrendImagesCollection from "../components/home/brendImagesCollection";
import AboutContainer from "../components/aboutContainer"
import { TelegramChannels } from "@/components/telegram/TelegramChannels";
import { Button } from "@/components/ui/button";
import { AccessoresCollection } from "@/components/AccessoresCollection";

export default function Home() {
  const productCarousel = [...products];
  const [genderSwitch, setGenderSwitch] = useState<"man" | "woman">("man")
  return (
    <>
      <div className="min-h-screen bg-white home">

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-stretch gap-4 mb-8">
            <Button variant="outline" onClick={()=>setGenderSwitch("man")} className={`${genderSwitch == "man" ? "bg-[#EEEDEB]":"bg-white"} rounded-full`}>Для него</Button>
            <Button variant="outline" onClick={()=>setGenderSwitch("woman")} className={`${genderSwitch == "woman" ? "bg-[#EEEDEB]":"bg-white"} rounded-full`}>Для неё</Button>
          </div>
          <Header />
        </main>


        <ClothCollection title={"Популярный Продукт"} product={famousData} />
        <ClothCollection title={"Обувь"} product={obuv} />
        <ProductCarousel title="Последний покупки" product={productCarousel} />
        <ClothCollection title={"Одежда"} product={odejda} />
        <ProductCarousel title="Посмотрели" product={productCarousel} />
        <AccessoresCollection title={"Аксессуары"} product={AccessoriesData}/>

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
