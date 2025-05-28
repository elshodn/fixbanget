import { type NextRequest, NextResponse } from "next/server";
import type { WishlistResponse } from "@/types/handler";

const API_BASE_URL = "http://192.168.1.104:8000";

export async function POST(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID");

    if (!telegramId) {
      return NextResponse.json(
        { error: "X-Telegram-ID header is required" },
        { status: 400 }
      );
    }

    // Parse request body
    const formData = await request.formData();

    // Make API request
    const response = await fetch(`${API_BASE_URL}/wishlist/add/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId,
        Accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data: WishlistResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
