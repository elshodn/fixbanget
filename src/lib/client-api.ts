import type {
  AddToCartRequest,
  Cart,
  PaginatedResponse,
  Product,
  ProductFilterParams,
  WishlistResponse,
} from "@/types/handler";

const API_BASE = "/api";

// Products API
export async function getProducts(
  params: ProductFilterParams = {},
  telegramId: string
): Promise<PaginatedResponse<Product>> {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(
    `${API_BASE}/products?${queryParams.toString()}`,
    {
      headers: {
        "X-Telegram-ID": telegramId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProductBySlug(
  slug: string,
  telegramId: string
): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${slug}`, {
    headers: {
      "X-Telegram-ID": telegramId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}

// Cart API
export async function getCart(telegramId: string): Promise<Cart> {
  const response = await fetch(`${API_BASE}/cart`, {
    headers: {
      "X-Telegram-ID": telegramId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

export async function addToCart(data: AddToCartRequest, telegramId: string) {
  const formData = new FormData();
  formData.append("product_id", data.product_id.toString());
  formData.append("quantity", data.quantity.toString());

  if (data.variant_id) {
    formData.append("variant_id", data.variant_id.toString());
  }

  const response = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: {
      "X-Telegram-ID": telegramId,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json();
}

export async function removeCartItem(itemId: number, telegramId: string) {
  const response = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "X-Telegram-ID": telegramId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove item from cart");
  }

  return response.json();
}

// Wishlist API
export async function getWishlist(telegramId: string) {
  const response = await fetch(`${API_BASE}/wishlist`, {
    headers: {
      "X-Telegram-ID": telegramId,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }

  return response.json();
}

export async function addToWishlist(
  productId: number,
  telegramId: string
): Promise<WishlistResponse> {
  const formData = new FormData();
  formData.append("product_id", productId.toString());

  const response = await fetch(`${API_BASE}/wishlist/add`, {
    method: "POST",
    headers: {
      "X-Telegram-ID": telegramId,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to add item to wishlist");
  }

  return response.json();
}
