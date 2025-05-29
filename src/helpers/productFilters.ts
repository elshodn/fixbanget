export interface FiltersState {
  availability: string
  priceRange: { min: string; max: string }
  selectedSizes: string[]
  selectedBrands: string[]
  sizeSystem: string
  sortBy: string
  searchQuery: string
  deliveryRange: { min: string; max: string }
  category: string
  subcategory: string
}

export interface ActiveFilters {
  size: boolean
  price: boolean
  brand: boolean
  delivery: boolean
}

export const sortOptions = [
  { value: "popular", label: "По популярности" },
  { value: "price", label: "Цена: по возрастанию" },
  { value: "-price", label: "Цена: по убыванию" },
  { value: "newest", label: "Новинки" },
  { value: "rating", label: "По рейтингу" },
]

export const getFiltersFromUrl = (searchParams: URLSearchParams, initialCategory?: string): FiltersState => {
  return {
    availability: searchParams.get("availability") || "",
    priceRange: {
      min: searchParams.get("price_min") || "",
      max: searchParams.get("price_max") || "",
    },
    selectedSizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    selectedBrands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    sizeSystem: searchParams.get("size_system") || "EU",
    sortBy: searchParams.get("sort") || "popular",
    searchQuery: searchParams.get("search") || "",
    deliveryRange: {
      min: searchParams.get("delivery_min") || "",
      max: searchParams.get("delivery_max") || "",
    },
    category: searchParams.get("categories") || initialCategory || "",
    subcategory: searchParams.get("subcategories") || "",
  }
}

export const createUrlParams = (filters: FiltersState, gender: IGender): URLSearchParams => {
  const params = new URLSearchParams()

  // FAQAT URL uchun gender qo'shamiz
  if (gender) {
    params.set("gender", gender === "female" ? "2" : "1")
  }

  // Boshqa filter'larni qo'shamiz
  if (filters.availability) params.set("availability", filters.availability)
  if (filters.priceRange.min) params.set("price_min", filters.priceRange.min)
  if (filters.priceRange.max) params.set("price_max", filters.priceRange.max)
  if (filters.selectedSizes.length > 0) params.set("sizes", filters.selectedSizes.join(","))
  if (filters.selectedBrands.length > 0) params.set("brands", filters.selectedBrands.join(","))
  if (filters.sizeSystem !== "EU") params.set("size_system", filters.sizeSystem)
  if (filters.sortBy !== "popular") params.set("sort", filters.sortBy)
  if (filters.searchQuery) params.set("search", filters.searchQuery)
  if (filters.deliveryRange.min) params.set("delivery_min", filters.deliveryRange.min)
  if (filters.deliveryRange.max) params.set("delivery_max", filters.deliveryRange.max)
  if (filters.category) params.set("categories", filters.category)
  if (filters.subcategory) params.set("subcategories", filters.subcategory)

  return params
}

export const calculateActiveFilters = (filters: FiltersState): ActiveFilters => {
  return {
    size: filters.selectedSizes.length > 0,
    price: Boolean(filters.priceRange.min || filters.priceRange.max),
    brand: filters.selectedBrands.length > 0,
    delivery: Boolean(filters.deliveryRange.min || filters.deliveryRange.max),
  }
}

export const buildFilterParams = (
  filters: FiltersState,
  sizes: any[],
  brands: any[],
  page: number,
  pageSize: number,
) => {
  const params: any = {
    page,
    page_size: pageSize,
  }

  // GENDER'ni bu yerda qo'shmaymiz! fetchFilterProducts da qo'shiladi

  if (filters.category) params.category = Number(filters.category)
  if (filters.subcategory) params.subcategory = Number(filters.subcategory)
  if (filters.searchQuery) params.search = filters.searchQuery
  if (filters.priceRange.min) params.price_min = Number(filters.priceRange.min)
  if (filters.priceRange.max) params.price_max = Number(filters.priceRange.max)
  if (filters.deliveryRange.min) params.delivery_min = Number(filters.deliveryRange.min)
  if (filters.deliveryRange.max) params.delivery_max = Number(filters.deliveryRange.max)

  // Size filtering
  if (filters.selectedSizes.length > 0 && sizes.length > 0) {
    const sizeIds = sizes.filter((size) => filters.selectedSizes.includes(size.name)).map((size) => size.id)
    if (sizeIds.length > 0) {
      params.size = sizeIds.join(",")
    }
  }

  // Brand filtering
  if (filters.selectedBrands.length > 0 && brands.length > 0) {
    const brandIds = brands.filter((brand) => filters.selectedBrands.includes(brand.name)).map((brand) => brand.id)
    if (brandIds.length > 0) {
      params.brand = brandIds.join(",")
    }
  }

  // Sorting
  if (filters.sortBy && filters.sortBy !== "popular") {
    params.ordering = filters.sortBy
  }

  console.log("🔧 Built filter params:", params)
  return params
}

// Helper functions for updating filters
export const updatePriceRange = (filters: FiltersState, name: string, value: string): FiltersState => {
  return {
    ...filters,
    priceRange: {
      ...filters.priceRange,
      [name]: value,
    },
  }
}

export const updateDeliveryRange = (filters: FiltersState, name: string, value: string): FiltersState => {
  return {
    ...filters,
    deliveryRange: {
      ...filters.deliveryRange,
      [name]: value,
    },
  }
}

export const toggleSize = (filters: FiltersState, size: string): FiltersState => {
  const selectedSizes = filters.selectedSizes.includes(size)
    ? filters.selectedSizes.filter((s) => s !== size)
    : [...filters.selectedSizes, size]

  return {
    ...filters,
    selectedSizes,
  }
}

export const toggleBrand = (filters: FiltersState, brand: string): FiltersState => {
  const selectedBrands = filters.selectedBrands.includes(brand)
    ? filters.selectedBrands.filter((b) => b !== brand)
    : [...filters.selectedBrands, brand]

  return {
    ...filters,
    selectedBrands,
  }
}

export const setSizeSystem = (filters: FiltersState, system: string): FiltersState => {
  return {
    ...filters,
    sizeSystem: system,
  }
}

export const setSortBy = (filters: FiltersState, sortBy: string): FiltersState => {
  return {
    ...filters,
    sortBy,
  }
}

export const setSearchQuery = (filters: FiltersState, searchQuery: string): FiltersState => {
  return {
    ...filters,
    searchQuery,
  }
}

// Clear functions
export const clearSizeFilter = (filters: FiltersState): FiltersState => {
  return {
    ...filters,
    selectedSizes: [],
  }
}

export const clearPriceFilter = (filters: FiltersState): FiltersState => {
  return {
    ...filters,
    priceRange: { min: "", max: "" },
  }
}

export const clearBrandFilter = (filters: FiltersState): FiltersState => {
  return {
    ...filters,
    selectedBrands: [],
  }
}

export const clearDeliveryFilter = (filters: FiltersState): FiltersState => {
  return {
    ...filters,
    deliveryRange: { min: "", max: "" },
  }
}

// Size system helpers
export const filterSizesBySystem = (sizes: any[], sizeSystem: string) => {
  return sizes.filter((size) => {
    if (sizeSystem === "EU" && size.size_eu !== null) return true
    if (sizeSystem === "US" && size.size_us !== null) return true
    if (sizeSystem === "UK" && size.size_uk !== null) return true
    if (sizeSystem === "FR" && size.size_fr !== null) return true
    return size.size_eu === null && size.size_us === null && size.size_uk === null && size.size_fr === null
  })
}

export const getSizeDisplayName = (item: any, sizeSystem: string): string => {
  switch (sizeSystem) {
    case "US":
      return item.size_us || item.name
    case "UK":
      return item.size_uk || item.name
    case "FR":
      return item.size_fr || item.name
    case "EU":
    default:
      return item.size_eu || item.name
  }
}
