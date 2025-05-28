import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ViewedProduct {
  id: number
  name: string
  slug: string
  price: string
  discount_price: string | null
  image: string
  brand_name: string
  viewed_at: number
}

export  interface PurchasedProduct {
  id: number
  name: string
  slug: string
  price: string
  discount_price: string | null
  image: string
  brand_name: string
  purchased_at: number
  order_id: number
}

interface ViewedProductsState {
  viewedProducts: ViewedProduct[]
  purchasedProducts: PurchasedProduct[]
  addViewedProduct: (product: any) => void
  addPurchasedProduct: (product: any, orderId: number) => void
  getViewedProducts: () => ViewedProduct[]
  getPurchasedProducts: () => PurchasedProduct[]
  clearViewedProducts: () => void
  clearPurchasedProducts: () => void
}

const MAX_VIEWED_PRODUCTS = 20
const MAX_PURCHASED_PRODUCTS = 15

export const useViewedProductsStore = create<ViewedProductsState>()(
  persist(
    (set, get) => ({
      viewedProducts: [],
      purchasedProducts: [],

      addViewedProduct: (product) => {
        const currentProducts = get().viewedProducts
        const existingIndex = currentProducts.findIndex((p) => p.id === product.id)

        const viewedProduct: ViewedProduct = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          discount_price: product.discount_price,
          image: product.images?.[0]?.image || "",
          brand_name: product.brand?.name || "",
          viewed_at: Date.now(),
        }

        let updatedProducts: ViewedProduct[]

        if (existingIndex >= 0) {
          updatedProducts = [...currentProducts.filter((p) => p.id !== product.id), viewedProduct]
        } else {
          updatedProducts = [...currentProducts, viewedProduct]
        }

        if (updatedProducts.length > MAX_VIEWED_PRODUCTS) {
          updatedProducts = updatedProducts.slice(-MAX_VIEWED_PRODUCTS)
        }

        set({ viewedProducts: updatedProducts })
      },

      addPurchasedProduct: (product, orderId) => {
        const currentProducts = get().purchasedProducts
        const existingIndex = currentProducts.findIndex((p) => p.id === product.id)

        const purchasedProduct: PurchasedProduct = {
          id: product.id,
          name: product.name || product.product_name,
          slug: product.slug || product.product_slug || `product-${product.id}`,
          price: product.price || product.product_price,
          discount_price: product.discount_price || product.product_discount_price,
          image: product.image || product.product_image || product.images?.[0]?.image || "",
          brand_name: product.brand?.name || product.brand_name || "",
          purchased_at: Date.now(),
          order_id: orderId,
        }

        let updatedProducts: PurchasedProduct[]

        if (existingIndex >= 0) {
          updatedProducts = [...currentProducts.filter((p) => p.id !== product.id), purchasedProduct]
        } else {
          updatedProducts = [...currentProducts, purchasedProduct]
        }

        if (updatedProducts.length > MAX_PURCHASED_PRODUCTS) {
          updatedProducts = updatedProducts.slice(-MAX_PURCHASED_PRODUCTS)
        }

        set({ purchasedProducts: updatedProducts })
      },

      getViewedProducts: () => {
        return get().viewedProducts.slice().reverse()
      },

      getPurchasedProducts: () => {
        return get().purchasedProducts.slice().reverse()
      },

      clearViewedProducts: () => {
        set({ viewedProducts: [] })
      },

      clearPurchasedProducts: () => {
        set({ purchasedProducts: [] })
      },
    }),
    {
      name: "viewed-products-storage",
      version: 1,
    },
  ),
)
