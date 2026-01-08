import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const baseStyles = 'w-full px-4 py-2 font-mono border-2 border-gray-300 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-pokedex-blue focus:border-pokedex-blue transition-all shadow-sm hover:shadow-md'
  
  const errorStyles = error ? 'border-red-400 focus:ring-red-400' : ''

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block mb-2 font-mono font-bold text-gray-700 uppercase text-sm">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>
      )}
    </div>
  )
}
