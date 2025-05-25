"use client";

import type React from "react";

import { type FC, useEffect, useState, useCallback, useMemo } from "react";
import { useLikeStore } from "@/stores/likeStore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share2, X } from "lucide-react";
import { ProductCarousel } from "@/components/Carousel";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import sizeImage from "@/assets/images/size.png";
import { Separator } from "@/components/ui/separator";
import { PaymentSummary } from "./summary-appbar";
import { fetchFilterProducts } from "@/lib/api";
import { useGender } from "@/hooks/use-gender";

interface ProductDetailCardProps {
  product: Product;
}

const ProductDetailCard: FC<ProductDetailCardProps> = ({ product }) => {
  const { gender } = useGender();
  const [method, setMethod] = useState<"store" | "pickup">("store");
  const [minmax, setMinmax] = useState<"min" | "max">("min");
  const [countryCode, setCountryCode] = useState("+7");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].color.hex_code : null
  );
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    product.variants.length > 0 ? product.variants[0].size.name : null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
  const [mainImage, setMainImage] = useState(
    product.images.length > 0 ? product.images[0].image : ""
  );
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);
  const [filteredImages, setFilteredImages] = useState(product.images);

  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    review: "",
  });

  interface FormData {
    name: string;
    email: string;
    title: string;
    review: string;
  }

  interface InputChangeEvent
    extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Memoize unique colors and sizes to prevent infinite re-renders
  const uniqueColors = useMemo(() => {
    return Array.from(
      new Map(
        product.variants.map((variant: any) => [
          variant.color.hex_code,
          variant.color,
        ])
      ).values()
    );
  }, [product.variants]);

  const uniqueSizes = useMemo(() => {
    return Array.from(
      new Map(
        product.variants.map((variant: any) => [
          variant.size.name,
          variant.size,
        ])
      ).values()
    );
  }, [product.variants]);

  // Tanlangan rangga qarab razmerni filtrlash
  const availableSizes = useMemo(() => {
    return selectedColor
      ? product.variants
          .filter((variant: any) => variant.color.hex_code === selectedColor)
          .map((variant: any) => variant.size)
      : uniqueSizes;
  }, [selectedColor, product.variants, uniqueSizes]);

  // Tanlangan razmerga qarab ranglarni filtrlash
  const availableColors = useMemo(() => {
    return selectedSize
      ? product.variants
          .filter((variant: any) => variant.size.name === selectedSize)
          .map((variant: any) => variant.color)
      : uniqueColors;
  }, [selectedSize, product.variants, uniqueColors]);

  // Rang tanlaganda rasmlarni filtrlash - useCallback bilan optimize qilish
  const updateFilteredImages = useCallback(() => {
    if (selectedColor && product.variants.length > 0) {
      // Tanlangan rangning indeksini topamiz
      const selectedColorIndex = uniqueColors.findIndex(
        (color: any) => color.hex_code === selectedColor
      );

      // Har bir rangga tegishli rasmlar sonini hisoblaymiz
      const imagesPerColor = Math.floor(
        product.images.length / uniqueColors.length
      );

      if (imagesPerColor > 0 && selectedColorIndex !== -1) {
        // Tanlangan rangga tegishli rasmlarni olamiz
        const startIndex = selectedColorIndex * imagesPerColor;
        const endIndex = startIndex + imagesPerColor;
        const colorImages = product.images.slice(startIndex, endIndex);

        setFilteredImages(colorImages);
        setMainImage(colorImages[0]?.image || product.images[0].image);
        setCurrentThumbnailIndex(0);
      } else {
        // Agar rasmlar teng taqsimlanmagan bo'lsa, barcha rasmlarni ko'rsatamiz
        setFilteredImages(product.images);
        setMainImage(product.images[0].image);
        setCurrentThumbnailIndex(0);
      }
    } else {
      // Agar rang tanlanmagan bo'lsa, barcha rasmlarni ko'rsatamiz
      setFilteredImages(product.images);
      setMainImage(product.images[0].image);
      setCurrentThumbnailIndex(0);
    }
  }, [selectedColor, product.images, uniqueColors]);

  // useEffect with proper dependencies
  useEffect(() => {
    updateFilteredImages();
  }, [updateFilteredImages]);

  interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

  interface ReviewData extends FormData {
    rating: number;
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const reviewData: ReviewData = {
      ...formData,
      rating,
    };
    console.log(reviewData);
    // Add your API call here
  };

  const { likedProducts, toggleLike } = useLikeStore();
  const isLiked = likedProducts.includes(product.id);

  // Memoize the fetch function to prevent infinite re-renders
  const getRecommendProducts = useCallback(async () => {
    try {
      const response = await fetchFilterProducts(
        {
          subcategory: product.subcategory.id,
          page_size: 10,
        },
        gender
      );
      if (response && response.results) {
        // O'zimizning mahsulotni olib tashlaymiz
        const filteredProducts = response.results.filter(
          (p: Product) => p.id !== product.id
        );
        setRecommendProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Tavsiya mahsulotlarini yuklashda xatolik:", error);
    }
  }, [product.id, product.subcategory.id]);

  useEffect(() => {
    getRecommendProducts();
  }, [getRecommendProducts]);

  if (!product) {
    return <div className="p-4 text-red-600">Продукт не найден</div>;
  }

  type HandleQuantityChange = (delta: number) => void;

  const handleQuantityChange: HandleQuantityChange = (delta) => {
    setQuantity((prev: number) => Math.max(1, prev + delta));
  };

  const handleThumbnailClick = (img: string, index: number) => {
    setMainImage(img);
    setCurrentThumbnailIndex(index);
  };

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .then(() => console.log("Ulashildi"))
        .catch((error) => console.log("Ulashishda xatolik:", error));
    } else {
      // Eski brauzerlar uchun
      navigator.clipboard.writeText(window.location.href);
      alert("Havola nusxalandi!");
    }
  };

  // Mahsulot narxini hisoblash
  const productPrice = product.discount_price
    ? Number(product.price) - Number(product.discount_price)
    : Number(product.price);

  return (
    <div className="pb-18">
      {/* Main Product Section */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 h-auto sm:h-[500px]">
          {/* Main Image */}
          <div className="sm:w-9/12 h-[350px] flex justify-center items-center p-4 sm:p-6 rounded-lg relative">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative w-full h-full cursor-zoom-in">
                  <Image
                    fill
                    priority
                    src={mainImage || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full z-10 object-cover rounded-lg"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                <DialogTitle className="sr-only">
                  Просмотр изображения
                </DialogTitle>
                <Image
                  width={500}
                  height={500}
                  priority
                  src={mainImage || "/placeholder.svg"}
                  alt="zoomed"
                  className="w-11/12 mx-auto h-auto max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="sm:w-3/12 flex sm:flex-col gap-2 sm:gap-3 sm:h-full">
            <div className="sm:hidden w-full">
              <Swiper
                spaceBetween={10}
                slidesPerView={4}
                grabCursor={true}
                freeMode={true}
                watchSlidesProgress={true}
                touchRatio={1.5}
                speed={400}
              >
                {filteredImages.map((img: any, index: number) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`w-16 h-16 bg-[#F2F2F2] flex items-center justify-center cursor-pointer ${
                        currentThumbnailIndex === index
                          ? "border border-[#FF385C]"
                          : ""
                      }`}
                      onClick={() => handleThumbnailClick(img?.image, index)}
                    >
                      <Image
                        src={img.image || "/placeholder.svg"}
                        alt={`Thumbnail ${index}`}
                        width={60}
                        height={60}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Desktop Thumbnail List (Vertical click) */}
            <div className="hidden sm:flex sm:flex-col gap-3 sm:h-full overflow-y-auto">
              {filteredImages.map((img: any, index: number) => (
                <div
                  key={index}
                  className={`w-full h-[100px] bg-[#F2F2F2] flex items-center justify-center p-1 cursor-pointer ${
                    currentThumbnailIndex === index
                      ? "border border-[#FF385C]"
                      : ""
                  }`}
                  onClick={() => handleThumbnailClick(img?.image, index)}
                >
                  <Image
                    src={img.image || "/placeholder.svg"}
                    alt={`Thumbnail ${index}`}
                    width={90}
                    height={90}
                    className="object-cover h-full w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="w-full sm:w-1/2">
            <p className="mb-2 text-[#5F5F5F] font-medium">Цвет</p>
            <div className="flex gap-2 flex-wrap">
              {uniqueColors.map((color: any, idx: number) => {
                const isColorAvailable = selectedSize
                  ? product.variants.some(
                      (variant: any) =>
                        variant.color.hex_code === color.hex_code &&
                        variant.size.name === selectedSize &&
                        variant.stock > 0
                    )
                  : product.variants.some(
                      (variant: any) =>
                        variant.color.hex_code === color.hex_code &&
                        variant.stock > 0
                    );

                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded border-2 cursor-pointer ${
                      !isColorAvailable ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      backgroundColor: color.hex_code,
                      borderColor:
                        selectedColor === color.hex_code ? "#FF385C" : "#ccc",
                    }}
                    onClick={() =>
                      isColorAvailable && setSelectedColor(color.hex_code)
                    }
                  />
                );
              })}
            </div>
          </div>

          <span className="text-xs sm:text-sm text-gray-500">
            {product.brand.name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold">
              {productPrice} ₽
            </p>
            {product.discount_price && (
              <p className="text-lg text-gray-500 line-through">
                {product.price} ₽
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {product.shipping_methods.map((method: any, index: number) => (
              <Button
                key={index}
                variant="outline"
                className={`${
                  minmax === (index === 0 ? "min" : "max") && "border-[#FF3A5C]"
                }`}
                onClick={() => setMinmax(index === 0 ? "min" : "max")}
              >
                {method.price === "0.00" ? "0 ₽" : `${method.price} ₽`}{" "}
                {method.min_days}-{method.max_days} дней
              </Button>
            ))}
          </div>

          <hr />
          {/* Color and Size Selectors */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 justify-between">
            <div className="w-full sm:w-1/2">
              <div className="flex gap-4 items-start">
                <p className="font-medium mb-2">Размер</p> |
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="font-medium mb-2 text-[#1443EB] hover:underline cursor-pointer">
                      Помощь
                    </button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[100%-10px] lg:min-w-[800px] mx-auto">
                    <DialogHeader className="relative">
                      <DialogTitle className="text-center text-[#1B1B1B] font-semibold text-base md:text-2xl">
                        {product.name}
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Размерная таблица для {product.name}
                      </DialogDescription>
                      <div className="absolute top-0 right-0 cursor-pointer">
                        <DialogClose>
                          <X />
                        </DialogClose>
                      </div>
                    </DialogHeader>
                    <div className="py-0">
                      <Image
                        className="w-32 md:w-1/4 mx-auto"
                        src={sizeImage || "/placeholder.svg"}
                        alt="size image"
                      />
                      <p className="text-center mb-4">Измеряется в см</p>
                      <div className="border rounded-md overflow-hidden">
                        <Table className="text-[12px] md:text-[14px]">
                          <TableHeader>
                            <TableRow className="border-b border-t">
                              <TableHead className="border-r">Размер</TableHead>
                              <TableHead className="border-r text-center">
                                S
                              </TableHead>
                              <TableHead className="border-r text-center">
                                M
                              </TableHead>
                              <TableHead className="border-r text-center">
                                L
                              </TableHead>
                              <TableHead className="border-r text-center">
                                XL
                              </TableHead>
                              <TableHead className="text-center">XXL</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="border-r font-medium">
                                Длина Рукава
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                46
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                47
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                48
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                49
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                50
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border-r font-medium">
                                Грудь
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                118
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                120
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                124
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                130
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                150
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border-r font-medium">
                                Талия
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                104
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                108
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                112
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                116
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                10
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border-r font-medium">
                                БЕДРО
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                92
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                94
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                96
                              </TableCell>
                              <TableCell className="border-r text-center font-bold">
                                100
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                104
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size: any, idx: number) => {
                  const isSizeAvailable = selectedColor
                    ? product.variants.some(
                        (variant: any) =>
                          variant.size.name === size.name &&
                          variant.color.hex_code === selectedColor &&
                          variant.stock > 0
                      )
                    : product.variants.some(
                        (variant: any) =>
                          variant.size.name === size.name && variant.stock > 0
                      );

                  return (
                    <Button
                      key={idx}
                      size="sm"
                      disabled={!isSizeAvailable}
                      className={`px-2 sm:px-3 py-1 text-xs font-bold sm:text-sm bg-transparent text-black border-2 border-[#D1D1D1] rounded ${
                        selectedSize === size.name ? "border-black" : ""
                      } ${
                        !isSizeAvailable ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        isSizeAvailable && setSelectedSize(size.name)
                      }
                    >
                      {size.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center justify-between gap-1 sm:gap-4 mt-4 sm:mt-6">
            <div className="border p-1 sm:p-2 rounded-md flex gap-2 sm:gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </Button>
              <p className="text-sm sm:text-base">{quantity}</p>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </Button>
            </div>
            <Button
              onClick={share}
              className="border bg-transparent w-9 h-9 md:w-12 md:h-12 p-5 text-gray-400 hover:text-[#FF385C]"
            >
              <Share2 size={25} />
            </Button>
          </div>

          {/* Description */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold text-sm sm:text-base">Описание</h4>
              <p className="text-xs sm:text-sm">{product.description}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">Материал</h4>
              <p className="text-xs sm:text-sm">
                {product.materials
                  .map((material: any) => material.name)
                  .join(", ")}
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-4 max-w-md mx-auto">
            <Label className="text-sm font-medium">Как получать</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`${method == "store" && "border-[#FF3A5C]"}`}
                onClick={() => setMethod("store")}
              >
                Курьер
              </Button>
              <Button
                variant="outline"
                className={`${method == "pickup" && "border-[#FF3A5C]"}`}
                onClick={() => setMethod("pickup")}
              >
                В пункт выдачи
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Имя и фамилия</Label>
              <Input id="name" placeholder="Имя и фамилия" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <div className="flex gap-2 mb-5">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+7">+7</SelectItem>
                    <SelectItem value="+998">+998</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="phone" placeholder="000" type="tel" />
              </div>
              <Separator />
            </div>
          </div>
        </div>
        <PaymentSummary
          quantity={quantity}
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />
      </div>
      {recommendProducts.length > 0 && (
        <ProductCarousel
          title="Tavsiya etilgan mahsulotlar"
          product={recommendProducts}
        />
      )}
    </div>
  );
};

export default ProductDetailCard;

// "use client";

// import { FC, useEffect, useState } from "react";
// import { useLikeStore } from "@/stores/likeStore";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogTrigger,
//   DialogHeader,
//   DialogDescription,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Share2, Heart, Star, X, ImageIcon } from "lucide-react";
// import { ProductCarousel } from "@/components/Carousel";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import sizeImage from "@/assets/images/size.png";
// import { Separator } from "@/components/ui/separator";
// import { PaymentSummary } from "./summary-appbar";
// import { fetchProducts } from "@/lib/api";
// interface ProductDetailCardProps {
//   product: Product;
// }

// const ProductDetailCard: FC<ProductDetailCardProps> = ({ product }) => {
//   console.log(product);
//   const [method, setMethod] = useState<"store" | "pickup">("store");
//   const [minmax, setMinmax] = useState<"min" | "max">("min");
//   const [countryCode, setCountryCode] = useState("+7");
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string | number | null>(
//     null
//   );
//   const [quantity, setQuantity] = useState(1);
//   const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
//   const [mainImage, setMainImage] = useState(product.images[0].image || "");
//   const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);

//   const [rating, setRating] = useState(0);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     title: "",
//     review: "",
//   });

//   interface FormData {
//     name: string;
//     email: string;
//     title: string;
//     review: string;
//   }

//   interface InputChangeEvent
//     extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {}

//   const handleInputChange = (e: InputChangeEvent) => {
//     const { name, value } = e.target;
//     setFormData((prev: FormData) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Ranglarni unique qilib olish (faqat har bir rang bir marta chiqadi)
//   const uniqueColors = Array.from(
//     new Map(
//       product.variants.map((variant) => [variant.color.hex_code, variant.color])
//     ).values()
//   );

//   // Razmerlar uchun unique qilib olish (faqat har bir razmer bir marta chiqadi)
//   const uniqueSizes = Array.from(
//     new Map(
//       product.variants.map((variant) => [variant.size.name, variant.size])
//     ).values()
//   );

//   interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

//   interface ReviewData extends FormData {
//     rating: number;
//   }

//   const handleSubmit = (e: SubmitEvent) => {
//     e.preventDefault();
//     const reviewData: ReviewData = {
//       ...formData,
//       rating,
//     };
//     console.log(reviewData);
//     // Add your API call here
//   };

//   if (!product) {
//     return <div className="p-4 text-red-600">Продукт не найден</div>;
//   }

//   interface HandleQuantityChange {
//     (delta: number): void;
//   }

//   const handleQuantityChange: HandleQuantityChange = (delta) => {
//     setQuantity((prev: number) => Math.max(1, prev + delta));
//   };

//   const handleThumbnailClick = (img: string, index: number) => {
//     setMainImage(img);
//     setCurrentThumbnailIndex(index);
//   };
//   const share = () => {
//     alert("Делиться");
//   };

//   useEffect(() => {
//     const getRecommendProducts = async () => {
//       const response = await fetchProducts();
//       setRecommendProducts(response);
//     };
//     getRecommendProducts();
//   }, []);

//   // Like store usage
//   const { likedProducts, toggleLike } = useLikeStore();
//   const isLiked = likedProducts.includes(product.id);

//   return (
//     <div className="pb-18">
//       {/* Main Product Section */}
//       <div className="w-11/12 mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
//         {/* Image Gallery */}
//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 h-auto sm:h-[500px]">
//           {/* Main Image */}
//           <div className="sm:w-9/12 h-[350px]  flex justify-center items-center p-4 sm:p-6 rounded-lg relative">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <div className="relative w-full h-full cursor-zoom-in">
//                   <Image
//                     fill
//                     priority
//                     src={mainImage}
//                     alt={product.name}
//                     className="w-full h-full z-10 object-cover rounded-lg"
//                   />
//                   {/* <ImageIcon className="w-16 h-full object-contain" /> */}
//                   {/* <Skeleton className="w-full h-full object-contain" /> */}
//                 </div>
//               </DialogTrigger>
//               <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
//                 <DialogTitle className="sr-only">
//                   Просмотр изображения
//                 </DialogTitle>
//                 <Image
//                   width={500}
//                   height={500}
//                   priority
//                   src={mainImage}
//                   alt="zoomed"
//                   className="w-11/12 mx-auto h-auto max-h-[80vh] object-contain"
//                 />
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="sm:w-3/12 flex sm:flex-col gap-2 sm:gap-3  sm:h-full">
//             <div className="sm:hidden w-full">
//               <Swiper
//                 spaceBetween={10}
//                 slidesPerView={4}
//                 grabCursor={true} // qo'l kursor
//                 freeMode={true} // silliq surish
//                 watchSlidesProgress={true} // ruxsat etilgan progress kuzatuvchi
//                 touchRatio={1.5} // touch sezuvchanligini oshiradi
//                 speed={400} // surish tezligi (ms)
//               >
//                 {product.images.map((img, index) => (
//                   <SwiperSlide key={index}>
//                     <div
//                       className={`w-16 h-0.5 bg-[#F2F2F2] flex items-center justify-center cursor-pointer ${
//                         currentThumbnailIndex === index
//                           ? "border border-[#FF385C]"
//                           : ""
//                       }`}
//                       onClick={() => handleThumbnailClick(img?.image, index)}
//                     />
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             </div>

//             {/* Desktop Thumbnail List (Vertical click) */}
//             <div className="hidden sm:flex sm:flex-col gap-3 sm:h-full overflow-y-auto">
//               {product.images.map((img, index) => (
//                 <div
//                   key={index}
//                   className={`w-full h-[100px] bg-[#F2F2F2] flex items-center justify-center p-1 cursor-pointer ${
//                     currentThumbnailIndex === index
//                       ? "border border-[#FF385C]"
//                       : ""
//                   }`}
//                   onClick={() => handleThumbnailClick(img?.image, index)}
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-3 sm:space-y-4 md:space-y-6">
//           <div className="w-full sm:w-1/2">
//             <p className="mb-2 text-[#5F5F5F] font-medium">Цвет</p>
//             <div className="flex gap-2 flex-wrap">
//               {uniqueColors.map((color, idx) => (
//                 <div
//                   key={idx}
//                   className={`w-6 h-6 sm:w-8 sm:h-8 rounded border-2 cursor-pointer`}
//                   style={{
//                     backgroundColor: color.hex_code,
//                     borderColor:
//                       selectedColor === color.hex_code ? "#FF385C" : "#ccc",
//                   }}
//                   onClick={() => setSelectedColor(color.hex_code)}
//                 />
//               ))}
//             </div>
//           </div>

//           <span className="text-xs sm:text-sm text-gray-500">Lorem ipsum</span>
//           <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
//           <p className="text-xl sm:text-2xl font-semibold">{product.price} ₽</p>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               className={`${minmax == "min" && "border-[#FF3A5C]"}`}
//               onClick={() => setMinmax("min")}
//             >
//               0 ₽ 13-16 дней
//             </Button>
//             <Button
//               variant="outline"
//               className={`${minmax == "max" && "border-[#FF3A5C]"}`}
//               onClick={() => setMinmax("max")}
//             >
//               0 ₽ 25-30 дней
//             </Button>
//           </div>

//           <hr />
//           {/* Color and Size Selectors */}
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 justify-between">
//             <div className="w-full sm:w-1/2">
//               <div className="flex gap-4 items-start">
//                 <p className="font-medium mb-2">Размер</p> |
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <button className="font-medium mb-2 text-[#1443EB] hover:underline cursor-pointer">
//                       Помощь
//                     </button>
//                   </DialogTrigger>
//                   <DialogContent className="min-w-[100%-10px] lg:min-w-[800px] mx-auto">
//                     <DialogHeader className="relative">
//                       <DialogTitle className="text-center text-[#1B1B1B] font-semibold text-base md:text-2xl">
//                         Женский сладкий свитер
//                       </DialogTitle>
//                       <DialogDescription className="sr-only">
//                         Размерная таблица для женского сладкого свитера
//                       </DialogDescription>
//                       <div className="absolute top-0 right-0 cursor-pointer">
//                         <DialogClose>
//                           <X />
//                         </DialogClose>
//                       </div>
//                     </DialogHeader>
//                     <div className="py-0">
//                       <Image
//                         className="w-32 md:w-1/4 mx-auto"
//                         src={sizeImage}
//                         alt="size image"
//                       />
//                       <p className="text-center mb-4">Измеряется в см</p>
//                       <div className="border rounded-md overflow-hidden">
//                         <Table className="text-[12px] md:text-[14px]">
//                           <TableHeader>
//                             <TableRow className="border-b border-t">
//                               <TableHead className="border-r">Размер</TableHead>
//                               <TableHead className="border-r text-center">
//                                 S
//                               </TableHead>
//                               <TableHead className="border-r text-center">
//                                 M
//                               </TableHead>
//                               <TableHead className="border-r text-center">
//                                 L
//                               </TableHead>
//                               <TableHead className="border-r text-center">
//                                 XL
//                               </TableHead>
//                               <TableHead className="text-center">XXL</TableHead>
//                             </TableRow>
//                           </TableHeader>
//                           <TableBody>
//                             <TableRow>
//                               <TableCell className="border-r font-medium">
//                                 Длина Рукава
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 46
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 47
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 48
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 49
//                               </TableCell>
//                               <TableCell className="text-center font-bold">
//                                 50
//                               </TableCell>
//                             </TableRow>
//                             <TableRow>
//                               <TableCell className="border-r font-medium">
//                                 Грудь
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 118
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 120
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 124
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 130
//                               </TableCell>
//                               <TableCell className="text-center font-bold">
//                                 150
//                               </TableCell>
//                             </TableRow>
//                             <TableRow>
//                               <TableCell className="border-r font-medium">
//                                 Талия
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 104
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 108
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 112
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 116
//                               </TableCell>
//                               <TableCell className="text-center font-bold">
//                                 10
//                               </TableCell>
//                             </TableRow>
//                             <TableRow>
//                               <TableCell className="border-r font-medium">
//                                 БЕДРО
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 92
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 94
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 96
//                               </TableCell>
//                               <TableCell className="border-r text-center font-bold">
//                                 100
//                               </TableCell>
//                               <TableCell className="text-center font-bold">
//                                 104
//                               </TableCell>
//                             </TableRow>
//                           </TableBody>
//                         </Table>
//                       </div>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//               <div className="flex gap-2 flex-wrap">
//                 {uniqueSizes.map((size, idx) => (
//                   <Button
//                     key={idx}
//                     size="sm"
//                     className={`px-2 sm:px-3 py-1 text-xs font-bold sm:text-sm bg-transparent text-black border-2 border-[#D1D1D1] rounded ${
//                       selectedSize === size.name ? "border-black" : ""
//                     }`}
//                     onClick={() => setSelectedSize(size.name)}
//                   >
//                     {size.name}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quantity & Actions */}
//           <div className="flex items-center justify-between gap-1 sm:gap-4 mt-4 sm:mt-6">
//             <div className="border p-1 sm:p-2 rounded-md flex gap-2 sm:gap-3 items-center">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-6 w-6 sm:h-8 sm:w-8 p-0"
//                 onClick={() => handleQuantityChange(-1)}
//               >
//                 -
//               </Button>
//               <p className="text-sm sm:text-base">{quantity}</p>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-6 w-6 sm:h-8 sm:w-8 p-0"
//                 onClick={() => handleQuantityChange(1)}
//               >
//                 +
//               </Button>
//             </div>
//             {/* <Button onClick={addCart} className="bg-[#FF385C] hover:bg-[#E0314D] py-2 h-full text-white text-sm sm:text-base px-5 md:px-15 sm:py-3">
//               Добавить в корзину
//             </Button> */}
//             <Button
//               onClick={() => toggleLike(product.id)}
//               className={`border bg-transparent w-9 h-9 md:w-12 md:h-12 p-5 ${
//                 isLiked
//                   ? "text-[#FF385C] fill-[#FF385C]"
//                   : "text-gray-400 hover:text-[#FF385C]"
//               }`}
//             >
//               <Heart
//                 size={25}
//                 className={isLiked ? "fill-current" : "fill-none"}
//               />
//             </Button>
//           </div>

//           {/* Description */}
//           <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-gray-700">
//             <div>
//               <h4 className="font-bold text-sm sm:text-base">Описание</h4>
//               <p className="text-xs sm:text-sm">{product.description}</p>
//             </div>
//             <div>
//               <h4 className="font-bold text-sm sm:text-base">Материал</h4>
//               <p className="text-xs sm:text-sm">{product.materials[0].name}</p>
//             </div>
//           </div>
//           <Separator />
//           <div className="space-y-4 max-w-md mx-auto">
//             <Label className="text-sm font-medium">Как получать</Label>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 className={`${method == "store" && "border-[#FF3A5C]"}`}
//                 onClick={() => setMethod("store")}
//               >
//                 Курьер
//               </Button>
//               <Button
//                 variant="outline"
//                 className={`${method == "pickup" && "border-[#FF3A5C]"}`}
//                 onClick={() => setMethod("pickup")}
//               >
//                 В пункт выдачи
//               </Button>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="name">Имя и фамилия</Label>
//               <Input id="name" placeholder="Имя и фамилия" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">Телефон</Label>
//               <div className="flex gap-2 mb-5">
//                 <Select
//                   onValueChange={setCountryCode}
//                   defaultValue={countryCode}
//                 >
//                   <SelectTrigger className="w-20">
//                     <SelectValue placeholder="+7" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="+7">+7</SelectItem>
//                     <SelectItem value="+998">+998</SelectItem>
//                     <SelectItem value="+1">+1</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Input id="phone" placeholder="000" type="tel" />
//               </div>
//               <Separator />
//             </div>
//           </div>
//         </div>
//         <PaymentSummary quantity={quantity} product={product} />
//       </div>
//       <ProductCarousel product={recommendProducts} />
//     </div>
//   );
// };

// export default ProductDetailCard;
