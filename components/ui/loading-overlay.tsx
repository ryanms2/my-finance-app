"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingOverlay({ 
  isLoading, 
  text = "Carregando...", 
  className,
  size = "md" 
}: LoadingOverlayProps) {
  if (!isLoading) return null

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in",
      className
    )}>
      <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-lg p-6 shadow-xl animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className={cn("animate-spin text-purple-400", sizeClasses[size])} />
            <div className="absolute inset-0">
              <Loader2 className={cn("animate-spin text-blue-400 opacity-50", sizeClasses[size])} 
                style={{ animationDelay: "0.5s", animationDirection: "reverse" }} />
            </div>
          </div>
          <p className={cn("text-gray-300 font-medium animate-pulse-subtle", textSizes[size])}>
            {text}
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading para páginas inteiras
export function PageLoadingOverlay({
  text = "Carregando página...",
  className
}: {
  text?: string
  className?: string
}) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center",
      className
    )}>
      <div className="text-center animate-fade-in">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-gray-800 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" 
            style={{ animationDelay: "0.5s", animationDirection: "reverse" }}></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2 animate-pulse-subtle">{text}</h2>
        <p className="text-gray-400 animate-pulse-subtle" style={{ animationDelay: "0.2s" }}>
          Preparando sua experiência...
        </p>
      </div>
    </div>
  )
}

// Loading inline para buttons
export function ButtonLoading({ 
  text = "Carregando...",
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      <span>{text}</span>
    </div>
  )
}
