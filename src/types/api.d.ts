/**
 * Standard API response interface for paginated data
 */
interface IApiResponse<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

/**
 * API error response structure
 */
interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Request options for API calls
 */
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  signal?: AbortSignal;
}

/**
 * Pagination parameters
 */
interface PaginationParams {
  page?: number;
  limit?: number;
}
