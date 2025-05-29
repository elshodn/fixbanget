"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { fetchFilterProducts, fetchBrands, fetchSizes, type FilterParams } from "@/lib/api"


interface UseProductDataProps {
  initialCategory?: string
  gender: IGender
}

interface UseProductDataReturn {
  products: Product[]
  featuredProducts: Product[]
  brands: any[]
  sizes: any[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  totalCount: number
  page: number
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  setTotalCount: React.Dispatch<React.SetStateAction<number>>
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export const useProductData = ({ initialCategory, gender }: UseProductDataProps): UseProductDataReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)

  // Brands ni useMemo bilan cache qilish
  const memoizedBrands = useMemo(() => {
    return brands
  }, [brands])

  // Sizes ni useMemo bilan cache qilish
  const memoizedSizes = useMemo(() => {
    return sizes
  }, [sizes])

  // Featured products ni useMemo bilan cache qilish
  const memoizedFeaturedProducts = useMemo(() => {
    return featuredProducts
  }, [featuredProducts])

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        // Parallel API calls for better performance
        const [brandsData, sizesData, featuredData] = await Promise.all([
          fetchBrands(),
          fetchSizes(),
          fetchFilterProducts({ is_featured: true }, gender),
        ])

        setBrands(brandsData || [])
        setSizes(sizesData || [])
        setFeaturedProducts(featuredData?.results ? featuredData.results.flat() : [])

        // Initial products fetch
        const filterParams: FilterParams = {
          page: 1,
          page_size: 12,
        }

        if (initialCategory) {
          filterParams.category = Number(initialCategory)
        }

        const productsData = await fetchFilterProducts(filterParams, gender)
        setProducts(productsData?.results ? productsData.results.flat() : [])
        setTotalCount(productsData?.count || 0)
        setHasMore(productsData?.next !== null)
      } catch (error) {
        console.error("Error fetching initial data:", error)
        // Set empty arrays on error
        setBrands([])
        setSizes([])
        setFeaturedProducts([])
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [initialCategory, gender])

  return {
    products,
    featuredProducts: memoizedFeaturedProducts,
    brands: memoizedBrands,
    sizes: memoizedSizes,
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
  }
}
