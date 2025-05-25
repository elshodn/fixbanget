import { type NextRequest, NextResponse } from "next/server";
import type { Cart } from "@/types/handler";

const API_BASE_URL = "http://192.168.1.118:8000/api/v1";

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
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: {
        "X-Telegram-ID": telegramId,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const cart: Cart = await response.json();
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
