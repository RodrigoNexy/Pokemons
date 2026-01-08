import React from 'react'
import { getTypeColor } from '@/lib/constants/colors'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'type'
  type?: string
  className?: string
}

export function Badge({ children, variant = 'default', type, className = '' }: BadgeProps) {
  const baseStyles = 'inline-block px-3 py-1 font-mono font-bold text-sm uppercase rounded-full transition-all'
  
  if (variant === 'type' && type) {
    const typeColor = getTypeColor(type)
    return (
      <span
        className={`${baseStyles} text-white shadow-md hover:shadow-lg ${className}`}
        style={{ backgroundColor: typeColor }}
      >
        {children}
      </span>
    )
  }

  return (
    <span className={`${baseStyles} bg-pokedex-blue text-white border-2 border-pokedex-blue-dark shadow-md hover:shadow-lg ${className}`}>
      {children}
    </span>
  )
}
