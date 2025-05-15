import React, { useState } from 'react';
import { mockOrders } from '@/lib/mockData'; // Sizning mockData joylashuvingizga moslashtiring
import { X, ChevronLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefundDialog } from './refundDialog';
import Link from 'next/link';

type OrderItem = {
  image: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  status: 'processing' | 'shipped' | 'delivery' | 'delivered' | 'refund' | string;
  refundStatus?: string;
  date: string;
  trackingNumber: string;
  items: OrderItem[];
};

export default function ProfileOrdersComponent() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState<boolean>(false);

  const filterOptions = [
    { id: 'all', label: 'Все' },
    { id: 'processing', label: 'Ожидание платежа' },
    { id: 'shipped', label: 'Заказ в процессе' },
    { id: 'delivery', label: 'В доставке' },
    { id: 'delivered', label: 'Полный заказ' },
    { id: 'refund', label: 'Возвращать деньги' },
  ];

  const filteredOrders = activeFilter === 'all'
    ? mockOrders
    : mockOrders.filter((order: Order) => order.status === activeFilter);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      processing: 'Ожидание платежа',
      shipped: 'Заказ в процессе',
      delivery: 'В доставке',
      delivered: 'Доставлено',
      refund: 'Возврат',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      processing: 'bg-[#FFF7E5] text-[#FFAB00]',
      shipped: 'bg-blue-100 text-blue-800',
      delivery: 'bg-[#F4F5F6] text-black',
      delivered: 'bg-green-100 text-green-800',
      refund: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white flex-1 p-3 sm:p-6 rounded-lg shadow-sm">
      {selectedOrder ? (
        <>
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <ChevronLeft className="cursor-pointer" onClick={() => setSelectedOrder(null)} />
              <h3 className="text-sm sm:text-lg font-semibold">
                <span className="text-[#5F5F5F]">ID заказа :</span> {selectedOrder.id}
              </h3>
            </div>
            <X onClick={() => setSelectedOrder(null)} className="cursor-pointer" />
          </div>

          <div className="space-y-6 sm:space-y-8 mt-4">
            <div className="flex justify-between">
              <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">Статус</p>
              <p className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                {getStatusText(selectedOrder.status)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">Дата покупки</p>
              <p className="text-[#1B1B1B] font-bold text-sm sm:text-base">{selectedOrder.date}</p>
            </div>
            <div className="flex justify-between border-b pb-5">
              <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">Счет</p>
              <p className="text-[#FF385C] text-sm sm:text-base">INV/20221114/MPL/28203158839</p>
            </div>

            <div>
              <h1 className="text-[#1B1B1B] text-lg sm:text-xl font-semibold">Перевозки</h1>
              <div className="flex justify-between mt-4">
                <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">Курьер</p>
                <p className="text-[#1B1B1B] font-bold text-sm sm:text-base">AnterAja - Регулятор</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-2">
                <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">№ квитанции</p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedOrder.trackingNumber);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className={`px-2 text-sm sm:text-base flex items-center gap-1 ${
                      isCopied ? 'bg-[#FF385C] text-white' : 'bg-[#F4F4F4] text-[#FF385C]'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    {isCopied ? 'Скопировано!' : 'Копировать'}
                  </Button>
                  <p className="text-[#1B1B1B] font-bold text-sm sm:text-base">{selectedOrder.trackingNumber}</p>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <p className="text-[#5F5F5F] font-medium text-sm sm:text-base">Адрес</p>
                <p className="text-[#1B1B1B] font-bold text-sm sm:text-base">Блк. А-Б Джл. Цикутра № 125, Цикутр</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-base sm:text-lg">Продукты</h4>
              {selectedOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap md:flex-nowrap gap-3 sm:gap-4 mb-4 last:mb-0 border-b pb-3 min-h-[120px] sm:min-h-[160px]"
                >
                  <div className="w-24 sm:w-28 min-h-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-sm sm:text-base">
                      <span className="text-[#1B1B1BB2] font-medium text-[13px] sm:text-[14px]">Весенняя коллекция</span>{' '}
                      <br />
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">L Розовый </p>
                      <span className="bg-[#EEC7C2] w-5 h-5 block rounded"></span>
                    </div>
                  </div>
                  <div className="flex md:w-max w-full items-center font-semibold text-sm sm:text-base gap-4">
                    <div className="flex items-center border px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                      {item.quantity} × {formatPrice(item.price)}
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-right font-bold text-sm sm:text-base">
              Итого: {formatPrice(selectedOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0))}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap overflow-x-auto pb-4 mb-5">
            <div className="flex gap-2 sm:gap-4 text-sm">
              {filterOptions.map((option, index) => (
                <div key={index}>
                  <button
                    onClick={() => setActiveFilter(option.id)}
                    className={`px-3 rounded-md whitespace-nowrap ${
                      activeFilter === option.id ? 'font-semibold border-b-2 border-gray-500' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order: Order) => (
                <div key={order.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                    <h3 className="font-semibold text-lg sm:text-xl">
                      <span className="text-[#5F5F5F]">ID заказа :</span> {order.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'refund' && order.refundStatus
                        ? `Возврат: ${order.refundStatus}`
                        : getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="pt-3 sm:pt-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex my-4 py-4 pr-2 md:pr-10 flex-wrap md:flex-nowrap gap-3 sm:gap-4 border-b min-h-[120px] sm:min-h-[160px]"
                      >
                        <div className="w-24 sm:w-28 min-h-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between space-y-5">
                          <h4 className="font-bold text-sm sm:text-base">
                            <span className="text-[#1B1B1BB2] font-medium text-[13px] sm:text-[14px]">Весенняя коллекция</span>{' '}
                            <br />
                            {item.name}
                          </h4>
                          <div className="flex md:hidden items-center border w-max px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                            {item.quantity} × {formatPrice(item.price)}
                          </div>
                          <div className="flex items-center gap-2 justify-between">
                            <div className="flex gap-1">
                              <p className="text-sm">L | Розовый </p>
                              <span className="bg-[#EEC7C2] w-5 h-5 block rounded"></span>
                            </div>
                            <p className="font-medium md:hidden block">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                        <div className="flex md:w-max w-full items-center justify-between font-semibold text-sm sm:text-base gap-4">
                          <div className="md:flex hidden items-center border px-2 py-1 sm:px-3 rounded-md text-[#1B1B1B]">
                            {item.quantity} × {formatPrice(item.price)}
                          </div>
                          <p className="font-medium md:block hidden">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 sm:pt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md text-sm bg-[#FF385C] text-white"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Детали
                      </button>

                      {order.status === 'delivered' && (
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FF385C] text-white rounded-md text-sm hover:bg-[#E0314D]">
                          Оставить отзыв
                        </button>
                      )}

                      {order.status === 'processing' && (
                        <Link
                          href="/paymentComplete"
                          className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md text-sm bg-green-600 text-white"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Oплату
                        </Link>
                      )}

                      {order.status === 'refund' && (
                        <button
                          onClick={() => setRefundDialogOpen(true)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                        >
                          Отследить возврат
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Нет заказов по выбранному фильтру</p>
              </div>
            )}
            <RefundDialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}