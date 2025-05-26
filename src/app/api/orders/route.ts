import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://192.168.1.118:8000"

export async function POST(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID")

    if (!telegramId) {
      return NextResponse.json({ error: "X-Telegram-ID header is required" }, { status: 400 })
    }

    const formData = await request.formData()

    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID")

    if (!telegramId) {
      return NextResponse.json({ error: "X-Telegram-ID header is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/orders/`, {
      headers: {
        "X-Telegram-ID": telegramId,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Extract the results array from the paginated response
    // Return just the results array to match the expected format
    return NextResponse.json(data.results || [])
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
