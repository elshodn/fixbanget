"use client";
import React, { useState } from "react";
import { mockOrders } from "@/lib/mockData";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
type OrderItem = {
  image: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  status:
    | "processing"
    | "shipped"
    | "delivery"
    | "delivered"
    | "refund"
    | string;
  refundStatus?: string;
  date: string;
  trackingNumber: string | null;
  items: OrderItem[];
};

export default function ProfileOrdersComponent() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState<boolean>(false);

  const filterOptions = [
    { id: "all", label: "Все" },
    { id: "processing", label: "Ожидание платежа" },
    { id: "shipped", label: "Заказ в процессе" },
    { id: "delivery", label: "В доставке" },
    { id: "delivered", label: "Полный заказ" },
    { id: "refund", label: "Возвращать деньги" },
  ];

  const filteredOrders =
    activeFilter === "all"
      ? mockOrders
      : mockOrders.filter((order: Order) => order.status === activeFilter);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      processing: "Ожидание платежа",
      shipped: "Заказ в процессе",
      delivery: "В доставке",
      delivered: "Доставлено",
      refund: "Возврат",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      processing: "bg-[#FFF7E5] text-[#FFAB00]",
      shipped: "bg-blue-100 text-blue-800",
      delivery: "bg-[#F4F5F6] text-black",
      delivered: "bg-green-100 text-green-800",
      refund: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white flex-1 p-3 sm:p-6 rounded-lg shadow-sm">
      <>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-lg font-semibold">
              <span className="text-[#5F5F5F]">мой заказ</span>
            </h3>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8 mt-4">
          <div className="flex justify-between">
            <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">
              ID Заказа : 430960
            </p>
            <p className={`px-3 py-1 rounded-full text-xs font-medium `}></p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">
              Статус
            </p>
            <p
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                "delivery"
              )}`}
            >
              новая
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">
              Дата покупки
            </p>
            <p className="text-[#1B1B1B] font-bold text-sm sm:text-base">
              Dolor, 9 ipsum <br />
              set г., 10:12 amet
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">
              дата доставки
            </p>
            <p className="text-[#1B1B1B] text-sm sm:text-base">
              Dolor, 9 ipsum <br />
              set г., 10:12 amet
            </p>
          </div>
          <div className="flex justify-between border-b pb-5">
            <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">
              Счет
            </p>
            <p className="text-[#FF385C] text-sm sm:text-base">
              Lorem/ipsum/dolor.
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#5F5F5F] font-medium text-sm sm:text-base w-1/2">
              адрес доставок пункт выдачи
            </p>
            <p className="text-[#1B1B1B] font-bold text-sm sm:text-base w-1/2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </p>
          </div>
          <h1 className='font-semibold mb-2 text-base sm:text-lg"'>
            Подробности продукта
          </h1>
          <div className="flex my-4 py-4 pr-2 md:pr-10 flex-wrap md:flex-nowrap gap-3 sm:gap-4 border-b min-h-[120px] sm:min-h-[160px]">
            <div className="w-24 sm:w-28 min-h-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
              <Image
                src="https://i.pinimg.com/originals/9a/06/a9/9a06a9d5fb3daddd463ae7f84b82904f.png"
                alt="product"
                className="w-full h-full object-cover"
                width={112}
                height={112}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between space-y-5">
              <h4 className="font-bold text-sm sm:text-base">
                <span className="text-[#1B1B1BB2] font-medium text-[13px] sm:text-[14px]">
                  Весенняя коллекция
                </span>{" "}
                <br />
                <span className="text-[#1B1B1BB2] font-medium text-[13px] sm:text-[14px]">
                  Платье с цветочным принтом
                </span>
              </h4>
              <div className="flex md:hidden items-center border w-max px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                2 × $0
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex gap-1">
                  <p className="text-sm">L | Розовый </p>
                  <span className="bg-[#EEC7C2] w-5 h-5 block rounded"></span>
                </div>
                <p className="font-medium md:hidden block">$ 0</p>
              </div>
            </div>
            <div className="flex md:w-max w-full items-center justify-between font-semibold text-sm sm:text-base gap-4">
              <div className="md:flex hidden items-center border px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                2 × $0
              </div>
              <p className="font-medium md:block hidden ">$ 0</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-base sm:text-lg">
              Детали платежа
            </h4>

            <>
              <div className="flex justify-between">
                <span className="text-[#5F5F5F] font-medium text-base">
                  Всего покупок
                </span>
                <span className="text-[#1B1B1B] font-bold text-base">$0</span>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-[#5F5F5F] font-medium text-base ">
                  Перевозки
                </span>
                <span className="text-[#1B1B1B] font-bold text-base">$0</span>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-[#5F5F5F] font-medium text-base ">
                  Налог
                </span>
                <span className="text-[#1B1B1B] font-bold text-base">$0</span>
              </div>
              <div className="flex justify-between text-[#FF385C] mt-3 mb-2">
                <span className="font-medium text-base">Скидка</span>
                <span className="font-bold text-base">−$0</span>
              </div>
              <Separator />
              <div className="flex justify-between mt-3">
                <span className="font-medium text-base capitalize">итог</span>
                <span className="font-bold text-base">$ 0</span>
              </div>
            </>
            <Link href="/congratulations">
              <Button className="w-full bg-[#FF385C] rounded-2xl mt-6 h-12 capitalize">
                помощь
              </Button>
            </Link>
          </div>
        </div>
      </>
    </div>
  );
}
