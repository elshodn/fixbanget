"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/navigation"
import { ArrowDownWideNarrow, Filter, Search, Loader, X } from "lucide-react"
import Link from "next/link"
import { ProductCarouselCard } from "@/components/Carousel/ProductCarouselCard"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useGender } from "@/hooks/use-gender"
import { useProductData } from "@/hooks/useProductData"
import { useProductFilters } from "@/hooks/useProductFilters"
import { filterSizesBySystem, getSizeDisplayName, sortOptions } from "@/helpers/productFilters"

const ProductsClient = ({ initialCategory }: { initialCategory?: string }) => {
  const { gender, toggleGender } = useGender()

  // Custom hook'lar
  const {
    products,
    featuredProducts,
    brands,
    sizes,
    isLoading,
    isLoadingMore,
    hasMore,
    totalCount,
    page,
    setProducts,
    setIsLoading,
    setIsLoadingMore,
    setHasMore,
    setTotalCount,
    setPage,
  } = useProductData({ initialCategory, gender })

  const {
    filters,
    activeFilters,
    applyFilters,
    handlePriceChange,
    handleDeliveryChange,
    handleToggleSize,
    handleToggleBrand,
    handleSetSizeSystem,
    handleSortChange,
    handleSearchChange,
    handleClearSizeFilter,
    handleClearPriceFilter,
    handleClearDeliveryFilter,
    handleClearBrandFilter,
  } = useProductFilters({
    initialCategory,
    gender,
    sizes,
    brands,
    setProducts,
    setIsLoading,
    setIsLoadingMore,
    setHasMore,
    setTotalCount,
    setPage,
  })

  // Local state - yangilangan versiya
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null) // null = loading state
  const [visibleFilter, setVisibleFilter] = useState<string | null>(null)
  const [openFilter, setOpenFilter] = useState<string | null>(null) // Declare openFilter

  // Intersection observer for infinite scroll
  const [loadMoreRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "200px",
  })

  // Load more products when scrolling
  useEffect(() => {
    const loadMoreProducts = async () => {
      if (!hasMore || isLoadingMore) return

      const nextPage = page + 1
      setIsLoadingMore(true)

      try {
        await applyFilters(nextPage, false)
        setPage(nextPage)
      } finally {
        setIsLoadingMore(false)
      }
    }

    if (isIntersecting && hasMore && !isLoading && !isLoadingMore) {
      loadMoreProducts()
    }
  }, [isIntersecting, hasMore, isLoading, isLoadingMore, page, applyFilters, setPage, setIsLoadingMore])

  // isMobile state'ni to'g'ri aniqlash
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Event listener
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (openFilter && !target.closest(".filter-modal") && !target.closest(".filter-trigger")) {
        setOpenFilter(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openFilter])

  // Toggle filter
  const toggleFilter = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType)
  }

  const toggleFilterVisibility = (filterName: string) => {
    if (visibleFilter === filterName) {
      setVisibleFilter(null)
    } else {
      setVisibleFilter(filterName)
    }
  }

  // Render sizes with memoization
  const renderSizes = useMemo(() => {
    const filteredSizes = filterSizesBySystem(sizes, filters.sizeSystem)

    return (
      <div className="grid grid-cols-3 gap-x-12 gap-y-2 w-max mx-auto">
        {filteredSizes.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Checkbox
              className="rounded-full border border-[#848484]"
              checked={filters.selectedSizes.includes(item.name)}
              onCheckedChange={() => handleToggleSize(item.name)}
            />
            <p className="text-[#222222]">{getSizeDisplayName(item, filters.sizeSystem)}</p>
          </div>
        ))}
      </div>
    )
  }, [sizes, filters.sizeSystem, filters.selectedSizes, handleToggleSize])

  // Render filters sidebar - yangilangan versiya
  const renderFilters = () => {
    // Loading state uchun
    if (isMobile === null) {
      return <div className="hidden md:block w-3/12 pr-8" /> // Placeholder
    }

    return (
      <div
        className={`${
          isMobile
            ? showMobileFilters
              ? "fixed inset-0 z-50 bg-white p-4 overflow-y-auto flex flex-col"
              : "hidden"
            : "hidden md:block w-3/12 pr-8"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {isMobile && (
            <>
              <div className="flex justify-between items-center pb-4 mb-3 border-b">
                <Search size={30} />
                <Input
                  type="text"
                  placeholder="Поиск..."
                  value={filters.searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-11/12 border-none rounded focus-visible:outline-none focus-visible:ring-0 shadow-none focus:shadow-none"
                />
              </div>
            </>
          )}

          <div className="my-6">
            <h1 className="text-base text-[#222222] font-medium mb-3">Цена, RUB mn</h1>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  name="min"
                  value={filters.priceRange.min}
                  onChange={handlePriceChange}
                  placeholder="от 0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  name="max"
                  value={filters.priceRange.max}
                  onChange={handlePriceChange}
                  placeholder="до 0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-base text-[#222222] font-medium mb-3">Размер</h1>
            <div>
              <div className="flex w-full border gap-0.5 rounded bg-[#F2F2F2] p-2 my-5">
                {["EU", "US", "UK", "FR"].map((system) => (
                  <Button
                    key={system}
                    className={clsx(
                      "rounded px-5 py-5 text-sm font-bold w-1/4",
                      filters.sizeSystem === system
                        ? "bg-white text-black shadow hover:bg-white"
                        : "bg-transparent text-black shadow-none hover:bg-transparent",
                    )}
                    onClick={() => handleSetSizeSystem(system)}
                  >
                    {system}
                  </Button>
                ))}
              </div>
              {renderSizes}
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-base text-[#222222] font-medium mb-3">Бренды</h1>
            <div className="space-y-3 grid grid-cols-2 md:grid-cols-1">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.selectedBrands.includes(brand.name)}
                    onCheckedChange={() => handleToggleBrand(brand.name)}
                  />
                  <p className="text-[#222222]">{brand.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="sticky bottom-0 bg-white pt-4">
            <Button
              className="w-full py-6 bg-[#FF385C] text-white mb-2"
              onClick={() => {
                applyFilters()
                setShowMobileFilters(false)
              }}
            >
              Поиск
            </Button>
            <div className="h-1 w-full bg-[#EDEDED]"></div>
          </div>
        )}
      </div>
    )
  }

  // Size Filter Modal Component
  const SizeFilterModal = () => (
    <div className="filter-modal absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">Размер</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenFilter(null)}>
          <X size={16} />
        </Button>
      </div>
      <div className="flex w-full border gap-0.5 rounded bg-[#F2F2F2] p-2 mb-3">
        {["EU", "US", "UK", "FR"].map((system) => (
          <Button
            key={system}
            className={clsx(
              "rounded px-3 py-2 text-xs font-bold w-1/4",
              filters.sizeSystem === system
                ? "bg-white text-black shadow hover:bg-white"
                : "bg-transparent text-black shadow-none hover:bg-transparent",
            )}
            onClick={() => handleSetSizeSystem(system)}
          >
            {system}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
        {filterSizesBySystem(sizes, filters.sizeSystem).map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox
              className="rounded-full border border-[#848484]"
              checked={filters.selectedSizes.includes(item.name)}
              onCheckedChange={() => handleToggleSize(item.name)}
            />
            <p className="text-sm">{getSizeDisplayName(item, filters.sizeSystem)}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" onClick={handleClearSizeFilter}>
          Сбросить
        </Button>
        <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={() => setOpenFilter(null)}>
          Применить
        </Button>
      </div>
    </div>
  )

  // Price Filter Modal Component
  const PriceFilterModal = () => (
    <div className="filter-modal absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">Цена, RUB</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenFilter(null)}>
          <X size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <Input
            type="text"
            name="min"
            value={filters.priceRange.min}
            onChange={handlePriceChange}
            placeholder="от 0"
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            name="max"
            value={filters.priceRange.max}
            onChange={handlePriceChange}
            placeholder="до 0"
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleClearPriceFilter}>
          Сбросить
        </Button>
        <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={() => setOpenFilter(null)}>
          Применить
        </Button>
      </div>
    </div>
  )

  // Brand Filter Modal Component
  const BrandFilterModal = () => (
    <div className="filter-modal absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">Бренды</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenFilter(null)}>
          <X size={16} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-center gap-2">
            <Checkbox
              checked={filters.selectedBrands.includes(brand.name)}
              onCheckedChange={() => handleToggleBrand(brand.name)}
            />
            <p className="text-sm">{brand.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" onClick={handleClearBrandFilter}>
          Сбросить
        </Button>
        <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={() => setOpenFilter(null)}>
          Применить
        </Button>
      </div>
    </div>
  )

  // Delivery Filter Modal Component
  const DeliveryFilterModal = () => (
    <div className="filter-modal absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">Срок доставки, дни</h3>
        <Button variant="outline" size="sm" onClick={() => setOpenFilter(null)}>
          <X size={16} />
        </Button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <Input
            type="text"
            name="min"
            value={filters.deliveryRange.min}
            onChange={handleDeliveryChange}
            placeholder="от 0"
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="flex-1">
          <Input
            type="text"
            name="max"
            value={filters.deliveryRange.max}
            onChange={handleDeliveryChange}
            placeholder="до 0"
            className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleClearDeliveryFilter}>
          Сбросить
        </Button>
        <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={() => setOpenFilter(null)}>
          Применить
        </Button>
      </div>
    </div>
  )

  // Render filter content based on visible filter
  const renderFilterContent = () => {
    if (!visibleFilter) return null

    switch (visibleFilter) {
      case "size":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Размер</h3>
              <Button variant="outline" size="sm" onClick={() => setVisibleFilter(null)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex w-full border gap-0.5 rounded bg-[#F2F2F2] p-2 mb-3">
              {["EU", "US", "UK", "FR"].map((system) => (
                <Button
                  key={system}
                  className={clsx(
                    "rounded px-3 py-2 text-xs font-bold w-1/4",
                    filters.sizeSystem === system
                      ? "bg-white text-black shadow hover:bg-white"
                      : "bg-transparent text-black shadow-none hover:bg-transparent",
                  )}
                  onClick={() => handleSetSizeSystem(system)}
                >
                  {system}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {sizes
                .filter((size) => {
                  if (filters.sizeSystem === "EU" && size.size_eu !== null) return true
                  if (filters.sizeSystem === "US" && size.size_us !== null) return true
                  if (filters.sizeSystem === "UK" && size.size_uk !== null) return true
                  if (filters.sizeSystem === "FR" && size.size_fr !== null) return true
                  return (
                    size.size_eu === null && size.size_us === null && size.size_uk === null && size.size_fr === null
                  )
                })
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      className="rounded-full border border-[#848484]"
                      checked={filters.selectedSizes.includes(item.name)}
                      onCheckedChange={() => handleToggleSize(item.name)}
                    />
                    <p className="text-sm">
                      {filters.sizeSystem === "EU" && item.size_eu
                        ? item.size_eu
                        : filters.sizeSystem === "US" && item.size_us
                          ? item.size_us
                          : filters.sizeSystem === "UK" && item.size_uk
                            ? item.size_uk
                            : filters.sizeSystem === "FR" && item.size_fr
                              ? item.size_fr
                              : item.name}
                    </p>
                  </div>
                ))}
            </div>
            <div className="flex justify-between mt-3">
              <Button variant="outline" size="sm" onClick={() => handleClearSizeFilter()}>
                Сбросить
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
                Применить
              </Button>
            </div>
          </div>
        )
      case "price":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Цена, RUB</h3>
              <Button variant="outline" size="sm" onClick={() => setVisibleFilter(null)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <Input
                  type="text"
                  name="min"
                  value={filters.priceRange.min}
                  onChange={handlePriceChange}
                  placeholder="от 0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  name="max"
                  value={filters.priceRange.max}
                  onChange={handlePriceChange}
                  placeholder="до 0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleClearPriceFilter()}>
                Сбросить
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
                Применить
              </Button>
            </div>
          </div>
        )
      case "brand":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Бренды</h3>
              <Button variant="outline" size="sm" onClick={() => setVisibleFilter(null)}>
                <X size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.selectedBrands.includes(brand.name)}
                    onCheckedChange={() => handleToggleBrand(brand.name)}
                  />
                  <p className="text-sm">{brand.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <Button variant="outline" size="sm" onClick={() => handleClearBrandFilter()}>
                Сбросить
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
                Применить
              </Button>
            </div>
          </div>
        )
      case "delivery":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Срок доставки, дни</h3>
              <Button variant="outline" size="sm" onClick={() => setVisibleFilter(null)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <Input
                  type="text"
                  name="min"
                  value={filters.deliveryRange.min}
                  onChange={handleDeliveryChange}
                  placeholder="от 0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  name="max"
                  value={filters.deliveryRange.max}
                  onChange={handleDeliveryChange}
                  placeholder="до 0"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleClearDeliveryFilter()}>
                Сбросить
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
                Применить
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="my-10 font-medium">
      <p className="mx-5 text-[#8D8D9A]">
        <Link href="/">Главная</Link> /
        <span onClick={toggleGender}>{gender === "female" ? " Женщинам " : " Мужчинам "} </span>/ продукт
      </p>
      <h1 className="p-5 text-3xl">
        {filters.category
          ? brands.find((brand) => brand.id === Number(filters.category))?.name ||
            sizes.find((size) => size.id === Number(filters.category))?.name ||
            "Товары"
          : "Товары"}
      </h1>
      <div className="flex p-5 flex-col md:flex-row">
        {/* Filters Sidebar - Desktop */}
        {!isMobile && renderFilters()}

        {/* Products Section - yangilangan versiya */}
        <div className={`${isMobile === null ? "w-full" : isMobile ? "w-full" : "w-full md:w-9/12"}`}>
          {/* Mobile Filter Button */}
          {isMobile && (
            <>
              <div className="mb-4 flex justify-between items-center scrollbar-hide">
                <div className="relative">
                  <Button
                    className="flex items-center gap-2 text-black bg-transparent"
                    onClick={() => {
                      const dropdown = document.getElementById("sort-dropdown")
                      if (dropdown) dropdown.classList.toggle("hidden")
                    }}
                  >
                    <ArrowDownWideNarrow size={18} />
                    {sortOptions.find((opt) => opt.value === filters.sortBy)?.label}
                  </Button>
                  <div
                    id="sort-dropdown"
                    className="hidden absolute sm:right-0 left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filters.sortBy === option.value ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          handleSortChange(option.value)
                          const dropdown = document.getElementById("sort-dropdown")
                          if (dropdown) dropdown.classList.add("hidden")
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="flex items-center gap-2 text-black bg-white"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter size={18} />
                  Фильтры
                </Button>
              </div>
              <div className="flex gap-4 justify-center overflow-auto ps-5">
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.size ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                  )}
                  onClick={() => toggleFilterVisibility("size")}
                >
                  Размер{" "}
                  {activeFilters.size && (
                    <X
                      className="ml-1"
                      size={12}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClearSizeFilter()
                      }}
                    />
                  )}
                </Button>
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.price ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                  )}
                  onClick={() => toggleFilterVisibility("price")}
                >
                  Цена{" "}
                  {activeFilters.price && (
                    <X
                      className="ml-1"
                      size={12}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClearPriceFilter()
                      }}
                    />
                  )}
                </Button>
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.brand ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                  )}
                  onClick={() => toggleFilterVisibility("brand")}
                >
                  Бренд{" "}
                  {activeFilters.brand && (
                    <X
                      className="ml-1"
                      size={12}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClearBrandFilter()
                      }}
                    />
                  )}
                </Button>
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.delivery ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                  )}
                  onClick={() => toggleFilterVisibility("delivery")}
                >
                  Срок доставки{" "}
                  {activeFilters.delivery && (
                    <X
                      className="ml-1"
                      size={12}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClearDeliveryFilter()
                      }}
                    />
                  )}
                </Button>
              </div>
              {/* Render filter content for mobile */}
              <div className="relative">{renderFilterContent()}</div>
            </>
          )}

          {/* Mobile Filters - Overlay */}
          {isMobile && showMobileFilters && <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>}
          {isMobile && showMobileFilters && renderFilters()}

          {/* Desktop Filter Buttons - faqat desktop'da ko'rsatish */}
          {isMobile === false && (
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {/* Size Filter */}
                  <div className="relative">
                    <Button
                      className={clsx(
                        "filter-trigger rounded-xl cursor-pointer text-base",
                        activeFilters.size ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                      )}
                      onClick={() => toggleFilter("size")}
                    >
                      Размер{" "}
                      {activeFilters.size && (
                        <X
                          className="ml-1"
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClearSizeFilter()
                          }}
                        />
                      )}
                    </Button>
                    {openFilter === "size" && <SizeFilterModal />}
                  </div>

                  {/* Price Filter */}
                  <div className="relative">
                    <Button
                      className={clsx(
                        "filter-trigger rounded-xl cursor-pointer text-base",
                        activeFilters.price ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                      )}
                      onClick={() => toggleFilter("price")}
                    >
                      Цена{" "}
                      {activeFilters.price && (
                        <X
                          className="ml-1"
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClearPriceFilter()
                          }}
                        />
                      )}
                    </Button>
                    {openFilter === "price" && <PriceFilterModal />}
                  </div>

                  {/* Brand Filter */}
                  <div className="relative">
                    <Button
                      className={clsx(
                        "filter-trigger rounded-xl cursor-pointer text-base",
                        activeFilters.brand ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                      )}
                      onClick={() => toggleFilter("brand")}
                    >
                      Бренд{" "}
                      {activeFilters.brand && (
                        <X
                          className="ml-1"
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClearBrandFilter()
                          }}
                        />
                      )}
                    </Button>
                    {openFilter === "brand" && <BrandFilterModal />}
                  </div>

                  {/* Delivery Filter */}
                  <div className="relative">
                    <Button
                      className={clsx(
                        "filter-trigger rounded-xl cursor-pointer text-base",
                        activeFilters.delivery ? "bg-black text-white" : "bg-[#F2F2F2] text-black",
                      )}
                      onClick={() => toggleFilter("delivery")}
                    >
                      Срок доставки{" "}
                      {activeFilters.delivery && (
                        <X
                          className="ml-1"
                          size={16}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClearDeliveryFilter()
                          }}
                        />
                      )}
                    </Button>
                    {openFilter === "delivery" && <DeliveryFilterModal />}
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <Button
                    className="flex items-center gap-2 bg-transparent text-black border-2"
                    onClick={() => {
                      const dropdown = document.getElementById("sort-dropdown-desktop")
                      if (dropdown) dropdown.classList.toggle("hidden")
                    }}
                  >
                    <ArrowDownWideNarrow size={18} />
                    {sortOptions.find((opt) => opt.value === filters.sortBy)?.label}
                  </Button>
                  <div
                    id="sort-dropdown-desktop"
                    className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filters.sortBy === option.value ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          handleSortChange(option.value)
                          const dropdown = document.getElementById("sort-dropdown-desktop")
                          if (dropdown) dropdown.classList.add("hidden")
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr className="my-6" />

          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <ProductCarouselCard key={product.id + index + Math.random()} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg text-gray-500">Товары не найдены</p>
                  </div>
                )}
              </div>

              {/* Load more indicator */}
              {products.length > 0 && (
                <div ref={loadMoreRef} className="w-full flex justify-center items-center py-8">
                  {isLoadingMore && <Loader className="w-6 h-6 animate-spin text-gray-500" />}
                  {!isLoadingMore && hasMore && (
                    <p className="text-sm text-gray-500">Прокрутите вниз для загрузки дополнительных товаров</p>
                  )}
                  {!isLoadingMore && !hasMore && products.length > 0 && (
                    <p className="text-sm text-gray-500">Больше товаров нет</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsClient
