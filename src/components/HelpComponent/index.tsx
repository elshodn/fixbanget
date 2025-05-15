import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react'
import plasticCard from "@/assets/images/plasticCard.png"


import virtualCard1 from "@/assets/images/cardsImages/btn.png"
import virtualCard2 from "@/assets/images/cardsImages/cimb.png"
import virtualCard3 from "@/assets/images/cardsImages/maybank.png"
import virtualCard4 from "@/assets/images/cardsImages/anz.png"
import virtualCard5 from "@/assets/images/cardsImages/Card Logo.png"
import koshelokCard1 from "@/assets/images/cardsImages/gopay.png"
import koshelokCard2 from "@/assets/images/cardsImages/gpay.png"
import koshelokCard3 from "@/assets/images/cardsImages/cashbac.png"
import koshelokCard4 from "@/assets/images/cardsImages/paytren.png"
import koshelokCard5 from "@/assets/images/cardsImages/SHOPEEPAY.png"
import Image from "next/image";
const helpItems = [
  { id: "return", title: "Возврат Заказа" },
  { id: "faq", title: "Часто Задаваемые Вопросы" },
  { id: "payment", title: "Payment Information" },
];

export default function HelpComponent() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-1 flex flex-col items-center">
      {/* Card Buttons */}
      {!activeTab &&
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2 w-full max-w-6xl">
          {helpItems.map((item) => (
            <div key={item.id} className="bg-white p-6 m rounded-2xl shadow-sm text-center flex flex-col justify-between">
              <h3 className="font-semibold text-xl mb-2 text-[#1B1B1B]">{item.title}</h3>
              <p className="mb-4 text-[#8D8D8D] text-[14px]">
                {item.id === "return" && "Помогите вам понять, как работает порядок возврата средств"}
                {item.id === "faq" && "Все вопросы, которые пользователи обычно задают о наших услугах"}
                {item.id === "payment" && "Информация о том, как управлять платежами и оплачивать заказ"}
              </p>
              <Button className="bg-[#FF385C]" onClick={() => setActiveTab(item.id)}>
                Смотреть руководство
              </Button>
            </div>
          ))}
        </div>
      }
      {activeTab &&
        <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-sm">
          {activeTab === "return" && (
            <div className="space-y-4 text-gray-700">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 cursor-pointer"><ChevronLeft onClick={() => setActiveTab(null)} /> Возврат заказа</h2>
              <ol className="list-decimal ml-5 text-[#1B1B1B] text-base font-normal">
                <li>Подтвердите причину возврата. Если у вас возникли проблемы с приобретенным вами продуктом, свяжитесь со службой поддержки клиентов Erigo через чат на официальной учетной записи Erigo Product Sales, доступной на торговой площадке, которую вы использовали при покупке продукта.</li>
                <li>Команда связывается с вами После подтверждения команда немедленно свяжется с вами по телефону / Whatsapp по номеру телефона, указанному в деталях вашего заказа, чтобы убедиться, что требования к возврату подтвержденного вами продукта выполнены, например, бирки продукта, которые все еще висят, и продукты, которые не использовались / не стирались. Затем мы предоставим процедуру обмена / возврата.</li>
                <li>Прикрепите этикетку возврата. Затем подготовьте посылку для отправки нам обратно. Убедитесь, что продукт, бирка продукта, которая все еще висит, и форма процедуры возврата прикреплены к посылке.</li>
                <li>Прикрепите этикетку возврата. Затем подготовьте посылку для отправки нам обратно. Добавьте свои товары и надежно прикрепите посылку. Обязательно снимите или закройте оригинальную этикетку доставки и прикрепите новую этикетку возврата к посылке. Все готово! Просто запланируйте забор или доставку в любом авторизованном пункте курьерской службы, указанном на этикетке доставки. Пожалуйста, подождите около 7 - 14 дней для обработки возврата. Вы получите уведомление от нас, когда ваш возврат будет получен и готов к обработке. Последний этап, вам просто нужно дождаться уведомления о номере квитанции, который будет сообщен нашей командой.</li>
              </ol>
              <h1 className="text-[#1B1B1B] font-semibold text-xl mb-3">Перевозки</h1>
              <p className="text-[#1B1B1B] text-base font-normal">
                Мы упаковываем и отправляем ваш заказ как можно скорее. Мы продолжим обработку в соответствии с вашим заказом. Заказы, которые обрабатываются, продолжают корректировать порядок входящих заказов, и могут быть задержки, если поток заказов очень высок. Тем не менее, мы сделаем все возможное, чтобы ваш заказ был доставлен вовремя, и Erigo не несет ответственности за условия, находящиеся вне нашего контроля, такие как плохая погода, перебои в обслуживании и т. д. Вы можете периодически проверять статус доставки вашего заказа на странице сведений о вашем заказе, найденной на торговой площадке, или на официальной странице веб-сайта Erigo, которую вы использовали при размещении заказа.
              </p>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="text-gray-700 space-y-2">
              <h1 className="text-xl font-semibold flex items-center gap-2 mb-4 cursor-pointer"><ChevronLeft onClick={() => setActiveTab(null)} />Платежная информация</h1>
              <div className="space-y-2 mb-6">
                <h2 className="text-[#1B1B1B] font-semibold text-base">Карточка</h2>
                <Image src={plasticCard} alt="Plastic Card" className="max-w-52" />
              </div>
              <div className="space-y-2 mb-6">
                <h2 className="text-[#1B1B1B] font-semibold text-base">Виртуальный счет</h2>
                <div className="flex flex-wrap gap-2">
                  <Image src={virtualCard1} alt="Virtual Card 1" className="w-16" />
                  <Image src={virtualCard2} alt="Virtual Card 2" className="w-16" />
                  <Image src={virtualCard3} alt="Virtual Card 3" className="w-16" />
                  <Image src={virtualCard4} alt="Virtual Card 4" className="w-16" />
                  <Image src={virtualCard5} alt="Virtual Card 5" className="w-[200px]" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <h2 className="text-[#1B1B1B] font-semibold text-base">Электронный кошелек</h2>
                <div className="flex flex-wrap gap-2">
                    <Image src={koshelokCard1} alt="Gopay" className="w-16" />
                    <Image src={koshelokCard2} alt="GPay" className="w-16" />
                    <Image src={koshelokCard3} alt="Cashbac" className="w-16" />
                    <Image src={koshelokCard4} alt="Paytren" className="w-16" />
                    <Image src={koshelokCard5} alt="ShopeePay" className="w-16" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <>
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 cursor-pointer"><ChevronLeft onClick={() => setActiveTab(null)} />Часто задаваемые вопросы</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border rounded px-2  my-4">
                  <AccordionTrigger   >Какой вариант доставки у вас есть?</AccordionTrigger>
                  <AccordionContent className="text-[#1B1B1B] text-[14px] font-normal">Мы осуществляем доставку на дом курьерской службой и Click&Collect.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border rounded px-2 my-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer py-3  text-[#1B1B1B] text-base font-semibold">Когда я получу свой заказ после уведомления об успешном заказе?</AccordionTrigger>
                  <AccordionContent>Обычно доставка занимает от 2 до 7 рабочих дней в зависимости от вашего региона.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border rounded px-2 my-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer py-3  text-[#1B1B1B] text-base font-semibold">Как узнать размерный ряд товара?</AccordionTrigger>
                  <AccordionContent>Размерные таблицы доступны на странице каждого товара.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border rounded px-2 my-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer py-3  text-[#1B1B1B] text-base font-semibold">Какие способы оплаты вы принимаете?</AccordionTrigger>
                  <AccordionContent>Мы принимаем оплату банковскими картами, электронными кошельками и наложенным платежом.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border rounded px-2 my-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer py-3  text-[#1B1B1B] text-base font-semibold">Могу ли я внести изменения в заказ после его подтверждения?</AccordionTrigger>
                  <AccordionContent>Да, вы можете изменить заказ в течение 1 часа после подтверждения через службу поддержки.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </div>
      }
    </div>
  );
}