import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseStyles = 'bg-white border-2 border-gray-300 rounded-xl shadow-md transition-all duration-300'
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1 hover:border-gray-400 cursor-pointer' : ''
  const clickStyles = onClick ? 'cursor-pointer active:shadow-sm active:translate-y-0' : ''

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${clickStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}
