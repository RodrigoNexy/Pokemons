import React from 'react'
import NextImage from 'next/image'

export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function Image({ src, alt, width, height, className = '', priority = false }: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={src.startsWith('http')}
    />
  )
}
