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

interface OrderItem {
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
    images: any[]
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

interface PickupBranch {
  id: number
  name: string
  branch_type: string
  street: string
  district: string
  city: string
  region: string
  country: string
  postal_code: string
  phone: string
  working_hours: string
  is_active: boolean
  location_link: string
  manager_name: string
  manager_phone: string
  has_fitting_room: boolean
  has_parking: boolean
  is_24_hours: boolean
  created_at: string
  updated_at: string
}

interface ShippingInfo {
  method: string
  delivery_type: string
  min_days: number
  max_days: number
  price: number
  pickup_location: {
    name: string
    address: string
    working_hours: string
    phone: string
    has_fitting_room: boolean
    has_parking: boolean
    is_24_hours: boolean
    location_link: string | null
  }
}

interface EstimatedDelivery {
  min_date: string
  max_date: string
  formatted: string
}

interface Order {
  id: number
  user: number
  items: OrderItem[]
  total_amount: string
  discount_amount: string
  shipping_amount: string
  final_amount: string
  status: string
  shipping_method: {
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
  }
  pickup_branch: PickupBranch
  tracking_number: string
  order_note: string
  customer_name: string
  phone_number: string
  payment_method: string
  payment_status: string
  created_at: string
  updated_at: string
  status_display: string
  payment_method_display: string
  items_count: number
  can_cancel: boolean
  shipping_info: ShippingInfo
  estimated_delivery_date: EstimatedDelivery
  active_branches: any
}
