import { type NextRequest, NextResponse } from "next/server";
import type { PaginatedResponse, Wishlist } from "@/types/handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

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
    const response = await fetch(`${API_BASE_URL}/wishlist/`, {
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
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
