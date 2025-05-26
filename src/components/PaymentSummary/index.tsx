"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"

interface PaymentSummaryProps {
  total?: number
  shipping?: number
  tax?: number
  discount?: number
  redirectTo: string
  promoCode: string
  setPromoCode: React.Dispatch<React.SetStateAction<string>>
  discountApplied: boolean
  setDiscountApplied: React.Dispatch<React.SetStateAction<boolean>>
  selectedShipping: string
  getData: boolean
  customerName?: string
  phoneNumber?: string
  cartId?: number
  telegramId?: number
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  total = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  redirectTo,
  promoCode,
  setPromoCode,
  discountApplied,
  setDiscountApplied,
  selectedShipping,
  getData,
  customerName = "",
  phoneNumber = "",
  cartId,
  telegramId = 1524783641,
}) => {
  const [showMobileFullDetails, setShowMobileFullDetails] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  // Calculate totals with fallback values
  const safeTotal = Number(total) || 0
  const safeShipping = Number(shipping) || 0
  const safeTax = Number(tax) || 0
  const safeDiscount = Number(discount) || 0
  const grandTotal = safeTotal + safeShipping + safeTax - safeDiscount

  // Debug logging
  useEffect(() => {
    console.log("PaymentSummary Props:", {
      total,
      shipping,
      tax,
      discount,
      customerName,
      phoneNumber,
      cartId,
      getData,
      grandTotal,
    })
  }, [total, shipping, tax, discount, customerName, phoneNumber, cartId, getData, grandTotal])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const isWide = window.innerWidth >= 768
        setShowMobileFullDetails(isWide)
        setIsDesktop(isWide)
        setIsMobile(!isWide)
      }

      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const router = useRouter()

  const createOrder = async () => {
    if (!cartId) {
      toast({
        title: "Ошибка",
        description: "Корзина не найдена",
        variant: "destructive",
      })
      return false
    }

    if (!customerName?.trim() || !phoneNumber?.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните имя и телефон",
        variant: "destructive",
      })
      return false
    }

    setIsCreatingOrder(true)
    try {
      const orderFormData = new FormData()
      orderFormData.append("cart_id", cartId.toString())
      orderFormData.append("shipping_method_id", "1")
      orderFormData.append("pickup_branch_id", "1")
      orderFormData.append("customer_name", customerName)
      orderFormData.append("phone_number", phoneNumber)
      orderFormData.append("payment_method", "cash_on_pickup")

      console.log("Creating order with data:", {
        cart_id: cartId,
        customer_name: customerName,
        phone_number: phoneNumber,
      })

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
        body: orderFormData,
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to create order")
      }

      const orderData = await orderResponse.json()

      toast({
        title: "Заказ создан успешно!",
        description: `Заказ #${orderData.id} создан. Мы свяжемся с вами в ближайшее время.`,
        variant: "default",
      })

      router.push("/statusInfo")
      return true
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при создании заказа",
        variant: "destructive",
      })
      return false
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handlePaymentClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    console.log("Payment button clicked with getData:", getData)

    if (!getData) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      })
      return
    }

    if (cartId && customerName && phoneNumber) {
      const orderCreated = await createOrder()
      if (orderCreated) {
        return
      }
    } else {
      router.push(redirectTo)
    }
  }

  return (
    <div className="p-4 space-y-1 h-max">
      {(isDesktop || showMobileFullDetails) && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowMobileFullDetails(!showMobileFullDetails)}
        />
      )}
      <div className="p-4 space-y-3 bg-white shadow-md border fixed bottom-0 left-0 right-0 z-50 rounded-t-xl md:static md:rounded-md">
        <h1 className="text-[#1B1B1B] text-xl font-semibold">Сводка цен</h1>

        {/* Debug Information - Remove in production */}
        <div className="bg-gray-100 p-2 rounded text-xs">
          <p>Debug Info:</p>
          <p>Total: {safeTotal} ₽</p>
          <p>Shipping: {safeShipping} ₽</p>
          <p>Tax: {safeTax} ₽</p>
          <p>Discount: {safeDiscount} ₽</p>
          <p>Cart ID: {cartId || "Not provided"}</p>
          <p>Customer: {customerName || "Not provided"}</p>
          <p>Phone: {phoneNumber || "Not provided"}</p>
          <p>Form Valid: {getData ? "Yes" : "No"}</p>
        </div>

        {/* Promo Code Section */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Промо-код"
            className="flex-1"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            variant="outline"
            className={`font-medium ${discountApplied ? "bg-green-100 text-green-700" : ""}`}
            onClick={() => setDiscountApplied(!discountApplied)}
          >
            {discountApplied ? "Применено" : "Добавить"}
          </Button>
        </div>

        <Separator />

        {/* Price Details - Always show on desktop, toggle on mobile */}
        {(showMobileFullDetails || isDesktop) && (
          <>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">Всего покупок</span>
              <span className="text-[#1B1B1B] font-bold text-base">{safeTotal.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">Перевозки</span>
              <span className="text-[#1B1B1B] font-bold text-base">{safeShipping.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">Налог</span>
              <span className="text-[#1B1B1B] font-bold text-base">{safeTax.toLocaleString()} ₽</span>
            </div>
            {safeDiscount > 0 && (
              <div className="flex justify-between text-[#FF385C]">
                <span className="font-medium text-base">Скидка</span>
                <span className="font-bold text-base">−{safeDiscount.toLocaleString()} ₽</span>
              </div>
            )}
            <Separator />
          </>
        )}

        {/* Total Section */}
        <div
          className="flex justify-between font-semibold text-lg cursor-pointer md:cursor-default"
          onClick={() => {
            if (isMobile) setShowMobileFullDetails(!showMobileFullDetails)
          }}
        >
          <span>Итого</span>
          <span>{grandTotal.toLocaleString()} ₽</span>
        </div>

        {/* Payment Button */}
        <Button
          className="w-full bg-[#FF385C] text-white hover:bg-[#E6325A] disabled:opacity-50"
          onClick={handlePaymentClick}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Создание заказа...
            </>
          ) : cartId && customerName && phoneNumber ? (
            "Оформить заказ"
          ) : (
            "Перейти к оплате"
          )}
        </Button>

        {/* Status Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Статус формы: {getData ? "✅ Готов" : "❌ Не заполнен"}</p>
          {!getData && <p>Заполните имя и телефон для оформления заказа</p>}
        </div>
      </div>
    </div>
  )
}
