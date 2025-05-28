"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { ArrowDownWideNarrow, Filter, Search, Loader, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  fetchFilterProducts,
  fetchBrands,
  fetchSizes,
  type FilterParams,
} from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductCarouselCard } from "@/components/Carousel/ProductCarouselCard";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useGender } from "@/hooks/use-gender";

const ProductsClient = ({ initialCategory }: { initialCategory?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialRenderRef = useRef(true);
  const initialParamsProcessedRef = useRef(false);

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
    deliveryRange: {
      min: string;
      max: string;
    };
    category?: string;
    subcategory?: string;
  };

  // URL-dan filtrlarni olish
  const getInitialFiltersFromUrl = (): FiltersState => {
    const categoryFromUrl = searchParams.get("categories");
    const subcategoryFromUrl = searchParams.get("subcategories");

    return {
      availability: searchParams.get("availability") || "",
      priceRange: {
        min: searchParams.get("price_min") || "",
        max: searchParams.get("price_max") || "",
      },
      selectedSizes: searchParams.get("sizes")?.split(",") || [],
      selectedBrands: searchParams.get("brands")?.split(",") || [],
      sizeSystem: searchParams.get("size_system") || "EU",
      sortBy: searchParams.get("sort") || "popular",
      searchQuery: searchParams.get("search") || "",
      deliveryRange: {
        min: searchParams.get("delivery_min") || "",
        max: searchParams.get("delivery_max") || "",
      },
      category: categoryFromUrl || initialCategory || "",
      subcategory: subcategoryFromUrl || "",
    };
  };

  const [filters, setFilters] = useState<FiltersState>(
    getInitialFiltersFromUrl
  );

  // Active filter states
  const [activeFilters, setActiveFilters] = useState({
    size: false,
    price: false,
    brand: false,
    delivery: false,
  });

  // Debounced values for inputs
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);
  const debouncedPriceMin = useDebounce(filters.priceRange.min, 500);
  const debouncedPriceMax = useDebounce(filters.priceRange.max, 500);
  const debouncedDeliveryMin = useDebounce(filters.deliveryRange.min, 500);
  const debouncedDeliveryMax = useDebounce(filters.deliveryRange.max, 500);

  const { gender, toggleGender } = useGender();

  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 12;

  // Intersection observer for infinite scroll
  const [loadMoreRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>(
    {
      rootMargin: "200px",
    }
  );

  // URL-ni yangilash funksiyasi
  const updateUrl = useCallback(() => {
    // Agar birinchi render bo'lsa, URL-ni o'zgartirmaymiz
    if (initialRenderRef.current) {
      return;
    }

    const params = new URLSearchParams();

    // Barcha filtrlarni URL-ga qo'shish
    if (filters.availability) params.set("availability", filters.availability);
    if (filters.priceRange.min) params.set("price_min", filters.priceRange.min);
    if (filters.priceRange.max) params.set("price_max", filters.priceRange.max);
    if (filters.selectedSizes.length > 0)
      params.set("sizes", filters.selectedSizes.join(","));
    if (filters.selectedBrands.length > 0)
      params.set("brands", filters.selectedBrands.join(","));
    if (filters.sizeSystem !== "EU")
      params.set("size_system", filters.sizeSystem);
    if (filters.sortBy !== "popular") params.set("sort", filters.sortBy);
    if (filters.searchQuery) params.set("search", filters.searchQuery);
    if (filters.deliveryRange.min)
      params.set("delivery_min", filters.deliveryRange.min);
    if (filters.deliveryRange.max)
      params.set("delivery_max", filters.deliveryRange.max);
    if (filters.category) params.set("categories", filters.category);
    if (filters.subcategory) params.set("subcategories", filters.subcategory);

    // Gender parametrini bir marta qo'shamiz
    params.set("gender", gender);

    // URL-ni yangilash
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.push(newUrl, { scroll: false });
  }, [filters, pathname, router, gender]);

  // Boshlang'ich URL parametrlarini saqlash
  useEffect(() => {
    if (!initialParamsProcessedRef.current) {
      // Boshlang'ich URL parametrlarini olish
      const initialFilters = getInitialFiltersFromUrl();
      setFilters(initialFilters);
      initialParamsProcessedRef.current = true;
    }
  }, [searchParams]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch all products
        const filterParams: FilterParams = {
          page: 1,
          page_size: PAGE_SIZE,
        };

        if (filters.category) {
          filterParams.category = Number(filters.category);
        }

        if (filters.subcategory) {
          filterParams.subcategory = Number(filters.subcategory);
        }

        const productsData = await fetchFilterProducts(filterParams, gender);
        setProducts(productsData.results.flat());
        setTotalCount(productsData.count);
        setHasMore(productsData.next !== null);

        // Fetch featured products
        const featuredData = await fetchFilterProducts(
          { is_featured: true },
          gender
        );
        setFeaturedProducts(featuredData.results.flat());

        // Fetch brands and sizes for filters
        const brandsData = await fetchBrands();
        setBrands(brandsData);

        const sizesData = await fetchSizes();
        setSizes(sizesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // Check if mobile
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);

      return () => window.removeEventListener("resize", checkIfMobile);
    }
  }, [filters.category, filters.subcategory, gender]);

  // URL o'zgarishini kuzatish
  useEffect(() => {
    const handleUrlChange = () => {
      setFilters(getInitialFiltersFromUrl());
    };

    // URL o'zgarganda filtrlarni yangilash
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // Update active filters based on filter state
  useEffect(() => {
    setActiveFilters({
      size: filters.selectedSizes.length > 0,
      price: filters.priceRange.min !== "" || filters.priceRange.max !== "",
      brand: filters.selectedBrands.length > 0,
      delivery:
        filters.deliveryRange.min !== "" || filters.deliveryRange.max !== "",
    });
  }, [filters]);

  // Apply filters when debounced values change
  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
    setProducts([]);
    applyFilters(1, true);

    // URL-ni yangilash
    updateUrl();

    // Birinchi render tugadi
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }
  }, [
    debouncedSearchQuery,
    debouncedPriceMin,
    debouncedPriceMax,
    debouncedDeliveryMin,
    debouncedDeliveryMax,
    filters.selectedSizes,
    filters.selectedBrands,
    filters.sortBy,
    filters.availability,
    filters.sizeSystem,
    filters.category,
    filters.subcategory,
    updateUrl,
    gender,
  ]);

  // Load more products when scrolling to the bottom
  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading && !isLoadingMore) {
      loadMoreProducts();
    }
  }, [isIntersecting, hasMore, isLoading, isLoadingMore]);

  // Load more products function
  const loadMoreProducts = async () => {
    if (!hasMore || isLoadingMore) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      await applyFilters(nextPage, false);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Update the applyFilters function to handle pagination
  const applyFilters = async (currentPage = 1, resetProducts = false) => {
    if (resetProducts) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const filterParams: FilterParams = {
        page: currentPage,
        page_size: PAGE_SIZE,
      };

      // Category
      if (filters.category) {
        filterParams.category = Number(filters.category);
      }

      // Subcategory
      if (filters.subcategory) {
        filterParams.subcategory = Number(filters.subcategory);
      }

      // Price range
      if (filters.priceRange.min) {
        filterParams.price_min = Number.parseInt(filters.priceRange.min);
      }
      if (filters.priceRange.max) {
        filterParams.price_max = Number.parseInt(filters.priceRange.max);
      }

      // Delivery range
      if (filters.deliveryRange.min) {
        filterParams.delivery_min = Number.parseInt(filters.deliveryRange.min);
      }
      if (filters.deliveryRange.max) {
        filterParams.delivery_max = Number.parseInt(filters.deliveryRange.max);
      }

      // Sizes - handle different size systems
      if (filters.selectedSizes.length > 0) {
        // Get the selected sizes with their details
        const selectedSizeObjects = sizes.filter((size) =>
          filters.selectedSizes.includes(size.name)
        );

        // Determine which size parameter to use based on the selected system
        if (filters.sizeSystem === "EU") {
          const euSizes = selectedSizeObjects
            .filter((size) => size.size_eu !== null)
            .map((size) => size.size_eu);

          if (euSizes.length > 0) {
            filterParams.size_eu = euSizes.join(",");
          }
        } else if (filters.sizeSystem === "US") {
          const usSizes = selectedSizeObjects
            .filter((size) => size.size_us !== null)
            .map((size) => size.size_us);

          if (usSizes.length > 0) {
            filterParams.size_us = usSizes.join(",");
          }
        } else if (filters.sizeSystem === "UK") {
          const ukSizes = selectedSizeObjects
            .filter((size) => size.size_uk !== null)
            .map((size) => size.size_uk);

          if (ukSizes.length > 0) {
            filterParams.size_uk = ukSizes.join(",");
          }
        } else if (filters.sizeSystem === "FR") {
          const frSizes = selectedSizeObjects
            .filter((size) => size.size_fr !== null)
            .map((size) => size.size_fr);

          if (frSizes.length > 0) {
            filterParams.size_fr = frSizes.join(",");
          }
        }

        // For letter sizes (S, M, L, etc.), always include them by name
        const letterSizes = selectedSizeObjects
          .filter(
            (size) =>
              size.size_eu === null &&
              size.size_us === null &&
              size.size_uk === null &&
              size.size_fr === null
          )
          .map((size) => size.name);

        if (letterSizes.length > 0) {
          filterParams.size = letterSizes.join(",");
        }
      }

      // Brands
      if (filters.selectedBrands.length > 0) {
        const brandIds = brands
          .filter((brand) => filters.selectedBrands.includes(brand.name))
          .map((brand) => brand.id);

        if (brandIds.length > 0) {
          filterParams.brand = brandIds;
        }
      }

      // Search query
      if (filters.searchQuery) {
        filterParams.search = filters.searchQuery;
      }

      // Availability
      if (filters.availability === "in-stock") {
        filterParams.in_stock = true;
      }

      // Sorting
      switch (filters.sortBy) {
        case "price-asc":
          filterParams.ordering = "price";
          break;
        case "price-desc":
          filterParams.ordering = "-price";
          break;
        case "popular":
        default:
          filterParams.ordering = "-created_at";
          break;
      }

      const response = await fetchFilterProducts(filterParams, gender);

      if (resetProducts) {
        setProducts(response.results.flat());
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.results.flat(),
        ]);
      }

      setTotalCount(response.count);
      setHasMore(response.next !== null);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      if (resetProducts) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  interface PriceChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  type PriceChangeHandler = (e: PriceChangeEvent) => void;

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

  const handleDeliveryChange: PriceChangeHandler = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      setFilters((prev) => ({
        ...prev,
        deliveryRange: {
          ...prev.deliveryRange,
          [name]: value,
        },
      }));
    }
  };

  type ToggleSizeFn = (size: string) => void;

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

  type ToggleBrandFn = (brand: string) => void;

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

  const setSizeSystem = (system: string) => {
    setFilters((prev: FiltersState) => ({
      ...prev,
      sizeSystem: system,
    }));
  };

  const handleSortChange = (sortOption: string) => {
    setFilters((prev: FiltersState) => ({
      ...prev,
      sortBy: sortOption,
    }));
  };

  // Clear filter functions
  const clearSizeFilter = () => {
    setFilters((prev) => ({
      ...prev,
      selectedSizes: [],
    }));
  };

  const clearPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        min: "",
        max: "",
      },
    }));
  };

  const clearBrandFilter = () => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: [],
    }));
  };

  const clearDeliveryFilter = () => {
    setFilters((prev) => ({
      ...prev,
      deliveryRange: {
        min: "",
        max: "",
      },
    }));
  };

  // Toggle filter visibility
  const [visibleFilter, setVisibleFilter] = useState<string | null>(null);

  const toggleFilterVisibility = (filterName: string) => {
    if (visibleFilter === filterName) {
      setVisibleFilter(null);
    } else {
      setVisibleFilter(filterName);
    }
  };

  const sortOptions = [
    { value: "popular", label: "Популярные" },
    { value: "price-asc", label: "Цена (по возрастанию)" },
    { value: "price-desc", label: "Цена (по убыванию)" },
  ];

  // Update the size system handling to properly filter sizes based on the selected system
  const renderSizes = () => {
    // Filter sizes based on the selected size system
    const filteredSizes = sizes.filter((size) => {
      if (filters.sizeSystem === "EU" && size.size_eu !== null) return true;
      if (filters.sizeSystem === "US" && size.size_us !== null) return true;
      if (filters.sizeSystem === "UK" && size.size_uk !== null) return true;
      if (filters.sizeSystem === "FR" && size.size_fr !== null) return true;

      // For letter sizes (S, M, L, etc.), show them in all systems if they don't have numeric equivalents
      return (
        size.size_eu === null &&
        size.size_us === null &&
        size.size_uk === null &&
        size.size_fr === null
      );
    });

    return (
      <div className="grid grid-cols-3 gap-x-12 gap-y-2 w-max mx-auto">
        {filteredSizes.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Checkbox
              className="rounded-full border border-[#848484]"
              checked={filters.selectedSizes.includes(item.name)}
              onCheckedChange={() => toggleSize(item.name)}
            />
            <p className="text-[#222222]">
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
    );
  };

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

        <div className="my-6">
          <h1 className="text-base text-[#222222] font-medium mb-3">
            Цена, RUB mn
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
            {renderSizes()}
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-base text-[#222222] font-medium mb-3">Бренды</h1>
          <div className="space-y-3 grid grid-cols-2 md:grid-cols-1">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center gap-3">
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
            onClick={() => {
              applyFilters();
              setShowMobileFilters(false);
            }}
          >
            Поиск
          </Button>
          <div className="h-1 w-full bg-[#EDEDED]"></div>
          {/* <Button
            className="w-full my-4 py-6 text-[#FF385C] border border-[#FF385C] bg-white mb-2"
            onClick={() => router.push("/login")}
          >
            Авторизоваться
          </Button> */}
        </div>
      )}
    </div>
  );

  // Render filter content based on visible filter
  const renderFilterContent = () => {
    if (!visibleFilter) return null;

    switch (visibleFilter) {
      case "size":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Размер</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
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
                      : "bg-transparent text-black shadow-none hover:bg-transparent"
                  )}
                  onClick={() => setSizeSystem(system)}
                >
                  {system}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {sizes
                .filter((size) => {
                  if (filters.sizeSystem === "EU" && size.size_eu !== null)
                    return true;
                  if (filters.sizeSystem === "US" && size.size_us !== null)
                    return true;
                  if (filters.sizeSystem === "UK" && size.size_uk !== null)
                    return true;
                  if (filters.sizeSystem === "FR" && size.size_fr !== null)
                    return true;
                  return (
                    size.size_eu === null &&
                    size.size_us === null &&
                    size.size_uk === null &&
                    size.size_fr === null
                  );
                })
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      className="rounded-full border border-[#848484]"
                      checked={filters.selectedSizes.includes(item.name)}
                      onCheckedChange={() => toggleSize(item.name)}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearSizeFilter()}
              >
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
        );
      case "price":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Цена, RUB</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearPriceFilter()}
              >
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
        );
      case "brand":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Бренды</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.selectedBrands.includes(brand.name)}
                    onCheckedChange={() => toggleBrand(brand.name)}
                  />
                  <p className="text-sm">{brand.name}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearBrandFilter()}
              >
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
        );
      case "delivery":
        return (
          <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Срок доставки, дни</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVisibleFilter(null)}
              >
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearDeliveryFilter()}
              >
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="my-10 font-medium">
      <p className="mx-5 text-[#8D8D9A]">
        <Link href="/">Главная</Link> /
        <span onClick={toggleGender}>
          {gender === "female" ? " Женщинам " : " Мужчинам "}{" "}
        </span>
        / продукт
      </p>
      <h1 className="p-5 text-3xl">
        {filters.category
          ? brands.find((brand) => brand.id === Number(filters.category))
              ?.name ||
            sizes.find((size) => size.id === Number(filters.category))?.name ||
            "Товары"
          : "Товары"}
      </h1>
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
                    className="flex items-center gap-2 text-black bg-transparent"
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
                    className="hidden absolute sm:right-0 left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
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
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.size
                      ? "bg-black text-white"
                      : "bg-[#F2F2F2] text-black"
                  )}
                  onClick={() => toggleFilterVisibility("size")}
                >
                  Размер{" "}
                  {activeFilters.size && (
                    <X className="ml-1" size={12} onClick={clearSizeFilter} />
                  )}
                </Button>
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.price
                      ? "bg-black text-white"
                      : "bg-[#F2F2F2] text-black"
                  )}
                  onClick={() => toggleFilterVisibility("price")}
                >
                  Цена{" "}
                  {activeFilters.price && (
                    <X className="ml-1" size={12} onClick={clearPriceFilter} />
                  )}
                </Button>
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.brand
                      ? "bg-black text-white"
                      : "bg-[#F2F2F2] text-black"
                  )}
                  onClick={() => toggleFilterVisibility("brand")}
                >
                  Бренд{" "}
                  {activeFilters.brand && (
                    <X className="ml-1" size={12} onClick={clearBrandFilter} />
                  )}
                </Button>
                <Button
                  className={clsx(
                    "rounded-xl cursor-pointer text-xs h-5",
                    activeFilters.delivery
                      ? "bg-black text-white"
                      : "bg-[#F2F2F2] text-black"
                  )}
                  onClick={() => toggleFilterVisibility("delivery")}
                >
                  Срок доставки{" "}
                  {activeFilters.delivery && (
                    <X
                      className="ml-1"
                      size={12}
                      onClick={clearDeliveryFilter}
                    />
                  )}
                </Button>
              </div>
              {/* Render filter content for mobile */}
              <div className="relative">{renderFilterContent()}</div>
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
                <div className="flex gap-4 relative">
                  <Button
                    className={clsx(
                      "rounded-xl cursor-pointer text-base",
                      activeFilters.size
                        ? "bg-black text-white"
                        : "bg-[#F2F2F2] text-black"
                    )}
                    onClick={() => toggleFilterVisibility("size")}
                  >
                    Размер{" "}
                    {activeFilters.size && (
                      <X className="ml-1" size={16} onClick={clearSizeFilter} />
                    )}
                  </Button>
                  <Button
                    className={clsx(
                      "rounded-xl cursor-pointer text-base",
                      activeFilters.price
                        ? "bg-black text-white"
                        : "bg-[#F2F2F2] text-black"
                    )}
                    onClick={() => toggleFilterVisibility("price")}
                  >
                    Цена{" "}
                    {activeFilters.price && (
                      <X
                        className="ml-1"
                        size={16}
                        onClick={clearPriceFilter}
                      />
                    )}
                  </Button>
                  <Button
                    className={clsx(
                      "rounded-xl cursor-pointer text-base",
                      activeFilters.brand
                        ? "bg-black text-white"
                        : "bg-[#F2F2F2] text-black"
                    )}
                    onClick={() => toggleFilterVisibility("brand")}
                  >
                    Бренд{" "}
                    {activeFilters.brand && (
                      <X
                        className="ml-1"
                        size={16}
                        onClick={clearBrandFilter}
                      />
                    )}
                  </Button>
                  <Button
                    className={clsx(
                      "rounded-xl cursor-pointer text-base",
                      activeFilters.delivery
                        ? "bg-black text-white"
                        : "bg-[#F2F2F2] text-black"
                    )}
                    onClick={() => toggleFilterVisibility("delivery")}
                  >
                    Срок доставки{" "}
                    {activeFilters.delivery && (
                      <X
                        className="ml-1"
                        size={16}
                        onClick={clearDeliveryFilter}
                      />
                    )}
                  </Button>

                  {/* Render filter content for desktop */}
                  {renderFilterContent()}
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
                      className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
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
          </div>
          <hr className="mb-6" />

          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
              >
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <ProductCarouselCard
                      key={product.id + index + Math.random()}
                      product={product}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg text-gray-500">Товары не найдены</p>
                  </div>
                )}
              </div>

              {/* Load more indicator */}
              {products.length > 0 && (
                <div
                  ref={loadMoreRef}
                  className="w-full flex justify-center items-center py-8"
                >
                  {isLoadingMore && (
                    <Loader className="w-6 h-6 animate-spin text-gray-500" />
                  )}
                  {!isLoadingMore && hasMore && (
                    <p className="text-sm text-gray-500">
                      Прокрутите вниз для загрузки дополнительных товаров
                    </p>
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
  );
};

export default ProductsClient;

// "use client";

// import type React from "react";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import clsx from "clsx";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { SwiperSlide, Swiper } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/autoplay";
// import "swiper/css/navigation";
// import {
//   ArrowRight,
//   ArrowLeft,
//   ChevronRight,
//   ArrowDownWideNarrow,
//   Filter,
//   Search,
//   Loader,
//   X,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import {
//   fetchFilterProducts,
//   fetchBrands,
//   fetchSizes,
//   type FilterParams,
// } from "@/lib/api";
// import { useDebounce } from "@/hooks/use-debounce";
// import { ProductCarouselCard } from "@/components/Carousel/ProductCarouselCard";
// import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
// import { useGender } from "@/hooks/use-gender";

// const ProductsClient = ({ initialCategory }: { initialCategory?: string }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const initialRenderRef = useRef(true);
//   const initialParamsProcessedRef = useRef(false);

//   type FiltersState = {
//     availability: string;
//     priceRange: {
//       min: string;
//       max: string;
//     };
//     selectedSizes: string[];
//     selectedBrands: string[];
//     sizeSystem: string;
//     sortBy: string;
//     searchQuery: string;
//     deliveryRange: {
//       min: string;
//       max: string;
//     };
//     category?: string;
//     subcategory?: string;
//   };

//   // URL-dan filtrlarni olish
//   const getInitialFiltersFromUrl = (): FiltersState => {
//     const categoryFromUrl = searchParams.get("categories");
//     const subcategoryFromUrl = searchParams.get("subcategories");

//     return {
//       availability: searchParams.get("availability") || "",
//       priceRange: {
//         min: searchParams.get("price_min") || "",
//         max: searchParams.get("price_max") || "",
//       },
//       selectedSizes: searchParams.get("sizes")?.split(",") || [],
//       selectedBrands: searchParams.get("brands")?.split(",") || [],
//       sizeSystem: searchParams.get("size_system") || "EU",
//       sortBy: searchParams.get("sort") || "popular",
//       searchQuery: searchParams.get("search") || "",
//       deliveryRange: {
//         min: searchParams.get("delivery_min") || "",
//         max: searchParams.get("delivery_max") || "",
//       },
//       category: categoryFromUrl || initialCategory || "",
//       subcategory: subcategoryFromUrl || "",
//     };
//   };

//   const [filters, setFilters] = useState<FiltersState>(
//     getInitialFiltersFromUrl
//   );

//   // Active filter states
//   const [activeFilters, setActiveFilters] = useState({
//     size: false,
//     price: false,
//     brand: false,
//     delivery: false,
//   });

//   // Debounced values for inputs
//   const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);
//   const debouncedPriceMin = useDebounce(filters.priceRange.min, 500);
//   const debouncedPriceMax = useDebounce(filters.priceRange.max, 500);
//   const debouncedDeliveryMin = useDebounce(filters.deliveryRange.min, 500);
//   const debouncedDeliveryMax = useDebounce(filters.deliveryRange.max, 500);

//   const { gender, toggleGender } = useGender();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//   const [brands, setBrands] = useState<any[]>([]);
//   const [sizes, setSizes] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [totalCount, setTotalCount] = useState(0);
//   const PAGE_SIZE = 12;

//   // Intersection observer for infinite scroll
//   const [loadMoreRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>(
//     {
//       rootMargin: "200px",
//     }
//   );

//   // URL-ni yangilash funksiyasi
//   const updateUrl = useCallback(() => {
//     // Agar birinchi render bo'lsa, URL-ni o'zgartirmaymiz
//     if (initialRenderRef.current) {
//       return;
//     }

//     const params = new URLSearchParams();

//     // Barcha filtrlarni URL-ga qo'shish
//     if (filters.availability) params.set("availability", filters.availability);
//     if (filters.priceRange.min) params.set("price_min", filters.priceRange.min);
//     if (filters.priceRange.max) params.set("price_max", filters.priceRange.max);
//     if (filters.selectedSizes.length > 0)
//       params.set("sizes", filters.selectedSizes.join(","));
//     if (filters.selectedBrands.length > 0)
//       params.set("brands", filters.selectedBrands.join(","));
//     if (filters.sizeSystem !== "EU")
//       params.set("size_system", filters.sizeSystem);
//     if (filters.sortBy !== "popular") params.set("sort", filters.sortBy);
//     if (filters.searchQuery) params.set("search", filters.searchQuery);
//     if (filters.deliveryRange.min)
//       params.set("delivery_min", filters.deliveryRange.min);
//     if (filters.deliveryRange.max)
//       params.set("delivery_max", filters.deliveryRange.max);
//     if (filters.category) params.set("categories", filters.category);
//     if (filters.subcategory) params.set("subcategories", filters.subcategory);

//     // URL-ni yangilash
//     const newUrl = params.toString()
//       ? `${pathname}?${params.toString()}`
//       : pathname;
//     router.push(newUrl, { scroll: false });
//   }, [filters, pathname, router, gender]);

//   // Boshlang'ich URL parametrlarini saqlash
//   useEffect(() => {
//     if (!initialParamsProcessedRef.current) {
//       // Boshlang'ich URL parametrlarini olish
//       const initialFilters = getInitialFiltersFromUrl();
//       setFilters(initialFilters);
//       initialParamsProcessedRef.current = true;
//     }
//   }, [searchParams]);

//   // Fetch initial data
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       try {
//         // Fetch all products
//         const filterParams: FilterParams = {
//           page: 1,
//           page_size: PAGE_SIZE,
//         };

//         if (filters.category) {
//           filterParams.category = Number(filters.category);
//         }

//         if (filters.subcategory) {
//           filterParams.subcategory = Number(filters.subcategory);
//         }

//         const productsData = await fetchFilterProducts(filterParams, gender);
//         setProducts(productsData.results.flat());
//         setTotalCount(productsData.count);
//         setHasMore(productsData.next !== null);

//         // Fetch featured products
//         const featuredData = await fetchFilterProducts(
//           { is_featured: true },
//           gender
//         );
//         setFeaturedProducts(featuredData.results.flat());

//         // Fetch brands and sizes for filters
//         const brandsData = await fetchBrands();
//         setBrands(brandsData);

//         const sizesData = await fetchSizes();
//         setSizes(sizesData);
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInitialData();

//     // Check if mobile
//     if (typeof window !== "undefined") {
//       const checkIfMobile = () => {
//         setIsMobile(window.innerWidth < 768);
//       };

//       checkIfMobile();
//       window.addEventListener("resize", checkIfMobile);

//       return () => window.removeEventListener("resize", checkIfMobile);
//     }
//   }, [filters.category, filters.subcategory]);

//   // URL o'zgarishini kuzatish
//   useEffect(() => {
//     const handleUrlChange = () => {
//       setFilters(getInitialFiltersFromUrl());
//     };

//     // URL o'zgarganda filtrlarni yangilash
//     window.addEventListener("popstate", handleUrlChange);
//     return () => window.removeEventListener("popstate", handleUrlChange);
//   }, []);

//   // Update active filters based on filter state
//   useEffect(() => {
//     setActiveFilters({
//       size: filters.selectedSizes.length > 0,
//       price: filters.priceRange.min !== "" || filters.priceRange.max !== "",
//       brand: filters.selectedBrands.length > 0,
//       delivery:
//         filters.deliveryRange.min !== "" || filters.deliveryRange.max !== "",
//     });
//   }, [filters]);

//   // Apply filters when debounced values change
//   useEffect(() => {
//     // Reset pagination when filters change
//     setPage(1);
//     setProducts([]);
//     applyFilters(1, true);

//     // URL-ni yangilash
//     updateUrl();

//     // Birinchi render tugadi
//     if (initialRenderRef.current) {
//       initialRenderRef.current = false;
//     }
//   }, [
//     debouncedSearchQuery,
//     debouncedPriceMin,
//     debouncedPriceMax,
//     debouncedDeliveryMin,
//     debouncedDeliveryMax,
//     filters.selectedSizes,
//     filters.selectedBrands,
//     filters.sortBy,
//     filters.availability,
//     filters.sizeSystem,
//     filters.category,
//     filters.subcategory,
//     updateUrl,
//   ]);

//   // Load more products when scrolling to the bottom
//   useEffect(() => {
//     if (isIntersecting && hasMore && !isLoading && !isLoadingMore) {
//       loadMoreProducts();
//     }
//   }, [isIntersecting, hasMore, isLoading, isLoadingMore]);

//   // Load more products function
//   const loadMoreProducts = async () => {
//     if (!hasMore || isLoadingMore) return;

//     const nextPage = page + 1;
//     setIsLoadingMore(true);

//     try {
//       await applyFilters(nextPage, false);
//       setPage(nextPage);
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   // Update the applyFilters function to handle pagination
//   const applyFilters = async (currentPage = 1, resetProducts = false) => {
//     if (resetProducts) {
//       setIsLoading(true);
//     } else {
//       setIsLoadingMore(true);
//     }

//     try {
//       const filterParams: FilterParams = {
//         page: currentPage,
//         page_size: PAGE_SIZE,
//       };

//       // Category
//       if (filters.category) {
//         filterParams.category = Number(filters.category);
//       }

//       // Subcategory
//       if (filters.subcategory) {
//         filterParams.subcategory = Number(filters.subcategory);
//       }

//       // Price range
//       if (filters.priceRange.min) {
//         filterParams.price_min = Number.parseInt(filters.priceRange.min);
//       }
//       if (filters.priceRange.max) {
//         filterParams.price_max = Number.parseInt(filters.priceRange.max);
//       }

//       // Delivery range
//       if (filters.deliveryRange.min) {
//         filterParams.delivery_min = Number.parseInt(filters.deliveryRange.min);
//       }
//       if (filters.deliveryRange.max) {
//         filterParams.delivery_max = Number.parseInt(filters.deliveryRange.max);
//       }

//       // Sizes - handle different size systems
//       if (filters.selectedSizes.length > 0) {
//         // Get the selected sizes with their details
//         const selectedSizeObjects = sizes.filter((size) =>
//           filters.selectedSizes.includes(size.name)
//         );

//         // Determine which size parameter to use based on the selected system
//         if (filters.sizeSystem === "EU") {
//           const euSizes = selectedSizeObjects
//             .filter((size) => size.size_eu !== null)
//             .map((size) => size.size_eu);

//           if (euSizes.length > 0) {
//             filterParams.size_eu = euSizes.join(",");
//           }
//         } else if (filters.sizeSystem === "US") {
//           const usSizes = selectedSizeObjects
//             .filter((size) => size.size_us !== null)
//             .map((size) => size.size_us);

//           if (usSizes.length > 0) {
//             filterParams.size_us = usSizes.join(",");
//           }
//         } else if (filters.sizeSystem === "UK") {
//           const ukSizes = selectedSizeObjects
//             .filter((size) => size.size_uk !== null)
//             .map((size) => size.size_uk);

//           if (ukSizes.length > 0) {
//             filterParams.size_uk = ukSizes.join(",");
//           }
//         } else if (filters.sizeSystem === "FR") {
//           const frSizes = selectedSizeObjects
//             .filter((size) => size.size_fr !== null)
//             .map((size) => size.size_fr);

//           if (frSizes.length > 0) {
//             filterParams.size_fr = frSizes.join(",");
//           }
//         }

//         // For letter sizes (S, M, L, etc.), always include them by name
//         const letterSizes = selectedSizeObjects
//           .filter(
//             (size) =>
//               size.size_eu === null &&
//               size.size_us === null &&
//               size.size_uk === null &&
//               size.size_fr === null
//           )
//           .map((size) => size.name);

//         if (letterSizes.length > 0) {
//           filterParams.size = letterSizes.join(",");
//         }
//       }

//       // Brands
//       if (filters.selectedBrands.length > 0) {
//         const brandIds = brands
//           .filter((brand) => filters.selectedBrands.includes(brand.name))
//           .map((brand) => brand.id);

//         if (brandIds.length > 0) {
//           filterParams.brand = brandIds;
//         }
//       }

//       // Search query
//       if (filters.searchQuery) {
//         filterParams.search = filters.searchQuery;
//       }

//       // Availability
//       if (filters.availability === "in-stock") {
//         filterParams.in_stock = true;
//       }

//       // Sorting
//       switch (filters.sortBy) {
//         case "price-asc":
//           filterParams.ordering = "price";
//           break;
//         case "price-desc":
//           filterParams.ordering = "-price";
//           break;
//         case "popular":
//         default:
//           filterParams.ordering = "-created_at";
//           break;
//       }

//       const response = await fetchFilterProducts(filterParams, gender);

//       if (resetProducts) {
//         setProducts(response.results.flat());
//       } else {
//         setProducts((prevProducts) => [
//           ...prevProducts,
//           ...response.results.flat(),
//         ]);
//       }

//       setTotalCount(response.count);
//       setHasMore(response.next !== null);
//     } catch (error) {
//       console.error("Error applying filters:", error);
//     } finally {
//       if (resetProducts) {
//         setIsLoading(false);
//       } else {
//         setIsLoadingMore(false);
//       }
//     }
//   };

//   interface PriceChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

//   type PriceChangeHandler = (e: PriceChangeEvent) => void;

//   const handlePriceChange: PriceChangeHandler = (e) => {
//     const { name, value } = e.target;
//     if (value === "" || /^[0-9\b]+$/.test(value)) {
//       setFilters((prev) => ({
//         ...prev,
//         priceRange: {
//           ...prev.priceRange,
//           [name]: value,
//         },
//       }));
//     }
//   };

//   const handleDeliveryChange: PriceChangeHandler = (e) => {
//     const { name, value } = e.target;
//     if (value === "" || /^[0-9\b]+$/.test(value)) {
//       setFilters((prev) => ({
//         ...prev,
//         deliveryRange: {
//           ...prev.deliveryRange,
//           [name]: value,
//         },
//       }));
//     }
//   };

//   type ToggleSizeFn = (size: string) => void;

//   const toggleSize: ToggleSizeFn = (size) => {
//     setFilters((prev: FiltersState) => {
//       const newSizes = prev.selectedSizes.includes(size)
//         ? prev.selectedSizes.filter((s: string) => s !== size)
//         : [...prev.selectedSizes, size];

//       return {
//         ...prev,
//         selectedSizes: newSizes,
//       };
//     });
//   };

//   type ToggleBrandFn = (brand: string) => void;

//   const toggleBrand: ToggleBrandFn = (brand) => {
//     setFilters((prev: FiltersState) => {
//       const newBrands = prev.selectedBrands.includes(brand)
//         ? prev.selectedBrands.filter((b: string) => b !== brand)
//         : [...prev.selectedBrands, brand];

//       return {
//         ...prev,
//         selectedBrands: newBrands,
//       };
//     });
//   };

//   const setSizeSystem = (system: string) => {
//     setFilters((prev: FiltersState) => ({
//       ...prev,
//       sizeSystem: system,
//     }));
//   };

//   const handleSortChange = (sortOption: string) => {
//     setFilters((prev: FiltersState) => ({
//       ...prev,
//       sortBy: sortOption,
//     }));
//   };

//   // Clear filter functions
//   const clearSizeFilter = () => {
//     setFilters((prev) => ({
//       ...prev,
//       selectedSizes: [],
//     }));
//   };

//   const clearPriceFilter = () => {
//     setFilters((prev) => ({
//       ...prev,
//       priceRange: {
//         min: "",
//         max: "",
//       },
//     }));
//   };

//   const clearBrandFilter = () => {
//     setFilters((prev) => ({
//       ...prev,
//       selectedBrands: [],
//     }));
//   };

//   const clearDeliveryFilter = () => {
//     setFilters((prev) => ({
//       ...prev,
//       deliveryRange: {
//         min: "",
//         max: "",
//       },
//     }));
//   };

//   // Toggle filter visibility
//   const [visibleFilter, setVisibleFilter] = useState<string | null>(null);

//   const toggleFilterVisibility = (filterName: string) => {
//     if (visibleFilter === filterName) {
//       setVisibleFilter(null);
//     } else {
//       setVisibleFilter(filterName);
//     }
//   };

//   const sortOptions = [
//     { value: "popular", label: "Популярные" },
//     { value: "price-asc", label: "Цена (по возрастанию)" },
//     { value: "price-desc", label: "Цена (по убыванию)" },
//   ];

//   // Update the size system handling to properly filter sizes based on the selected system
//   const renderSizes = () => {
//     // Filter sizes based on the selected size system
//     const filteredSizes = sizes.filter((size) => {
//       if (filters.sizeSystem === "EU" && size.size_eu !== null) return true;
//       if (filters.sizeSystem === "US" && size.size_us !== null) return true;
//       if (filters.sizeSystem === "UK" && size.size_uk !== null) return true;
//       if (filters.sizeSystem === "FR" && size.size_fr !== null) return true;

//       // For letter sizes (S, M, L, etc.), show them in all systems if they don't have numeric equivalents
//       return (
//         size.size_eu === null &&
//         size.size_us === null &&
//         size.size_uk === null &&
//         size.size_fr === null
//       );
//     });

//     return (
//       <div className="grid grid-cols-3 gap-x-12 gap-y-2 w-max mx-auto">
//         {filteredSizes.map((item) => (
//           <div key={item.id} className="flex items-center gap-3">
//             <Checkbox
//               className="rounded-full border border-[#848484]"
//               checked={filters.selectedSizes.includes(item.name)}
//               onCheckedChange={() => toggleSize(item.name)}
//             />
//             <p className="text-[#222222]">
//               {filters.sizeSystem === "EU" && item.size_eu
//                 ? item.size_eu
//                 : filters.sizeSystem === "US" && item.size_us
//                 ? item.size_us
//                 : filters.sizeSystem === "UK" && item.size_uk
//                 ? item.size_uk
//                 : filters.sizeSystem === "FR" && item.size_fr
//                 ? item.size_fr
//                 : item.name}
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Render filters sidebar
//   const renderFilters = () => (
//     <div
//       className={`${
//         isMobile
//           ? showMobileFilters
//             ? "fixed inset-0 z-50 bg-white p-4 overflow-y-auto flex flex-col"
//             : "hidden"
//           : "w-3/12 pr-8"
//       }`}
//     >
//       <div className="flex-1 overflow-y-auto">
//         {isMobile && (
//           <>
//             <div className="flex justify-between items-center pb-4 mb-3 border-b">
//               <Search size={30} />
//               <Input
//                 type="text"
//                 placeholder="Поиск..."
//                 value={filters.searchQuery}
//                 onChange={(e) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     searchQuery: e.target.value,
//                   }))
//                 }
//                 className="w-11/12 border-none rounded focus-visible:outline-none focus-visible:ring-0 shadow-none focus:shadow-none"
//               />
//             </div>
//           </>
//         )}

//         <div className="my-6">
//           <h1 className="text-base text-[#222222] font-medium mb-3">
//             Цена, RUB mn
//           </h1>
//           <div className="flex items-center gap-3">
//             <div className="flex-1">
//               <Input
//                 type="text"
//                 name="min"
//                 value={filters.priceRange.min}
//                 onChange={handlePriceChange}
//                 placeholder="от 0"
//                 className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//               />
//             </div>
//             <div className="flex-1">
//               <Input
//                 type="text"
//                 name="max"
//                 value={filters.priceRange.max}
//                 onChange={handlePriceChange}
//                 placeholder="до 0"
//                 className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mb-8">
//           <h1 className="text-base text-[#222222] font-medium mb-3">Размер</h1>
//           <div>
//             <div className="flex w-full border gap-0.5 rounded bg-[#F2F2F2] p-2 my-5">
//               {["EU", "US", "UK", "FR"].map((system) => (
//                 <Button
//                   key={system}
//                   className={clsx(
//                     "rounded px-5 py-5 text-sm font-bold w-1/4",
//                     filters.sizeSystem === system
//                       ? "bg-white text-black shadow hover:bg-white"
//                       : "bg-transparent text-black shadow-none hover:bg-transparent"
//                   )}
//                   onClick={() => setSizeSystem(system)}
//                 >
//                   {system}
//                 </Button>
//               ))}
//             </div>
//             {renderSizes()}
//           </div>
//         </div>

//         <div className="mb-8">
//           <h1 className="text-base text-[#222222] font-medium mb-3">Бренды</h1>
//           <div className="space-y-3 grid grid-cols-2 md:grid-cols-1">
//             {brands.map((brand) => (
//               <div key={brand.id} className="flex items-center gap-3">
//                 <Checkbox
//                   checked={filters.selectedBrands.includes(brand.name)}
//                   onCheckedChange={() => toggleBrand(brand.name)}
//                 />
//                 <p className="text-[#222222]">{brand.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {isMobile && (
//         <div className="sticky bottom-0 bg-white pt-4">
//           <Button
//             className="w-full py-6 bg-[#FF385C] text-white mb-2"
//             onClick={() => {
//               applyFilters();
//               setShowMobileFilters(false);
//             }}
//           >
//             Поиск
//           </Button>
//           <div className="h-1 w-full bg-[#EDEDED]"></div>
//           {/* <Button
//             className="w-full my-4 py-6 text-[#FF385C] border border-[#FF385C] bg-white mb-2"
//             onClick={() => router.push("/login")}
//           >
//             Авторизоваться
//           </Button> */}
//         </div>
//       )}
//     </div>
//   );

//   // Render filter content based on visible filter
//   const renderFilterContent = () => {
//     if (!visibleFilter) return null;

//     switch (visibleFilter) {
//       case "size":
//         return (
//           <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-medium">Размер</h3>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 <X size={16} />
//               </Button>
//             </div>
//             <div className="flex w-full border gap-0.5 rounded bg-[#F2F2F2] p-2 mb-3">
//               {["EU", "US", "UK", "FR"].map((system) => (
//                 <Button
//                   key={system}
//                   className={clsx(
//                     "rounded px-3 py-2 text-xs font-bold w-1/4",
//                     filters.sizeSystem === system
//                       ? "bg-white text-black shadow hover:bg-white"
//                       : "bg-transparent text-black shadow-none hover:bg-transparent"
//                   )}
//                   onClick={() => setSizeSystem(system)}
//                 >
//                   {system}
//                 </Button>
//               ))}
//             </div>
//             <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
//               {sizes
//                 .filter((size) => {
//                   if (filters.sizeSystem === "EU" && size.size_eu !== null)
//                     return true;
//                   if (filters.sizeSystem === "US" && size.size_us !== null)
//                     return true;
//                   if (filters.sizeSystem === "UK" && size.size_uk !== null)
//                     return true;
//                   if (filters.sizeSystem === "FR" && size.size_fr !== null)
//                     return true;
//                   return (
//                     size.size_eu === null &&
//                     size.size_us === null &&
//                     size.size_uk === null &&
//                     size.size_fr === null
//                   );
//                 })
//                 .map((item) => (
//                   <div key={item.id} className="flex items-center gap-2">
//                     <Checkbox
//                       className="rounded-full border border-[#848484]"
//                       checked={filters.selectedSizes.includes(item.name)}
//                       onCheckedChange={() => toggleSize(item.name)}
//                     />
//                     <p className="text-sm">
//                       {filters.sizeSystem === "EU" && item.size_eu
//                         ? item.size_eu
//                         : filters.sizeSystem === "US" && item.size_us
//                         ? item.size_us
//                         : filters.sizeSystem === "UK" && item.size_uk
//                         ? item.size_uk
//                         : filters.sizeSystem === "FR" && item.size_fr
//                         ? item.size_fr
//                         : item.name}
//                     </p>
//                   </div>
//                 ))}
//             </div>
//             <div className="flex justify-between mt-3">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => clearSizeFilter()}
//               >
//                 Сбросить
//               </Button>
//               <Button
//                 className="bg-black text-white hover:bg-gray-800"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 Применить
//               </Button>
//             </div>
//           </div>
//         );
//       case "price":
//         return (
//           <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-medium">Цена, RUB</h3>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 <X size={16} />
//               </Button>
//             </div>
//             <div className="flex items-center gap-3 mb-3">
//               <div className="flex-1">
//                 <Input
//                   type="text"
//                   name="min"
//                   value={filters.priceRange.min}
//                   onChange={handlePriceChange}
//                   placeholder="от 0"
//                   className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//                 />
//               </div>
//               <div className="flex-1">
//                 <Input
//                   type="text"
//                   name="max"
//                   value={filters.priceRange.max}
//                   onChange={handlePriceChange}
//                   placeholder="до 0"
//                   className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => clearPriceFilter()}
//               >
//                 Сбросить
//               </Button>
//               <Button
//                 className="bg-black text-white hover:bg-gray-800"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 Применить
//               </Button>
//             </div>
//           </div>
//         );
//       case "brand":
//         return (
//           <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-medium">Бренды</h3>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 <X size={16} />
//               </Button>
//             </div>
//             <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
//               {brands.map((brand) => (
//                 <div key={brand.id} className="flex items-center gap-2">
//                   <Checkbox
//                     checked={filters.selectedBrands.includes(brand.name)}
//                     onCheckedChange={() => toggleBrand(brand.name)}
//                   />
//                   <p className="text-sm">{brand.name}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-between mt-3">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => clearBrandFilter()}
//               >
//                 Сбросить
//               </Button>
//               <Button
//                 className="bg-black text-white hover:bg-gray-800"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 Применить
//               </Button>
//             </div>
//           </div>
//         );
//       case "delivery":
//         return (
//           <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-lg border w-80">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-medium">Срок доставки, дни</h3>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 <X size={16} />
//               </Button>
//             </div>
//             <div className="flex items-center gap-3 mb-3">
//               <div className="flex-1">
//                 <Input
//                   type="text"
//                   name="min"
//                   value={filters.deliveryRange.min}
//                   onChange={handleDeliveryChange}
//                   placeholder="от 0"
//                   className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//                 />
//               </div>
//               <div className="flex-1">
//                 <Input
//                   type="text"
//                   name="max"
//                   value={filters.deliveryRange.max}
//                   onChange={handleDeliveryChange}
//                   placeholder="до 0"
//                   className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-black"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => clearDeliveryFilter()}
//               >
//                 Сбросить
//               </Button>
//               <Button
//                 className="bg-black text-white hover:bg-gray-800"
//                 size="sm"
//                 onClick={() => setVisibleFilter(null)}
//               >
//                 Применить
//               </Button>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="my-10 font-medium">
//       <p className="mx-5 text-[#8D8D9A]">
//         <Link href="/">Главная</Link> /
//         <span onClick={toggleGender}>
//           {gender === "female" ? " Женщинам " : " Мужчинам "}{" "}
//         </span>
//         / продукт
//       </p>
//       <h1 className="p-5 text-3xl">
//         {filters.category
//           ? brands.find((brand) => brand.id === Number(filters.category))
//               ?.name ||
//             sizes.find((size) => size.id === Number(filters.category))?.name ||
//             "Товары"
//           : "Товары"}
//       </h1>
//       <div className="flex p-5 flex-col md:flex-row">
//         {/* Filters Sidebar - Desktop */}
//         {!isMobile && renderFilters()}

//         {/* Products Section */}
//         <div className={`${isMobile ? "w-full" : "w-9/12"}`}>
//           {/* Mobile Filter Button */}
//           {isMobile && (
//             <>
//               <div className="mb-4 flex justify-between items-center scrollbar-hide">
//                 <div className="relative">
//                   <Button
//                     className="flex items-center gap-2 text-black bg-transparent"
//                     onClick={() => {
//                       const dropdown = document.getElementById("sort-dropdown");
//                       if (dropdown) dropdown.classList.toggle("hidden");
//                     }}
//                   >
//                     <ArrowDownWideNarrow size={18} />
//                     {
//                       sortOptions.find((opt) => opt.value === filters.sortBy)
//                         ?.label
//                     }
//                   </Button>
//                   <div
//                     id="sort-dropdown"
//                     className="hidden absolute sm:right-0 left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
//                   >
//                     {sortOptions.map((option) => (
//                       <button
//                         key={option.value}
//                         className={`block w-full text-left px-4 py-2 text-sm ${
//                           filters.sortBy === option.value
//                             ? "bg-gray-100 text-black"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                         onClick={() => {
//                           handleSortChange(option.value);
//                           const dropdown =
//                             document.getElementById("sort-dropdown");
//                           if (dropdown) dropdown.classList.add("hidden");
//                         }}
//                       >
//                         {option.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <Button
//                   className="flex items-center gap-2 text-black bg-white"
//                   onClick={() => setShowMobileFilters(true)}
//                 >
//                   <Filter size={18} />
//                   Фильтры
//                 </Button>
//               </div>
//               <div className="flex gap-4 justify-center overflow-auto ps-5">
//                 <Button
//                   className={clsx(
//                     "rounded-xl cursor-pointer text-xs h-5",
//                     activeFilters.size
//                       ? "bg-black text-white"
//                       : "bg-[#F2F2F2] text-black"
//                   )}
//                   onClick={() => toggleFilterVisibility("size")}
//                 >
//                   Размер{" "}
//                   {activeFilters.size && (
//                     <X className="ml-1" size={12} onClick={clearSizeFilter} />
//                   )}
//                 </Button>
//                 <Button
//                   className={clsx(
//                     "rounded-xl cursor-pointer text-xs h-5",
//                     activeFilters.price
//                       ? "bg-black text-white"
//                       : "bg-[#F2F2F2] text-black"
//                   )}
//                   onClick={() => toggleFilterVisibility("price")}
//                 >
//                   Цена{" "}
//                   {activeFilters.price && (
//                     <X className="ml-1" size={12} onClick={clearPriceFilter} />
//                   )}
//                 </Button>
//                 <Button
//                   className={clsx(
//                     "rounded-xl cursor-pointer text-xs h-5",
//                     activeFilters.brand
//                       ? "bg-black text-white"
//                       : "bg-[#F2F2F2] text-black"
//                   )}
//                   onClick={() => toggleFilterVisibility("brand")}
//                 >
//                   Бренд{" "}
//                   {activeFilters.brand && (
//                     <X className="ml-1" size={12} onClick={clearBrandFilter} />
//                   )}
//                 </Button>
//                 <Button
//                   className={clsx(
//                     "rounded-xl cursor-pointer text-xs h-5",
//                     activeFilters.delivery
//                       ? "bg-black text-white"
//                       : "bg-[#F2F2F2] text-black"
//                   )}
//                   onClick={() => toggleFilterVisibility("delivery")}
//                 >
//                   Срок доставки{" "}
//                   {activeFilters.delivery && (
//                     <X
//                       className="ml-1"
//                       size={12}
//                       onClick={clearDeliveryFilter}
//                     />
//                   )}
//                 </Button>
//               </div>
//               {/* Render filter content for mobile */}
//               <div className="relative">{renderFilterContent()}</div>
//             </>
//           )}

//           {/* Mobile Filters - Overlay */}
//           {isMobile && showMobileFilters && (
//             <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
//           )}
//           {isMobile && showMobileFilters && renderFilters()}

//           <div className="mb-6 group relative">
//             {!isMobile && (
//               <div className="flex justify-between">
//                 <div className="flex gap-4 relative">
//                   <Button
//                     className={clsx(
//                       "rounded-xl cursor-pointer text-base",
//                       activeFilters.size
//                         ? "bg-black text-white"
//                         : "bg-[#F2F2F2] text-black"
//                     )}
//                     onClick={() => toggleFilterVisibility("size")}
//                   >
//                     Размер{" "}
//                     {activeFilters.size && (
//                       <X className="ml-1" size={16} onClick={clearSizeFilter} />
//                     )}
//                   </Button>
//                   <Button
//                     className={clsx(
//                       "rounded-xl cursor-pointer text-base",
//                       activeFilters.price
//                         ? "bg-black text-white"
//                         : "bg-[#F2F2F2] text-black"
//                     )}
//                     onClick={() => toggleFilterVisibility("price")}
//                   >
//                     Цена{" "}
//                     {activeFilters.price && (
//                       <X
//                         className="ml-1"
//                         size={16}
//                         onClick={clearPriceFilter}
//                       />
//                     )}
//                   </Button>
//                   <Button
//                     className={clsx(
//                       "rounded-xl cursor-pointer text-base",
//                       activeFilters.brand
//                         ? "bg-black text-white"
//                         : "bg-[#F2F2F2] text-black"
//                     )}
//                     onClick={() => toggleFilterVisibility("brand")}
//                   >
//                     Бренд{" "}
//                     {activeFilters.brand && (
//                       <X
//                         className="ml-1"
//                         size={16}
//                         onClick={clearBrandFilter}
//                       />
//                     )}
//                   </Button>
//                   <Button
//                     className={clsx(
//                       "rounded-xl cursor-pointer text-base",
//                       activeFilters.delivery
//                         ? "bg-black text-white"
//                         : "bg-[#F2F2F2] text-black"
//                     )}
//                     onClick={() => toggleFilterVisibility("delivery")}
//                   >
//                     Срок доставки{" "}
//                     {activeFilters.delivery && (
//                       <X
//                         className="ml-1"
//                         size={16}
//                         onClick={clearDeliveryFilter}
//                       />
//                     )}
//                   </Button>

//                   {/* Render filter content for desktop */}
//                   {renderFilterContent()}
//                 </div>
//                 {!isMobile && (
//                   <div className="relative">
//                     <Button
//                       className="flex items-center gap-2 bg-transparent text-black border-2"
//                       onClick={() => {
//                         const dropdown =
//                           document.getElementById("sort-dropdown");
//                         if (dropdown) dropdown.classList.toggle("hidden");
//                       }}
//                     >
//                       <ArrowDownWideNarrow size={18} />
//                       {
//                         sortOptions.find((opt) => opt.value === filters.sortBy)
//                           ?.label
//                       }
//                     </Button>
//                     <div
//                       id="sort-dropdown"
//                       className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20"
//                     >
//                       {sortOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           className={`block w-full text-left px-4 py-2 text-sm ${
//                             filters.sortBy === option.value
//                               ? "bg-gray-100 text-black"
//                               : "text-gray-700 hover:bg-gray-100"
//                           }`}
//                           onClick={() => {
//                             handleSortChange(option.value);
//                             const dropdown =
//                               document.getElementById("sort-dropdown");
//                             if (dropdown) dropdown.classList.add("hidden");
//                           }}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//           <hr className="mb-6" />

//           {isLoading && products.length === 0 ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader className="w-8 h-8 animate-spin text-gray-500" />
//             </div>
//           ) : (
//             <>
//               <div
//                 className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
//               >
//                 {products.length > 0 ? (
//                   products.map((product, index) => (
//                     <ProductCarouselCard
//                       key={product.id + index + Math.random()}
//                       product={product}
//                     />
//                   ))
//                 ) : (
//                   <div className="col-span-full text-center py-10">
//                     <p className="text-lg text-gray-500">Товары не найдены</p>
//                   </div>
//                 )}
//               </div>

//               {/* Load more indicator */}
//               {products.length > 0 && (
//                 <div
//                   ref={loadMoreRef}
//                   className="w-full flex justify-center items-center py-8"
//                 >
//                   {isLoadingMore && (
//                     <Loader className="w-6 h-6 animate-spin text-gray-500" />
//                   )}
//                   {!isLoadingMore && hasMore && (
//                     <p className="text-sm text-gray-500">
//                       Прокрутите вниз для загрузки дополнительных товаров
//                     </p>
//                   )}
//                   {!isLoadingMore && !hasMore && products.length > 0 && (
//                     <p className="text-sm text-gray-500">Больше товаров нет</p>
//                   )}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductsClient;
