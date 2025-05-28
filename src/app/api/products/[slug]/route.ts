import { type NextRequest, NextResponse } from "next/server";
import type { Product } from "@/types/handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const telegramId = request.headers.get("X-Telegram-ID");

    console.log("slug", slug, "telegramId", telegramId);

    if (!telegramId) {
      return NextResponse.json(
        { error: "X-Telegram-ID header is required" },
        { status: 400 }
      );
    }

    // Make API request
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      headers: {
        "X-Telegram-ID": telegramId,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const product: Product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
