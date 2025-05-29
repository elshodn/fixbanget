import { type NextRequest, NextResponse } from "next/server";

// Base API URL - you can move this to environment variables
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL!;
// Types based on your API response
interface Gender {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  gender: Gender;
  image: string | null;
  created_at: string;
}

interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export async function GET(request: NextRequest) {
  try {
    // const telegramId = request.headers.get("X-Telegram-ID");
    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    // const page = searchParams.get("page") || "1";
    const gender = searchParams.get("gender");
    const search = searchParams.get("search");

    // if (!telegramId) {
    //   return NextResponse.json({ error: "No Authorized" }, { status: 401 });
    // }

    // Build query string
    const queryParams = new URLSearchParams();
    // queryParams.append("page", page);

    if (gender) {
      queryParams.append("gender", gender);
    }

    if (search) {
      queryParams.append("search", search);
    }

    // Make request to your API
    const apiUrl = `${BASE_API_URL}/categories?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "X-Telegram-ID": telegramId,
      },
      // Add cache control if needed
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data: CategoriesResponse = await response.json();

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
