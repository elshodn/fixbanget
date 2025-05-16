"use client";

import { FC, useState } from "react";
import { useLikeStore } from "@/stores/likeStore";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { products } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogClose, DialogContent, DialogTrigger, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Share2, Heart, Star, X } from "lucide-react";
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
import { PaymentSummary } from "./PaymentSummary";
import Link from "next/link";
interface ProductDetailCardProps {
  product: Product;
}

const ProductDetailCard: FC<ProductDetailCardProps> = ({ product }) => {


  const [method, setMethod] = useState<'store' | 'pickup'>('store');
  const [minmax, setMinmax] = useState<'min' | 'max'>('min');
  const [countryCode, setCountryCode] = useState('+7');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0);
  const [switchComment, setSwitchComment] = useState(true);
  const [mainImage, setMainImage] = useState(product?.image || '');

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
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

  interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> { }

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  interface SubmitEvent extends React.FormEvent<HTMLFormElement> { }

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

  if (!product) {
    return <div className="p-4 text-red-600">Продукт не найден</div>;
  }

  interface HandleQuantityChange {
    (delta: number): void;
  }

  const handleQuantityChange: HandleQuantityChange = (delta) => {
    setQuantity((prev: number) => Math.max(1, prev + delta));
  };

  const handleThumbnailClick = (img: string, index: number) => {
    setMainImage(img);
    setCurrentThumbnailIndex(index);
  };
  const share = () => {
    alert("Делиться");
  };


  const thumbnails = [product.image, product.image, product.image, product.image];

  // Like store usage
  const { likedProducts, toggleLike } = useLikeStore();
  const isLiked = likedProducts.includes(product.id);

  return (
    <div className="pb-18">
      {/* Main Product Section */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 h-auto sm:h-[500px]'>
          {/* Main Image */}
          <div className='sm:w-9/12 bg-[#F2F2F2] flex justify-center items-center p-4 sm:p-6 rounded-lg'>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative h-full cursor-zoom-in">
                  <Image
                    width={500}
                    height={500}
                    priority
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
                <Image
                  width={500}
                  height={500}
                  priority
                  src={mainImage || product.image}
                  alt="zoomed"
                  className="w-11/12 mx-auto h-auto max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className='sm:w-3/12 flex sm:flex-col gap-2 sm:gap-3  sm:h-full'>
            <div className='sm:hidden w-full'>
              <Swiper
                spaceBetween={10}
                slidesPerView={4}
                grabCursor={true}               // qo'l kursor
                freeMode={true}                 // silliq surish
                watchSlidesProgress={true}     // ruxsat etilgan progress kuzatuvchi
                touchRatio={1.5}               // touch sezuvchanligini oshiradi
                speed={400}          // surish tezligi (ms)
              >
                {thumbnails.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`w-16 h-0.5 bg-[#F2F2F2] flex items-center justify-center cursor-pointer ${currentThumbnailIndex === index ? 'border border-[#FF385C]' : ''
                        }`}
                      onClick={() => handleThumbnailClick(img, index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

            </div>

            {/* Desktop Thumbnail List (Vertical click) */}
            <div className='hidden sm:flex sm:flex-col gap-3 sm:h-full overflow-y-auto'>
              {thumbnails.map((img, index) => (
                <div
                  key={index}
                  className={`w-full h-[100px] bg-[#F2F2F2] flex items-center justify-center p-1 cursor-pointer ${currentThumbnailIndex === index ? 'border border-[#FF385C]' : ''
                    }`}
                  onClick={() => handleThumbnailClick(img, index)}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-full object-contain"
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
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded border-2 cursor-pointer`}
                    style={{
                      backgroundColor: color,
                      borderColor: selectedColor === color ? "#FF385C" : "#ccc",
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

          <span className="text-xs sm:text-sm text-gray-500">Весенняя коллекция</span>
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-xl sm:text-2xl font-semibold">{product.price} ₽</p>
          <div className="flex gap-2">
            <Button
              variant='outline'
              className={`${minmax == "min" && "border-[#FF3A5C]"}`}
              onClick={() => setMinmax('min')}
            >
              4880R 12-18 den
            </Button>
            <Button
              variant='outline'
              className={`${minmax == "max" && "border-[#FF3A5C]"}`}
              onClick={() => setMinmax('max')}
            >
              4832R 25-30 den
            </Button>
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
                      <DialogTitle className="text-center text-[#1B1B1B] font-semibold text-base md:text-2xl">Женский сладкий свитер</DialogTitle>
                      <DialogDescription className="sr-only">Размерная таблица для женского сладкого свитера</DialogDescription>
                      <div className='absolute top-0 right-0 cursor-pointer'>
                        <DialogClose>
                          <X />
                        </DialogClose>
                      </div>
                    </DialogHeader>
                    <div className="py-0">
                      <Image className='w-32 md:w-1/4 mx-auto' src={sizeImage} alt="size image" />
                      <p className="text-center mb-4">Измеряется в см</p>
                      <div className="border rounded-md overflow-hidden">
                        <Table className="text-[12px] md:text-[14px]">
                          <TableHeader>
                            <TableRow className="border-b border-t">
                              <TableHead className="border-r">Размер</TableHead>
                              <TableHead className="border-r text-center">S</TableHead>
                              <TableHead className="border-r text-center">M</TableHead>
                              <TableHead className="border-r text-center">L</TableHead>
                              <TableHead className="border-r text-center">XL</TableHead>
                              <TableHead className="text-center">XXL</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="border-r font-medium">Длина Рукава</TableCell>
                              <TableCell className="border-r text-center font-bold">46</TableCell>
                              <TableCell className="border-r text-center font-bold">47</TableCell>
                              <TableCell className="border-r text-center font-bold">48</TableCell>
                              <TableCell className="border-r text-center font-bold">49</TableCell>
                              <TableCell className="text-center font-bold">50</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border-r font-medium">Грудь</TableCell>
                              <TableCell className="border-r text-center font-bold">118</TableCell>
                              <TableCell className="border-r text-center font-bold">120</TableCell>
                              <TableCell className="border-r text-center font-bold">124</TableCell>
                              <TableCell className="border-r text-center font-bold">130</TableCell>
                              <TableCell className="text-center font-bold">150</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border-r font-medium">Талия</TableCell>
                              <TableCell className="border-r text-center font-bold">104</TableCell>
                              <TableCell className="border-r text-center font-bold">108</TableCell>
                              <TableCell className="border-r text-center font-bold">112</TableCell>
                              <TableCell className="border-r text-center font-bold">116</TableCell>
                              <TableCell className="text-center font-bold">10</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border-r font-medium">БЕДРО</TableCell>
                              <TableCell className="border-r text-center font-bold">92</TableCell>
                              <TableCell className="border-r text-center font-bold">94</TableCell>
                              <TableCell className="border-r text-center font-bold">96</TableCell>
                              <TableCell className="border-r text-center font-bold">100</TableCell>
                              <TableCell className="text-center font-bold">104</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    className={`px-2 sm:px-3 py-1 text-xs font-bold sm:text-sm bg-transparent text-black border-2 border-[#D1D1D1] rounded ${selectedSize === size ? "border-black" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
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
            {/* <Button onClick={addCart} className="bg-[#FF385C] hover:bg-[#E0314D] py-2 h-full text-white text-sm sm:text-base px-5 md:px-15 sm:py-3">
              Добавить в корзину
            </Button> */}
            <Button onClick={() => toggleLike(product.id)} className={`border bg-transparent w-9 h-9 md:w-12 md:h-12 p-5 ${isLiked
              ? 'text-[#FF385C] fill-[#FF385C]'
              : 'text-gray-400 hover:text-[#FF385C]'
              }`}>
              <Heart size={25} className={isLiked ? 'fill-current' : 'fill-none'} />
            </Button>
          </div>

          {/* Description */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold text-sm sm:text-base">Описание</h4>
              <p className="text-xs sm:text-sm">
                Милый и милый вязаный свитер с водолазкой и длинными рукавами, готовый стать вашим лучшим другом в переменчивую погоду.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">Материал</h4>
              <p className="text-xs sm:text-sm">
                Трикотаж из хлопка. Лучший хлопок, гладкий, удобный, впитывает пот и не блестит.
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-4 max-w-md mx-auto">
            <Label className="text-sm font-medium">Как получать</Label>
            <div className="flex gap-2">
              <Button
                variant='outline'
                className={`${method == "store" && "border-[#FF3A5C]"}`}

                onClick={() => setMethod('store')}
              >
                В магазине
              </Button>
              <Button
               variant='outline'
                className={`${method == "pickup" && "border-[#FF3A5C]"}`}
                onClick={() => setMethod('pickup')}
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
                <Select onValueChange={setCountryCode} defaultValue={countryCode}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="+7" />
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
<Link href="/statusInfo">
               <Button
              
                variant='outline'
                className="rounded-full bg-[#FF385C] text-white text-[16px] w-full h-12 mt-4"
                >
                оплатить 1000₽
              </Button>
                </Link>
            </div>
          </div>
        </div>
        <PaymentSummary/>
      </div>
      <ProductCarousel product={products} />
    </div>
  );
};

export default ProductDetailCard;
