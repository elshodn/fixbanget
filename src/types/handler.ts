// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  total_pages?: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Gender
export interface Gender {
  id: number;
  name: string;
  slug: string;
  description: string;
}

// Brand
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  created_at: string;
}

// Subcategory
export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  gender: Gender;
  image: string;
  is_active: boolean;
  created_at: string;
}

// Season
export interface Season {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

// Material
export interface Material {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

// Shipping Method
export interface ShippingMethod {
  id: number;
  name: string;
  min_days: number;
  max_days: number;
  price: string;
  is_active: boolean;
  created_at: string;
}

// Color
export interface Color {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
}

// Size
export interface Size {
  id: number;
  name: string;
  size_eu: number | null;
  size_us: number | null;
  size_uk: number | null;
  size_fr: number | null;
  created_at: string;
}

// Product Variant
export interface ProductVariant {
  id: number;
  color: Color;
  size: Size;
  stock: number;
}

// Product Image
export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

// Product
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string;
  subcategory: Subcategory;
  brand: Brand;
  gender: Gender;
  season: Season;
  materials: Material[];
  shipping_methods: ShippingMethod[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  variants: ProductVariant[];
  likes_count: number;
  is_liked: boolean;
}

// Cart Item
export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  product_image: string;
  product_price: string;
  product_discount_price: string;
  quantity: number;
  color: string;
  color_hex: string;
  size: string | null;
  total_price: number;
  variant_id?: number;
}

// Cart
export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_price: string;
  created_at: string;
  updated_at: string;
}

// Wishlist
export interface Wishlist {
  id: number;
  user: number;
  products: Product[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
  name: string;
  description: string;
}

// API Request Types
export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  variant_id?: number;
}

export interface ProductFilterParams {
  gender?: number;
  brand?: number;
  category?: number;
  delivery_max?: number;
  delivery_min?: number;
  has_discount?: boolean;
  is_featured?: boolean;
  in_stock?: boolean;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  price_max?: number;
  price_min?: number;
  search?: string;
  size?: number | null;
  size_eu?: number | null;
  size_uk?: number | null;
  size_us?: number | null;
  slug?: string;
  subcategory?: number;
}

// API Response Types
export interface AddToCartResponse {
  message: string;
  cart_item: CartItem;
}

export interface WishlistResponse {
  message: string;
  wishlist: Wishlist;
  is_liked: boolean;
}
