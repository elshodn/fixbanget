import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function DELETE(request: NextRequest) {
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

    console.log("Removing cart item:", itemId)

    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}/`, {
      method: "DELETE",
      headers: {
        "X-Telegram-ID": telegramId,
        Accept: "*/*",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Cart remove API error:", errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // DELETE request might return empty response
    let data = {}
    try {
      const responseText = await response.text()
      if (responseText) {
        data = JSON.parse(responseText)
      }
    } catch (parseError) {
      console.log("No JSON response from delete, which is normal")
    }

    return NextResponse.json({ success: true, message: "Item removed successfully", ...data })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}
