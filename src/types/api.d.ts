/**
 * Standard API response interface for paginated data
 */
interface ApiResponse<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

/**
 * API error response structure
 */
interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Request options for API calls
 */
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  signal?: AbortSignal;
}

/**
 * Pagination parameters
 */
interface PaginationParams {
  page?: number;
  limit?: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
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

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  gender: Gender;
  image: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  gender: Gender;
  image: string;
  created_at: string;
  subcategories: Subcategory[];
}

interface Gender {
  id: number;
  name: string;
  slug: string;
  description: string;
}
const DEFAULT_GENDER_ID = 1;

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  created_at: string;
  products_count: number;
}

interface Season {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface Material {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface ShippingMethod {
  id: number;
  name: string;
  min_days: number;
  max_days: number;
  price: string;
  is_active: boolean;
}

interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

interface ProductVariant {
  id: number;
  color: Color;
  size: Size;
  stock: number;
}

interface Color {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
}

interface Size {
  id: number;
  name: string;
  size_eu: number;
  size_us: number;
  size_uk: number;
  size_fr: number;
}
