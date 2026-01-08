import React from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-mono font-bold uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-pokedex-red text-white hover:bg-pokedex-red-dark active:bg-pokedex-red-dark border-2 border-pokedex-red-dark rounded-lg shadow-md hover:shadow-lg transition-all',
    secondary: 'bg-pokedex-blue text-white hover:bg-pokedex-blue-dark active:bg-pokedex-blue-dark border-2 border-pokedex-blue-dark rounded-lg shadow-md hover:shadow-lg transition-all',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border-2 border-red-600 rounded-lg shadow-md hover:shadow-lg transition-all',
    ghost: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
