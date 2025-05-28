"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { Heart, Check, ShoppingCart } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useWishlistStore } from "@/stores/wishlist-store";
import { getTelegramIdForApi } from "@/lib/api";

interface PaymentSummaryProps {
  total?: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  redirectTo: string;
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  discountApplied: boolean;
  setDiscountApplied: React.Dispatch<React.SetStateAction<boolean>>;
  selectedShipping: string;
  getData: boolean;
  customerName?: string;
  phoneNumber?: string;
  cartId?: number;
  telegramId?: number;
  product?: Product;
  quantity: number;
  selectedColor: string | null;
  selectedSize: string | number | null;
  deliveryMethod: "store" | "pickup";
  selectedShippingMethod?: any;
  selectedBranch?: number | null;
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
  product,
  quantity,
  selectedColor,
  selectedSize,
  deliveryMethod,
  selectedShippingMethod,
  selectedBranch,
}) => {
  const [showMobileFullDetails, setShowMobileFullDetails] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isLiked, setIsLiked] = useState(product?.is_liked || false);

  const router = useRouter();
  const toggleWishlistItem = useWishlistStore(
    (state) => state.toggleWishlistItem
  );

  // Split narxni hisoblash funksiyasi
  const calculatePrice = () => {
    if (!product) return { originalPrice: 0, splitPrice: 0, remainingPrice: 0 };

    const singleProductPrice = product.discount_price
      ? Number(product.price) - Number(product.discount_price)
      : Number(product.price);

    const productTotal = singleProductPrice * quantity;
    const shippingCost = selectedShippingMethod
      ? Number(selectedShippingMethod.price || 0)
      : 0;
    const totalPrice = productTotal + shippingCost;

    return {
      originalPrice: totalPrice,
      splitPrice: enabled ? totalPrice / 2 : totalPrice,
      remainingPrice: enabled ? totalPrice / 2 : 0,
    };
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling || !product) return;

    setIsToggling(true);
    setIsLiked(!isLiked);
    try {
      await toggleWishlistItem(product.id);
    } catch (error) {
      setIsLiked(isLiked);
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const getSelectedVariantId = (): number | null => {
    if (!selectedColor || !selectedSize || !product?.variants) {
      return null;
    }

    const selectedVariant = product.variants.find(
      (variant) =>
        variant.color_hex === selectedColor &&
        variant.size_name === selectedSize
    );

    return selectedVariant ? selectedVariant.id : null;
  };

  const handleAddToCart = async () => {
    if (isLoading || isAddedToCart || !product) return;

    const variantId = getSelectedVariantId();

    if (!variantId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите цвет и размер",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { splitPrice, originalPrice } = calculatePrice();
      const effectiveQuantity = enabled ? Math.ceil(quantity / 2) : quantity;

      const formData = new FormData();
      formData.append("product_id", product.id.toString());
      formData.append("quantity", effectiveQuantity.toString());
      formData.append("variant_id", variantId.toString());

      // Split narxni qo'shimcha ma'lumot sifatida yuborish
      if (enabled) {
        formData.append("is_split_payment", "true");
        formData.append("split_price", splitPrice.toString());
        formData.append(
          "original_price",
          calculatePrice().originalPrice.toString()
        );
      }

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "X-Telegram-ID": getTelegramIdForApi(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();

      if (data.cart_item) {
        setIsAddedToCart(true);

        // Split to'lov haqida xabar
        const priceMessage = enabled
          ? `Split to'lov: ${splitPrice.toFixed(
              0
            )} ₽ (qolgan: ${calculatePrice().remainingPrice.toFixed(0)} ₽)`
          : `${splitPrice.toFixed(0)} ₽`;

        toast({
          title: "Товар добавлен в корзину",
          description: `${data.cart_item.product_name} (${data.cart_item.quantity} шт.) - ${priceMessage}`,
          variant: "default",
        });

        setTimeout(() => {
          setIsAddedToCart(false);
        }, 3000);
      } else {
        toast({
          title: "Ошибка",
          description: data.message || "Не удалось добавить товар в корзину",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении товара в корзину",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectPurchase = async () => {
    if (isCreatingOrder || !product) return;

    const variantId = getSelectedVariantId();

    if (!variantId) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите цвет и размер",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBranch) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите филиал",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingOrder(true);
    try {
      const { splitPrice, originalPrice } = calculatePrice();
      const shippingCost = selectedShippingMethod
        ? Number(selectedShippingMethod.price || 0)
        : 0;
      const totalWithShipping = splitPrice + shippingCost;

      // Direct purchase ma'lumotlarini tayyorlash
      const purchaseData = {
        product_id: product.id,
        variant_id: variantId,
        quantity: quantity,
        pickup_branch_id: selectedBranch,
        shipping_method_id: selectedShippingMethod?.id || 1,
        payment_method: enabled ? "split" : "cash_on_pickup",
        customer_name: customerName || "Test User",
        phone_number: phoneNumber || "+998901234567",
        order_note: enabled
          ? `Split to'lov: ${totalWithShipping.toFixed(
              0
            )} ₽ hozir (shipping: ${shippingCost} ₽), ${calculatePrice().remainingPrice.toFixed(
              0
            )} ₽ keyinroq`
          : `Oddiy buyurtma (shipping: ${shippingCost} ₽)`,
        is_split_payment: enabled,
        shipping_cost: shippingCost,
      };

      console.log("Direct purchase data:", purchaseData);

      const response = await fetch("/api/direct-purchase", {
        method: "POST",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Direct purchase failed:", errorData);
        throw new Error("Failed to create direct purchase");
      }

      const orderData = await response.json();
      console.log("Direct purchase response:", orderData);

      const successMessage = enabled
        ? `Split to'lov bilan buyurtma yaratildi! Hozir: ${totalWithShipping.toFixed(
            0
          )} ₽ (shipping: ${shippingCost} ₽), Keyinroq: ${calculatePrice().remainingPrice.toFixed(
            0
          )} ₽`
        : `Buyurtma muvaffaqiyatli yaratildi! Jami: ${totalWithShipping.toFixed(
            0
          )} ₽ (shipping: ${shippingCost} ₽)`;

      toast({
        title: "Заказ создан успешно!",
        description: `Заказ #${orderData.order.id}. ${successMessage}`,
        variant: "default",
      });

      // Orders sahifasiga yo'naltirish
      router.push("/statusInfo");
    } catch (error) {
      console.error("Error creating direct purchase:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании заказа",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const isWide = window.innerWidth >= 768;
        setShowMobileFullDetails(isWide);
        setIsDesktop(isWide);
        setIsMobile(!isWide);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Calculate totals with fallback values
  const safeTotal = Number(total) || 0;
  const safeShipping = Number(shipping) || 0;
  const safeTax = Number(tax) || 0;
  const safeDiscount = Number(discount) || 0;
  const grandTotal = safeTotal + safeShipping + safeTax - safeDiscount;

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
    });
  }, [
    total,
    shipping,
    tax,
    discount,
    customerName,
    phoneNumber,
    cartId,
    getData,
    grandTotal,
  ]);

  const isVariantSelected = selectedColor && selectedSize;
  const selectedVariant = isVariantSelected
    ? product?.variants?.find(
        (variant) =>
          variant.color_hex === selectedColor &&
          variant.size_name === selectedSize
      )
    : null;
  const isVariantAvailable = selectedVariant && selectedVariant.stock > 0;

  const { originalPrice, splitPrice, remainingPrice } = calculatePrice();

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
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col justify-center items-center gap-3">
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              className="w-[59px] h-[32px] data-[state=checked]:bg-red-500"
            />
            <div>
              <p className="text-[12px] font-medium">
                Сплит:{" "}
                <span className="text-[#FF385C]">
                  {splitPrice.toFixed(0)} ₽
                </span>
              </p>
              <p className="text-[10px] text-gray-500">
                {enabled
                  ? `остаток: ${remainingPrice.toFixed(0)} ₽`
                  : "остаток потом"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {/* Wishlist Button */}
            <div
              className={`rounded-xl w-12 h-12 flex justify-center items-center p-2 border-2 cursor-pointer transition-colors ${
                isLiked
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleToggleWishlist}
            >
              {isToggling ? (
                <Loader className="h-6 w-6 animate-spin text-gray-500" />
              ) : (
                <Heart
                  className={`h-6 w-6 ${
                    isLiked ? "text-red-500 fill-red-500" : "text-gray-500"
                  }`}
                />
              )}
            </div>

            <Button
              className=" w-20 h-12 rounded-xl flex justify-center items-center border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
              onClick={handleAddToCart}
              variant={"outline"}
              disabled={
                isLoading ||
                isAddedToCart ||
                !isVariantSelected ||
                !isVariantAvailable
              }
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : isAddedToCart ? (
                <>
                  <Check className="h-5 w-5" />
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Price Display 
        {enabled && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Umumiy narx:</span>
              <span className="line-through text-gray-500">{originalPrice.toFixed(0)} ₽</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-green-600">Hozir to'lash:</span>
              <span className="text-green-600">{splitPrice.toFixed(0)} ₽</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-600">Keyinroq:</span>
              <span className="text-orange-600">{remainingPrice.toFixed(0)} ₽</span>
            </div>
          </div>
        )}
*/}
        {/* Promo Code Section */}
        {/* <div className="flex gap-2 items-center">
          <Input
            placeholder="Промо-код"
            className="flex-1"
            disabled
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button
            variant="outline"
            disabled
            className={`font-medium ${discountApplied ? "bg-green-100 text-green-700" : ""}`}
            onClick={() => setDiscountApplied(!discountApplied)}
          >
            {discountApplied ? "Применено" : "Добавить"}`
          </Button>
        </div> */}

        {/* Price Details - Always show on desktop, toggle on mobile */}
        {(showMobileFullDetails || isDesktop) && (
          <>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">
                Всего покупок
              </span>
              <span className="text-[#1B1B1B] font-bold text-base">
                {safeTotal.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">
                Перевозки
              </span>
              <span className="text-[#1B1B1B] font-bold text-base">
                {safeShipping.toLocaleString()} ₽
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5F5F] font-medium text-base">
                Налог
              </span>
              <span className="text-[#1B1B1B] font-bold text-base">
                {safeTax.toLocaleString()} ₽
              </span>
            </div>
            {safeDiscount > 0 && (
              <div className="flex justify-between text-[#FF385C]">
                <span className="font-medium text-base">Скидка</span>
                <span className="font-bold text-base">
                  −{safeDiscount.toLocaleString()} ₽
                </span>
              </div>
            )}
            <Separator />
          </>
        )}

        {/* Total Section */}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Add to Cart Button */}

          {/* Buy Now Button */}
          <Button
            className="flex-1 h-12 rounded-full bg-[#FF385C] text-white hover:bg-[#E6325A] disabled:opacity-50"
            onClick={handleDirectPurchase}
            disabled={
              isCreatingOrder ||
              !isVariantSelected ||
              !isVariantAvailable ||
              !selectedBranch
            }
          >
            {isCreatingOrder ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : !isVariantSelected ? (
              "Выберите вариант"
            ) : !isVariantAvailable ? (
              "Нет в наличии"
            ) : !selectedBranch ? (
              "Выберите филиал"
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold">
                  Купить: {splitPrice.toFixed(0)} ₽
                </p>
                {enabled && (
                  <p className="text-xs opacity-90">
                    (остаток: {remainingPrice.toFixed(0)} ₽)
                  </p>
                )}
                {selectedShippingMethod &&
                  Number(selectedShippingMethod.price) > 0 && (
                    <p className="text-xs opacity-90">
                      +доставка: {Number(selectedShippingMethod.price)} ₽
                    </p>
                  )}
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
  );
};
