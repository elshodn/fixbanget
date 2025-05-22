"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingCart, Check, Loader } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { addToHandleCart, type CartItem } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface Props {
  product: Product;
  quantity: number;
  telegramId?: number;
}

export const PaymentSummary: React.FC<Props> = ({
  product,
  quantity,
  telegramId = 1524783641,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  const handleAddToCart = async () => {
    
    if (isLoading || isAddedToCart) return;

    setIsLoading(true);
    try {
      const response = await addToHandleCart(telegramId, product.id, quantity);

      if (response.success && response.cart_item) {
        setIsAddedToCart(true);
        setCartItem(response.cart_item);

        toast({
          title: "Товар добавлен в корзину",
          description: `${response.cart_item.product.name} (${response.cart_item.quantity} шт.) добавлен в корзину`,
          variant: "default",
        });

        // Reset the added state after 3 seconds
        setTimeout(() => {
          setIsAddedToCart(false);
        }, 3000);
      } else {
        toast({
          title: "Ошибка",
          description:
            response.message || "Не удалось добавить товар в корзину",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении товара в корзину",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the price based on split payment option
  const calculatedPrice = enabled
    ? (Number(product.price) - Number(product.discount_price || 0)) / 2
    : Number(product.price) - Number(product.discount_price || 0);

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
            Сплит:{" "}
            <span className="text-[#FF385C]">
              {calculatedPrice.toFixed(0)} ₽
            </span>
            <br /> остаток потом
          </p>
        </div>
        <div
          className={`rounded-xl p-2 border-2 cursor-pointer ${
            isAddedToCart
              ? "border-green-500 bg-green-50"
              : isLoading
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onClick={handleAddToCart}
        >
          {isLoading ? (
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
          ) : isAddedToCart ? (
            <Check className="h-6 w-6 text-green-500" />
          ) : (
            <ShoppingCart className="h-6 w-6" />
          )}
        </div>
        <Link href="/checkout/method">
          <Button className="h-12 rounded-full px-13 bg-[#FF385C] text-white text-lg font-semibold">
            Купить
          </Button>
        </Link>
      </div>

      {/* Display cart item details if needed */}
      {cartItem && (
        <div className="hidden">
          {/* This is hidden but can be used to access cart item details if needed */}
          <p>Cart Item ID: {cartItem.id}</p>
          <p>Quantity: {cartItem.quantity}</p>
          <p>Total Price: {cartItem.total_price}</p>
        </div>
      )}
    </div>
  );
};
