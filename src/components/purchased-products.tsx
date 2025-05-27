"use client"

import { ProductCarousel } from "@/components/Carousel"
import { useViewedProductsStore } from "@/stores/viewed-product-store"

export function PurchasedProductsCarousel() {
  const { getPurchasedProducts } = useViewedProductsStore()
  const purchasedProducts = getPurchasedProducts()

  if (purchasedProducts.length === 0) {
    return null
  }

  // Convert purchased products to Product format for ProductCarousel
  const formattedProducts = purchasedProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    discount_price: product.discount_price,
    images: [{ id: 1, image: product.image, alt_text: product.name }],
    brand: { name: product.brand_name },
    shipping_methods: [{ min_days: 1, max_days: 3 }], // Default shipping
    is_liked: false, // Default value
    // Add other required Product fields with default values
    description: "",
    subcategory: { id: 1, name: "", slug: "", description: "", gender: { id: 1, name: "", slug: "" } },
    gender: { id: 1, name: "", slug: "" },
    season: { id: 1, name: "", description: "", created_at: "" },
    materials: [],
    is_featured: false,
    is_active: true,
    created_at: "",
    updated_at: "",
    variants: [],
    likes_count: 0,
  }))

  return <ProductCarousel title="Ранее купленные" product={formattedProducts} />
}
