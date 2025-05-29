import { NextResponse } from "next/server"

const DATA_SOURCE_URL = process.env.NEXT_PUBLIC_API_URL

interface FilterParams {
  gender?: string
  brand?: string
  category?: string
  delivery_max?: number
  delivery_min?: number
  has_discount?: boolean
  is_featured?: boolean
  in_stock?: boolean
  is_active?: boolean
  ordering?: string
  page?: number
  price_max?: number
  price_min?: number
  search?: string
  size?: string
  size_eu?: string
  size_uk?: string
  size_us?: string
  slug?: string
  subcategory?: string
  page_size?: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get Telegram ID from headers (optional for now)
    const telegramId = request.headers.get("X-Telegram-ID")
    console.log("📱 Telegram ID from header:", telegramId)

    const filterParams: FilterParams = {}

    // Extract filter parameters from searchParams - FAQAT BIRINCHI QIYMATNI OLAMIZ
    searchParams.forEach((value, key) => {
      // Agar key allaqachon mavjud bo'lsa, skip qilamiz (duplicate'larni oldini olamiz)
      if (filterParams.hasOwnProperty(key)) {
        console.log(`⚠️ Duplicate parameter detected: ${key}, skipping...`)
        return
      }

      if (key === "gender") filterParams.gender = value
      if (key === "brand") filterParams.brand = value
      if (key === "category") filterParams.category = value
      if (key === "delivery_max") filterParams.delivery_max = Number(value)
      if (key === "delivery_min") filterParams.delivery_min = Number(value)
      if (key === "has_discount") filterParams.has_discount = value === "true"
      if (key === "is_featured") filterParams.is_featured = value === "true"
      if (key === "in_stock") filterParams.in_stock = value === "true"
      if (key === "is_active") filterParams.is_active = value === "true"
      if (key === "ordering") filterParams.ordering = value
      if (key === "page") filterParams.page = Number(value)
      if (key === "price_max") filterParams.price_max = Number(value)
      if (key === "price_min") filterParams.price_min = Number(value)
      if (key === "search") filterParams.search = value
      if (key === "size") filterParams.size = value
      if (key === "size_eu") filterParams.size_eu = value
      if (key === "size_uk") filterParams.size_uk = value
      if (key === "size_us") filterParams.size_us = value
      if (key === "slug") filterParams.slug = value
      if (key === "subcategory") filterParams.subcategory = value
      if (key === "page_size") filterParams.page_size = Number(value)
    })

    console.log("🔍 Processed filter params:", filterParams)

    // Build query string - FAQAT BIR MARTA QO'SHAMIZ
    const queryParams = new URLSearchParams()

    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.set(key, String(value)) // set() ishlatamiz, append() emas
      }
    })

    const url = `${DATA_SOURCE_URL}?${queryParams.toString()}`
    console.log("🌐 Final API URL:", url)

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Add Telegram ID if available
    if (telegramId) {
      headers["X-Telegram-ID"] = telegramId
    }

    const res = await fetch(url, { headers })

    if (!res.ok) {
      console.error("❌ External API error:", res.status, res.statusText)
      const errorText = await res.text()
      console.error("Error details:", errorText)
      return NextResponse.json(
        {
          error: "Failed to fetch data",
          details: errorText,
          status: res.status,
        },
        { status: res.status },
      )
    }

    const products = await res.json()
    console.log("✅ External API response received successfully")

    return NextResponse.json(products)
  } catch (error) {
    console.error("❌ Error in products API route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
