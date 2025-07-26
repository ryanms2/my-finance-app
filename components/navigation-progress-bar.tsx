"use client"

import React from 'react'
import { useNavigationLoading } from './navigation-loading-provider'

export function NavigationProgressBar() {
  const { isLoading } = useNavigationLoading()

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-0.5">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 shadow-sm shadow-purple-500/30"
        style={{
          animation: 'progress-loading 1.2s ease-in-out infinite',
          transformOrigin: 'left center'
        }}
      />
    </div>
  )
}
