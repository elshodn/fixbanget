import { type NextRequest, NextResponse } from "next/server";
import type { AddToCartResponse } from "@/types/handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

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
    const response = await fetch(`${API_BASE_URL}/cart/add/`, {
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

    const data: AddToCartResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

