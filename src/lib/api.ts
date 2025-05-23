import { getGenderId } from "./utils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.118:8000/api/v1";

/**
 *
 * @param gender
 * @returns Promise<Product[]>
 * @description Fetches products based on the selected
 */

export async function fetchCategories(gender: IGender): Promise<Category[]> {
  try {
    const genderID = gender === "male" ? 1 : 2;
    const response = await fetch(
      `${API_BASE_URL}/categories?gender=${genderID}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Category> = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 *
 * @param gender
 * @returns Promise<Product[]>
 * @description Fetches products based on the selected
 */
export async function fetchSubCategories(
  gender: IGender
): Promise<Subcategory[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/subcategories?gender=${getGenderId(gender)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Subcategory> = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * get all brands
 * @returns Promise<Brand[]>
 */
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/brands?page_size=100`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse<Brand> = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * Fetches products based on the selected category and
 *@returns Promise<Product[]>
 * @description Fetches products based on the selected
 */

export async function fetchProductsBySlug(slug: string): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Product = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse<Product> = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export interface FilterParams {
  gender?: number;
  brand?: number | number[];
  category?: number;
  subcategory?: number;
  delivery_max?: number;
  delivery_min?: number;
  has_discount?: boolean;
  is_featured?: boolean;
  in_stock?: boolean;
  page_size?: number;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  price_max?: number;
  price_min?: number;
  search?: string;
  size?: string | number;
  size_eu?: string | number;
  size_uk?: string | number;
  size_us?: string | number;
  size_fr?: string | number;
  slug?: string;
}

export async function fetchFilterProducts(
  filters: FilterParams = {},
  gender: IGender
): Promise<ApiResponse<Product>> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add all filter parameters to the query
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
          queryParams.append("gender", getGenderId(gender).toString());
        } else {
          queryParams.append(key, value.toString());
          queryParams.append("gender", getGenderId(gender).toString());
        }
      }
    });

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    const url = `${API_BASE_URL}/products/${queryString}`;

    const response = await fetch(url, {
      headers: {
        // "X-Telegram-ID": "1524783641",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Product> = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
}

// Sizes API endpoint path should be updated to match the actual endpoint
export async function fetchSizes(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sizes/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
}
export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  cart_item?: CartItem;
}
/**
 * Add a product to the cart
 * @param telegramId - User's Telegram ID
 * @param productId - Product ID to add to cart
 * @param quantity - Quantity of the product
 * @returns Promise with cart response
 */
export async function addToCart(
  telegramId: number,
  productId: number,
  quantity: number
): Promise<CartResponse> {
  try {
    // telegramId, productId va quantity ni tekshirish
    if (!telegramId || !productId || !quantity) {
      throw new Error("telegramId, productId yoki quantity kiritilmagan");
    }

    // FormData yaratish
    const formData = new URLSearchParams();
    formData.append("product_id", productId.toString());
    formData.append("quantity", quantity.toString());

    // API so'rov
    const response = await fetch(`${API_BASE_URL}/cart/add/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": String(telegramId), // Stringga aylantirish
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(), // FormData'ni to'g'ri formatda yuborish
    });

    // Javobni JSON sifatida olish
    const data = await response.json();

    // Agar javob muvaffaqiyatsiz bo'lsa
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP xato: ${response.status}`,
      };
    }

    // Muvaffaqiyatli javob
    return {
      success: true,
      message: data.message || "Product added to cart",
      cart_item: data.cart_item,
    };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get cart items
 * @param telegramId - User's Telegram ID
 * @returns Promise with cart items
 */
export async function getCart(telegramId: number): Promise<any> {
  try {
    const response = await fetch(`api/cart/`, {
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export interface CartProductVariant {
  id: number;
  color: {
    id: number;
    name: string;
    hex_code: string;
    created_at: string;
  };
  size: {
    id: number;
    name: string;
    size_eu: number | null;
    size_us: number | null;
    size_uk: number | null;
    size_fr: number | null;
    created_at: string;
  };
  stock: number;
}

export interface CartProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface CartProductMaterial {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CartProductShippingMethod {
  id: number;
  name: string;
  min_days: number;
  max_days: number;
  price: string;
  is_active: boolean;
  created_at: string;
}

export interface CartProductBrand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  created_at: string;
}

export interface CartProductGender {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface CartProductSeason {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CartProductSubcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  gender: CartProductGender;
  image: string;
  is_active: boolean;
  created_at: string;
}

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string;
  subcategory: CartProductSubcategory;
  brand: CartProductBrand;
  gender: CartProductGender;
  season: CartProductSeason;
  materials: CartProductMaterial[];
  shipping_methods: CartProductShippingMethod[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: CartProductImage[];
  variants: CartProductVariant[];
  likes_count: number;
  is_liked: boolean;
}

export interface CartGetItem {
  id: number;
  product: CartProduct;
  quantity: number;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface CartGetResult {
  id: number;
  user: number;
  items: CartGetItem[];
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface CartGetResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: CartGetResult[];
}

/**
 * Get cart items using the internal API route
 * @param telegramId - User's Telegram ID
 * @returns Promise with cart items
 */

export async function getHandleCart(
  telegramId: number
): Promise<CartGetResponse | null> {
  try {
    const response = await fetch(`/api/cart/`, {
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return null;
    }

    return data as CartGetResponse;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export interface CartItem {
  id: number;
  product: CartProduct;
  quantity: number;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  cart_item?: CartItem;
}

export interface CartItemsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: CartItem[];
}

/**
 * Get cart items using the internal API route
 * @param telegramId - User's Telegram ID
 * @returns Promise with cart items
 */
export async function getCartItems(
  telegramId = 1524783641
): Promise<CartItemsResponse> {
  try {
    const response = await fetch(`/api/cart/items`, {
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CartItemsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return {
      count: 0,
      total_pages: 0,
      current_page: 1,
      next: null,
      previous: null,
      results: [],
    };
  }
}

/**
 * Add a product to the cart using the internal API route
 * @param telegramId - User's Telegram ID
 * @param productId - Product ID to add to cart
 * @param quantity - Quantity of the product
 * @returns Promise with cart response
 */
export async function addToHandleCart(
  telegramId: number,
  productId: number,
  quantity: number,
  variant_id: number
): Promise<CartResponse> {
  try {
    const formData = new FormData();
    formData.append("product_id", productId.toString());
    formData.append("quantity", quantity.toString());
    formData.append("variant_id", variant_id.toString());

    const response = await fetch(`/api/cart/add/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
      };
    }

    return {
      success: true,
      message: data.message || "Product added to cart",
      cart_item: data.cart_item,
    };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get user's wishlist
 * @param telegramId - User's Telegram ID
 * @returns Promise with wishlist data
 */
export async function getWishlist(
  telegramId: number
): Promise<Wishlist | null> {
  try {
    const response = await fetch(`/api/wishlist/`, {
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return null;
  }
}

/**
 * Add a product to the wishlist
 * @param telegramId - User's Telegram ID
 * @param productId - Product ID to add to wishlist
 * @returns Promise with wishlist response
 */
export async function addToWishlist(
  telegramId: number,
  productId: number
): Promise<WishlistResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("product_id", productId.toString());

    const response = await fetch(`/api/wishlist/add/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
      };
    }

    return {
      success: true,
      message: data.message || "Product added to wishlist successfully",
      wishlist: data.wishlist,
    };
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export interface Wishlist {
  id: number;
  user: number;
  products: Product[];
  created_at: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  wishlist?: Wishlist;
}

/**
 * Remove a product from the wishlist
 * @param telegramId - User's Telegram ID
 * @param productId - Product ID to remove from wishlist
 * @returns Promise with wishlist response
 */
export async function removeFromWishlist(
  telegramId: number,
  productId: number
): Promise<WishlistResponse> {
  try {
    const formData = new URLSearchParams();
    formData.append("product_id", productId.toString());

    const response = await fetch(`${API_BASE_URL}/wishlist/remove/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId.toString(),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
      };
    }

    return {
      success: true,
      message: data.message || "Product removed from wishlist successfully",
      wishlist: data.wishlist,
    };
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
