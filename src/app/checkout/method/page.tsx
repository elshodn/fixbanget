'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

import kreditCard1 from "@/assets/images/cardsImages/btn.png";
import kreditCard2 from "@/assets/images/cardsImages/cimb.png";
import virtualCard3 from "@/assets/images/cardsImages/maybank.png";
import virtualCard4 from "@/assets/images/cardsImages/anz.png";
import koshelokCard1 from "@/assets/images/cardsImages/gopay.png";
import koshelokCard2 from "@/assets/images/cardsImages/gpay.png";
import koshelokCard3 from "@/assets/images/cardsImages/cashbac.png";
import koshelokCard4 from "@/assets/images/cardsImages/paytren.png";
import koshelokCard5 from "@/assets/images/cardsImages/SHOPEEPAY.png";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentSummary } from "@/components/PaymentSummary"; 
import Image, { StaticImageData } from "next/image";

type PaymentOption = {
  label: string;
  value: string;
  image: StaticImageData;
};

function PaymentPage() {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  const renderPaymentOptions = (
    options: PaymentOption[],
    selected: string,
    setSelected: (value: string) => void
  ) => {
    return (
      <div className="space-y-3">
        {options.map(({ label, value, image }) => (
          <div
            key={value}
            className="flex justify-between items-center p-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <Image src={image} alt={label} className="h-6" height={24} />
              <span>{label}</span>
            </div>
            <Checkbox
              checked={selected === value}
              onCheckedChange={() => setSelected(value)}
              className="rounded-full cursor-pointer w-5 h-5 border-2 data-[state=checked]:bg-[#FF385C] data-[state=checked]:text-white data-[state=checked]:border-[#FF385C]"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-semibold">Способ оплаты</h2>
        <Accordion type="single" collapsible defaultValue="bank">
          <AccordionItem value="card">
            <AccordionTrigger className="hover:no-underline cursor-pointer py-3 text-[#1B1B1B] text-base font-semibold">
              Кредитная карта
            </AccordionTrigger>
            <AccordionContent>
              {renderPaymentOptions(
                [
                  { label: "BTN", value: "btn", image: kreditCard1 },
                  { label: "CIMB", value: "cimb", image: kreditCard2 },
                ],
                selectedBank,
                setSelectedBank
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bank">
            <AccordionTrigger className="hover:no-underline cursor-pointer py-3 text-[#1B1B1B] text-base font-semibold">
              VA и банковский перевод
            </AccordionTrigger>
            <AccordionContent>
              {renderPaymentOptions(
                [
                  { label: "Maybank", value: "maybank_card", image: virtualCard3 },
                  { label: "ANZ", value: "anz", image: virtualCard4 },
                ],
                selectedBank,
                setSelectedBank
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wallet">
            <AccordionTrigger className="hover:no-underline cursor-pointer py-3 text-[#1B1B1B] text-base font-semibold">
              Электронный кошелек
            </AccordionTrigger>
            <AccordionContent>
              {renderPaymentOptions(
                [
                  { label: "Gopay", value: "gopay", image: koshelokCard1 },
                  { label: "Google Pay", value: "gpay", image: koshelokCard2 },
                  { label: "Cashbac", value: "cashbac", image: koshelokCard3 },
                  { label: "Paytren", value: "paytren", image: koshelokCard4 },
                  { label: "ShopeePay", value: "shopeepay", image: koshelokCard5 },
                ],
                selectedBank,
                setSelectedBank
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Summary card */}
        <PaymentSummary
          redirectTo="/checkout/payment"
          getData={!!selectedBank}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          discountApplied={discountApplied}
          setDiscountApplied={setDiscountApplied}
          selectedShipping={selectedShipping}
        />
      </div>
    </div>
  );
}
export default PaymentPage;
