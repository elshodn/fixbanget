import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function GET(request: NextRequest) {
  try {
    // Telegram ID-ni headerdan olish
    const telegramId = request.headers.get("X-Telegram-ID") || "1524783641";

    // Tashqi API-ga so'rov yuborish
    const response = await fetch(`${API_BASE_URL}/cart/my`, {
      method: "GET",
      headers: {
        "X-Telegram-ID": telegramId,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    // API javobini JSON formatida olish
    const data = await response.json();

    // API javobini qaytarish
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);

    // Xatolik yuz berganda 500 status kodi bilan javob qaytarish
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        results: [],
      },
      { status: 500 }
    );
  }
}
