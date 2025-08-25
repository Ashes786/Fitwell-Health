'use client'

import { useState, useEffect, useCallback } from 'react'

interface FetchOptions {
  enabled?: boolean
  refetchInterval?: number
  retryCount?: number
  retryDelay?: number
  cacheKey?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  isRefreshing: boolean
}

export function useDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
) {
  const {
    enabled = true,
    refetchInterval,
    retryCount = 3,
    retryDelay = 1000,
    cacheKey,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isRefreshing: false
  })

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!enabled) return

    setState(prev => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      error: null
    }))

    let currentRetryCount = 0

    const attemptFetch = async (): Promise<T> => {
      try {
        const result = await fetchFn()
        
        // Cache the result if cacheKey is provided
        if (cacheKey) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify({
              data: result,
              timestamp: Date.now()
            }))
          } catch (error) {
            console.warn('Failed to cache data:', error)
          }
        }

        setState(prev => ({
          ...prev,
          data: result,
          isLoading: false,
          isRefreshing: false,
          error: null
        }))

        onSuccess?.(result)
        return result
      } catch (error) {
        currentRetryCount++
        
        if (currentRetryCount <= retryCount) {
          console.log(`Retry ${currentRetryCount}/${retryCount}...`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return attemptFetch()
        }

        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: errorMessage
        }))

        onError?.(errorMessage)
        throw error
      }
    }

    return attemptFetch()
  }, [fetchFn, enabled, retryCount, retryDelay, cacheKey, onSuccess, onError])

  const loadCachedData = useCallback(() => {
    if (!cacheKey) return null

    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        // Cache expires after 5 minutes
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setState(prev => ({
            ...prev,
            data,
            isLoading: false
          }))
          return data
        }
      }
    } catch (error) {
      console.warn('Failed to load cached data:', error)
    }
    
    return null
  }, [cacheKey])

  useEffect(() => {
    if (!enabled) return

    // Try to load cached data first
    const cachedData = loadCachedData()
    
    // If no cached data, fetch fresh data
    if (!cachedData) {
      fetchData()
    }

    // Set up refetch interval if specified
    let intervalId: NodeJS.Timeout | null = null
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(() => {
        fetchData(true)
      }, refetchInterval)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchData, enabled, refetchInterval, loadCachedData])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    if (cacheKey) {
      try {
        localStorage.removeItem(cacheKey)
      } catch (error) {
        console.warn('Failed to clear cache:', error)
      }
    }
  }, [cacheKey])

  return {
    ...state,
    refetch,
    clearCache
  }
}

// Hook for multiple parallel data fetches
export function useParallelDataFetch<T extends Record<string, any>>(
  fetchFns: { [K in keyof T]: () => Promise<T[K]> },
  options: FetchOptions = {}
) {
  const {
    enabled = true,
    refetchInterval,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<{
    data: Partial<T>
    isLoading: boolean
    errors: Partial<Record<keyof T, string>>
    isRefreshing: boolean
  }>({
    data: {},
    isLoading: false,
    errors: {},
    isRefreshing: false
  })

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!enabled) return

    setState(prev => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      errors: {}
    }))

    try {
      const entries = Object.entries(fetchFns) as [keyof T, () => Promise<T[keyof T]>][]
      const results = await Promise.allSettled(
        entries.map(([_, fn]) => fn())
      )

      const newData: Partial<T> = {}
      const newErrors: Partial<Record<keyof T, string>> = {}

      results.forEach((result, index) => {
        const key = entries[index][0]
        
        if (result.status === 'fulfilled') {
          newData[key] = result.value
        } else {
          const error = result.reason as Error
          newErrors[key] = error.message
        }
      })

      setState(prev => ({
        ...prev,
        data: { ...prev.data, ...newData },
        isLoading: false,
        isRefreshing: false,
        errors: newErrors
      }))

      onSuccess?.(newData as T)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        errors: { ...prev.errors, general: errorMessage }
      }))

      onError?.(errorMessage)
    }
  }, [fetchFns, enabled, onSuccess, onError])

  useEffect(() => {
    if (!enabled) return

    fetchData()

    let intervalId: NodeJS.Timeout | null = null
    if (refetchInterval && refetchInterval > 0) {
      intervalId = setInterval(() => {
        fetchData(true)
      }, refetchInterval)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchData, enabled, refetchInterval])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  return {
    ...state,
    refetch
  }
}