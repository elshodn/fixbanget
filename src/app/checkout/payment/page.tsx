"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Copy } from "lucide-react";
import Image from "next/image";
import virtualCard4 from "@/assets/images/cardsImages/anz.png"; // rasmni tekshirish

const PaymentCompletePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(3 * 60 * 60); // 3 soat
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  const handleCopy = (): void => {
    navigator.clipboard.writeText("0009234442");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const paymentSteps: string[] = ["Банкомат BCA", "М Банкинг", "Нажмите БСА"];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center py-8 px-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-md">
        <h2 className="text-center text-xl font-semibold text-[#1B1B1B] mb-2">
          Завершите оплату в
        </h2>
        <div className="text-center text-2xl font-bold text-[#FF385C] mb-2">
          {formatTime(timeLeft)}
        </div>
        <p className="text-center text-sm text-gray-500 mb-4">
          Воскресенье, 9 октября 2022 г., 10:12 утра
        </p>

        <div className="bg-[#F9FAFB] border rounded-lg p-4 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">🏦 VA и банковский перевод</span>
            <Image src={virtualCard4} alt="BCA" className="h-6 w-auto" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Номер ВА</span>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCopy}
                className={`px-2 text-sm sm:text-base flex items-center gap-1 ${
                  isCopied ? "bg-[#FF385C] text-white" : "bg-[#F4F4F4] text-[#FF385C]"
                }`}
              >
                <Copy className="w-4 h-4" />
                <p className="hidden md:flex">
                  {isCopied ? "Скопировано!" : "Копировать"}
                </p>
              </Button>
              <span className="font-semibold text-black">0009234442</span>
            </div>
          </div>

          <div className="flex justify-between font-medium text-base">
            <span>Общий</span>
            <span>$2,010.00</span>
          </div>

          <Button
            onClick={() => router.push("/statusInfo")}
            className="w-full bg-[#FF385C] text-white hover:bg-[#e42f50]"
          >
            Продолжить покупки
          </Button>
        </div>
      </div>

      {/* Instructions Accordion */}  
      <div className="bg-white p-4 mt-6 w-full max-w-xl rounded-lg shadow-md">
        <h3 className="text-base font-semibold mb-2">Как оплатить</h3>
        <Accordion type="single" collapsible>
          {paymentSteps.map((title, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="hover:no-underline cursor-pointer py-3 text-[#1B1B1B] text-base font-semibold">
                {title}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Вставьте карту BCA ATM и PIN-код</li>
                  <li>
                    Выберите меню Other Transactions {'>'} Transfer {'>'} to BCA Virtual Account
                  </li>
                  <li>
                    Введите 5-значный код компании Tokopedia (02999) и номер мобильного телефона
                  </li>
                  <li>
                    Проверьте правильность данных: VA No, Name, Product и т.д.
                  </li>
                  <li>Введите сумму перевода согласно Total Bill</li>
                  <li>Следуйте инструкциям, чтобы завершить транзакцию</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PaymentCompletePage;
