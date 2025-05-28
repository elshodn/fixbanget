export interface OrderItem {
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
    images: Array<{
      id: number
      image: string
      is_primary: boolean
    }>
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

export interface PickupBranch {
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

export interface ShippingMethod {
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

export interface ShippingInfo {
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

export interface EstimatedDelivery {
  min_date: string
  max_date: string
  formatted: string
}

export interface SplitPaymentInfo {
  first_payment: {
    amount: number
    date: string
    status: string
    due_date: string
    is_overdue: boolean
    is_paid: boolean
  }
  second_payment: {
    amount: number
    due_date: string
    status: string
    is_overdue: boolean
    is_paid: boolean
    days_remaining: number
  }
  total_amount: number
  remaining_amount: number
  payment_schedule: {
    first_payment_due: string
    second_payment_due: string
  }
}

export interface Order {
  id: number
  user: number
  items: OrderItem[]
  total_amount: string
  discount_amount: string
  shipping_amount: string
  final_amount: string
  status: string
  shipping_method: ShippingMethod | null
  pickup_branch: PickupBranch | null
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
  shipping_info: ShippingInfo | null
  estimated_delivery_date: EstimatedDelivery | null
  active_branches: any
  is_split_payment: boolean
  first_payment_amount: string | null
  first_payment_date: string | null
  second_payment_amount: string | null
  second_payment_due_date: string | null
  second_payment_status: string
  split_payment_info: SplitPaymentInfo | null
}

// API Response interfaces
export interface OrdersResponse {
  count: number
  next: string | null
  previous: string | null
  results: Order[]
}

// Order creation interfaces
export interface CreateOrderRequest {
  product_id: number
  variant_id: number
  quantity: number
  pickup_branch_id: number
  payment_method: string
  customer_name: string
  phone_number: string
  order_note?: string
  is_split_payment?: boolean
}

export interface CreateOrderResponse {
  message: string
  order: Order
}
