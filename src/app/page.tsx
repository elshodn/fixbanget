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
import  AboutContainer  from "../components/aboutContainer"
import { TelegramChannels } from "@/components/telegram/TelegramChannels";

export default function Home() {
  const productCarousel = [...products];

  return (
    <>
    <div className="min-h-screen bg-white home">
            <main className="container mx-auto px-4 py-8">
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
            {/* <Catalogs link="/search" linkButtonTitle="Перейти в каталог" product={products.slice(0, 10)} title="Кроссовок в каталоге" desc="В Unicflo есть такие культовые модели как: Nike Air Max, Dunk, New Balance 550, Air Jordan, Adidas Samba, Asics Gel Kahana. Разные расцветки от классических до редких коллекционные вариантов." /> */}
            {/* <Catalogs link="/search" linkButtonTitle="Смотреть все кроссовки" product={products.slice(0, 10)} title="Забрать сегодня" desc="Самовывоз из магазина в Москве или доставка СДЭКом в любой город РФ" /> */}
            <AboutContainer />
            <TelegramChannels/>
        </div>
        </>
  ); 
}
