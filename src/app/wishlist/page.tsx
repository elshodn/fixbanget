"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Loader } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

// Telegram ID (amalda foydalanuvchi autentifikatsiyasi orqali olinadi)
const TELEGRAM_ID = 1524783641

interface WishlistResponse {
  count: number
  next: string | null
  previous: string | null
  results: WishlistItem[]
}

interface WishlistItem {
  id: number
  user: number
  products: Product[]
  created_at: string
}

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])
  const [wishlistId, setWishlistId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRemoving, setIsRemoving] = useState(false)
  const [removingProductIds, setRemovingProductIds] = useState<number[]>([])
  const isMounted = useRef(true)

  // Component mount/unmount uchun
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Wishlist ma'lumotlarini olish
  const fetchWishlist = async () => {
    if (!isMounted.current) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/wishlist", {
        headers: {
          "X-Telegram-ID": TELEGRAM_ID.toString(),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Wishlist data:", data) // Debug uchun

      // API javobidan ma'lumotlarni olish
      if (isMounted.current) {
        if (data.results && data.results.length > 0) {
          setWishlistProducts(data.results[0].products || [])
          setWishlistId(data.results[0].id || null)
        } else {
          setWishlistProducts([])
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      if (isMounted.current) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список желаний",
          variant: "destructive",
        })
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [])

  // Mahsulotni wishlistdan o'chirish
  const removeFromWishlist = async (productId: number) => {
    // Agar mahsulot allaqachon o'chirilayotgan bo'lsa, qayta so'rov yubormaymiz

    // O'chirilayotgan mahsulotlar ro'yxatiga qo'shamiz
    setRemovingProductIds((prev) => [...prev, productId])

    try {
      // UI-da mahsulotni darhol o'chiramiz (optimistic update)
      setWishlistProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))

      const formData = new FormData()
      formData.append("product_id", productId.toString())

      const response = await fetch("/api/wishlist/remove", {
        method: "POST",
        headers: {
          "X-Telegram-ID": TELEGRAM_ID.toString(),
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        if (isMounted.current) {
          toast({
            title: "Успешно",
            description: "Товар удален из списка желаний",
          })
        }
      } else {
        // Agar so'rov muvaffaqiyatsiz bo'lsa, mahsulotni qaytaramiz
        if (isMounted.current) {
          fetchWishlist() // Barcha ma'lumotlarni qayta yuklaymiz

          toast({
            title: "Ошибка",
            description: data.message || "Не удалось удалить товар из списка желаний",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      // Xatolik yuz berganda, mahsulotlarni qayta yuklaymiz
      if (isMounted.current) {
        fetchWishlist()

        toast({
          title: "Ошибка",
          description: "Произошла ошибка при удалении товара из списка желаний",
          variant: "destructive",
        })
      }
    } finally {
      if (isMounted.current) {
        // O'chirilgan mahsulotni ro'yxatdan olib tashlaymiz
        setRemovingProductIds((prev) => prev.filter((id) => id !== productId))
      }
    }
  }

  // Barcha mahsulotlarni wishlistdan o'chirish
  const handleDeleteAll = async () => {
    if (isRemoving) return

    setIsRemoving(true)
    try {
      if (wishlistProducts.length > 0) {
        // UI-da barcha mahsulotlarni darhol o'chiramiz (optimistic update)
        setWishlistProducts([])

        // Barcha mahsulotlarni o'chirish uchun so'rovlar
        const removePromises = wishlistProducts.map((product) => {
          const formData = new FormData()
          formData.append("product_id", product.id.toString())

          return fetch("/api/wishlist/remove", {
            method: "POST",
            headers: {
              "X-Telegram-ID": TELEGRAM_ID.toString(),
            },
            body: formData,
          })
        })

        await Promise.all(removePromises)

        if (isMounted.current) {
          toast({
            title: "Успешно",
            description: "Все товары удалены из списка желаний",
          })
        }
      }
    } catch (error) {
      console.error("Error removing all items from wishlist:", error)
      // Xatolik yuz berganda, mahsulotlarni qayta yuklaymiz
      if (isMounted.current) {
        fetchWishlist()

        toast({
          title: "Ошибка",
          description: "Произошла ошибка при удалении товаров из списка желаний",
          variant: "destructive",
        })
      }
    } finally {
      if (isMounted.current) {
        setIsRemoving(false)
      }
    }
  }

  // Wishlist bo'sh yoki yo'qligini tekshirish
  const hasItems = wishlistProducts.length > 0

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <h1 className="font-semibold text-xl sm:text-3xl md:text-4xl">Мой список желаний</h1>
        {hasItems && (
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className="text-[#F04438] hover:bg-transparent font-medium text-sm sm:text-base"
            disabled={isRemoving}
          >
            {isRemoving ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
            Удалить все
          </Button>
        )}
      </div>

      {hasItems ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden transition-shadow hover:shadow-lg rounded-lg"
            >
              <button
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full hover:bg-white cursor-pointer transition-colors"
                onClick={() => removeFromWishlist(product.id)}
                aria-label="Remove from wishlist"
                disabled={removingProductIds.includes(product.id) || isRemoving}
              >
                {removingProductIds.includes(product.id) ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#F04438]" />
                ) : (
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#F04438] fill-[#F04438]" />
                )}
              </button>

              <Link href={`/products/${product.slug}`} className="block">
                <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      fill
                      src={product.images[0].image || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">{product.brand.name}</p>
                  <h3 className="font-medium text-base sm:text-lg line-clamp-1">{product.name}</h3>
                  <p className="font-semibold text-base sm:text-lg mt-1 sm:mt-2">
                    {product.discount_price ? (
                      <>
                        <span className="text-[#F04438]">
                          {Number(product.price) - Number(product.discount_price)} ₽
                        </span>{" "}
                        <span className="line-through text-gray-500 text-sm">{product.price} ₽</span>
                      </>
                    ) : (
                      `${product.price} ₽`
                    )}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto py-10 sm:py-20">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#F04438]" />
          </div>
          <h1 className="text-[#1B1B1B] text-xl sm:text-2xl font-semibold capitalize mt-4">Пустой список желаний</h1>
          <p className="text-[#8D8D8D] font-normal text-sm sm:text-base px-4 sm:px-0">
            В вашем списке желаний нет ни одного товара.
          </p>
          <Link href="/products" className="inline-block w-full sm:w-auto">
            <Button className="bg-[#FF385C] w-full sm:w-64 font-semibold text-base mt-4">Продолжить покупки</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Wishlist
