"use client";
import { useState } from "react";
import { ProductCarousel } from "@/components/Carousel";
// import { Catalogs } from "@/components/Catalogs";
import { GenderSwitch } from "@/components/genderSwitch";
import { StyliesCollection } from "@/components/StyliesCollection";
import { ClothCollection } from "@/components/ClothCollection";
import { AccessoriesCollection } from "@/components/AccessoriesCollection";
import { AccessoriesData, products } from "@/lib/mockData";
import { Header } from "@/components/home/header";
import { Assortment } from "../components/home/assortment"
import BrendImagesCollection from "../components/home/brendImagesCollection";
import AboutContainer from "../components/aboutContainer"
import { TelegramChannels } from "@/components/telegram/TelegramChannels";
import { Button } from "@/components/ui/button";

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


        <ClothCollection />
        <ProductCarousel product={productCarousel} />
        <StyliesCollection />
        <AccessoriesCollection product={AccessoriesData.map(item => ({
          ...item,
          image: typeof item.image === "string" ? item.image : item.image.src
        }))} />
        <Assortment />
        <BrendImagesCollection />
        <AboutContainer />
        <TelegramChannels />
      </div>
    </>
  );
}
