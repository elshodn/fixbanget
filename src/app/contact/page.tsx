'use client'

import React from 'react'
import { Phone, Mail } from 'lucide-react'
import { TelegramChannels } from '@/components/telegram/TelegramChannels'
import Link from 'next/link'

const Contact = () => {
    return (
        <div>
            <div className='mx-auto w-11/12 my-10'>
                <p className='text-[#8D8D9A]'>
                    <Link href="/">Главная страница</Link> | Связаться с нами
                </p>

                <h1 className='text-3xl sm:text-4xl md:text-5xl font-normal my-6 md:my-10'>
                    Связаться с нами
                </h1>

                <div className='py-4 md:py-6'>
                    <h3 className='text-base font-medium'>Телефоны для связи</h3>
                    <div className='space-y-4 mt-3 md:mt-5'>
                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center'>
                            <div className='flex gap-2 sm:gap-4 items-center'>
                                <Phone className='fill-[#FF385C] text-[#FF385C] w-5 h-5' />
                                <p className='text-sm sm:text-base'>Консультация по женскому ассортименту</p>
                            </div>
                            <p className='text-sm sm:text-base font-medium ml-7 sm:ml-0'>+7 (915) 776-02-11</p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center'>
                            <div className='flex gap-2 sm:gap-4 items-center'>
                                <Phone className='fill-[#FF385C] text-[#FF385C] w-5 h-5' />
                                <p className='text-sm sm:text-base'>Консультация по мужскому ассортименту</p>
                            </div>
                            <p className='text-sm sm:text-base font-medium ml-7 sm:ml-0'>+7 (915) 776-02-11</p>
                        </div>
                    </div>
                </div>

                {/* Email Section */}
                <div className='py-4 md:py-6'>
                    <h3 className='text-base font-medium'>Электронная почта</h3>
                    <div className='flex gap-2 sm:gap-4 items-center mt-3 md:mt-5'>
                        <Mail className="fill-[#FF385C] text-[#FF385C] w-5 h-5" />
                        <p className='text-sm sm:text-base font-medium'>unicflo@gmail.com</p>
                    </div>
                </div>

                {/* Telegram Section */}
                <div className='py-4 md:py-6'>
                    <h3 className='text-base font-medium'>Телеграм</h3>
                    <div className='space-y-4 mt-3 md:mt-5'>
                        <div className='flex gap-2 sm:gap-4 items-center'>
                            <Phone className='fill-[#FF385C] text-[#FF385C] w-5 h-5' />
                            <p className='text-sm sm:text-base'>Для него</p>
                        </div>
                        <div className='flex gap-2 sm:gap-4 items-center'>
                            <Phone className='fill-[#FF385C] text-[#FF385C] w-5 h-5' />
                            <p className='text-sm sm:text-base'>Для нее</p>
                        </div>
                    </div>
                </div>
            </div>
            <TelegramChannels />
        </div>
    )
}

export default Contact
