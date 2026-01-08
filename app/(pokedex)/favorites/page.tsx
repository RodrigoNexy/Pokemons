'use client'

import { PokedexLayout } from '@/components/templates'
import { FavoritesList, ProtectedRoute } from '@/components/organisms'
import { Card } from '@/components/atoms'

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <PokedexLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="font-mono font-bold text-4xl text-gray-800 mb-2 uppercase drop-shadow-lg">
              Meus Favoritos
            </h1>
            <p className="font-mono text-gray-700">
              Pokémons que você favoritou
            </p>
          </div>

          <FavoritesList />
        </div>
      </PokedexLayout>
    </ProtectedRoute>
  )
}
