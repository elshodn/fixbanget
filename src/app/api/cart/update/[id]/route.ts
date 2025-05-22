import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function PUT(
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

    // Request body-ni olish
    const formData = await request.formData();
    const quantity = formData.get("quantity");

    if (!quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity is required",
        },
        { status: 400 }
      );
    }

    // Tashqi API-ga yuborish uchun URLSearchParams yaratish
    const searchParams = new URLSearchParams();
    searchParams.append("quantity", quantity.toString());

    // Tashqi API-ga so'rov yuborish
    const response = await fetch(`${API_BASE_URL}/cart/update/${cartItemId}/`, {
      method: "PUT",
      headers: {
        "X-Telegram-ID": telegramId,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: searchParams,
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
    console.error("Error updating cart item:", error);

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
