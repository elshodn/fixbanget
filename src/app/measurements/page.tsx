'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TelegramChannels } from '@/components/telegram/TelegramChannels';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import measurementImage from '@/assets/images/measurementImage.png';

interface FormField {
  id: string;
  label: string;
  required: boolean;
  fullWidth?: boolean;
}

const Measurements: React.FC = () => {
  const formFields: FormField[][] = [
    [
      { id: 'gender', label: 'Пол', required: false },
      { id: 'weight', label: 'Вес', required: false },
    ],
    [
      { id: 'hips', label: 'Бёдра', required: false },
      { id: 'height', label: 'Рост', required: false },
    ],
    [
      { id: 'chest', label: 'Бюст', required: false },
      { id: 'shoulders', label: 'Плечи', required: false },
    ],
    [
      { id: 'waist', label: 'Талия', required: false },
      { id: 'name', label: 'Ваше имя', required: true },
    ],
    [
      {
        id: 'size',
        label: 'Ваш размер',
        required: true,
        fullWidth: true,
      },
    ],
  ];

  return (
    <div>
      <div className="mx-auto w-11/12 my-10 md:my-20">
        <p className="text-[#8D8D9A] text-[14px]">
          <Link href="/">Главная страница</Link> / Замеры
        </p>

        <h1 className="text-3xl md:text-5xl font-medium my-6 md:my-10">Замеры</h1>

        <div className="flex flex-col lg:flex-row justify-between">
          {/* Left side - form */}
          <div className="w-full lg:w-1/2">
            <p className="my-6 md:my-10 mx-auto w-full md:w-5/12 lg:w-full xl:w-5/12 leading-7 md:leading-9">
              Заполните форму, мы свяжемся с вами в течении 10 минут и сообщим размер
            </p>

            <form className="space-y-4">
              {formFields.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {row.map((field) => (
                    <div key={field.id} className="space-y-2 col-span-1 sm:col-span-1">
                      <Label
                        htmlFor={field.id}
                        className="translate-y-6 ml-2 bg-[#EFEFEF] text-black w-max p-2"
                      >
                        {field.label}
                        {field.required && <span className="text-[#FF385C]">*</span>}
                      </Label>
                      <Input
                        id={field.id}
                        className="rounded-none border py-7 border-[#A6A5B1]"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              ))}

              <Button type="submit" className="mt-6 py-6 w-full bg-[#FF385C] hover:bg-[#E03150]">
                Отправить
              </Button>
              <p className="text-sm md:text-base">
                <span className="text-[#FF385C]">*</span> - обязательные поля
              </p>
            </form>
          </div>

          <div className="hidden w-full md:w-2/5 bg-amber-200 md:flex justify-center lg:justify-end mt-8 lg:mt-0">
            <Image
              src={measurementImage}
              alt="Measurement illustration"
              className="w-full  h-auto"
              placeholder="blur"
            />
          </div>
        </div>
      </div>

      <TelegramChannels />
    </div>
  );
};

export default Measurements;
