"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

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
}) => {
  const [showMobileFullDetails, setShowMobileFullDetails] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const grandTotal = total + shipping + tax - discount

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

  const handlePaymentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!getData) {
      e.preventDefault()
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите один вариант.",
        variant: "destructive",
      })
      return
    }
    router.push(redirectTo)
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
        {showMobileFullDetails && (
          <>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">Всего покупок</span>
              <span className="text-[#1B1B1B] font-bold text-base">{total.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">Перевозки</span>
              <span className="text-[#1B1B1B] font-bold text-base">{shipping.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">Налог</span>
              <span className="text-[#1B1B1B] font-bold text-base">{tax.toLocaleString()} ₽</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#FF385C]">
                <span className="font-medium text-base">Скидка</span>
                <span className="font-bold text-base">−{discount.toLocaleString()} ₽</span>
              </div>
            )}
            <Separator />
          </>
        )}
        <div
          className="flex justify-between font-semibold text-lg md:pointer-events-none md:select-none md:cursor-default md:bg-transparent md:shadow-none"
          onClick={() => {
            if (isMobile) setShowMobileFullDetails(!showMobileFullDetails)
          }}
        >
          <span>Итого</span>
          <span>{grandTotal.toLocaleString()} ₽</span>
        </div>
        <Button className="w-full bg-[#FF385C] text-white" onClick={handlePaymentClick}>
          Перейти к оплате
        </Button>
      </div>
    </div>
  )
}
