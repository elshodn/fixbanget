"use client"

import { ApiClient } from "@/lib/api-client"
import { useCallback, useEffect, useState } from "react"

interface UseApiOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: ApiError) => void
  dependencies?: any[]
}

interface UseApiResult<T> {
  data: T | undefined
  isLoading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for making API requests with loading and error states
 *
 * @param apiClient - The API client instance
 * @param requestFn - Function that makes the API request
 * @param options - Additional options for the hook
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useApi<T>(
  apiClient: ApiClient,
  requestFn: (client: ApiClient) => Promise<T>,
  options: UseApiOptions<T> = {},
): UseApiResult<T> {
  const { initialData, onSuccess, onError, dependencies = [] } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await requestFn(apiClient)
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      onError?.(apiError)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }, [apiClient, requestFn, onSuccess, onError, ...dependencies])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, refetch }
}

interface UsePaginatedApiOptions<T> extends UseApiOptions<IApiResponse<T>> {
  initialPage?: number
  initialLimit?: number
}

interface UsePaginatedApiResult<T> extends UseApiResult<IApiResponse<T>> {
  page: number
  limit: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  goToPage: (page: number) => Promise<void>
  nextPage: () => Promise<void>
  previousPage: () => Promise<void>
  setItemsPerPage: (limit: number) => Promise<void>
}

/**
 * Custom hook for making paginated API requests
 *
 * @param apiClient - The API client instance
 * @param endpoint - The API endpoint to request
 * @param options - Additional options for the hook
 * @returns Object containing paginated data, navigation functions, and state
 */
export function usePaginatedApi<T>(
  apiClient: ApiClient,
  endpoint: string,
  options: UsePaginatedApiOptions<T> = {},
): UsePaginatedApiResult<T> {
  const { initialPage = 1, initialLimit = 10, dependencies = [], ...apiOptions } = options

  const [pagination, setPagination] = useState<PaginationParams>({
    page: initialPage,
    limit: initialLimit,
  })

  const requestFn = useCallback(
    (client: ApiClient) => client.getPaginated<T>(endpoint, pagination.page, pagination.limit),
    [endpoint, pagination.page, pagination.limit],
  )

  const { data, isLoading, error, refetch } = useApi<IApiResponse<T>>(apiClient, requestFn, {
    ...apiOptions,
    dependencies: [...dependencies, pagination],
  })

  const totalPages = data ? Math.ceil(data.count / pagination.limit!) : 0
  const totalItems = data?.count || 0
  const hasNextPage = data?.next !== null
  const hasPreviousPage = data?.previous !== null

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1 || (totalPages > 0 && page > totalPages)) {
        return
      }

      setPagination((prev) => ({ ...prev, page }))
    },
    [totalPages],
  )

  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      setPagination((prev) => ({ ...prev, page: prev.page! + 1 }))
    }
  }, [hasNextPage])

  const previousPage = useCallback(async () => {
    if (hasPreviousPage) {
      setPagination((prev) => ({ ...prev, page: prev.page! - 1 }))
    }
  }, [hasPreviousPage])

  const setItemsPerPage = useCallback(async (limit: number) => {
    if (limit < 1) {
      return
    }

    setPagination((prev) => ({ page: 1, limit }))
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch,
    page: pagination.page!,
    limit: pagination.limit!,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage,
  }
}
