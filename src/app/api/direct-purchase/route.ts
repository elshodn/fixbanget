import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://192.168.1.104:8000"

export async function POST(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID")

    if (!telegramId) {
      return NextResponse.json({ error: "X-Telegram-ID header is required" }, { status: 400 })
    }

    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/direct-purchase/`, {
      method: "POST",
      headers: {
        "X-Telegram-ID": telegramId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Direct purchase API error:", errorData)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating direct purchase:", error)
    return NextResponse.json({ error: "Failed to create direct purchase" }, { status: 500 })
  }
}
