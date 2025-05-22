import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Telegram ID-ni headerdan olish
    const telegramId = request.headers.get("X-Telegram-ID");
    if (!telegramId) {
      return;
    }
    const cartItemId = id;

    // Tashqi API-ga so'rov yuborish
    const response = await fetch(`${API_BASE_URL}/cart/items/${cartItemId}/`, {
      method: "DELETE",
      headers: {
        "X-Telegram-ID": telegramId,
        Accept: "application/json",
      },
    });

    // API javobini JSON formatida olish
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // DELETE so'rovlari ba'zan bo'sh javob qaytarishi mumkin
      data = { success: response.ok };
    }

    // API javobini qaytarish
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error removing cart item:", error);

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
