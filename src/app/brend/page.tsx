'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TelegramChannels } from '@/components/telegram/TelegramChannels'
import queto from "@/assets/images/quote.png"
import brendpageimage from "@/assets/images/brendpageimage.png"
import brendpageimage2 from "@/assets/images/brendpageimage2.png"
import brendpageimage3 from "@/assets/images/brendpageimage3.png"
import brendpageimage4 from "@/assets/images/brendpageimage4.png"
export default function Brend() {
    return (
        <div>
            <div className='mx-auto py-6 sm:py-8 md:py-10 my-2 w-11/12 max-w-7xl'>
                <p className='text-[#8D8D9A] text-[14px]'>
                    <Link href="/">Главная страница</Link> / Реплика или копия? Копия или оригинал?
                </p>

                <h1 className='text-2xl mt-5 sm:text-3xl md:text-4xl font-medium text-[#545454] text-left'>
                    МИРАЖ БРЕНДОВ <br className="hidden sm:inline" /> ИСКУССТВО ЭЛЕГАНТНОГО ОБМАНА
                </h1>

                {/* Quote Section */}
                <div className='flex gap-3 py-4 sm:py-6 items-start mt-6'>
                    <div className='flex mx-0 sm:mx-4 md:mx-10 mb-4 sm:mb-0'>
                        <Image
                            src={queto}
                            width={48}
                            height={48}
                            className='object-contain w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12'
                            alt="quote icon"
                        />
                    </div>
                    <p className='w-full sm:w-10/12 md:w-6/12 text-[12px] sm:text-xl md:text-2xl font-normal text-[#545454]'>
                        Пока одни краснеют при слове "копия", другие открывают бутылку шампанского, празднуя удачную находку! Представьте себе: мадам с Рублевки и финансовый магнат с Уолл-стрит — оба тайно коллекционируют "почти оригиналы". Шокирующе? Возможно. Правдиво? Абсолютно!
                    </p>
                </div>

                {/* First Content Section */}
                <div className='my-8 sm:my-10 md:my-14 text-[#545454]'>
                    <h1 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4 md:mb-5'>ТАЙНАЯ ИЕРАРХИЯ ПОДДЕЛОК</h1>
                    <p className='text-base sm:text-lg md:text-xl font-normal w-full md:w-10/12 lg:w-8/12'>
                        Базовый самообман — китайская "Гучи" за копейки (узнают даже бабушки в автобусе)
                        Продвинутый камуфляж — когда даже продавец в бутике моргнет дважды
                        Высший пилотаж фальсификации — когда сам дизайнер бренда задумается: "А не я ли это шил?"
                        Раньше миллионеры швыряли деньги на ветер, сегодня они коллекционируют идеальные копии. Революция? Еще какая!
                    </p>
                </div>

                {/* Image with Content Section */}
                <div>
                    <Image
                        src={brendpageimage}
                        alt="Brand showcase"
                        className='w-full h-auto rounded-lg shadow-sm object-cover'
                    />
                    <div className='my-8 sm:my-10 md:my-14 text-[#545454]'>
                        <h1 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4 md:mb-5'>ТАЙНА ТРЕХ БУКВ: КАК ОТЛИЧИТЬ "ВАУ" ОТ "УВЫ"</h1>
                        <p className='text-base sm:text-lg md:text-xl font-normal w-full lg:w-10/12 xl:w-9/12'>
                            Представьте две абсолютно одинаковые сумки Hermes. Одна стоит как автомобиль, другая — как ужин в ресторане. В чем подвох? Возможно, в том единственном стежке, который виден только под микроскопом, или в коже, которую гладили исключительно девственницы при полнолунии.
                            Модный мир больше не делится на черное и белое. Теперь это 50 оттенков подлинности — от "очевидно фальшиво" до "обманчиво настоящего"!
                            Помните: настоящий шик сегодня — это когда никто не знает, потратили вы на сумку годовой бюджет маленькой страны или просто знаете правильные сайты в интернете.
                            Мода — это игра. А в каждой игре есть свои правила и секретные ходы...
                        </p>
                    </div>
                </div>

                {/* Image Gallery Section */}
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 my-8 sm:my-10 md:my-12 mb-10 sm:mb-16 md:mb-20'>
                    <Image
                        src={brendpageimage2}
                        className='w-full sm:w-5/12 object-cover h-full rounded-lg shadow-sm'
                        alt="Brand image 1"
                        width={500}
                        height={400}
                    />
                    <div className='w-full sm:w-7/12 flex flex-col gap-3 sm:gap-4 md:gap-6'>
                        <Image
                            className='w-full object-cover h-1/2 sm:h-56 md:h-1/2 rounded-lg shadow-sm'
                            src={brendpageimage3}
                            alt="Brand image 2"
                            width={700}
                            height={300}
                        />
                        <Image
                            className='w-full object-cover h-48 sm:h-56 md:h-1/2 rounded-lg shadow-sm'
                            src={brendpageimage4}
                            alt="Brand image 3"
                            width={700}
                            height={300}
                        />
                    </div>
                </div>
            </div>

            <TelegramChannels />
        </div>
    )
}
