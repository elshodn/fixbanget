"use client"
import { type FC, useEffect, useState, useCallback, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Share2, X, MapPin, Clock, Phone } from "lucide-react"
import { ProductCarousel } from "@/components/Carousel"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import sizeImage from "@/assets/images/size.png"
import { Separator } from "@/components/ui/separator"
import { PaymentSummary } from "./summary-appbar"
import { PhoneInput } from "./phone-input"
import { fetchFilterProducts } from "@/lib/api"
import { useGender } from "@/hooks/use-gender"
import type { Branch } from "@/types/branch"
import { toast } from "@/components/ui/use-toast"

interface ProductDetailCardProps {
  product: Product
}

const ProductDetailCard: FC<ProductDetailCardProps> = ({ product }) => {
  const { gender } = useGender()
  const [method, setMethod] = useState<"store" | "pickup">("pickup")
  const [minmax, setMinmax] = useState<"min" | "max">("min")
  const [countryCode, setCountryCode] = useState("+998")
  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product?.variants?.length > 0 ? product.variants[0].color_hex : null,
  )
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    product?.variants?.length > 0 ? product.variants[0].size_name : null,
  )
  const [quantity, setQuantity] = useState(1)
  const [currentThumbnailIndex, setCurrentThumbnailIndex] = useState(0)
  const [mainImage, setMainImage] = useState(product?.images?.length > 0 ? product.images[0].image : "")
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([])
  const [filteredImages, setFilteredImages] = useState(product?.images || [])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(
    product?.shipping_methods && product.shipping_methods.length > 0 ? product.shipping_methods[0] : null,
  )
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [isBranchesLoading, setIsBranchesLoading] = useState(false)

  // PaymentSummary uchun kerakli state'lar
  const [promoCode, setPromoCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)

  const telegramId = 1524783641

  // Loading states for missing data
  const isProductLoading = !product
  const hasImages = product?.images && product.images.length > 0
  const hasVariants = product?.variants && product.variants.length > 0
  const hasShippingMethods = product?.shipping_methods && product.shipping_methods.length > 0

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    try {
      setIsBranchesLoading(true)
      const response = await fetch("/api/branches", {
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch branches")
      }

      const data = await response.json()
      console.log("Branches data:", data)

      // Filter only active branches
      const activeBranches = data.filter((branch: Branch) => branch.is_active)
      setBranches(activeBranches)
    } catch (error) {
      console.error("Error fetching branches:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить филиалы",
        variant: "destructive",
      })
    } finally {
      setIsBranchesLoading(false)
    }
  }, [telegramId])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  // Memoize unique colors and sizes to prevent infinite re-renders
  const uniqueColors = useMemo(() => {
    if (!hasVariants) return []
    return Array.from(
      new Map(
        product.variants.map((variant: any) => [
          variant.color_hex,
          {
            id: variant.color,
            name: variant.color_name,
            hex_code: variant.color_hex,
          },
        ]),
      ).values(),
    )
  }, [product?.variants, hasVariants])

  const uniqueSizes = useMemo(() => {
    if (!hasVariants) return []
    return Array.from(
      new Map(
        product.variants.map((variant: any) => [
          variant.size_name,
          {
            id: variant.size,
            name: variant.size_name,
          },
        ]),
      ).values(),
    )
  }, [product?.variants, hasVariants])

  // Tanlangan rangga qarab razmerni filtrlash
  const availableSizes = useMemo(() => {
    if (!hasVariants) return []
    return selectedColor
      ? product.variants
          .filter((variant: any) => variant.color_hex === selectedColor)
          .map((variant: any) => ({
            id: variant.size,
            name: variant.size_name,
          }))
      : uniqueSizes
  }, [selectedColor, product?.variants, uniqueSizes, hasVariants])

  // Tanlangan razmerga qarab ranglarni filtrlash
  const availableColors = useMemo(() => {
    if (!hasVariants) return []
    return selectedSize
      ? product.variants
          .filter((variant: any) => variant.size_name === selectedSize)
          .map((variant: any) => ({
            id: variant.color,
            name: variant.color_name,
            hex_code: variant.color_hex,
          }))
      : uniqueColors
  }, [selectedSize, product?.variants, uniqueColors, hasVariants])

  // Rang tanlaganda rasmlarni filtrlash
  const updateFilteredImages = useCallback(() => {
    if (!hasImages) {
      setFilteredImages([])
      setMainImage("")
      return
    }

    if (selectedColor && hasVariants) {
      const selectedColorIndex = uniqueColors.findIndex((color: any) => color.hex_code === selectedColor)

      const imagesPerColor = Math.floor(product.images.length / uniqueColors.length)

      if (imagesPerColor > 0 && selectedColorIndex !== -1) {
        const startIndex = selectedColorIndex * imagesPerColor
        const endIndex = startIndex + imagesPerColor
        const colorImages = product.images.slice(startIndex, endIndex)

        setFilteredImages(colorImages)
        setMainImage(colorImages[0]?.image || product.images[0]?.image || "")
        setCurrentThumbnailIndex(0)
      } else {
        setFilteredImages(product.images)
        setMainImage(product.images[0]?.image || "")
        setCurrentThumbnailIndex(0)
      }
    } else {
      setFilteredImages(product.images)
      setMainImage(product.images[0]?.image || "")
      setCurrentThumbnailIndex(0)
    }
  }, [selectedColor, product?.images, uniqueColors, hasImages, hasVariants])

  useEffect(() => {
    updateFilteredImages()
  }, [updateFilteredImages])

  // Memoize the fetch function to prevent infinite re-renders
  const getRecommendProducts = useCallback(async () => {
    if (!product?.subcategory?.id) return

    try {
      setIsLoading(true)
      const response = await fetchFilterProducts(
        {
          subcategory: product.subcategory.id,
          page_size: 10,
        },
        gender,
      )
      if (response && response.results) {
        const filteredProducts = response.results.filter((p: Product) => p.id !== product.id)
        setRecommendProducts(filteredProducts)
      }
    } catch (error) {
      console.error("Tavsiya mahsulotlarini yuklashda xatolik:", error)
    } finally {
      setIsLoading(false)
    }
  }, [product?.id, product?.subcategory?.id, gender])

  useEffect(() => {
    getRecommendProducts()
  }, [getRecommendProducts])

  if (isProductLoading) {
    return (
      <div className="pb-18">
        <div className="w-11/12 mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 h-auto sm:h-[500px]">
            <Skeleton className="sm:w-9/12 h-[350px] rounded-lg" />
            <div className="sm:w-3/12 flex sm:flex-col gap-2 sm:gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 sm:w-full sm:h-[100px]" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev: number) => Math.max(1, prev + delta))
  }

  const handleThumbnailClick = (img: string, index: number) => {
    setMainImage(img)
    setCurrentThumbnailIndex(index)
  }

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .then(() => console.log("Ulashildi"))
        .catch((error) => console.log("Ulashishda xatolik:", error))
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Havola nusxalandi!")
    }
  }

  const productPrice = product.discount_price
    ? Number(product.price) - Number(product.discount_price)
    : Number(product.price)

  // PaymentSummary uchun kerakli ma'lumotlarni hisoblash
  const calculateTotals = () => {
    // Asosiy mahsulot narxi (chegirma hisobga olingan)
    const singlePrice = productPrice
    const subtotal = singlePrice * quantity

    // Shipping narxi
    const shipping = selectedShippingMethod ? Number(selectedShippingMethod.price || 0) : 0

    // Soliq (hozircha 0)
    const tax = 0

    // Chegirma (promo kod orqali)
    const discount = discountApplied ? subtotal * 0.1 : 0 // 10% chegirma

    // Jami narx: mahsulot narxi + shipping - chegirma
    const total = subtotal + shipping - discount

    return { total, subtotal, shipping, tax, discount }
  }

  const { total, subtotal, shipping, tax, discount } = calculateTotals()

  // Form validatsiyasi
  const isFormValid =
    customerName.trim() !== "" && phoneNumber.trim() !== "" && selectedColor && selectedSize && selectedBranch !== null

  // Get selected branch details
  const selectedBranchDetails = branches.find((branch) => branch.id === selectedBranch)

  return (
    <div className="pb-18">
      <div className="w-11/12 mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 h-auto sm:h-[500px]">
          <div className="sm:w-9/12 h-[350px] flex justify-center items-center p-4 sm:p-6 rounded-lg relative">
            {hasImages ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-full cursor-zoom-in">
                    <Image
                      fill
                      priority
                      src={mainImage || "/placeholder.svg?height=350&width=350&query=product image"}
                      alt={product.name || "Product image"}
                      className="w-full h-full z-10 object-cover rounded-lg"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
                  <DialogTitle className="sr-only">Просмотр изображения</DialogTitle>
                  <Image
                    width={500}
                    height={500}
                    priority
                    src={mainImage || "/placeholder.svg?height=500&width=500&query=product image"}
                    alt="zoomed"
                    className="w-11/12 mx-auto h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
                  width={200}
                  height={200}
                  src="/placeholder.svg?height=200&width=200&query=no product image available"
                  alt="No image available"
                  className="opacity-50"
                />
              </div>
            )}
          </div>

          <div className="sm:w-3/12 flex sm:flex-col gap-2 sm:gap-3 sm:h-full">
            {hasImages ? (
              <>
                <div className="sm:hidden w-full">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={Math.min(4, filteredImages.length || 1)}
                    grabCursor={true}
                    freeMode={true}
                    watchSlidesProgress={true}
                    touchRatio={1.5}
                    speed={400}
                  >
                    {filteredImages.map((img: any, index: number) => (
                      <SwiperSlide key={index}>
                        <div
                          className={`w-16 h-16 bg-[#F2F2F2] flex items-center justify-center cursor-pointer ${
                            currentThumbnailIndex === index ? "border border-[#FF385C]" : ""
                          }`}
                          onClick={() => handleThumbnailClick(img?.image, index)}
                        >
                          <Image
                            src={img.image || "/placeholder.svg?height=60&width=60&query=thumbnail"}
                            alt={`Thumbnail ${index}`}
                            width={60}
                            height={60}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="hidden sm:flex sm:flex-col gap-3 sm:h-full overflow-y-auto">
                  {filteredImages.map((img: any, index: number) => (
                    <div
                      key={index}
                      className={`w-full h-[100px] bg-[#F2F2F2] flex items-center justify-center p-1 cursor-pointer ${
                        currentThumbnailIndex === index ? "border border-[#FF385C]" : ""
                      }`}
                      onClick={() => handleThumbnailClick(img?.image, index)}
                    >
                      <Image
                        src={img.image || "/placeholder.svg?height=90&width=90&query=thumbnail"}
                        alt={`Thumbnail ${index}`}
                        width={90}
                        height={90}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Нет изображений</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Color Selection */}
          {hasVariants && uniqueColors.length > 0 && (
            <div className="w-full sm:w-1/2">
              <p className="mb-2 text-[#5F5F5F] font-medium">Цвет</p>
              <div className="flex gap-2 flex-wrap">
                {uniqueColors.map((color: any, idx: number) => {
                  const isColorAvailable = selectedSize
                    ? product.variants.some(
                        (variant: any) =>
                          variant.color_hex === color.hex_code &&
                          variant.size_name === selectedSize &&
                          variant.stock > 0,
                      )
                    : product.variants.some((variant: any) => variant.color_hex === color.hex_code && variant.stock > 0)

                  return (
                    <div
                      key={idx}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded border-2 cursor-pointer ${
                        !isColorAvailable ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: color.hex_code,
                        borderColor: selectedColor === color.hex_code ? "#FF385C" : "#ccc",
                      }}
                      onClick={() => isColorAvailable && setSelectedColor(color.hex_code)}
                    />
                  )
                })}
              </div>
            </div>
          )}

          <span className="text-xs sm:text-sm text-gray-500">{product?.brand?.name || "Неизвестный бренд"}</span>
          <h1 className="text-2xl sm:text-3xl font-bold">{product?.name || "Название товара"}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-semibold">{productPrice || 0} ₽</p>
            {product?.discount_price && <p className="text-lg text-gray-500 line-through">{product.price} ₽</p>}
          </div>

          {/* Shipping Methods */}
          {hasShippingMethods && (
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Способ доставки</p>
                <div className="flex gap-2">
                  {product.shipping_methods.map((method: any) => (
                    <Button
                      key={method.id}
                      variant="outline"
                      className={`${selectedShippingMethod?.id === method.id ? "border-[#FF3A5C] bg-red-50" : ""} px-3 py-2 h-auto`}
                      onClick={() => setSelectedShippingMethod(method)}
                    >
                      <div className="text-center flex gap-2 items-center">
                        <span className="text-base font-semibold">
                            {(() => {
                              // Asl narx va discount narxini hisoblash
                              const originalPrice = Number(product.price);
                              const discount = Number(product.discount_price || 0);
                              const shipping = Number(method.price || 0);
                              const hasDiscount = !!product.discount_price;
                              const basePrice = hasDiscount ? originalPrice - discount : originalPrice;

                              // Agar shipping 0 bo'lsa, mahsulot narxini (chegirma bo'lsa chegirma bilan) chiqarish
                              if (shipping === 0) {
                                return `${basePrice.toLocaleString()}₽`;
                              }
                              // Aks holda, narx + shipping
                              const finalPrice = basePrice + shipping;
                              return `${finalPrice.toLocaleString()}₽`;
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
            </div>
          )}

          <hr />

          {/* Size Selection */}
          {hasVariants && uniqueSizes.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 justify-between">
              <div className="w-full sm:w-1/2">
                <div className="flex gap-4 items-start">
                  <p className="font-medium mb-2">Размер</p> |
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="font-medium mb-2 text-[#1443EB] hover:underline cursor-pointer">Помощь</button>
                    </DialogTrigger>
                    <DialogContent className="min-w-[100%-10px] lg:min-w-[800px] mx-auto">
                      <DialogHeader className="relative">
                        <DialogTitle className="text-center text-[#1B1B1B] font-semibold text-base md:text-2xl">
                          {product.name}
                        </DialogTitle>
                        <DialogDescription className="sr-only">Размерная таблица для {product.name}</DialogDescription>
                        <div className="absolute top-0 right-0 cursor-pointer">
                          <DialogClose>
                            <X />
                          </DialogClose>
                        </div>
                      </DialogHeader>
                      <div className="py-0">
                        <Image
                          className="w-32 md:w-1/4 mx-auto"
                          src={sizeImage || "/placeholder.svg?height=100&width=100&query=size chart"}
                          alt="size image"
                        />
                        <p className="text-center mb-4">Измеряется в см</p>
                        <div className="border rounded-md overflow-hidden">
                          <Table className="text-[12px] md:text-[14px]">
                            <TableHeader>
                              <TableRow className="border-b border-t">
                                <TableHead className="border-r">Размер</TableHead>
                                <TableHead className="border-r text-center">S</TableHead>
                                <TableHead className="border-r text-center">M</TableHead>
                                <TableHead className="border-r text-center">L</TableHead>
                                <TableHead className="border-r text-center">XL</TableHead>
                                <TableHead className="text-center">XXL</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="border-r font-medium">Длина Рукава</TableCell>
                                <TableCell className="border-r text-center font-bold">46</TableCell>
                                <TableCell className="border-r text-center font-bold">47</TableCell>
                                <TableCell className="border-r text-center font-bold">48</TableCell>
                                <TableCell className="border-r text-center font-bold">49</TableCell>
                                <TableCell className="text-center font-bold">50</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size: any, idx: number) => {
                    const isSizeAvailable = selectedColor
                      ? product.variants.some(
                          (variant: any) =>
                            variant.size_name === size.name && variant.color_hex === selectedColor && variant.stock > 0,
                        )
                      : product.variants.some((variant: any) => variant.size_name === size.name && variant.stock > 0)

                    return (
                      <Button
                        key={idx}
                        size="sm"
                        disabled={!isSizeAvailable}
                        className={`px-2 sm:px-3 py-1 text-xs font-bold sm:text-sm bg-transparent text-black border-2 border-[#D1D1D1] rounded ${
                          selectedSize === size.name ? "border-black" : ""
                        } ${!isSizeAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => isSizeAvailable && setSelectedSize(size.name)}
                      >
                        {size.name}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex items-center justify-between gap-1 sm:gap-4 mt-4 sm:mt-6">
            <div className="border p-1 sm:p-2 rounded-md flex gap-2 sm:gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </Button>
              <p className="text-sm sm:text-base">{quantity}</p>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </Button>
            </div>
            <Button
              onClick={share}
              className="border bg-transparent w-9 h-9 md:w-12 md:h-12 p-5 text-gray-400 hover:text-[#FF385C]"
            >
              <Share2 size={25} />
            </Button>
          </div>

          {/* Description */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold text-sm sm:text-base">Описание</h4>
              <p className="text-xs sm:text-sm">{product?.description || "Описание недоступно"}</p>
            </div>
            {product?.materials && product.materials.length > 0 && (
              <div>
                <h4 className="font-bold text-sm sm:text-base">Материал</h4>
                <p className="text-xs sm:text-sm">
                  {product.materials.map((material: any) => material.name).join(", ")}
                </p>
              </div>
            )}
          </div>
          <Separator />

          {/* Customer Information Form */}
          <div className="space-y-4 max-w-md mx-auto">
            <Label className="text-sm font-medium">Как получать</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={`${method == "pickup" && "border-[#FF3A5C]"}`}
                onClick={() => setMethod("pickup")}
              >
                В пункт выдачи
              </Button>
              {/* <Button
                variant="outline"
                className={`${method == "store" && "border-[#FF3A5C]"}`}
                onClick={() => setMethod("store")}
              >
                В магазине
              </Button> */}
            </div>

            {/* Branch Selection */}
            <div className="space-y-2">
              <Label htmlFor="branch">Выберите филиал *</Label>
              {isBranchesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedBranch?.toString() || ""}
                  onValueChange={(value) => setSelectedBranch(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите филиал для получения" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
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
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Информация о филиале
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="font-medium">
                      {selectedBranchDetails.name} - {selectedBranchDetails.city}
                    </p>
                    <p>
                      {selectedBranchDetails.street}, {selectedBranchDetails.district}
                    </p>
                    <p>
                      {selectedBranchDetails.region}, {selectedBranchDetails.country}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="h-3 w-3" />
                      <span>{selectedBranchDetails.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Режим работы: {selectedBranchDetails.working_hours}</span>
                    </div>
                    {selectedBranchDetails.has_fitting_room && <p className="text-green-600">✓ Примерочная доступна</p>}
                    {selectedBranchDetails.has_parking && <p className="text-green-600">✓ Парковка доступна</p>}
                    {selectedBranchDetails.is_24_hours && <p className="text-blue-600">🕐 Работает 24/7</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Имя и фамилия *</Label>
              <Input
                id="name"
                placeholder="Имя и фамилия"
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
              <Separator />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <PaymentSummary
        total={subtotal}
        shipping={shipping}
        tax={tax}
        discount={discount}
        redirectTo="/cart"
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        discountApplied={discountApplied}
        setDiscountApplied={setDiscountApplied}
        selectedShipping={selectedShippingMethod?.name || "standard"}
        getData={!!(isFormValid && selectedBranch !== null)}
        customerName={customerName}
        phoneNumber={`${countryCode}${phoneNumber}`}
        cartId={undefined}
        telegramId={1524783641}
        product={product}
        quantity={quantity}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        deliveryMethod={method}
        selectedShippingMethod={selectedShippingMethod}
        selectedBranch={selectedBranch}
      />

      {/* Recommended Products */}
      {recommendProducts.length > 0 && (
        <ProductCarousel title="Tavsiya etilgan mahsulotlar" product={recommendProducts} />
      )}
    </div>
  )
}

export default ProductDetailCard
