'use client'

import Image from 'next/image'
import telegramIconBlack from '@/assets/images/telegramIconBlack.png'
import { TelegramChannelsData } from '@/lib/mockData'

export const TelegramChannels = () => {
    return (
        <div className='text-center px-0 sm:px-6 py-8 md:py-12'>
            <h1 className='text-start md:text-center text-[#545454] mx-auto w-11/12 md:w-full text-3xl md:text-4xl lg:text-5xl font-medium py-4 sm:py-6'>
                Полный каталог в наших Telegram-каналах:
            </h1>

            <div className='flex flex-wrap justify-center  gap-0 sm:gap-3 md:gap-4'>
                {TelegramChannelsData.map((item, index) => (
                    <div
                        key={index}
                        className='w-1/2 sm:w-[calc(33.333%-12px)] md:w-[calc(25%-16px)] lg:w-[calc(20%-16px)] xl:w-[calc(16.666%-20px)] flex flex-col justify-between h-full bg-[#EFEDEC] rounded-none md:rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'
                    >
                        <div className='h-[300px] p-2 relative'>
                            <Image
                                src={item.image}
                                alt={item.name}
                                className='object-contain object-center w-full h-full'
                            />
                        </div>
                        <div
                            className='h-12 md:h-24 flex w-full items-center justify-center gap-3 md:gap-4 px-2'
                            style={{ background: index % 2 === 0 ? "#D9D9D9" : "#CBCBCB" }}
                        >
                            <p className='text-sm sm:text-base md:text-lg truncate'>{item.name}</p>
                            <Image
                                src={telegramIconBlack}
                                alt="Telegram icon"
                                width={24}
                                height={24}
                                className='w-5 h-5 md:w-6 md:h-6'
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
