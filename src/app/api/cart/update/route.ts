import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function PUT(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID")

    if (!telegramId) {
      return NextResponse.json({ error: "X-Telegram-ID header is required" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("item_id")

    if (!itemId) {
      return NextResponse.json({ error: "item_id is required" }, { status: 400 })
    }

    const body = await request.json()
    const { product, quantity } = body

    if (!product || !quantity) {
      return NextResponse.json({ error: "product and quantity are required" }, { status: 400 })
    }

    console.log("Updating cart item:", { itemId, product, quantity })

    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}/`, {
      method: "PUT",
      headers: {
        "X-Telegram-ID": telegramId,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        product: Number(product),
        quantity: Number(quantity),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cart update API error:", errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}
