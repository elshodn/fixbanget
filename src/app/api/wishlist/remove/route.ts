import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function POST(request: NextRequest) {
  try {
    // Telegram ID-ni headerdan olish
    const telegramId = request.headers.get("X-Telegram-ID") || "1524783641";

    // Request body-ni olish
    const formData = await request.formData();
    const productId = formData.get("product_id");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // Tashqi API-ga yuborish uchun URLSearchParams yaratish
    const params = new URLSearchParams();
    params.append("product_id", productId.toString());

    // Tashqi API-ga so'rov yuborish
    const response = await fetch(`${API_BASE_URL}/wishlist/remove/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params,
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
    console.error("Error removing from wishlist:", error);

    // Xatolik yuz berganda 500 status kodi bilan javob qaytarish
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
