"use client"

import { useState, useCallback } from "react"

interface UseLoadingState {
  isLoading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T | null>
  reset: () => void
}

export function useLoadingState(initialLoading = false): UseLoadingState {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [error, setError] = useState<string | null>(null)

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
    if (loading) {
      setError(null) // Clear error when starting new loading
    }
  }, [])

  const setErrorState = useCallback((error: string | null) => {
    setError(error)
    if (error) {
      setIsLoading(false) // Stop loading when error occurs
    }
  }, [])

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true)
      const result = await asyncFn()
      setLoading(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro inesperado"
      setErrorState(errorMessage)
      return null
    }
  }, [setLoading, setErrorState])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    setLoading,
    setError: setErrorState,
    withLoading,
    reset
  }
}

// Hook específico para formulários
export function useFormLoading() {
  const loadingState = useLoadingState()
  
  const submitWithLoading = useCallback(async <T>(
    submitFn: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void
      onError?: (error: string) => void
      loadingText?: string
    }
  ): Promise<boolean> => {
    const result = await loadingState.withLoading(submitFn)
    
    if (result !== null && options?.onSuccess) {
      options.onSuccess(result)
      return true
    } else if (result === null && options?.onError && loadingState.error) {
      options.onError(loadingState.error)
      return false
    }
    
    return result !== null
  }, [loadingState])

  return {
    ...loadingState,
    submitWithLoading
  }
}
