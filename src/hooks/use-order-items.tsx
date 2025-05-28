"use client"

import { useState, useEffect } from "react"

// Your existing interfaces (keeping them for reference)
export interface OrderItem {
  id: number
  product: {
    id: number
    name: string
    slug: string
    description: string
    price: string
    discount_price: string | null
    subcategory: {
      id: number
      name: string
      slug: string
      description: string
      gender: {
        id: number
        name: string
        slug: string
      }
    }
    brand: {
      id: number
      name: string
      slug: string
      description: string
      logo: string | null
      created_at: string
    }
    gender: {
      id: number
      name: string
      slug: string
    }
    season: {
      id: number
      name: string
      description: string
      created_at: string
    }
    materials: Array<{
      id: number
      name: string
      description: string
      created_at: string
    }>
    shipping_methods: Array<{
      id: number
      name: string
      delivery_type: string
      min_days: number
      max_days: number
      price: string
      is_active: boolean
      description: string
      estimated_delivery_time: string
      free_shipping_threshold: number | null
      available_time_slots: any[]
      max_weight: number | null
      tracking_available: boolean
      insurance_available: boolean
      insurance_cost: string
      created_at: string
      updated_at: string
    }>
    is_featured: boolean
    is_active: boolean
    created_at: string
    updated_at: string
    images: Array<{
      id: number
      image: string
      is_primary: boolean
    }>
    variants: Array<{
      id: number
      color: number
      color_name: string
      color_hex: string
      size: number
      size_name: string
      size_eu: string | null
      size_us: string | null
      size_uk: string | null
      size_fr: string | null
      stock: number
    }>
    likes_count: number
    is_liked: boolean
  }
  product_name: string
  product_image: string | null
  quantity: number
  price: string
  total_price: string
  created_at: string
}

export interface Order {
  id: number
  items: OrderItem[]
  status: string
  status_display: string
  created_at: string
  // ... other order properties
}

// Custom hook for managing order items
export function useOrderItems() {
  const [allOrderItems, setAllOrderItems] = useState<OrderItem[]>([])
  const [uniqueProducts, setUniqueProducts] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Function to extract all order items from orders
  const extractOrderItems = (orders: Order[]): OrderItem[] => {
    const items: OrderItem[] = []

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        items.push(...order.items)
      }
    })

    return items
  }

  // Function to get unique products (remove duplicates based on product ID)
  const getUniqueProducts = (items: OrderItem[]): OrderItem[] => {
    const uniqueMap = new Map<number, OrderItem>()

    items.forEach((item) => {
      const productId = item.product.id

      // Keep the most recent purchase of each product
      if (!uniqueMap.has(productId) || new Date(item.created_at) > new Date(uniqueMap.get(productId)!.created_at)) {
        uniqueMap.set(productId, item)
      }
    })

    return Array.from(uniqueMap.values())
  }

  // Function to update order items from orders data
  const updateOrderItems = (orders: Order[]) => {
    setIsLoading(true)

    try {
      const extractedItems = extractOrderItems(orders)
      const uniqueItems = getUniqueProducts(extractedItems)

      setAllOrderItems(extractedItems)
      setUniqueProducts(uniqueItems)
    } catch (error) {
      console.error("Error processing order items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get products by category
  const getProductsByCategory = (categoryName: string): OrderItem[] => {
    return uniqueProducts.filter((item) =>
      item.product.subcategory.name.toLowerCase().includes(categoryName.toLowerCase()),
    )
  }

  // Function to get products by brand
  const getProductsByBrand = (brandName: string): OrderItem[] => {
    return uniqueProducts.filter((item) => item.product.brand.name.toLowerCase().includes(brandName.toLowerCase()))
  }

  // Function to get recently purchased items (last 30 days)
  const getRecentlyPurchased = (): OrderItem[] => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return allOrderItems.filter((item) => new Date(item.created_at) >= thirtyDaysAgo)
  }

  // Function to get most purchased products
  const getMostPurchased = (limit = 10): Array<{ item: OrderItem; count: number }> => {
    const productCounts = new Map<number, { item: OrderItem; count: number }>()

    allOrderItems.forEach((item) => {
      const productId = item.product.id
      if (productCounts.has(productId)) {
        productCounts.get(productId)!.count += item.quantity
      } else {
        productCounts.set(productId, { item, count: item.quantity })
      }
    })

    return Array.from(productCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  return {
    // State
    allOrderItems,
    uniqueProducts,
    isLoading,

    // Functions
    updateOrderItems,
    getProductsByCategory,
    getProductsByBrand,
    getRecentlyPurchased,
    getMostPurchased,

    // Computed values
    totalUniqueProducts: uniqueProducts.length,
    totalItemsPurchased: allOrderItems.reduce((sum, item) => sum + item.quantity, 0),
    totalAmountSpent: allOrderItems.reduce((sum, item) => sum + Number.parseFloat(item.total_price), 0),
  }
}

// Example usage component
export default function PreviouslyPurchasedProducts() {
  const {
    uniqueProducts,
    isLoading,
    updateOrderItems,
    getRecentlyPurchased,
    getMostPurchased,
    totalUniqueProducts,
    totalItemsPurchased,
  } = useOrderItems()

  // Example: Update items when orders are fetched
  useEffect(() => {
    // This would be called when you have orders data
    // updateOrderItems(ordersFromAPI)
  }, [])

  if (isLoading) {
    return <div>Загрузка ранее купленных товаров...</div>
  }

  const recentItems = getRecentlyPurchased()
  const mostPurchased = getMostPurchased(5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ранее купленные товары</h2>
        <div className="text-sm text-gray-600">
          {totalUniqueProducts} уникальных товаров • {totalItemsPurchased} всего покупок
        </div>
      </div>

      {/* Recently purchased */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Недавние покупки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.slice(0, 6).map((item) => (
            <div key={`${item.id}-${item.created_at}`} className="border rounded-lg p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3">
                {item.product_image && (
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <h4 className="font-medium text-sm">{item.product_name}</h4>
              <p className="text-xs text-gray-600">{item.product.brand.name}</p>
              <p className="text-sm font-semibold mt-1">{item.price} ₽</p>
            </div>
          ))}
        </div>
      </div>

      {/* Most purchased */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Часто покупаемые</h3>
        <div className="space-y-3">
          {mostPurchased.map(({ item, count }) => (
            <div key={item.product.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-lg">
                {item.product_image && (
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.product_name}</h4>
                <p className="text-sm text-gray-600">{item.product.brand.name}</p>
                <p className="text-xs text-gray-500">Куплено {count} раз</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{item.price} ₽</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All unique products */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Все купленные товары</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {uniqueProducts.map((item) => (
            <div key={item.product.id} className="border rounded-lg p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3">
                {item.product_image && (
                  <img
                    src={item.product_image || "/placeholder.svg"}
                    alt={item.product_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <h4 className="font-medium text-sm">{item.product_name}</h4>
              <p className="text-xs text-gray-600">{item.product.brand.name}</p>
              <p className="text-sm font-semibold mt-1">{item.price} ₽</p>
              <button className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                Купить снова
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
