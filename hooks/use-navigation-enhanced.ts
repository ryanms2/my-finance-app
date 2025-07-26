"use client"

import { useCallback } from 'react'
import { useNavigationLoading } from '@/components/navigation-loading-provider'

export function useNavigationWithLoading() {
  const { navigateWithLoading, isLoading } = useNavigationLoading()

  // Navegação programática com loading
  const navigate = useCallback((href: string, options?: { 
    replace?: boolean
    scroll?: boolean
  }) => {
    navigateWithLoading(href)
  }, [navigateWithLoading])

  // Handler para links que precisam de lógica adicional
  const createNavigationHandler = useCallback((href: string, callback?: () => void) => {
    return (e: React.MouseEvent) => {
      if (callback) {
        callback()
      }
      
      // Pequeno delay para permitir que o callback execute
      setTimeout(() => {
        navigateWithLoading(href)
      }, 0)
    }
  }, [navigateWithLoading])

  // Handler para formulários que redirecionam após submit
  const createFormNavigationHandler = useCallback((href: string) => {
    return () => {
      // Aguardar um pouco mais para formulários
      setTimeout(() => {
        navigateWithLoading(href)
      }, 500)
    }
  }, [navigateWithLoading])

  return {
    navigate,
    createNavigationHandler,
    createFormNavigationHandler,
    isNavigating: isLoading
  }
}
