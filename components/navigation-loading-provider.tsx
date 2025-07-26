"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface NavigationLoadingContextType {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  navigateWithLoading: (href: string) => void
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined)

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext)
  if (!context) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider')
  }
  return context
}

interface NavigationLoadingProviderProps {
  children: React.ReactNode
}

export function NavigationLoadingProvider({ children }: NavigationLoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const navigateWithLoading = useCallback((href: string) => {
    // Não mostrar loading se já estamos na página
    if (href === pathname) {
      return
    }

    startLoading()
    
    // Usar requestAnimationFrame para uma transição mais suave
    requestAnimationFrame(() => {
      // Simular um pequeno delay mínimo para evitar flashes muito rápidos
      setTimeout(() => {
        router.push(href)
        // O loading será parado pelo useEffect que monitora mudanças de rota
      }, 100)
    })
  }, [pathname, router, startLoading])

  // Monitorar mudanças de rota para parar o loading
  React.useEffect(() => {
    stopLoading()
  }, [pathname, stopLoading])

  const value = {
    isLoading,
    startLoading,
    stopLoading,
    navigateWithLoading,
  }

  return (
    <NavigationLoadingContext.Provider value={value}>
      {children}
      
      {/* Loading Overlay Global */}
      {isLoading && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-navigation-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="loading-title"
          aria-describedby="loading-description"
        >
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-gray-900/90 backdrop-blur-md border border-gray-700 animate-scale-in">
            <div className="relative" aria-hidden="true">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" style={{ animationDelay: '150ms' }} />
            </div>
            <div className="text-center">
              <p id="loading-title" className="text-sm font-medium text-gray-100">Carregando página...</p>
              <p id="loading-description" className="text-xs text-gray-400 mt-1">Aguarde um momento</p>
            </div>
          </div>
          
          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Navegando para nova página, por favor aguarde.
          </div>
        </div>
      )}
    </NavigationLoadingContext.Provider>
  )
}
