"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"
import { Heart, Check, ShoppingCart } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useWishlistStore } from "@/stores/wishlist-store"

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
  getData?: string | number | false | null
  customerName?: string
  phoneNumber?: string
  cartId?: number
  telegramId?: number
  product?: Product
  quantity: number
  selectedColor: string | null
  selectedSize: string | number | null
  deliveryMethod: "store" | "pickup"
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  total = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  getData = false,
  customerName = "",
  phoneNumber = "",
  cartId,
  telegramId = 1524783641,
  product,
  quantity,
  selectedColor,
  selectedSize,
}) => {
  const [showMobileFullDetails, setShowMobileFullDetails] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isLiked, setIsLiked] = useState(product?.is_liked || false)

  const router = useRouter()
  const toggleWishlistItem = useWishlistStore((state) => state.toggleWishlistItem)

  // Split narxni hisoblash funksiyasi
  const calculatePrice = () => {
    if (!product) return { originalPrice: 0, splitPrice: 0, remainingPrice: 0 }

    const singleProductPrice = product.discount_price
      ? Number(product.price) - Number(product.discount_price)
      : Number(product.price)

    const totalPrice = singleProductPrice * quantity
    return {
      originalPrice: totalPrice,
      splitPrice: enabled ? totalPrice / 2 : totalPrice,
      remainingPrice: enabled ? totalPrice / 2 : 0,
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isToggling || !product) return

    setIsToggling(true)
    setIsLiked(!isLiked)
    try {
      await toggleWishlistItem(product.id)
    } catch (error) {
      setIsLiked(isLiked)
      console.error("Error toggling wishlist:", error)
    } finally {
      setIsToggling(false)
    }
  }

  const getSelectedVariantId = (): number | null => {
    if (!selectedColor || !selectedSize || !product?.variants) {
      return null
    }

    const selectedVariant = product.variants.find(
      (variant) => variant.color_hex === selectedColor && variant.size_name === selectedSize,
    )

    return selectedVariant ? selectedVariant.id : null
  }

  const handleAddToCart = async () => {
    if (isLoading || isAddedToCart || !product) return

    const variantId = getSelectedVariantId()

    if (!variantId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите цвет и размер",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const { splitPrice, originalPrice } = calculatePrice()
      const effectiveQuantity = enabled ? Math.ceil(quantity / 2) : quantity

      const formData = new FormData()
      formData.append("product_id", product.id.toString())
      formData.append("quantity", effectiveQuantity.toString())
      formData.append("variant_id", variantId.toString())

      // Split narxni qo'shimcha ma'lumot sifatida yuborish
      if (enabled) {
        formData.append("is_split_payment", "true")
        formData.append("split_price", splitPrice.toString())
        formData.append("original_price", calculatePrice().originalPrice.toString())
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      const data = await response.json()

      if (data.cart_item) {
        setIsAddedToCart(true)

        // Split to'lov haqida xabar
        const priceMessage = enabled
          ? `Split to'lov: ${splitPrice.toFixed(0)} ₽ (qolgan: ${calculatePrice().remainingPrice.toFixed(0)} ₽)`
          : `${splitPrice.toFixed(0)} ₽`

        toast({
          title: "Товар добавлен в корзину",
          description: `${data.cart_item.product_name} (${data.cart_item.quantity} шт.) - ${priceMessage}`,
          variant: "default",
        })

        setTimeout(() => {
          setIsAddedToCart(false)
        }, 3000)
      } else {
        toast({
          title: "Ошибка",
          description: data.message || "Не удалось добавить товар в корзину",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении товара в корзину",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectPurchase = async () => {
    if (isCreatingOrder || !product) return

    const variantId = getSelectedVariantId()

    if (!variantId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите цвет и размер",
        variant: "destructive",
      })
      return
    }

    if (!customerName.trim() || !phoneNumber.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните имя и телефон",
        variant: "destructive",
      })
      return
    }

    setIsCreatingOrder(true)
    try {
      const { splitPrice, originalPrice } = calculatePrice()
      const effectiveQuantity = enabled ? Math.ceil(quantity / 2) : quantity

      // Avval cartga qo'shish
      const cartFormData = new FormData()
      cartFormData.append("product_id", product.id.toString())
      cartFormData.append("quantity", effectiveQuantity.toString())
      cartFormData.append("variant_id", variantId.toString())

      // Split ma'lumotlarini qo'shish
      if (enabled) {
        cartFormData.append("is_split_payment", "true")
        cartFormData.append("split_price", splitPrice.toString())
        cartFormData.append("original_price", splitPrice.toString())
      }

      const cartResponse = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
        body: cartFormData,
      })

      if (!cartResponse.ok) {
        throw new Error("Failed to add to cart")
      }

      // Cart ma'lumotlarini olish
      const cartGetResponse = await fetch("/api/cart", {
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
      })

      if (!cartGetResponse.ok) {
        throw new Error("Failed to get cart")
      }

      const cartData = await cartGetResponse.json()

      // Buyurtma yaratish
      const orderFormData = new FormData()
      orderFormData.append("cart_id", cartData.id.toString())
      orderFormData.append("shipping_method_id", "1")
      orderFormData.append("pickup_branch_id", "1")
      orderFormData.append("customer_name", customerName)
      orderFormData.append("phone_number", phoneNumber)
      orderFormData.append("payment_method", "cash_on_pickup")


      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
        body: orderFormData,
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await orderResponse.json()

      const successMessage = enabled
        ? `Split to'lov bilan buyurtma yaratildi! Hozir: ${splitPrice.toFixed(0)} ₽, Keyinroq: ${calculatePrice().remainingPrice.toFixed(0)} ₽`
        : `Buyurtma muvaffaqiyatli yaratildi!`

      toast({
        title: "Заказ создан успешно!",
        description: `Заказ #${orderData.id}. ${successMessage}`,
        variant: "default",
      })

      // Local storage ga split ma'lumotlarini saqlash
      if (enabled) {
        const splitOrderInfo = {
          orderId: orderData.id,
          totalAmount: splitPrice,
          paidAmount: splitPrice,
          remainingAmount: calculatePrice().remainingPrice,
          createdAt: new Date().toISOString(),
        }

        const existingSplitOrders = JSON.parse(localStorage.getItem("splitOrders") || "[]")
        existingSplitOrders.push(splitOrderInfo)
        localStorage.setItem("splitOrders", JSON.stringify(existingSplitOrders))
      }

      router.push("/statusInfo")
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании заказа",
        variant: "destructive",
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

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

  const isVariantSelected = selectedColor && selectedSize
  const selectedVariant = isVariantSelected
    ? product?.variants?.find((variant) => variant.color_hex === selectedColor && variant.size_name === selectedSize)
    : null
  const isVariantAvailable = selectedVariant && selectedVariant.stock > 0

  const { originalPrice, splitPrice, remainingPrice } = calculatePrice()

  return (
    <div className="p-4 space-y-1 h-max">
      {(isDesktop || showMobileFullDetails) && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowMobileFullDetails(!showMobileFullDetails)}
        />
      )}
      <div className="p-4 space-y-3 bg-white shadow-md border fixed bottom-0 left-0 right-0 z-50 rounded-t-xl md:static md:rounded-md">
        {/* Split Payment Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              className="w-[59px] h-[32px] data-[state=checked]:bg-red-500"
            />
            <div>
              <p className="text-[12px] font-medium">
                Сплит: <span className="text-[#FF385C]">{splitPrice.toFixed(0)} ₽</span>
              </p>
              <p className="text-[10px] text-gray-500">
                {enabled ? `остаток: ${remainingPrice.toFixed(0)} ₽` : "остаток потом"}
              </p>
            </div>
          </div>

          {/* Wishlist Button */}
          <div
            className={`rounded-xl p-2 border-2 cursor-pointer transition-colors ${
              isLiked ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleToggleWishlist}
          >
            {isToggling ? (
              <Loader className="h-6 w-6 animate-spin text-gray-500" />
            ) : (
              <Heart className={`h-6 w-6 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
            )}
          </div>
        </div>

        {/* Promo Code Section 
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
*/}
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Add to Cart Button */}
          <Button
            className="flex-1 h-12 rounded-full bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
            onClick={handleAddToCart}
            disabled={isLoading || isAddedToCart || !isVariantSelected || !isVariantAvailable}
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : isAddedToCart ? (
              <>
                <Check className="h-5 w-5 mr-2" />В корзине
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />В корзину
              </>
            )}
          </Button>

          {/* Buy Now Button */}
          <Button
            className="flex-1 h-12 rounded-full bg-[#FF385C] text-white hover:bg-[#E6325A] disabled:opacity-50"
            onClick={handleDirectPurchase}
            disabled={isCreatingOrder || !isVariantSelected || !isVariantAvailable}
          >
            {isCreatingOrder ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : !isVariantSelected ? (
              "Выберите вариант"
            ) : !isVariantAvailable ? (
              "Нет в наличии"
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold">Купить: {splitPrice.toFixed(0)} ₽</p>
                {enabled && <p className="text-xs opacity-90">(остаток: {remainingPrice.toFixed(0)} ₽)</p>}
              </div>
            )}
          </Button>
        </div>

        {/* Status Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Статус формы: {getData ? "✅ Готов" : "❌ Не заполнен"}</p>
          {!getData && <p>Заполните имя и телефон для оформления заказа</p>}
        </div>
      </div>
    </div>
  )
}
