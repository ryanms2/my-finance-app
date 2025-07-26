"use client"

import React from 'react'
import { NavigationLink } from './navigation-link'
import { useNavigationLoading } from './navigation-loading-provider'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedNavigationLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  showInlineLoader?: boolean
}

export function EnhancedNavigationLink({ 
  href, 
  children, 
  className, 
  onClick,
  showInlineLoader = true 
}: EnhancedNavigationLinkProps) {
  const { isLoading } = useNavigationLoading()

  return (
    <NavigationLink 
      href={href} 
      className={cn(
        className,
        isLoading && "opacity-80",
        "transition-all duration-200"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 relative">
        <span className={cn(isLoading && "opacity-70")}>{children}</span>
        {showInlineLoader && isLoading && (
          <Loader2 
            className="h-3 w-3 animate-spin text-purple-400 absolute -right-4"
            style={{
              animation: 'spin 1s linear infinite, fadeIn 200ms 100ms forwards',
              opacity: 0
            }}
          />
        )}
      </div>
    </NavigationLink>
  )
}
