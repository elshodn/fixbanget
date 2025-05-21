const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.118:8000/api/v1";

/**
 *
 * @param gender
 * @returns
 */

export async function fetchCategories(
  gender: "male" | "female"
): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories?gender=${gender}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Category> = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// export async function fetchPopularProducts(): Promise<Product[]> {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/api/products?is_available=true`
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: ApiResponse<Product> = await response.json();
//     return data.results;
//   } catch (error) {
//     console.error("Error fetching popular products:", error);
//     throw error;
//   }
// }
