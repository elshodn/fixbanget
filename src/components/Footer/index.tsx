import React from 'react';

import Image from "next/image";
export const Footer: React.FC = () => {
    return (
        <footer className='bg-black mt-20'>
            <div className="flex w-11/12 mx-auto md:w-full items-center p-4">
                <div className='flex gap-2 items-center w-1/3'>
                    <Image
                        src="/telegramIcon.png"
                        alt="Telegram"
                        width={28}
                        height={28}
                        priority
                        style={{ width: "auto" }}
                        className="w-7 object-cover"
                    />
                    <Image className='w-7 object-cover' 
                        width={28}
                        height={28}
                        priority
                        style={{ width: "auto" }} src='/instagramIcon.png' alt="Instagram" />
                    <Image className='w-7 object-cover' 
                        width={28}
                        height={28}
                        priority
                        style={{ width: "auto" }} src='/youtubeIcon.png' alt="YouTube"
                        
                        />
                </div>
                <div className='w-1/3 flex justify-center'>
                    <img className='object-contain' src='/logo.png' alt="Logo" />
                </div>
            </div>

            <div className="flex w-11/12 mx-auto md:w-full mb-4">
                <div className='p-2 pt-4 w-1/3 space-y-1'>
                    <p className='text-white text-sm font-bold'>Магазин</p>
                    <p className='text-sm font-bold text-gray-500'>Мужское</p>
                    <p className='text-sm font-bold text-gray-500'>Женское</p>
                    <p className='text-sm font-bold text-gray-500'>Unicflo в Китае</p>
                    <p className='text-sm font-bold text-gray-500'>Замеры</p>
                    <p className='text-sm font-bold text-gray-500'>Доставка и Оплата</p>
                    <p className='text-sm font-bold text-gray-500'>Блог</p>
                    <p className='text-sm font-bold text-gray-500'>Свизатся с нами</p>
                </div>
                <div className='p-2 pt-4 w-1/3 space-y-1'>
                    <p className='text-white text-sm font-bold'>Каталог</p>
                    <p className='text-sm font-bold text-gray-500'>Кроссовки</p>
                    <p className='text-sm font-bold text-gray-500'>Все бренды</p>
                    <p className='text-sm font-bold text-gray-500'>Air Jordan</p>
                    <p className='text-sm font-bold text-gray-500'>Nike</p>
                    <p className='text-sm font-bold text-gray-500'>New Balance</p>
                    <p className='text-sm font-bold text-gray-500'>Adidas</p>
                    <p className='text-sm font-bold text-gray-500'>Asics</p>
                </div>
                <div className='p-2 pt-4 w-1/3 space-y-1'>
                    <p className='text-white text-sm font-bold'>Компания</p>
                    <p className='text-sm font-bold text-gray-500'>Приложение</p>
                    <p className='text-sm font-bold text-gray-500'>Команда</p>
                    <p className='text-sm font-bold text-gray-500'>Отзывы</p>
                    <p className='text-sm font-bold text-gray-500'>Контакты</p>
                </div>
            </div>

            <div className='w-11/12 mx-auto md:w-full flex flex-col md:flex-row p-3 gap-4 font-medium text-base border-t-4 md:border-t-0'>
                <p className='text-white'>© 2025 ООО «lorem ipsum»</p>
                <p className='text-gray-700'>Карта сайта</p>
                <p className='text-gray-700'>Политика конфиденциальности</p>
                <p className='text-gray-700'>Оферта</p>
            </div>
        </footer>
    );
};
