import { type NextRequest, NextResponse } from "next/server"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

export async function GET(request: NextRequest) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID")

    if (!telegramId) {
      return NextResponse.json({ error: "X-Telegram-ID header is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/branches/`, {
      headers: {
        "X-Telegram-ID": telegramId,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching branches:", error)
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
  }
}
