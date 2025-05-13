'use client';

import React, { useState } from 'react';
import { commentsData, products } from '@/lib/mockData';
import { Share2, Heart, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from '@/components/Carousel';
import { Dialog, DialogContent, DialogHeader,DialogDescription, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLikeStore } from '@/stores/likeStore';
import sizeImage from "../assets/images/size.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  email: string;
  title: string;
  review: string;
}

const DetailCard = ({ params }: { params: { id: string } }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState<number>(0);
  const [switchComment, setSwitchComment] = useState<boolean>(true);
  const product = products.find((p) => p.name.toString() === params.id);
  const [mainImage, setMainImage] = useState<string>(product?.image || '');
  const productCarousel = [...products];
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    title: "",
    review: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ...formData,
      rating,
    });
    // Add your API call here
  };

  if (!product) {
    return <div className="p-4 text-red-600">Продукт не найден</div>;
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleThumbnailClick = (img: string, index: number) => {
    setMainImage(img);
    setCurrentThumbnailIndex(index);
  };

  const share = () => {
    alert("Делиться");
  };

  const addCart = () => {
    alert("добавлено в корзину");
  };

  const toggleLike = useLikeStore((state) => state.toggleLike);
  const isLiked = useLikeStore((state) => state.likedProducts.includes(product.id));

  return (
    <div className="pb-12">
      {/* Main Product Section */}
      <div className="w-11/12 mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 h-auto sm:h-[500px]'>
          {/* Main Image */}
          <div className='sm:w-9/12 bg-[#F2F2F2] flex justify-center items-center p-4 sm:p-6 rounded-lg'>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative h-full cursor-zoom-in">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                <img
                  src={mainImage}
                  alt="zoomed"
                  className="w-11/12 mx-auto h-auto max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className='sm:w-3/12 flex sm:flex-col gap-2 sm:gap-3 overflow-hidden sm:h-full'>
            <div className='sm:hidden w-full'>
              <Swiper
                spaceBetween={10}
                slidesPerView={4}
              >
                {[product.image, product.image, product.image, product.image].map((img, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`w-16 h-16 bg-[#F2F2F2] flex items-center justify-center p-1 cursor-pointer ${currentThumbnailIndex === index ? 'border border-[#FF385C]' : ''
                        }`}
                      onClick={() => handleThumbnailClick(img, index)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className='hidden sm:flex sm:flex-col gap-3 sm:h-full overflow-y-auto'>
              {[product.image, product.image, product.image, product.image].map((img, index) => (
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
          <span className="text-xs sm:text-sm text-gray-500">Весенняя коллекция</span>
          <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
          <p className="text-xl sm:text-2xl font-semibold">{product.price} ₽</p>

          <div className="flex justify-between items-center gap-2 text-xs sm:text-sm text-gray-600">
            <p className='font-bold text-[#1B1B1B]'>398 товаров было продано</p>
            <button className="flex items-center gap-1 sm:gap-2 text-black font-bold cursor-pointer" onClick={share}>
              <Share2 size={16} />
              <span>Делиться</span>
            </button>
          </div>
          <hr />
          {/* Color and Size Selectors */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 justify-between">
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
                      <img className='w-32 md:w-1/4 mx-auto' src={sizeImage} alt="size image" />
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
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </Button>
              <p className="text-sm sm:text-base">{quantity}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </Button>
            </div>
            <Button onClick={addCart} className="bg-[#FF385C] hover:bg-[#E0314D] py-2 h-full text-white text-sm sm:text-base px-5 md:px-15 sm:py-3">
              Добавить в корзину
            </Button>
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
        </div>
      </div>

      {/* Reviews or Shipping Info Section */}
      <div className='w-11/12 mx-auto'>
        <div className='flex gap-2 mb-5'>
          <Button
            onClick={() => setSwitchComment(true)}
            className="bg-transparent text-[#1B1B1B] p-0.5 md:p-3 text-sm md:text-2xl font-semibold shadow-none relative"
          >
            Отзывы клиентов
            <span className={`w-full h-1 bg-black absolute bottom-0 ${switchComment ? "block" : "hidden"}`}></span>
          </Button>
          <Button
            onClick={() => setSwitchComment(false)}
            className="bg-transparent text-[#1B1B1B] p-0.5 md:p-3 text-sm md:text-2xl font-semibold shadow-none relative"
          >
            Доставка и возврат
            <span className={`w-full h-1 bg-black absolute bottom-0 ${switchComment ? "hidden" : "block"}`}></span>
          </Button>
        </div>

        {switchComment ? (
          <div className='h-[400px] overflow-hidden'>
            <div className="overflow-x-auto lg:overflow-x-hidden flex w-full gap-4 h-full">
              <div className='min-w-[300px] bg-[#FF385C] rounded-2xl p-4 text-white text-center h-full flex flex-col justify-around'>
                <h4 className='text-lg sm:text-xl font-semibold'>Женский сладкий свитер</h4>
                <h1 className='text-4xl sm:text-5xl font-semibold'>4.7</h1>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < 4 ? 'fill-[#FB941B] text-[#FB941B]' : 'fill-[#443FF3] text-[#443FF3]'}`}
                      />
                    ))}
                  </div>
                  <p className='text-sm sm:text-base font-medium'>Общий рейтинг на основе 198 отзывов</p>
                </div>
                <h3 className='text-sm sm:text-base font-bold'>398 товаров было продано</h3>

                {/* Review Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-[#FF385C] w-full sm:w-10/12 mx-auto text-sm sm:text-base">
                      Написать отзыв
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle className="text-center">Оставить отзыв</DialogTitle>
                      <DialogDescription className="sr-only">salom</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Ваше имя"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Электронная почта"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Рейтинг</Label>
                        <div className="flex">
                          {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                              <button
                                type="button"
                                key={ratingValue}
                                className="text-2xl"
                                onClick={() => setRating(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                              >
                                <Star
                                  className={`w-6 h-6 ${ratingValue <= (hover || rating) ? 'fill-[#FB941B] text-[#FB941B]' : 'fill-[#E8E8E8] text-[#E8E8E8]'}`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Заголовок обзора (макс. 10 слов)</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          placeholder="Ваш отзыв о названии"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="review">Текст обзора (макс. 150 слов)</Label>
                        <Textarea
                          className="min-h-32"
                          id="review"
                          name="review"
                          rows={4}
                          value={formData.review}
                          onChange={handleInputChange}
                          required
                          placeholder="напишите свой отзыв...."
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="submit" className="w-full bg-[#FF385C] hover:bg-[#FF385C]/90">
                          Отправить отзыв
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className='h-full pb-2'>
                <div className='flex gap-4 h-full' style={{ width: 'max-content' }}>
                  {commentsData.map((item, index) => (
                    <div key={index} className='max-w-[300px] xl:max-w-[350px] bg-white rounded-2xl h-full flex flex-col p-4 justify-between'>
                      <div>
                        <h1 className='text-lg sm:text-xl font-semibold my-2 sm:my-4'>{item.title}</h1>
                        <p className='text-[#8D8D8D] text-sm sm:text-base'>{item.desc}</p>
                      </div>
                      <div>
                        <div className='flex gap-2 mb-2 sm:mb-3'>
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${starIndex < item.rating ? 'fill-black text-black' : 'fill-[#E8E8E8] text-[#E8E8E8]'}`}
                            />
                          ))}
                        </div>
                        <div className='flex justify-between items-center text-xs sm:text-sm'>
                          <p>{item.after}</p>
                          <p>{item.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 text-base text-[#8D8D8D]'>
            <div className='w-full'>
              <h1 className='text-base font-medium text-black'>Процедура возврата и обмена онлайн-заказа</h1>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className='mb-5'>
                  <h3 className='my-1'>{item}. Подтверждение причины возврата</h3>
                  <p className='ml-4'>
                    Lorem ipsum dolor sit amet consectetur. Porta volutpat adipiscing ornare mi velit. Semper gravida id neque blandit. In malesuada curabitur curabitur consectetur habitasse dui. Venenatis dictumst sodales tincidunt ornare nunc sed.
                  </p>
                </div>
              ))}
            </div>
            <div className='w-full'>
              <h1 className='text-base font-medium text-black'>Перевозки</h1>
              <p className='mb-5'>
                Lorem ipsum dolor sit amet consectetur. Porta volutpat adipiscing ornare mi velit. Semper gravida id neque blandit. In malesuada curabitur curabitur consectetur habitasse dui. Venenatis dictumst sodales tincidunt ornare nunc sed.
              </p>
              <div className="mb-5">
                Lorem ipsum dolor sit amet consectetur. Dui ultrices nec lorem posuere lectus elit sit dui amet. Tellus tempor facilisi nibh purus quis elit blandit elementum. Elit vulputate arcu vitae vitae est urna amet ullamcorper id. Mattis dignissim at auctor vitae nulla ac sodales morbi. Purus dui nunc dui vestibulum id.
              </div>
              <div className="mb-5">
                Ut etiam pretium sed eu nunc suspendisse pellentesque massa maecenas. Sagittis arcu purus sollicitudin senectus accumsan porttitor mollis sodales. Massa ultrices sed elit viverra vitae placerat feugiat libero. Ac quis adipiscing tincidunt malesuada. Nullam eu velit amet adipiscing aliquet. Elementum sed ut ut mauris nascetur. In non ut pulvinar eget diam cursus. Eu dui consectetur amet dapibus pellentesque praesent. Amet eu fringilla vitae.
              </div>
            </div>
          </div>
        )}
      </div>

      <ProductCarousel product={productCarousel} />
    </div>
  );
};

export default DetailCard;