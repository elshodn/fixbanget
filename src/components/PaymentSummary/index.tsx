"use client";

import type React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useViewedProductsStore } from "@/stores/viewed-product-store";
import { getTelegramIdForApi } from "@/lib/api";

interface PaymentSummaryCartProps {
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
  selectedBranch?: number | null;
  selectedShippingMethod?: any;
  cartItems?: any[];
}

export const PaymentSummaryCart: React.FC<PaymentSummaryCartProps> = ({
  total = 0,
  shipping = 0,
  tax = 0,
  discount = 0,
  redirectTo,
  promoCode,
  discountApplied,
  getData,
  customerName = "",
  phoneNumber = "",
  cartId,
  selectedBranch,
  selectedShippingMethod,
  cartItems = [],
}) => {
  const [showMobileFullDetails, setShowMobileFullDetails] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [enabled, setEnabled] = useState(false); // Split payment toggle

  const router = useRouter();

  // Calculate totals with fallback values - YANGILANGAN HISOBLASH
  const safeTotal = Number(total) || 0;
  const safeShipping = Number(shipping) || 0;
  const safeTax = Number(tax) || 0;
  const safeDiscount = Number(discount) || 0; // Bu total_savings dan keladi

  // Apply promo code discount if enabled
  const promoDiscount = discountApplied ? safeTotal * 0.1 : 0; // 10% discount

  // Grand total calculation - YANGILANGAN
  // total allaqachon discount qo'llanilgan narx, shuning uchun uni ayirmaslik kerak
  const grandTotal =
    safeTotal + safeShipping + safeTax - promoDiscount - discount;

  // Split payment calculation
  const splitPrice = enabled ? grandTotal / 2 : grandTotal;
  const remainingPrice = enabled ? grandTotal / 2 : 0;

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

  const createOrder = async () => {
    if (!cartId) {
      toast({
        title: "Ошибка",
        description: "Корзина не найдена",
        variant: "destructive",
      });
      return false;
    }

    if (!customerName?.trim() || !phoneNumber?.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните имя и телефон",
        variant: "destructive",
      });
      return false;
    }

    if (!selectedBranch) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите филиал",
        variant: "destructive",
      });
      return false;
    }

    setIsCreatingOrder(true);
    try {
      const orderFormData = new FormData();
      orderFormData.append("cart_id", cartId.toString());
      orderFormData.append(
        "shipping_method_id",
        selectedShippingMethod?.id?.toString() || "1"
      );
      orderFormData.append("pickup_branch_id", selectedBranch.toString());
      orderFormData.append("customer_name", customerName);
      orderFormData.append("phone_number", phoneNumber);
      orderFormData.append(
        "payment_method",
        enabled ? "split" : "cash_on_pickup"
      );

      // Add split payment info if enabled
      if (enabled) {
        orderFormData.append("is_split_payment", "true");
        orderFormData.append("first_payment_amount", splitPrice.toString());
        orderFormData.append(
          "second_payment_amount",
          remainingPrice.toString()
        );
      }

      // Add promo code info if applied
      if (discountApplied && promoCode) {
        orderFormData.append("promo_code", promoCode);
        orderFormData.append("promo_discount", promoDiscount.toString());
      }

      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/orders`,
        {
          method: "POST",
          headers: {
            "X-Telegram-ID": getTelegramIdForApi(),
          },
          body: orderFormData,
        }
      );

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      const successMessage = enabled
        ? `Split to'lov bilan buyurtma yaratildi! Hozir: ${splitPrice.toFixed(
            0
          )} ₽, Keyinroq: ${remainingPrice.toFixed(0)} ₽`
        : `Buyurtma muvaffaqiyatli yaratildi! Jami: ${grandTotal.toFixed(0)} ₽`;

      toast({
        title: "Заказ создан успешно!",
        description: `Заказ #${
          orderData.id || orderData.order?.id
        }. ${successMessage}`,
        variant: "default",
      });

      // Add purchased products to localStorage
      const { addPurchasedProduct } = useViewedProductsStore.getState();

      // Cart items dan har birini sotib olingan deb belgilash
      if (cartItems && cartItems.length > 0) {
        cartItems.forEach((item) => {
          const productData = {
            id: item.product,
            name: item.product_name,
            slug: item.product_slug,
            price: item.product_price,
            discount_price: item.product_discount_price,
            image: item.product_images?.[0]?.url || "",
            brand_name: item.product_brand || "",
            product_name: item.product_name,
            product_slug: item.product_slug,
            product_price: item.product_price,
            product_discount_price: item.product_discount_price,
            product_image: item.product_images?.[0]?.url || "",
          };

          addPurchasedProduct(productData, orderData.id || orderData.order?.id);
        });
      }

      // Redirect to orders page
      router.push("/statusInfo");
      return true;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Произошла ошибка при создании заказа",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!getData) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля.",
        variant: "destructive",
      });
      return;
    }

    if (cartId && customerName && phoneNumber && selectedBranch) {
      const orderCreated = await createOrder();
      if (orderCreated) {
        return;
      }
    } else {
      router.push(redirectTo);
    }
  };

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
                Сплит:{" "}
                <span className="text-[#FF385C]">
                  {(grandTotal / 2).toLocaleString()} ₽
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Split Payment Info */}
        {enabled && (
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Общая сумма:</span>
              <span className="line-through text-gray-500">
                {grandTotal.toFixed(0)} ₽
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-green-600">Оплатить сейчас:</span>
              <span className="text-green-600">{splitPrice.toFixed(0)} ₽</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-600">Доплатить позже:</span>
              <span className="text-orange-600">
                {remainingPrice.toFixed(0)} ₽
              </span>
            </div>
          </div>
        )}

        <Separator />

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
                <span className="font-medium text-base">Скидка товара</span>
                <span className="font-bold text-base">
                  −{safeDiscount.toLocaleString()} ₽
                </span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#FF385C]">
                <span className="font-medium text-base">Промо-скидка</span>
                <span className="font-bold text-base">
                  −{promoDiscount.toFixed(0)} ₽
                </span>
              </div>
            )}
            <Separator />
          </>
        )}

        {/* Total Section */}
        <div
          className="flex justify-between font-semibold text-lg cursor-pointer md:cursor-default"
          onClick={() => {
            if (isMobile) setShowMobileFullDetails(!showMobileFullDetails);
          }}
        >
          <span>Итого</span>
          <span>{grandTotal.toLocaleString()} ₽</span>
        </div>

        {/* Payment Button */}
        <Button
          className="w-full bg-[#FF385C] text-white hover:bg-[#E6325A] disabled:opacity-50"
          onClick={handlePaymentClick}
          disabled={isCreatingOrder || !getData}
        >
          {isCreatingOrder ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Создание заказа...
            </>
          ) : enabled ? (
            <div className="text-center">
              <p className="text-sm font-semibold">
                Оплатить: {splitPrice.toFixed(0)} ₽
              </p>
              <p className="text-xs opacity-90">
                (остаток: {remainingPrice.toFixed(0)} ₽)
              </p>
            </div>
          ) : (
            `Оформить заказ: ${grandTotal.toLocaleString()} ₽`
          )}
        </Button>

        {/* Status Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Статус формы: {getData ? "✅ Готов" : "❌ Не заполнен"}</p>
          {!getData && <p>Заполните все поля для оформления заказа</p>}
          {enabled && <p>🔄 Split-платеж активирован</p>}
        </div>
      </div>
    </div>
  );
};
