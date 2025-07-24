import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InlineLoadingProps {
  text?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function InlineLoading({ 
  text = "Carregando...", 
  className,
  size = "md" 
}: InlineLoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn("flex items-center gap-2 text-gray-400", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      <span className={textSizes[size]}>{text}</span>
    </div>
  )
}

// Componente para estados de loading em cards
export function CardLoadingState({ 
  title = "Carregando dados...",
  subtitle,
  className 
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-200">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  )
}

// Loading state para listas vazias
export function EmptyStateLoading({
  icon: Icon,
  title = "Carregando...",
  description,
  className
}: {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="relative mb-4">
        {Icon ? (
          <Icon className="h-16 w-16 text-gray-600 animate-pulse" />
        ) : (
          <div className="h-16 w-16 bg-gray-700 rounded-full animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-medium text-gray-200 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 max-w-md">{description}</p>
      )}
    </div>
  )
}

// Adição de animação com delay personalizado
const style = `
  @keyframes spin-delay {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animation-delay-150 {
    animation-delay: 150ms;
  }
`

// Injetar estilos no head se não existirem
if (typeof document !== 'undefined' && !document.getElementById('inline-loading-styles')) {
  const styleElement = document.createElement('style')
  styleElement.id = 'inline-loading-styles'
  styleElement.textContent = style
  document.head.appendChild(styleElement)
}
