"use client"

import { useNavigationLoading } from '@/components/navigation-loading-provider'

/**
 * Hook personalizado para navegação com loading
 * Fornece uma interface simples para navegar entre páginas com feedback visual
 */
export function useNavigation() {
  const { isLoading, navigateWithLoading, startLoading, stopLoading } = useNavigationLoading()

  return {
    /**
     * Indica se há uma navegação em andamento
     */
    isNavigating: isLoading,
    
    /**
     * Navega para uma página específica com loading visual
     * @param href - URL de destino
     */
    navigateTo: navigateWithLoading,
    
    /**
     * Inicia o loading manualmente (útil para navegações customizadas)
     */
    startLoading,
    
    /**
     * Para o loading manualmente
     */
    stopLoading,
  }
}
