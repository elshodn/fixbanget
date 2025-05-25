import { type NextRequest, NextResponse } from "next/server";
import type {
  PaginatedResponse,
  Product,
  ProductFilterParams,
} from "@/types/handler";

const API_BASE_URL = "http://192.168.1.118:8000";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const telegramId = request.headers.get("X-Telegram-ID");

    if (!telegramId) {
      return NextResponse.json(
        { error: "X-Telegram-ID header is required" },
        { status: 400 }
      );
    }

    // Construct filter parameters
    const filterParams: ProductFilterParams = {};

    // Add all search parameters to the filter
    if (searchParams.has("gender"))
      filterParams.gender = Number(searchParams.get("gender"));
    if (searchParams.has("brand"))
      filterParams.brand = Number(searchParams.get("brand"));
    if (searchParams.has("category"))
      filterParams.category = Number(searchParams.get("category"));
    if (searchParams.has("delivery_max"))
      filterParams.delivery_max = Number(searchParams.get("delivery_max"));
    if (searchParams.has("delivery_min"))
      filterParams.delivery_min = Number(searchParams.get("delivery_min"));
    if (searchParams.has("has_discount"))
      filterParams.has_discount = searchParams.get("has_discount") === "true";
    if (searchParams.has("is_featured"))
      filterParams.is_featured = searchParams.get("is_featured") === "true";
    if (searchParams.has("in_stock"))
      filterParams.in_stock = searchParams.get("in_stock") === "true";
    if (searchParams.has("is_active"))
      filterParams.is_active = searchParams.get("is_active") === "true";
    if (searchParams.has("ordering"))
      filterParams.ordering = searchParams.get("ordering") as string;
    if (searchParams.has("page"))
      filterParams.page = Number(searchParams.get("page"));
    if (searchParams.has("price_max"))
      filterParams.price_max = Number(searchParams.get("price_max"));
    if (searchParams.has("price_min"))
      filterParams.price_min = Number(searchParams.get("price_min"));
    if (searchParams.has("search"))
      filterParams.search = searchParams.get("search") as string;
    if (searchParams.has("size"))
      filterParams.size = Number(searchParams.get("size"));
    if (searchParams.has("size_eu"))
      filterParams.size_eu = Number(searchParams.get("size_eu"));
    if (searchParams.has("size_uk"))
      filterParams.size_uk = Number(searchParams.get("size_uk"));
    if (searchParams.has("size_us"))
      filterParams.size_us = Number(searchParams.get("size_us"));
    if (searchParams.has("slug"))
      filterParams.slug = searchParams.get("slug") as string;
    if (searchParams.has("subcategory"))
      filterParams.subcategory = Number(searchParams.get("subcategory"));

    // Build query string
    const queryString = new URLSearchParams();
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryString.append(key, String(value));
      }
    });

    // Make API request
    const response = await fetch(
      `${API_BASE_URL}/products/?${queryString.toString()}`,
      {
        headers: {
          "X-Telegram-ID": telegramId,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data: PaginatedResponse<Product> = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
