"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { PaymentSummary } from "@/components/PaymentSummary"

interface CartItem {
  id: number
  product: number
  product_name: string
  product_slug: string
  product_images: any[]
  product_price: string
  product_discount_price: string | null
  quantity: number
  variant_details: {
    id: number
    color: {
      id: number
      name: string
      hex_code: string
    }
    size: {
      id: number
      name: string
    }
    stock: number
    available: boolean
    max_order_quantity: number
  }
  total_price: number
  in_stock: boolean
}

interface Cart {
  id: number
  items: CartItem[]
  total_price: string
  final_price: string
  items_count: number
  total_savings: number
  total_items_quantity: number
  available_shipping_methods: any[]
  estimated_delivery: any
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+7")
  const [promoCode, setPromoCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)
  const telegramId = 1524783641

  const fetchCart = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", {
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить корзину",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setIsUpdating(true)
    try {
      // Here you would implement the update quantity API call
      // For now, we'll just update locally
      if (cart) {
        const updatedItems = cart.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: newQuantity, total_price: Number(item.product_price) * newQuantity }
            : item,
        )

        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total_price, 0)

        setCart({
          ...cart,
          items: updatedItems,
          total_price: newTotalPrice.toString(),
          final_price: newTotalPrice.toString(),
          total_items_quantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        })
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (itemId: number) => {
    setIsUpdating(true)
    try {
      // Here you would implement the remove item API call
      if (cart) {
        const updatedItems = cart.items.filter((item) => item.id !== itemId)
        const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.total_price, 0)

        setCart({
          ...cart,
          items: updatedItems,
          total_price: newTotalPrice.toString(),
          final_price: newTotalPrice.toString(),
          items_count: updatedItems.length,
          total_items_quantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        })

        toast({
          title: "Товар удален",
          description: "Товар удален из корзины",
        })
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border rounded-lg">
                <Skeleton className="w-20 h-20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Ваша корзина пуста</h1>
          <p className="text-gray-600 mb-6">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Link href="/">
            <Button>Продолжить покупки</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isFormValid = customerName.trim() && phoneNumber.trim()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Корзина ({cart.items_count})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.product_images && item.product_images.length > 0 ? (
                      <Image
                        src={item.product_images[0].image || "/placeholder.svg"}
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
                    <Link href={`/products/${item.product_slug}`}>
                      <h3 className="font-semibold hover:text-[#FF385C] transition-colors">{item.product_name}</h3>
                    </Link>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Цвет: {item.variant_details.color.name}</span>
                      <span>Размер: {item.variant_details.size.name}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating || item.quantity >= item.variant_details.max_order_quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{item.total_price} ₽</p>
                          {item.product_discount_price && (
                            <p className="text-sm text-gray-500 line-through">
                              {Number(item.product_price) * item.quantity} ₽
                            </p>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {!item.in_stock && <p className="text-red-500 text-sm mt-2">Нет в наличии</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Information Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Информация для заказа</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя и фамилия *</Label>
                  <Input
                    id="name"
                    placeholder="Введите ваше имя и фамилию"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+7">+7</SelectItem>
                        <SelectItem value="+998">+998</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      placeholder="000 000 0000"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-2 mt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Информация для заказа</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя и фамилия *</Label>
                  <Input
                    id="name"
                    placeholder="Введите ваше имя и фамилию"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+7">+7</SelectItem>
                        <SelectItem value="+998">+998</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      placeholder="000 000 0000"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mt-8">
          <PaymentSummary
            total={Number(cart.total_price)}
            shipping={0}
            tax={0}
            discount={cart.total_savings}
            redirectTo="/statusInfo"
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            discountApplied={discountApplied}
            setDiscountApplied={setDiscountApplied}
            selectedShipping="standard"
            getData={customerName.trim() !== "" && phoneNumber.trim() !== ""}
            customerName={customerName}
            phoneNumber={`${countryCode}${phoneNumber}`}
            cartId={cart.id}
            telegramId={telegramId}
          />
        </div>
      </div>
    </div>
  )
}
