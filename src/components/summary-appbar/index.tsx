"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Heart, Check, Loader } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useWishlistStore } from "@/stores/wishlist-store"

interface Props {
  product: Product
  quantity: number
  selectedColor: string | null
  selectedSize: string | number | null
  telegramId?: number
}

export const PaymentSummary: React.FC<Props> = ({
  product,
  quantity,
  selectedColor,
  selectedSize,
  telegramId = 1524783641,
}) => {
  const [enabled, setEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isLiked, setIsLiked] = useState(product.is_liked) // Mahsulotning o'zidagi is_liked maydonidan foydalanish

  const toggleWishlistItem = useWishlistStore((state) => state.toggleWishlistItem)

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isToggling) return

    setIsToggling(true)

    // Optimistic update - UI'da darhol o'zgarishni ko'rsatish
    setIsLiked(!isLiked)

    try {
      await toggleWishlistItem(product.id)
    } catch (error) {
      // Xatolik yuz berganda, holatni qaytarish
      setIsLiked(isLiked)
      console.error("Error toggling wishlist:", error)
    } finally {
      setIsToggling(false)
    }
  }

  // Tanlangan variant ID ni topish
  const getSelectedVariantId = (): number | null => {
    if (!selectedColor || !selectedSize) {
      return null
    }

    const selectedVariant = product.variants.find(
      (variant) => variant.color.hex_code === selectedColor && variant.size.name === selectedSize,
    )

    return selectedVariant ? selectedVariant.id : null
  }

  const handleAddToCart = async () => {
    if (isLoading || isAddedToCart) return

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
      // API so'rovi uchun FormData yaratish
      const formData = new FormData()
      formData.append("product_id", product.id.toString())
      formData.append("quantity", quantity.toString())
      formData.append("variant_id", variantId.toString())

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

        toast({
          title: "Товар добавлен в корзину",
          description: `${data.cart_item.product_name} (${data.cart_item.quantity} шт.) добавлен в корзину`,
          variant: "default",
        })

        // Reset the added state after 3 seconds
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

  // Bitta mahsulot narxini hisoblash
  const singleProductPrice = product.discount_price
    ? Number(product.price) - Number(product.discount_price)
    : Number(product.price)

  // Umumiy narxni hisoblash (miqdor * bitta mahsulot narxi)
  const totalPrice = singleProductPrice * quantity

  // Split to'lov uchun narx (umumiy narxning yarmi)
  const splitPrice = enabled ? totalPrice / 2 : totalPrice

  // Check if variant is selected and available
  const isVariantSelected = selectedColor && selectedSize
  const selectedVariant = isVariantSelected
    ? product.variants.find((variant) => variant.color.hex_code === selectedColor && variant.size.name === selectedSize)
    : null
  const isVariantAvailable = selectedVariant && selectedVariant.stock > 0

  return (
    <div className="p-4 space-y-1 h-max">
      <div className="p-4 space-y-3 bg-white shadow-md border fixed bottom-0 left-0 right-0 z-50 rounded-t-xl md:static md:rounded-md flex items-center justify-around">
        <div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            className="w-[59px] h-[32px] data-[state=checked]:bg-red-500"
          />
          <p className="text-[12px] font-medium">
            Сплит: <span className="text-[#FF385C]">{splitPrice.toFixed(0)} ₽</span>
            <br /> остаток потом
          </p>
        </div>
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
        <Button
          className="h-12 rounded-full px-13 bg-[#FF385C] text-white text-lg font-semibold disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={isLoading || isAddedToCart || !isVariantSelected || !isVariantAvailable}
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : isAddedToCart ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Добавлено
            </>
          ) : !isVariantSelected ? (
            "Выберите вариант"
          ) : !isVariantAvailable ? (
            "Нет в наличии"
          ) : (
            "Купить"
          )}
        </Button>
      </div>
    </div>
  )
}
