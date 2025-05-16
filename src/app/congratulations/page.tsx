import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
const page = () => {
    return (
        <div className='text-center flex flex-col items-center justify-center h-screen gap-8'>
            <Image
                src="/congr.png"
                alt="Congratulations"
                width={142}
                height={142} />
            <p>Спасибо за ваш заказ!
                В вашем списке желаний нет ни одного товара.</p>
                <Link href="/">
            <Button className='bg-[#FF385C]'>Продолжить покупки</Button>
                </Link>
        </div>
    )
}

export default page
