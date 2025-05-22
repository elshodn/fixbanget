import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!
export async function GET(request: NextRequest) {
  try {
    // Telegram ID-ni headerdan olish
    const telegramId = request.headers.get("X-Telegram-ID");
    if (!telegramId) {
      return NextResponse.json(
        { telegramId: "Telegram ID not provided" },
        { status: 400 }
      );
    }

    // Request body-ni olish
    // const formData = await request.formData();

    // Tashqi API-ga yuborish uchun URLSearchParams yaratish
    // const params = new URLSearchParams();

    // // Barcha form ma'lumotlarini URLSearchParams-ga qo'shish
    // for (const [key, value] of formData.entries()) {
    //   params.append(key, value.toString());
    // }

    // Tashqi API-ga so'rov yuborish
    const response = await fetch(`${API_BASE_URL}/cart/items/`, {
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
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting from cart:", error);

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
