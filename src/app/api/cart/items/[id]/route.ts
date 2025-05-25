import { type NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "http://192.168.1.118:8000/api/v1";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const telegramId = request.headers.get("X-Telegram-ID");

    if (!telegramId) {
      return NextResponse.json(
        { error: "X-Telegram-ID header is required" },
        { status: 400 }
      );
    }

    // Make API request
    const response = await fetch(`${API_BASE_URL}/cart/items/${id}`, {
      method: "DELETE",
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

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
