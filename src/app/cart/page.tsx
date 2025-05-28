"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PhoneInput } from "@/components/phone-input";
import { LocalStorageViewer } from "@/components/local-storage-viewer";
import { ViewedProductsCarousel } from "@/components/viewed-products-viewer";
import { useCartStorage } from "@/stores/cart-storage";
import type { Branch } from "@/types/branch";
import { PurchasedProductsCarousel } from "@/components/purchased-products";
import { PaymentSummaryCart } from "@/components/PaymentSummary";
import { getTelegramIdForApi } from "@/lib/api";

interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_slug: string;
  product_images: any[];
  product_price: string;
  product_discount_price: string | null;
  quantity: number;
  variant_details: {
    id: number;
    color: {
      id: number;
      name: string;
      hex_code: string;
    };
    size: {
      id: number;
      name: string;
    };
    stock: number;
    available: boolean;
    max_order_quantity: number;
  };
  total_price: number;
  in_stock: boolean;
}

interface Cart {
  id: number;
  items: CartItem[];
  total_price: string;
  final_price: string;
  items_count: number;
  total_savings: number;
  total_items_quantity: number;
  available_shipping_methods: any[];
  estimated_delivery: any;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+998");
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isBranchesLoading, setIsBranchesLoading] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<any>(null);
  const telegramId = 1524783641;

  // LocalStorage integration
  const cartStorage = useCartStorage();

  // Load customer info from localStorage on mount
  useEffect(() => {
    const savedCustomerInfo = cartStorage.customerInfo;
    if (savedCustomerInfo.name) setCustomerName(savedCustomerInfo.name);
    if (savedCustomerInfo.phone) setPhoneNumber(savedCustomerInfo.phone);
    if (savedCustomerInfo.countryCode)
      setCountryCode(savedCustomerInfo.countryCode);
    if (savedCustomerInfo.selectedBranch)
      setSelectedBranch(savedCustomerInfo.selectedBranch);
  }, []);

  // Save customer info to localStorage when changed
  useEffect(() => {
    cartStorage.setCustomerInfo({
      name: customerName,
      phone: phoneNumber,
      countryCode: countryCode,
      selectedBranch: selectedBranch,
    });
  }, [customerName, phoneNumber, countryCode, selectedBranch]);

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setIsBranchesLoading(true);
      const response = await fetch("/api/branches", {
        headers: {
          "X-Telegram-ID": getTelegramIdForApi(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();
      const activeBranches = data.filter((branch: Branch) => branch.is_active);
      setBranches(activeBranches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить филиалы",
        variant: "destructive",
      });
    } finally {
      setIsBranchesLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart", {
        headers: {
          "X-Telegram-ID": getTelegramIdForApi(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      console.log("Cart data received:", data);
      setCart(data);

      // Sync with localStorage
      cartStorage.syncWithServer(data);

      // Set default shipping method if available
      if (
        data.available_shipping_methods &&
        data.available_shipping_methods.length > 0
      ) {
        setSelectedShippingMethod(data.available_shipping_methods[0]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить корзину",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    itemId: number,
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      console.log("Updating quantity:", { itemId, productId, newQuantity });

      // Update localStorage immediately for better UX
      cartStorage.updateQuantity(itemId, newQuantity);

      const response = await fetch(`/api/cart/update?item_id=${itemId}`, {
        method: "PUT",
        headers: {
          "X-Telegram-ID": getTelegramIdForApi(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update quantity");
      }

      const data = await response.json();
      console.log("Update response:", data);

      // Refresh cart after update
      await fetchCart();

      toast({
        title: "Количество обновлено",
        description: "Количество товара успешно изменено",
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Revert localStorage change on error
      await fetchCart();
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось обновить количество",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async (itemId: number) => {
    setIsUpdating(true);
    try {
      console.log("Removing item:", itemId);

      // Update localStorage immediately for better UX
      cartStorage.removeItem(itemId);

      const response = await fetch(`/api/cart/remove?item_id=${itemId}`, {
        method: "DELETE",
        headers: {
          "X-Telegram-ID": getTelegramIdForApi(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to remove item");
      }

      const data = await response.json();
      console.log("Remove response:", data);

      // Refresh cart after removal
      await fetchCart();

      toast({
        title: "Товар удален",
        description: "Товар удален из корзины",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      // Revert localStorage change on error
      await fetchCart();
      toast({
        title: "Ошибка",
        description:
          error instanceof Error ? error.message : "Не удалось удалить товар",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchBranches();
  }, []);

  // Debug cart data
  useEffect(() => {
    if (cart) {
      console.log("Cart state updated:", {
        id: cart.id,
        total_price: cart.total_price,
        final_price: cart.final_price,
        items_count: cart.items_count,
        total_savings: cart.total_savings,
        available_shipping_methods: cart.available_shipping_methods,
      });
    }
  }, [cart]);

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
        <LocalStorageViewer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Ваша корзина пуста</h1>
            <p className="text-gray-600 mb-6">
              Добавьте товары в корзину, чтобы продолжить покупки
            </p>
            <Link href="/">
              <Button>Продолжить покупки</Button>
            </Link>
          </div>
        </div>

        {/* Ko'rilgan mahsulotlar carousel */}
        <ViewedProductsCarousel />

        {/* Sotib olingan mahsulotlar carousel */}
        <PurchasedProductsCarousel />

        <LocalStorageViewer />
      </div>
    );
  }

  const isFormValid =
    customerName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    selectedBranch !== null;

  // Get selected branch details
  const selectedBranchDetails = branches.find(
    (branch) => branch.id === selectedBranch
  );

  // Calculate shipping cost
  const shippingCost = selectedShippingMethod
    ? Number(selectedShippingMethod.price || 0)
    : 0;

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Корзина ({cart.items_count})</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items List */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product_images && item.product_images.length > 0 ? (
                        <Image
                          src={item.product_images[0].url || "/placeholder.svg"}
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
                        <h3 className="font-semibold hover:text-[#FF385C] transition-colors">
                          {item.product_name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Цвет: {item.variant_details.color.name}</span>
                        <span>Размер: {item.variant_details.size.name}</span>
                      </div>

                      {/* Debug info for item */}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center ">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.product,
                                item.quantity - 1
                              )
                            }
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.product,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              isUpdating ||
                              item.quantity >=
                                item.variant_details.max_order_quantity
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">
                              {item.total_price} ₽
                            </p>
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

                      {!item.in_stock && (
                        <p className="text-red-500 text-sm mt-2">
                          Нет в наличии
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Methods */}
              {cart.available_shipping_methods &&
                cart.available_shipping_methods.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">
                      Способ доставки
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                      {cart.available_shipping_methods.map((method: any) => (
                        <Button
                          key={method.id}
                          variant="outline"
                          className={`${
                            selectedShippingMethod?.id === method.id
                              ? "border-[#FF3A5C] bg-red-50"
                              : ""
                          } px-4 py-2 h-auto`}
                          onClick={() => {setSelectedShippingMethod(method)

                          }}
                        >
                          <div className="text-center flex gap-2 items-center">
                            <span className="text-base font-semibold">
                              {(() => {
                                const shipping = Number(method.price);
                                const cartTotal = Number(cart.total_price);

                                if (shipping === 0) {
                                  return `${cartTotal.toLocaleString()} ₽`; 
                                }
                                const finalPrice = cartTotal + shipping;
                                return `${finalPrice.toLocaleString()} ₽`;
                              })()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {method.min_days}-{method.max_days} дней
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Customer Information Form */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">
                  Информация для заказа
                </h2>
                <div className="space-y-4">
                  {/* Branch Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="branch">Выберите филиал *</Label>
                    {isBranchesLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={selectedBranch?.toString() || ""}
                        onValueChange={(value) =>
                          setSelectedBranch(Number(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите филиал для получения" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem
                              key={branch.id}
                              value={branch.id.toString()}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {branch.name} - {branch.city}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {branch.street}, {branch.district}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* Selected Branch Details */}
                    {selectedBranchDetails && (
                      <div className="mt-3 p-3 bg-white rounded-lg border">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Информация о филиале
                        </h4>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p className="font-medium">
                            {selectedBranchDetails.name} -{" "}
                            {selectedBranchDetails.city}
                          </p>
                          <p>
                            {selectedBranchDetails.street},{" "}
                            {selectedBranchDetails.district}
                          </p>
                          <p>
                            {selectedBranchDetails.region},{" "}
                            {selectedBranchDetails.country}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Phone className="h-3 w-3" />
                            <span>{selectedBranchDetails.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>
                              Режим работы:{" "}
                              {selectedBranchDetails.working_hours}
                            </span>
                          </div>
                          {selectedBranchDetails.has_fitting_room && (
                            <p className="text-green-600">
                              ✓ Примерочная доступна
                            </p>
                          )}
                          {selectedBranchDetails.has_parking && (
                            <p className="text-green-600">
                              ✓ Парковка доступна
                            </p>
                          )}
                          {selectedBranchDetails.is_24_hours && (
                            <p className="text-blue-600">🕐 Работает 24/7</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

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
                    <PhoneInput
                      countryCode={countryCode}
                      phoneNumber={phoneNumber}
                      onCountryCodeChange={setCountryCode}
                      onPhoneNumberChange={setPhoneNumber}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-8">
            <PaymentSummaryCart
              total={Number(cart.total_price) || 0}
              shipping={shippingCost}
              tax={0}
              discount={cart.total_savings || 0}
              redirectTo="/checkout"
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              discountApplied={discountApplied}
              setDiscountApplied={setDiscountApplied}
              selectedShipping={selectedShippingMethod?.name || "standard"}
              getData={isFormValid}
              customerName={customerName}
              phoneNumber={`${countryCode}${phoneNumber}`}
              cartId={cart.id}
              telegramId={telegramId}
              selectedBranch={selectedBranch}
              selectedShippingMethod={selectedShippingMethod}
            />
          </div>
        </div>
      </div>

      {/* Ko'rilgan mahsulotlar carousel */}
      <ViewedProductsCarousel />

      {/* Sotib olingan mahsulotlar carousel */}
      <PurchasedProductsCarousel />

      {/* LocalStorage Viewer */}
    </div>
  );
}

