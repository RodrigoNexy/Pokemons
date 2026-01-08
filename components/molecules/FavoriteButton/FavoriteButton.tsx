'use client'

import { Star } from 'lucide-react'
import { Button } from '@/components/atoms'
import { useFavoriteCheck, useAddFavorite, useRemoveFavorite } from '@/lib/hooks/useFavorites'
import { useAuth } from '@/lib/hooks/useAuth'

export interface FavoriteButtonProps {
  pokemonId: number
  pokemonName: string
}

export function FavoriteButton({ pokemonId, pokemonName }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth()
  const { data: isFavorite, isLoading: isChecking } = useFavoriteCheck(pokemonId)
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

  if (!isAuthenticated) {
    return null
  }

  const handleToggle = async () => {
    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(pokemonId)
      } else {
        await addFavorite.mutateAsync({ pokemonId, pokemonName })
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error)
    }
  }

  const isLoading = isChecking || addFavorite.isPending || removeFavorite.isPending

  return (
    <Button
      variant={isFavorite ? 'secondary' : 'ghost'}
      onClick={handleToggle}
      isLoading={isLoading}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isFavorite ? (
        <>
          <Star className="w-4 h-4 fill-current" />
          Favoritado
        </>
      ) : (
        <>
          <Star className="w-4 h-4" />
          Favoritar
        </>
      )}
    </Button>
  )
}
