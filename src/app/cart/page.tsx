"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { getCartItems, type CartItem } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { PaymentSummary } from "@/components/PaymentSummary";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [selectedShipping, setSelectedShipping] = useState<string>("free");
  const telegramId = 1524783641; // Default Telegram ID
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const response = await getCartItems(telegramId);
        if (response && response.items) {
          setCartItems(response.items);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить корзину",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [telegramId]);

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.total_price);
    }, 0);
  };

  // Calculate discount
  const calculateDiscount = () => {
    return discountApplied && promoCode ? calculateTotal() * 0.1 : 0; // 10% discount if promo code is applied
  };

  // Handle quantity update
  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(cartItemId);
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("quantity", newQuantity.toString());

      const response = await fetch(`/api/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh cart items
        const cartResponse = await getCartItems(telegramId);
        if (cartResponse && cartResponse.items) {
          setCartItems(cartResponse.items);
        }

        toast({
          title: "Успешно",
          description: "Количество товара обновлено",
        });
      } else {
        toast({
          title: "Ошибка",
          description: data.message || "Не удалось обновить количество товара",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении количества товара",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId: number) => {
    setIsUpdating(true);
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    try {
      const response = await fetch(`/api/cart/items/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Успешно",
          description: "Товар удален из корзины",
        });
      } else {
        // Refresh cart items to restore if deletion failed
        const cartResponse = await getCartItems(telegramId);
        if (cartResponse && cartResponse.items) {
          setCartItems(cartResponse.items);
        }

        toast({
          title: "Ошибка",
          description: data.message || "Не удалось удалить товар из корзины",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении товара из корзины",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    setIsUpdating(true);
    try {
      // Delete all items one by one
      const deletePromises = cartItems.map((item) =>
        fetch(`/api/cart/items/${item.id}`, {
          method: "DELETE",
          headers: {
            "X-Telegram-ID": telegramId.toString(),
          },
        })
      );
      await Promise.all(deletePromises);
      setCartItems([]);
      toast({
        title: "Успешно",
        description: "Корзина очищена",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при очистке корзины",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 rounded-full mr-4" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex border rounded-lg p-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="ml-4 flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Skeleton className="h-12 w-full rounded-lg mb-4" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:flex md:gap-6">
      <div className="md:w-2/3">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingCart className="mr-2 h-6 w-6" /> Корзина
            </h1>
          </div>
          {cartItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleClearCart}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Очистить
            </Button>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex border rounded-lg p-4 shadow-sm"
              >
                <div className="relative h-24 w-24 rounded-md overflow-hidden">
                  <Image
                    src={
                      item.product_image ||
                      "/placeholder.svg?height=96&width=96&query=product"
                    }
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.product_name}</h3>
                  {(item.color || item.size) && (
                    <p className="text-sm text-gray-500 mb-4">
                      {item.color && (
                        <span
                          className="inline-block w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: item.color_hex || "#ccc" }}
                        ></span>
                      )}
                      {item.color && item.color}{" "}
                      {item.color && item.size && "•"} {item.size && item.size}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-lg"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isUpdating}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-lg"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-lg">
                        {Number(item.total_price).toLocaleString()} ₽
                      </span>
                      {item.product_discount_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {(
                            Number(item.product_price) * item.quantity
                          ).toLocaleString()}{" "}
                          ₽
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="self-start ml-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isUpdating}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-500 mb-6">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Link href="/products">
              <Button className="bg-black text-white hover:bg-gray-800">
                Перейти к покупкам
              </Button>
            </Link>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="md:w-1/3 mt-8 md:mt-0">
          <PaymentSummary
            total={calculateTotal()}
            shipping={0}
            tax={0}
            discount={calculateDiscount()}
            redirectTo="/checkout"
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            discountApplied={discountApplied}
            setDiscountApplied={setDiscountApplied}
            selectedShipping={selectedShipping}
            getData={cartItems.length > 0}
          />
        </div>
      )}
    </div>
  );
}
