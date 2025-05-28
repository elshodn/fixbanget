// export async function fetchBrands(): Promise<Brand[]> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/brands?page_size=100`, {
//       headers: {
//         "X-Telegram-ID": getTelegramIdForApi(),
//       },
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data: ApiResponse<Brand> = await response.json();
//     return data.results;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw error;
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import type { PaginatedResponse, Wishlist } from "@/types/handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID");

    if (!telegramId) {
      return NextResponse.json(
        { error: "X-Telegram-ID header is required" },
        { status: 400 }
      );
    }

    // Make API request
    const response = await fetch(`${API_BASE_URL}/brands?page_size=100`, {
      headers: {
        "X-Telegram-ID": telegramId,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data: PaginatedResponse<Wishlist> = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
