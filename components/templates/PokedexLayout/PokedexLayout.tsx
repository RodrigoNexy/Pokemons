import { ReactNode } from 'react'
import { Navigation, Footer } from '@/components/organisms'

export interface PokedexLayoutProps {
  children: ReactNode
}

export function PokedexLayout({ children }: PokedexLayoutProps) {
  return (
    <div className="min-h-screen bg-[#dddfde] flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-start justify-center py-6 px-4 md:py-8 relative">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-700 shadow-inner"></div>
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-red-700 shadow-inner"></div>
          </div>

          <div className="bg-[#57595b] rounded-lg p-2 md:p-3 shadow-2xl">
            <div className="bg-white rounded-md p-4 md:p-6 lg:p-8 min-h-[60vh]">
              {children}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 px-4">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 border-2 border-black shadow-inner"></div>
            <div className="flex flex-col gap-1.5">
              <div className="w-12 h-1 md:w-16 md:h-1.5 bg-gray-700"></div>
              <div className="w-12 h-1 md:w-16 md:h-1.5 bg-gray-700"></div>
              <div className="w-12 h-1 md:w-16 md:h-1.5 bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
