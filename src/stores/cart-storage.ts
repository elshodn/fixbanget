import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartStorageItem {
  id: number
  product_id: number
  product_name: string
  product_slug: string
  product_image: string
  quantity: number
  price: number
  total_price: number
  variant_details: {
    id: number
    color: {
      id: number
      name: string
      hex_code: string
    }
    size: {
      id: number
      name: string
    }
  }
  timestamp: number
}

interface CartStorageState {
  items: CartStorageItem[]
  customerInfo: {
    name: string
    phone: string
    countryCode: string
    selectedBranch: number | null
  }
  addItem: (item: Omit<CartStorageItem, "timestamp">) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  setCustomerInfo: (info: Partial<CartStorageState["customerInfo"]>) => void
  getItemsCount: () => number
  getTotalPrice: () => number
  syncWithServer: (serverCart: any) => void
}

export const useCartStorage = create<CartStorageState>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: {
        name: "",
        phone: "",
        countryCode: "+998",
        selectedBranch: null,
      },

      addItem: (item) => {
        const timestamp = Date.now()
        const existingItemIndex = get().items.findIndex(
          (existingItem) =>
            existingItem.product_id === item.product_id && existingItem.variant_details.id === item.variant_details.id,
        )

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          set((state) => ({
            items: state.items.map((existingItem, index) =>
              index === existingItemIndex
                ? {
                    ...existingItem,
                    quantity: existingItem.quantity + item.quantity,
                    total_price: (existingItem.quantity + item.quantity) * item.price,
                    timestamp,
                  }
                : existingItem,
            ),
          }))
        } else {
          // Add new item
          set((state) => ({
            items: [...state.items, { ...item, timestamp }],
          }))
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  total_price: quantity * item.price,
                  timestamp: Date.now(),
                }
              : item,
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      setCustomerInfo: (info) => {
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info },
        }))
      },

      getItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.total_price, 0)
      },

      syncWithServer: (serverCart) => {
        if (!serverCart || !serverCart.items) return

        const serverItems: CartStorageItem[] = serverCart.items.map((item: any) => ({
          id: item.id,
          product_id: item.product,
          product_name: item.product_name,
          product_slug: item.product_slug,
          product_image: item.product_images?.[0]?.image || "",
          quantity: item.quantity,
          price: Number(item.product_price),
          total_price: item.total_price,
          variant_details: item.variant_details,
          timestamp: Date.now(),
        }))

        set({ items: serverItems })
      },
    }),
    {
      name: "cart-storage",
      version: 1,
    },
  ),
)
