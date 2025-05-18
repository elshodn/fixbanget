"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { brendNames, products, sizeArray } from "@/lib/mockData";
import { ProductCarouselCard } from "../../components/Carousel/ProductCarouselCard";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ArrowDownWideNarrow,
  Filter,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SearchPage = () => {
  type FiltersState = {
    availability: string;
    priceRange: {
      min: string;
      max: string;
    };
    selectedSizes: string[];
    selectedBrands: string[];
    sizeSystem: string;
    sortBy: string;
    searchQuery: string;
  };

  const [filters, setFilters] = useState<FiltersState>({
    availability: "",
    priceRange: {
      min: "",
      max: "",
    },
    selectedSizes: [],
    selectedBrands: [],
    sizeSystem: "EU",
    sortBy: "popular",
    searchQuery: "",
  });

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);

      return () => window.removeEventListener("resize", checkIfMobile);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  interface PriceChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  interface PriceChangeHandler {
    (e: PriceChangeEvent): void;
  }

  const handlePriceChange: PriceChangeHandler = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setFilters((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [name]: value,
        },
      }));
    }
  };

  interface ToggleSizeFn {
    (size: string): void;
  }

  const toggleSize: ToggleSizeFn = (size) => {
    setFilters((prev: FiltersState) => {
      const newSizes = prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s: string) => s !== size)
        : [...prev.selectedSizes, size];

      return {
        ...prev,
        selectedSizes: newSizes,
      };
    });
  };

  interface ToggleBrandFn {
    (brand: string): void;
  }

  const toggleBrand: ToggleBrandFn = (brand) => {
    setFilters((prev: FiltersState) => {
      const newBrands = prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b: string) => b !== brand)
        : [...prev.selectedBrands, brand];

      return {
        ...prev,
        selectedBrands: newBrands,
      };
    });
  };

  interface SizeSystem {
    system: string;
  }

  const setSizeSystem = (system: string) => {
    setFilters((prev: FiltersState) => ({
      ...prev,
      sizeSystem: system,
    }));
  };

  interface SortOption {
    value: string;
    label: string;
  }

  const handleSortChange = (sortOption: SortOption["value"]) => {
    setFilters((prev: FiltersState) => ({
      ...prev,
      sortBy: sortOption,
    }));
  };

  const applyFilters = () => {
    let result = [...products];

    // Availability filter
    if (filters.availability === "in-stock") {
      result = result.filter(
        (product) => "inStock" in product && (product as any).inStock
      );
    } else if (filters.availability === "pre-order") {
      result = result.filter(
        (product) => "inStock" in product && !(product as any).inStock
      );
    }

    // Price range filter
    if (filters.priceRange.min) {
      const minPrice = parseFloat(filters.priceRange.min);
      result = result.filter((product) => product.price >= minPrice);
    }
    if (filters.priceRange.max) {
      const maxPrice = parseFloat(filters.priceRange.max);
      result = result.filter((product) => product.price <= maxPrice);
    }

    // Size filter
    if (filters.selectedSizes.length > 0) {
      result = result.filter((product) =>
        product.sizes.some((size) =>
          filters.selectedSizes.includes(String(size))
        )
      );
    }

    // Brand filter
    if (filters.selectedBrands.length > 0) {
      result = result.filter((product) =>
        filters.selectedBrands.includes(
          (product as any).brand ?? product.name.split(" ")[0]
        )
      );
    }

    // Search query filter
    if (filters.searchQuery) {
      const searchQuery = filters.searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const sortOptions = [
    { value: "popular", label: "Популярные" },
    { value: "price-asc", label: "Цена (по возрастанию)" },
    { value: "price-desc", label: "Цена (по убыванию)" },
  ];

  // Render filters sidebar
  const renderFilters = () => (
    <div
      className={`${
        isMobile
          ? showMobileFilters
            ? "fixed inset-0 z-50 bg-white p-4 overflow-y-auto flex flex-col"
            : "hidden"
          : "w-3/12 pr-8"
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
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchQuery: e.target.value,
                  }))
                }
                className="w-11/12 border-none rounded focus-visible:outline-none focus-visible:ring-0 shadow-none focus:shadow-none"
              />
            </div>
          </>
        )}

        {/*
                <h1 className='text-base text-[#222222] font-medium'>Из наличия или под заказ?</h1>
                <p className='text-sm font-normal text-[#535353]'>Под заказ кроссовки будут дешевле, а из наличия приедут сегодня или завтра</p>
                 <div className="flex justify-center mb-8">
                    <div className="flex w-full border gap-0.5 rounded bg-[#F2F2F2] p-2 my-5">
                        <Button
                            className={clsx(
                                "rounded px-5 py-5 text-sm font-bold w-1/2",
                                filters.availability === "in-stock"
                                    ? "bg-white text-black shadow hover:bg-white"
                                    : "bg-transparent text-black shadow-none hover:bg-transparent"
                            )}
                            onClick={() => setFilters(prev => ({
                                ...prev,
                                availability: prev.availability === "in-stock" ? "" : "in-stock"
                            }))}
                        >
                            🚀 Из наличия
                        </Button>
                        <Button
                            className={clsx(
                                "rounded px-5 py-5 text-sm font-bold w-1/2",
                                filters.availability === "pre-order"
                                    ? "bg-white text-black shadow hover:bg-white"
                                    : "bg-transparent text-black shadow-none hover:bg-transparent"
                            )}
                            onClick={() => setFilters(prev => ({
                                ...prev,
                                availability: prev.availability === "pre-order" ? "" : "pre-order"
                            }))}
                        >
                            🤑 Под заказ
                        </Button>
                    </div>
                </div> */}

        <div className="my-6">
          <h1 className="text-base text-[#222222] font-medium mb-3">
            Цена, RUB
          </h1>
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
                      : "bg-transparent text-black shadow-none hover:bg-transparent"
                  )}
                  onClick={() => setSizeSystem(system)}
                >
                  {system}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-x-12 gap-y-2 w-max mx-auto">
              {sizeArray.map((item) => (
                <div key={item.size} className="flex items-center gap-3">
                  <Checkbox
                    className="rounded-full border border-[#848484]"
                    checked={filters.selectedSizes.includes(String(item.size))}
                    onCheckedChange={() => toggleSize(String(item.size))}
                  />
                  <p className="text-[#222222]">{item.size}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-base text-[#222222] font-medium mb-3">Бренды</h1>
          <div className="space-y-3 grid grid-cols-2 md:grid-cols-1">
            {brendNames.map((brand) => (
              <div key={brand.name} className="flex items-center gap-3">
                <Checkbox
                  checked={filters.selectedBrands.includes(brand.name)}
                  onCheckedChange={() => toggleBrand(brand.name)}
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
            onClick={() => setShowMobileFilters(false)}
          >
            Поиск
          </Button>
          <div className="h-1 w-full bg-[#EDEDED]"></div>
          <Button
            className="w-full my-4 py-6 text-[#FF385C] border border-[#FF385C] bg-white mb-2"
            onClick={() => router.push("/login")}
          >
            Авторизоваться
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="my-10 font-medium">
      <p className="mx-5 text-[#8D8D9A]">
        <Link href="/">Главная</Link> / продукт
      </p>
      <h1 className="p-5 text-3xl">Мужские кроссовки и кеды</h1>
      <div className="flex p-5 flex-col md:flex-row">
        {/* Filters Sidebar - Desktop */}
        {!isMobile && renderFilters()}

        {/* Products Section */}
        <div className={`${isMobile ? "w-full" : "w-9/12"}`}>
          {/* Mobile Filter Button */}
          {isMobile && (
            <>
              <div className="mb-4 flex justify-between items-center scrollbar-hide">
                <div className="relative">
                  <Button
                    className="flex items-center gap-2  text-black bg-transparent "
                    onClick={() => {
                      const dropdown = document.getElementById("sort-dropdown");
                      if (dropdown) dropdown.classList.toggle("hidden");
                    }}
                  >
                    <ArrowDownWideNarrow size={18} />
                    {
                      sortOptions.find((opt) => opt.value === filters.sortBy)
                        ?.label
                    }
                  </Button>
                  <div
                    id="sort-dropdown"
                    className="hidden absolute sm:right-0 left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filters.sortBy === option.value
                            ? "bg-gray-100 text-black"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          handleSortChange(option.value);
                          const dropdown =
                            document.getElementById("sort-dropdown");
                          if (dropdown) dropdown.classList.add("hidden");
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
                <Button className="rounded-xl cursor-pointer text-xs h-5 bg-[#F2F2F2] text-black">
                  Размер
                </Button>
                <Button className="rounded-xl cursor-pointer text-xs h-5 bg-[#F2F2F2] text-black">
                  Цена
                </Button>
                <Button className="rounded-xl cursor-pointer text-xs h-5 bg-[#F2F2F2] text-black">
                  Бренд
                </Button>
                <Button className="rounded-xl cursor-pointer text-xs h-5 bg-[#F2F2F2] text-black">
                  Срок доставки
                </Button>
              </div>
            </>
          )}

          {/* Mobile Filters - Overlay */}
          {isMobile && showMobileFilters && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
          )}
          {isMobile && showMobileFilters && renderFilters()}

          <div className="mb-6 group relative">
            {!isMobile && (
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <Button className="rounded-xl cursor-pointer text-base bg-[#F2F2F2] text-black">
                    Размер
                  </Button>
                  <Button className="rounded-xl cursor-pointer text-base bg-[#F2F2F2] text-black">
                    Цена
                  </Button>
                  <Button className="rounded-xl cursor-pointer text-base bg-[#F2F2F2] text-black">
                    Бренд
                  </Button>
                  <Button className="rounded-xl cursor-pointer text-base bg-[#F2F2F2] text-black">
                    Срок доставки
                  </Button>
                </div>
                {!isMobile && (
                  <div className="relative">
                    <Button
                      className="flex items-center gap-2 bg-transparent text-black border-2"
                      onClick={() => {
                        const dropdown =
                          document.getElementById("sort-dropdown");
                        if (dropdown) dropdown.classList.toggle("hidden");
                      }}
                    >
                      <ArrowDownWideNarrow size={18} />
                      {
                        sortOptions.find((opt) => opt.value === filters.sortBy)
                          ?.label
                      }
                    </Button>
                    <div
                      id="sort-dropdown"
                      className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            filters.sortBy === option.value
                              ? "bg-gray-100 text-black"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            handleSortChange(option.value);
                            const dropdown =
                              document.getElementById("sort-dropdown");
                            if (dropdown) dropdown.classList.add("hidden");
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between py-4">
              <div>
                <p className="text-base font-bold">Быстрая доставка ⚡</p>
                <p className="text-sm text-gray-600">
                  Товары с доставкой за 0-2 дня или самовывоз
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center rounded-2xl h-12 gap-1"
              >
                Все <ChevronRight className="text-4xl" />
              </Button>
            </div>

            <div className="w-full px-1">
              <Swiper
                slidesPerView={isMobile ? 2 : 6}
                spaceBetween={10}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                modules={[Navigation, Autoplay]}
                navigation={{
                  nextEl: ".product-carousel-next",
                  prevEl: ".product-carousel-prev",
                }}
              >
                {products.map((product) => (
                  <SwiperSlide className="mb-3" key={product.id}>
                    <ProductCarouselCard
                      key={product.id}
                      product={{ ...product, title: product.name }}
                    />{" "}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button
              style={{ boxShadow: "0px 1px 7px 0px rgba(0,0,0,0.3)" }}
              className="product-carousel-prev cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ArrowLeft />
            </button>
            <button
              style={{ boxShadow: "0px 1px 7px 0px rgba(0,0,0,0.3)" }}
              className="product-carousel-next cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ArrowRight />
            </button>
          </div>
          <hr className="mb-6" />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Товары не найдены</h3>
              <p className="text-gray-500">
                Попробуйте изменить параметры фильтрации
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
            >
              {filteredProducts.map((product) => (
                <ProductCarouselCard
                  key={product.id}
                  product={{ ...product, title: product.name }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
