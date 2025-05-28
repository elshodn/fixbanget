"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin, Clock, Phone } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Order } from "@/types/order"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const telegramId = 1524783641

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching orders...")

      const response = await fetch("/api/orders", {
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      console.log("Orders API response:", data)

      // Handle both direct array and paginated response
      const ordersArray = Array.isArray(data) ? data : data.results || []
      console.log("Orders array:", ordersArray)

      setOrders(ordersArray)

      // If there are orders, don't auto-select the first one
      // Let user choose which order to view
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive",
      })
      setOrders([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "bg-[#FFF7E5] text-[#FFAB00]",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-[#F4F5F6] text-black",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      canceled: "bg-red-100 text-red-800", // Handle both spellings
    }
    return colorMap[status] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return dateString // Return original string if parsing fails
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 border rounded-lg">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Package className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">У вас пока нет заказов</h1>
          <p className="text-gray-600 mb-6">Сделайте свой первый заказ, чтобы увидеть его здесь</p>
          <Link href="/">
            <Button>Начать покупки</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (selectedOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к заказам
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Заказ #{selectedOrder.id}</h1>
                  <p className="text-gray-600">от {formatDate(selectedOrder.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status_display}
                </span>
              </div>

              <Separator />

              {/* Order Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Заказа:</span>
                    <span className="font-medium">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус:</span>
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status_display}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дата заказа:</span>
                    <span className="font-medium">{formatDate(selectedOrder.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ожидаемая доставка:</span>
                    <span className="font-medium">
                      {selectedOrder.estimated_delivery_date?.formatted || "Не указано"}
                    </span>
                  </div>
                  {selectedOrder.tracking_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Трек-номер:</span>
                      <span className="font-medium text-blue-600">{selectedOrder.tracking_number}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedOrder.pickup_branch && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Пункт выдачи
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{selectedOrder.pickup_branch.name}</p>
                        <p>
                          {selectedOrder.pickup_branch.street}, {selectedOrder.pickup_branch.district}
                        </p>
                        <p>
                          {selectedOrder.pickup_branch.city}, {selectedOrder.pickup_branch.region}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="h-3 w-3" />
                          <span>{selectedOrder.pickup_branch.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{selectedOrder.pickup_branch.working_hours}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-4">Информация о покупателе</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Имя:</span>
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Телефон:</span>
                    <span className="font-medium">{selectedOrder.phone_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Способ оплаты:</span>
                    <span className="font-medium">{selectedOrder.payment_method_display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Статус оплаты:</span>
                    <span className="font-medium">{selectedOrder.payment_status}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4">Товары в заказе</h3>
                <div className="space-y-4">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              width={80}
                              height={80}
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Image
                              src="/placeholder.svg?height=80&width=80&query=product"
                              alt={item.product_name}
                              width={80}
                              height={80}
                              className="object-cover rounded-lg opacity-50"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold">{item.product_name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.product?.brand?.name} • {item.product?.subcategory?.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">Количество: {item.quantity}</span>
                            <div className="text-right">
                              <p className="font-semibold">
                                {selectedOrder.is_split_payment
                                  ? `${selectedOrder.first_payment_amount} ₽`
                                  : `${item.total_price} ₽`}
                              </p>
                              {selectedOrder.is_split_payment && (
                                <p className="text-xs text-gray-500">
                                  (Split: {selectedOrder.first_payment_amount} ₽ paid,{" "}
                                  {selectedOrder.second_payment_amount} ₽ remaining)
                                </p>
                              )}
                              <p className="text-sm text-gray-500">за {item.quantity} шт.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">Нет товаров в заказе</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold mb-4">Детали платежа</h3>
                <div className="space-y-2">
                  {selectedOrder.is_split_payment ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Товары ({selectedOrder.items_count}):</span>
                        <span>{selectedOrder.total_amount} ₽</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Оплачено сейчас:</span>
                        <span>{selectedOrder.first_payment_amount} ₽</span>
                      </div>
                      <div className="flex justify-between text-orange-600">
                        <span>К доплате:</span>
                        <span>{selectedOrder.second_payment_amount} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Срок доплаты:</span>
                        <span>{selectedOrder.split_payment_info?.second_payment?.due_date}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Товары ({selectedOrder.items_count}):</span>
                        <span>{selectedOrder.total_amount} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Доставка:</span>
                        <span>{selectedOrder.shipping_amount} ₽</span>
                      </div>
                    </>
                  )}
                  {Number(selectedOrder.discount_amount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка:</span>
                      <span>-{selectedOrder.discount_amount} ₽</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Итого:</span>
                    <span>{selectedOrder.final_amount} ₽</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {selectedOrder.can_cancel && (
                  <Button variant="outline" className="flex-1">
                    Отменить заказ
                  </Button>
                )}
                <Button className="flex-1 bg-[#FF385C] hover:bg-[#E6325A]">Связаться с поддержкой</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Заказ #{order.id}</h3>
                  <p className="text-gray-600 text-sm">{formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status_display}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    {order.items_count} товар{order.items_count > 1 ? "а" : ""} • {order.payment_method_display}
                  </p>
                  <p className="text-sm text-gray-600">
                    Доставка: {order.estimated_delivery_date?.formatted || "Не указано"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {order.is_split_payment ? `${order.first_payment_amount} ₽` : `${order.final_amount} ₽`}
                  </p>
                  {order.is_split_payment && (
                    <p className="text-xs text-gray-500">Split: +{order.second_payment_amount} ₽ осталось</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
