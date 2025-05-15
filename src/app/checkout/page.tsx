"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Pencil } from "lucide-react";
import { mockOrders } from "@/lib/mockData";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"

import expressImage from "@/assets/images/express.png"
import fedExImage from "@/assets/images/fedex.png"
import productImage from "@/assets/images/mock/image2.png"
import { PaymentSummary } from "@/components/PaymentSummary";

function CheckOrder() {
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("fedex");

  const initialFields = [
    { name: "phone", label: "Номер Телефона *", placeholder: "+7 000", required: true },
    { name: "firstName", label: "Имя *", placeholder: "Ваше имя", required: true },
    { name: "lastName", label: "Фамилия", placeholder: "Ваша фамилия", required: false },
    { name: "country", label: "Страна", placeholder: "Добавьте свою страну", required: false },
    { name: "address", label: "Адрес *", placeholder: "Ваш адрес", required: true },
    { name: "province", label: "Провинция *", placeholder: "Провинция", required: true },
    { name: "city", label: "Город *", placeholder: "Город", required: true },
    { name: "district", label: "Округ *", placeholder: "Округ", required: true },
    { name: "zip", label: "Почтовый Индекс *", placeholder: "Введите индекс", required: true },
  ];

  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(initialFields.map(f => [f.name, ""]))
  );
  const [invalidFields, setInvalidFields] = useState({});

  const handleChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    // if (invalidFields[name]) {
    //   setInvalidFields(prev => ({ ...prev, [name]: false }));
    // }
  };

  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    const errors: Record<string, boolean> = {};
    initialFields.forEach(field => {
      if (field.required && !formValues[field.name].trim()) {
        errors[field.name] = true;
      }
    });

    setInvalidFields(errors);

    if (Object.keys(errors).length === 0) {
      setIsAddressSaved(true);
      if (dialogCloseRef.current) {
        dialogCloseRef.current.click();
      }
    } else {
      setTimeout(() => setInvalidFields({}), 2000);
    }
  };

  const getFormattedAddress = () => {
    return `${formValues.address}, ${formValues.city}, ${formValues.district}, ${formValues.province}, ${formValues.zip}`;
  };

  return (
    <div className="w-11/12 mx-auto relative">
      <h1 className="text-[#1B1B1B] text-xl font-semibold my-3 px-6 pt-8">Заказ</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 pt-2 relative overflow-hidden">
        <div className="w-full lg:col-span-2 mb-40 md:mb-0">
          <Card className="gap-0 px-3">
            {mockOrders.slice(0, 2).map((order, index) => (
              <div key={index}>
                {order.items.map((item, index) => (
                  <div key={index} className="flex my-4 py-4 pr-2 md:pr-10 flex-wrap md:flex-nowrap gap-3 sm:gap-4 border-b min-h-[120px] sm:min-h-[160px]">
                    <div className="w-24 sm:w-28 min-h-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      <Image 
                        src={productImage} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        width={112}
                        height={112}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between space-y-5">
                      <h4 className="font-bold text-sm sm:text-base">
                        <span className='text-[#1B1B1BB2] font-medium text-[13px] sm:text-[14px]'>Весенняя коллекция</span> <br />
                        {item.name}
                      </h4>
                      <div className="flex md:hidden items-center border w-max px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                        {item.quantity} × ${item.price}
                      </div>
                      <div className='flex items-center gap-2 justify-between'>
                        <div className="flex gap-1">
                          <p className='text-sm'>L | Розовый </p>
                          <span className='bg-[#EEC7C2] w-5 h-5 block rounded'></span>
                        </div>
                        <p className="font-medium md:hidden block">$ {item.price * item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex md:w-max w-full items-center justify-between font-semibold text-sm sm:text-base gap-4">
                      <div className="md:flex hidden items-center border px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                        {item.quantity} × ${item.price}
                      </div>
                      <p className="font-medium md:block hidden ">$ {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Card>

          <div className="mt-8">
            <h1 className="text-[#1B1B1B] text-xl font-semibold my-3">Детали доставки</h1>
            <Card className="p-4 space-y-2">
              <Label className="flex gap-2 items-center">
                <span className="font-semibold text-[14px]">Адрес</span>
              </Label>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative flex w-full">
                    <Input
                      value={isAddressSaved ? getFormattedAddress() : ""}
                      readOnly
                      placeholder="Добавить адрес доставки"
                      className="pr-10 py-5"
                    />
                    <Button
                      size="icon"
                      // variant="default"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      {isAddressSaved ? (
                        <Pencil className="w-4 h-4 text-[#FF385C]" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#FF385C]" />
                      )}
                    </Button>
                  </div>
                </DialogTrigger>

                <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[#1B1B1B] text-xl font-semibold flex justify-between">
                      <p>Детали адреса</p>
                      <DialogClose className="cursor-pointer">
                        <X />
                      </DialogClose>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Пожалуйста, заполните все обязательные поля
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {initialFields.map((field, idx) => (
                      <div
                        key={idx}
                        className={`col-span-1 ${["firstName", "lastName", "province", "city", "district", "zip"].includes(field.name)
                          ? ""
                          : "sm:col-span-2"
                          }`}
                      >
                        {field.name === "country" && (
                          <p className="text-[#1B1B1B] text-xl font-semibold pb-2">
                            Адрес доставки
                          </p>
                        )}
                        <Label className="pb-1">{field.label}</Label>
                        <Input
                          placeholder={field.placeholder}
                          value={formValues[field.name]}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          // className={invalidFields[field.name] ? "border-red-500" : ""}
                        />
                      </div>
                    ))}
                  </div>

                  <DialogFooter>
                    <div className="w-full">
                      <div
                        onClick={handleSubmit}
                        className="w-full flex justify-center items-center rounded-md py-2 cursor-pointer bg-[#FF385C] text-white mt-4"
                      >
                        <DialogClose ref={dialogCloseRef} className="cursor-pointer">
                          Продолжить доставку
                        </DialogClose>
                      </div>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {isAddressSaved &&
                <div className="mt-4 space-y-3">
                  <h2 className="text-[14px] font-semibold">Доставка</h2>
                  <div className="flex flex-col gap-3">
                    <Label className="flex items-center justify-between border p-3 rounded cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Image 
                          src={fedExImage} 
                          alt="FedEx" 
                          className="w-16"
                          width={64}
                          height={64}
                        />
                        <span>FedEx Regular (2-3 Days)</span>
                      </div>
                      <span>$12.00</span>
                      <input
                        type="radio"
                        name="shipping"
                        value="fedex"
                        checked={selectedShipping === "fedex"}
                        onChange={() => setSelectedShipping("fedex")}
                        className="ml-2"
                      />
                    </Label>
                    <Label className="flex items-center justify-between border p-3 rounded cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Image 
                          src={expressImage} 
                          alt="Express" 
                          className="w-16"
                          width={64}
                          height={64}
                        />
                        <span>Express (30 Days)</span>
                      </div>
                      <span>Бесплатно</span>
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={selectedShipping === "express"}
                        onChange={() => setSelectedShipping("express")}
                        className="ml-2"
                      />
                    </Label>
                    <hr />
                    <Label className="flex flex-col items-start mt-5 gap-3">
                      <h2 className="font-semibold text-[14px]">Добавить инструкции по доставке</h2>
                      <Textarea className="min-h-20" placeholder="напишите ваши инструкции...." />
                    </Label>
                  </div>
                </div>
              }
            </Card>
          </div>
        </div>
        
        {/* Payment summary */}
        <PaymentSummary
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          discountApplied={discountApplied}
          setDiscountApplied={setDiscountApplied}
          selectedShipping={selectedShipping}
          getData={isAddressSaved}
          redirectTo="/checkout/method" 
        />
      </div>
    </div>
  );
}

export default CheckOrder;