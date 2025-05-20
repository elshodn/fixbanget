/**
 * API Client for making HTTP requests
 *
 * This client provides a standardized way to interact with REST APIs
 * with built-in error handling, type safety, and request/response processing.
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  /**
   * Creates a new API client instance
   *
   * @param baseUrl - The base URL for all API requests
   * @param defaultHeaders - Default headers to include with every request
   */
  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...defaultHeaders,
    };
  }

  /**
   * Makes a GET request to the specified endpoint
   *
   * @param endpoint - The API endpoint to request
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  /**
   * Makes a POST request to the specified endpoint
   *
   * @param endpoint - The API endpoint to request
   * @param data - The data to send in the request body
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("POST", endpoint, data, options);
  }

  /**
   * Makes a PUT request to the specified endpoint
   *
   * @param endpoint - The API endpoint to request
   * @param data - The data to send in the request body
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, data, options);
  }

  /**
   * Makes a PATCH request to the specified endpoint
   *
   * @param endpoint - The API endpoint to request
   * @param data - The data to send in the request body
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>("PATCH", endpoint, data, options);
  }

  /**
   * Makes a DELETE request to the specified endpoint
   *
   * @param endpoint - The API endpoint to request
   * @param options - Additional request options
   * @returns Promise with the response data
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }

  /**
   * Makes a paginated GET request that returns data in the IApiResponse format
   *
   * @param endpoint - The API endpoint to request
   * @param page - The page number to request (1-based)
   * @param limit - The number of items per page
   * @param options - Additional request options
   * @returns Promise with the paginated response
   */
  async getPaginated<T>(
    endpoint: string,
    page = 1,
    limit = 10,
    options?: RequestOptions
  ): Promise<IApiResponse<T>> {
    const params = {
      ...(options?.params || {}),
      page: page.toString(),
      limit: limit.toString(),
    };

    const mergedOptions = {
      ...options,
      params,
    };

    return this.get<IApiResponse<T>>(endpoint, mergedOptions);
  }

  /**
   * Makes an HTTP request with the specified method, endpoint, and options
   *
   * @param method - The HTTP method to use
   * @param endpoint - The API endpoint to request
   * @param data - The data to send in the request body
   * @param options - Additional request options
   * @returns Promise with the response data
   * @throws ApiError if the request fails
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = new URL(
      endpoint.startsWith("/") ? endpoint.slice(1) : endpoint,
      this.baseUrl
    );

    // Add query parameters if provided
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = {
      ...this.defaultHeaders,
      ...options?.headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      cache: options?.cache,
      signal: options?.signal,
    };

    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url.toString(), requestOptions);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        // Handle different response types
        if (contentType.includes("text/")) {
          return (await response.text()) as unknown as T;
        }

        return undefined as unknown as T;
      }

      const responseData = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          status: response.status,
          message: responseData.message || response.statusText,
          errors: responseData.errors,
        };

        throw error;
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw error;
        }

        if ((error as unknown as ApiError).status) {
          throw error;
        }

        throw {
          status: 0,
          message: error.message || "Network error occurred",
        } as ApiError;
      }

      throw {
        status: 0,
        message: "Unknown error occurred",
      } as ApiError;
    }
  }
}

/**
 * Create a new API client instance with the provided base URL
 *
 * @param baseUrl - The base URL for all API requests
 * @param defaultHeaders - Default headers to include with every request
 * @returns A new ApiClient instance
 */
export const createApiClient = (
  baseUrl: string,
  defaultHeaders?: Record<string, string>
) => {
  return new ApiClient(baseUrl, defaultHeaders);
};
