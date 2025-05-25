import { create } from "zustand";
import { toast } from "@/components/ui/use-toast";
import type { Product } from "@/types/handler";

interface WishlistState {
  wishlistItems: Product[];
  isLoading: boolean;
  telegramId: number;

  // Methods
  fetchWishlist: () => Promise<void>;
  toggleWishlistItem: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  setTelegramId: (id: number) => void;
}

// API endpoint constants
const API_BASE = "/api";

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  wishlistItems: [],
  isLoading: false,
  telegramId: 1524783641, // Default Telegram ID

  fetchWishlist: async () => {
    const { telegramId } = get();
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_BASE}/wishlist`, {
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();

      // Check if we have results and at least one wishlist
      if (data.results && data.results.length > 0) {
        // Get the first wishlist's products
        const products = data.results[0].products || [];
        set({ wishlistItems: products });
      } else {
        set({ wishlistItems: [] });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список желаний",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlistItem: async (productId: number) => {
    const { telegramId } = get();
    set({ isLoading: true });

    try {
      // Create form data for the request
      const formData = new FormData();
      formData.append("product_id", productId.toString());

      // Call the API to toggle wishlist status
      const response = await fetch(`${API_BASE}/wishlist/add`, {
        method: "POST",
        headers: {
          "X-Telegram-ID": telegramId.toString(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to toggle wishlist item");
      }

      const data = await response.json();

      // Update the wishlist items based on the response
      if (data.wishlist && data.wishlist.products) {
        set({ wishlistItems: data.wishlist.products });

        // Show appropriate toast message
        if (data.is_liked) {
          toast({
            title: "Добавлено в избранное",
            description: "Товар добавлен в список желаний",
          });
        } else {
          toast({
            title: "Удалено из избранного",
            description: "Товар удален из списка желаний",
          });
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist item:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении списка желаний",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  isInWishlist: (productId: number) => {
    return get().wishlistItems.some((item) => item.id === productId);
  },

  clearWishlist: () => {
    set({ wishlistItems: [] });
  },

  setTelegramId: (id: number) => {
    set({ telegramId: id });
  },
}));

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/api";
// import { toast } from "@/components/ui/use-toast";

// interface WishlistState {
//   wishlistItems: Product[];
//   isLoading: boolean;
//   telegramId: number;

//   // Methods
//   fetchWishlist: () => Promise<void>;
//   toggleWishlistItem: (productId: number) => Promise<void>;
//   isInWishlist: (productId: number) => boolean;
//   clearWishlist: () => void;
//   setTelegramId: (id: number) => void;
// }

// export const useWishlistStore = create<WishlistState>()(
//   persist(
//     (set, get) => ({
//       wishlistItems: [],
//       isLoading: false,
//       telegramId: 1524783641, // Default Telegram ID

//       fetchWishlist: async () => {
//         const { telegramId } = get();
//         set({ isLoading: true });

//         try {
//           const wishlistData = await getWishlist(telegramId);

//           if (wishlistData && wishlistData.products) {
//             set({ wishlistItems: wishlistData.products });
//           }
//         } catch (error) {
//           console.error("Error fetching wishlist:", error);
//           toast({
//             title: "Ошибка",
//             description: "Не удалось загрузить список желаний",
//             variant: "destructive",
//           });
//         } finally {
//           set({ isLoading: false });
//         }
//       },

//       toggleWishlistItem: async (productId: number) => {
//         const { telegramId, wishlistItems } = get();
//         set({ isLoading: true });

//         const isInWishlist = wishlistItems.some(
//           (item) => item.id === productId
//         );

//         try {
//           if (isInWishlist) {
//             // Remove from wishlist
//             const response = await removeFromWishlist(telegramId, productId);

//             if (response.success) {
//               set({
//                 wishlistItems: wishlistItems.filter(
//                   (item) => item.id !== productId
//                 ),
//               });

//               toast({
//                 title: "Удалено из избранного",
//                 description: "Товар удален из списка желаний",
//               });
//             } else {
//               toast({
//                 title: "Ошибка",
//                 description:
//                   response.message ||
//                   "Не удалось удалить товар из списка желаний",
//                 variant: "destructive",
//               });
//             }
//           } else {
//             // Add to wishlist
//             const response = await addToWishlist(telegramId, productId);

//             if (response.success && response.wishlist) {
//               // Find the product in the wishlist response
//               const addedProduct = response.wishlist.products.find(
//                 (p) => p.id === productId
//               );

//               if (addedProduct) {
//                 set({
//                   wishlistItems: [...wishlistItems, addedProduct],
//                 });

//                 toast({
//                   title: "Добавлено в избранное",
//                   description: "Товар добавлен в список желаний",
//                 });
//               }
//             } else {
//               toast({
//                 title: "Ошибка",
//                 description:
//                   response.message ||
//                   "Не удалось добавить товар в список желаний",
//                 variant: "destructive",
//               });
//             }
//           }
//         } catch (error) {
//           console.error("Error toggling wishlist item:", error);
//           toast({
//             title: "Ошибка",
//             description: "Произошла ошибка при обновлении списка желаний",
//             variant: "destructive",
//           });
//         } finally {
//           set({ isLoading: false });
//         }
//       },

//       isInWishlist: (productId: number) => {
//         return get().wishlistItems.some((item) => item.id === productId);
//       },

//       clearWishlist: () => {
//         set({ wishlistItems: [] });
//       },

//       setTelegramId: (id: number) => {
//         set({ telegramId: id });
//       },
//     }),
//     {
//       name: "wishlist-storage", // name of the item in localStorage
//       partialize: (state) => ({
//         wishlistItems: state.wishlistItems,
//         telegramId: state.telegramId,
//       }),
//     }
//   )
// );
