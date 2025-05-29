import { NextResponse } from "next/server"

const DATA_SOURCE_URL = process.env.DATA_SOURCE_URL

export async function GET(request: Request) {
  try {
    const telegramId = request.headers.get("X-Telegram-ID")

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    if (telegramId) {
      headers["X-Telegram-ID"] = telegramId
    }

    // Extract base URL and add categories endpoint
    const baseUrl = DATA_SOURCE_URL?.replace("/products/", "/categories/") || DATA_SOURCE_URL + "/categories/"

    const res = await fetch(baseUrl, { headers })

    if (!res.ok) {
      console.error("Categories API error:", res.status, res.statusText)
      return NextResponse.json([], { status: 200 }) // Return empty array instead of error
    }

    const categories = await res.json()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
}
