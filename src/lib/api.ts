import { useApi, usePaginatedApi } from "@/hooks/use-api"
import { createApiClient } from "./api-client"

// Create a default API client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"
export const apiClient = createApiClient(API_BASE_URL)



// Export everything from the API module
export {
  createApiClient,
  useApi,
  usePaginatedApi,

}
