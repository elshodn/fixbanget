"use client";
import { useState } from "react";
import { ProductCarousel } from "@/components/Carousel";
import { Catalogs } from "@/components/Catalogs";
import { GenderSwitch } from "@/components/genderSwitch";
import { StyliesCollection } from "@/components/StyliesCollection";
import { ClothCollection } from "@/components/ClothCollection";
import { AccessoriesCollection } from "@/components/AccessoriesCollection";
import { AccessoriesData, products } from "@/lib/mockData";
import { Header } from "@/components/home/header";
import { Assortment } from "../components/home/assortment"
import BrendImagesCollection from "../components/home/brendImagesCollection";
import  AboutContainer  from "../components/aboutContainer"

export default function Home() {
  const [activeGender, setActiveGender] = useState("men");

  const filteredProducts = products.filter(product =>
      product.gender.includes(activeGender)
  );

  const productCarousel = [...products];

  return (
    <>
    <div className="min-h-screen bg-white home">
            <main className="container mx-auto px-4 py-8">
                <GenderSwitch
                    activeGender={activeGender}
                    setActiveGender={setActiveGender}
                />
                <Header />
            </main>

            <ProductCarousel product={productCarousel} />
            <ClothCollection />
            <ProductCarousel product={productCarousel} />
            <StyliesCollection />
            <AccessoriesCollection product={AccessoriesData} />
            <ProductCarousel product={productCarousel} />
            <Assortment />
            <BrendImagesCollection />
            <Catalogs link="/search" linkButtonTitle="Перейти в каталог" product={products.slice(0, 10)} title="Кроссовок в каталоге" desc="В Unicflo есть такие культовые модели как: Nike Air Max, Dunk, New Balance 550, Air Jordan, Adidas Samba, Asics Gel Kahana. Разные расцветки от классических до редких коллекционные вариантов." />
            <Catalogs link="/search" linkButtonTitle="Смотреть все кроссовки" product={products.slice(0, 10)} title="Забрать сегодня" desc="Самовывоз из магазина в Москве или доставка СДЭКом в любой город РФ" />
            <AboutContainer />
        </div>
        </>
  ); 

}