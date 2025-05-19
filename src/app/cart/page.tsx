'use client'

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { NotepadText, Trash2, ShoppingBag, X, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { styleData as initialData } from '@/lib/mockData';
import { Skeleton } from '@/components/ui/skeleton';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const Carts: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>(initialData.slice(0, 3));
  const [deleteAll, setDeleteAll] = useState<boolean>(cartData.length > 0);

  const updateQuantity = (index: number, change: number) => {
    setCartData(prev => {
      const updated = [...prev];
      const newQuantity = updated[index].quantity + change;

      if (newQuantity <= 0) {
        return updated.filter((_, i) => i !== index);
      }

      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const deleteItem = (index: number) => {
    setCartData(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteAll = () => {
    setCartData([]);
  };

  useEffect(() => {
    setDeleteAll(cartData.length > 0);
  }, [cartData]);

  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 md:py-10'>
      <div className='flex justify-between items-start sm:items-center mb-6 md:mb-8 gap-4'>
        <h1 className='font-semibold text-2xl sm:text-3xl md:text-4xl'>Ваша корзина</h1>
        {deleteAll && (
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className="text-[#F04438] hover:bg-transparent font-medium text-sm sm:text-base"
          >
            Удалить все
          </Button>
        )}
      </div>

      {deleteAll ? (
        <>
          {/* Table Headers */}
          <div className='hidden sm:flex items-center justify-between border-b p-3 text-lg font-semibold'>
            <div className='w-1/2'><p>Продукт</p></div>
            <div className='flex w-1/2 gap-4 md:gap-10 items-center justify-between'>
              <p className='w-1/4 text-center'>Цена</p>
              <p className='w-1/4 text-center'>Количество</p>
              <p className='w-1/4 text-center'>Общий</p>
            </div>
          </div>

          {/* Cart Items */}
          <div className='space-y-4 sm:space-y-6'>
            {cartData.map((item, index) => (
              <div key={item.id} className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b gap-4 sm:gap-0'>
                {/* Product Info */}
                <div className='flex items-center gap-4 w-full sm:w-1/2'>
                  {/* <img
                    src={item.image}
                    alt={item.name}
                    className='object-cover rounded-lg w-20 h-20 sm:w-32 sm:h-32'
                  /> */}
                  <div className='w-22 h-28 sm:w-32 sm:h-32 relative'>
                    <ImageIcon className='text-gray-400 left-1/2 top-1/2 -translate-y-1/2 absolute -translate-1/2' />
                  <Skeleton className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-1 flex flex-wrap justify-between'>
                    <p className='font-medium text-sm sm:text-base'>{item.name}</p>
                    <div className='md:flex gap-2'>
                      {/* Edit Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto text-xs sm:text-sm">
                            <NotepadText className='w-4 h-4 mr-1' />
                            <span className='hidden'>Редактировать</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex justify-between items-center">
                              Редактировать продукт
                              <DialogClose className="cursor-pointer"><X /></DialogClose>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              {/* <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              /> */}
                              <div><h3 className="font-medium text-lg">{item.name}</h3></div>
                            </div>

                            {/* Color & Size selection (static for now) */}
                            <div className="flex justify-between items-center pt-4">
                              <div>
                                <p className='text-[#5F5F5F]'>Цвет</p>
                                <div className='flex gap-3'>
                                  {['#FF385C', '#EBC1BB', '#A4A4A4'].map((color, i) => (
                                    <div key={i} className='rounded w-8 h-8' style={{ backgroundColor: color }}></div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className='text-[#5F5F5F]'>Размер</p>
                                <div className='flex gap-3'>
                                  {['S', 'M', 'L', 'XL', 'XLL'].map(size => (
                                    <div key={size} className='rounded w-10 h-10 border flex justify-center items-center font-bold'>{size}</div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                              <DialogClose asChild>
                                <Button className="bg-[#FF385C] w-full">Обновить корзину</Button>
                              </DialogClose>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto text-red-600 text-xs sm:text-sm">
                            <Trash2 className='w-4 h-4 mr-1' />
                            <span className='hidden'>Удалить</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="text-center max-w-xs sm:max-w-md">
                          <h3 className='font-semibold text-lg sm:text-xl'>удалить товар из корзины</h3>
                          <p className='text-[#8D8D8D] text-sm sm:text-base'>Вы уверены, что хотите удалить товар из корзины?</p>
                          <div className='flex justify-center gap-4 mt-4'>
                            <DialogClose asChild>
                              <Button className='bg-[#F04438] text-white w-1/2' onClick={() => deleteItem(index)}>
                                Удалить
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="outline" className="w-1/2">Отмена</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Mobile actions */}
                    <div className='flex sm:hidden justify-between items-center mt-2 w-full'>
                      <div className='border p-1 rounded-sm flex gap-3 items-center'>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(index, -1)}>-</Button>
                        <p className='text-sm'>0</p>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(index, 1)}>+</Button>
                      </div>
                      <p className='font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop Price Section */}
                <div className='hidden sm:flex w-1/2 gap-4 md:gap-10 items-center justify-between'>
                  <p className='w-1/4 text-center'>${item.price}</p>
                  <div className='w-1/4 flex justify-center'>
                    <div className='border p-2 rounded-sm flex gap-3 items-center'>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(index, -1)}>-</Button>
                      <p>0</p>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(index, 1)}>+</Button>
                    </div>
                  </div>
                  <p className='w-1/4 text-center'>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#FAFAFA] border-b-2 gap-4'>
            <p className='text-gray-500 text-sm sm:text-base'>Налоги и стоимость доставки будут рассчитаны при оформлении заказа.</p>
            <div className='flex items-center gap-6 sm:gap-10 w-full sm:w-auto justify-between sm:justify-end'>
              <p className='font-semibold text-lg'>Итого</p>
              <p className='font-semibold text-lg'>
                ${cartData.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6'>
            <Link href="/" className="w-full sm:w-auto">
              <Button className='w-full sm:w-auto border border-black bg-white text-black py-5 font-semibold'>
                Продолжить покупки
              </Button>
            </Link>
            <Link href="/checkout" className="w-full sm:w-auto">
              <Button className='w-full sm:w-auto bg-[#FF385C] py-5 font-semibold'>
                Проверить
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className='text-center space-y-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto py-10 sm:py-20'>
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-[#1B1B1B] text-xl sm:text-2xl font-semibold capitalize mt-4">пустая корзина</h1>
          <p className='text-[#8D8D8D] font-normal text-sm sm:text-base px-4 sm:px-0'>
            В вашей корзине нет товаров.
          </p>
          <Link href="/" className="inline-block w-full sm:w-auto">
            <Button className="bg-[#FF385C] w-full sm:w-64 font-semibold text-base mt-4">
              Продолжить покупки
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default Carts;
