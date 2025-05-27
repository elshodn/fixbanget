"use client"

import { ProductCarousel } from "@/components/Carousel"
import { PurchasedProduct, useViewedProductsStore, ViewedProduct } from "@/stores/viewed-product-store"

export function ViewedProductsCarousel({products, title }:{products?: ViewedProduct[] | PurchasedProduct[], title?: string}) {

  // Convert viewed products to Product format for ProductCarousel
  const formattedProducts = (products ?? []).map((product) => ({
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

  return <ProductCarousel title={title} product={formattedProducts} />
}
