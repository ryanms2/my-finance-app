"use client"

import React from 'react'
import Link, { LinkProps } from 'next/link'
import { useNavigationLoading } from './navigation-loading-provider'

interface NavigationLinkProps extends Omit<LinkProps, 'onClick'> {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function NavigationLink({ 
  href, 
  children, 
  className, 
  onClick,
  ...props 
}: NavigationLinkProps) {
  const { navigateWithLoading } = useNavigationLoading()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Executar onClick personalizado se fornecido
    if (onClick) {
      onClick(e)
    }

    // Se o evento foi prevenido, não fazer nada
    if (e.defaultPrevented) {
      return
    }

    // Prevenir o comportamento padrão do link
    e.preventDefault()
    
    // Usar nossa navegação com loading
    navigateWithLoading(href.toString())
  }

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}
