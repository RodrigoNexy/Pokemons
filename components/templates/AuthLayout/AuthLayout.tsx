import { ReactNode } from 'react'
import { Navigation } from '@/components/organisms'

export interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-pokedex-red">
      <Navigation />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
