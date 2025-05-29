"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import {
  type FiltersState,
  type ActiveFilters,
  getFiltersFromUrl,
  createUrlParams,
  calculateActiveFilters,
  buildFilterParams,
  updatePriceRange,
  updateDeliveryRange,
  toggleSize,
  toggleBrand,
  setSizeSystem,
  setSortBy,
  setSearchQuery,
  clearSizeFilter,
  clearPriceFilter,
  clearBrandFilter,
  clearDeliveryFilter,
} from "@/helpers/productFilters"
import { fetchFilterProducts } from "@/lib/api"


interface UseProductFiltersProps {
  initialCategory?: string
  gender: IGender
  sizes: any[]
  brands: any[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  setTotalCount: React.Dispatch<React.SetStateAction<number>>
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export const useProductFilters = ({
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
}: UseProductFiltersProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initialRenderRef = useRef(true)
  const initialParamsProcessedRef = useRef(false)

  const [filters, setFilters] = useState<FiltersState>(() => getFiltersFromUrl(searchParams, initialCategory))

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    size: false,
    price: false,
    brand: false,
    delivery: false,
  })

  // Debounced values
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 500)
  const debouncedPriceMin = useDebounce(filters.priceRange.min, 500)
  const debouncedPriceMax = useDebounce(filters.priceRange.max, 500)
  const debouncedDeliveryMin = useDebounce(filters.deliveryRange.min, 500)
  const debouncedDeliveryMax = useDebounce(filters.deliveryRange.max, 500)

  // URL yangilash
  const updateUrl = useCallback(() => {
    if (initialRenderRef.current) return

    const params = createUrlParams(filters, gender)
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newUrl, { scroll: false })
  }, [filters, pathname, router, gender])

  // Apply filters
  const applyFilters = useCallback(
    async (currentPage = 1, resetProducts = false) => {
      if (resetProducts) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      try {
        const filterParams = buildFilterParams(filters, sizes, brands, currentPage, 12)
        console.log("Filter params being sent:", filterParams) // Debug log

        const response = await fetchFilterProducts(filterParams, gender)
        console.log("API response:", response) // Debug log

        if (resetProducts) {
          setProducts(response?.results ? response.results.flat() : [])
        } else {
          setProducts((prevProducts) => [...prevProducts, ...(response?.results ? response.results.flat() : [])])
        }

        setTotalCount(response?.count || 0)
        setHasMore(response?.next !== null)
      } catch (error) {
        console.error("Error applying filters:", error)
        if (resetProducts) {
          setProducts([])
        }
      } finally {
        if (resetProducts) {
          setIsLoading(false)
        } else {
          setIsLoadingMore(false)
        }
      }
    },
    [filters, sizes, brands, gender, setProducts, setIsLoading, setIsLoadingMore, setHasMore, setTotalCount],
  )

  // Initial params processing
  useEffect(() => {
    if (!initialParamsProcessedRef.current && sizes.length > 0 && brands.length > 0) {
      const initialFilters = getFiltersFromUrl(searchParams, initialCategory)
      setFilters(initialFilters)
      initialParamsProcessedRef.current = true
    }
  }, [searchParams, initialCategory, sizes.length, brands.length])

  // Update active filters
  useEffect(() => {
    setActiveFilters(calculateActiveFilters(filters))
  }, [filters])

  // Apply filters when debounced values change
  useEffect(() => {
    // Skip if initial render or if sizes/brands not loaded yet
    if (initialRenderRef.current || sizes.length === 0 || brands.length === 0) {
      if (initialRenderRef.current) {
        initialRenderRef.current = false
      }
      return
    }

    setPage(1)
    setProducts([])
    applyFilters(1, true)
    updateUrl()
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
    gender,
    sizes.length,
    brands.length,
  ])

  // Filter handlers
  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => updatePriceRange(prev, name, value))
  }, [])

  const handleDeliveryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => updateDeliveryRange(prev, name, value))
  }, [])

  const handleToggleSize = useCallback((size: string) => {
    setFilters((prev) => toggleSize(prev, size))
  }, [])

  const handleToggleBrand = useCallback((brand: string) => {
    setFilters((prev) => toggleBrand(prev, brand))
  }, [])

  const handleSetSizeSystem = useCallback((system: string) => {
    setFilters((prev) => setSizeSystem(prev, system))
  }, [])

  const handleSortChange = useCallback((sortOption: string) => {
    setFilters((prev) => setSortBy(prev, sortOption))
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setFilters((prev) => setSearchQuery(prev, query))
  }, [])

  // Clear handlers
  const handleClearSizeFilter = useCallback(() => {
    setFilters((prev) => clearSizeFilter(prev))
  }, [])

  const handleClearPriceFilter = useCallback(() => {
    setFilters((prev) => clearPriceFilter(prev))
  }, [])

  const handleClearBrandFilter = useCallback(() => {
    setFilters((prev) => clearBrandFilter(prev))
  }, [])

  const handleClearDeliveryFilter = useCallback(() => {
    setFilters((prev) => clearDeliveryFilter(prev))
  }, [])

  return {
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
    handleClearBrandFilter,
    handleClearDeliveryFilter,
  }
}
