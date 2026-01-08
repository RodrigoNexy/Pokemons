'use client'

import { Card } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { Image } from '@/components/atoms'
import { PokemonListItem } from '@/lib/types/pokemon'
import { formatPokemonName, formatNumber } from '@/lib/utils/format'
import { ROUTES } from '@/lib/constants/routes'
import { useRouter } from 'next/navigation'
import { useFavoriteCheck, useAddFavorite, useRemoveFavorite } from '@/lib/hooks/useFavorites'
import { useAuth } from '@/lib/hooks/useAuth'
import { Heart } from 'lucide-react'

export interface PokemonCardProps {
  pokemon: PokemonListItem
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { data: isFavorite, isLoading: isChecking } = useFavoriteCheck(pokemon.id)
  const addFavorite = useAddFavorite()
  const removeFavorite = useRemoveFavorite()

  const handleClick = () => {
    router.push(ROUTES.POKEMON_DETAIL(pokemon.id))
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      return
    }

    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(pokemon.id)
      } else {
        await addFavorite.mutateAsync({ pokemonId: pokemon.id, pokemonName: pokemon.name })
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error)
    }
  }

  const isLoading = isChecking || addFavorite.isPending || removeFavorite.isPending

  return (
    <Card onClick={handleClick} hover className="p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-40 h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm">
          <Image
            src={pokemon.image}
            alt={formatPokemonName(pokemon.name)}
            width={160}
            height={160}
            className="object-contain"
          />

          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white border-2 border-gray-300 shadow-md hover:shadow-lg transition-all z-10 disabled:opacity-50"
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-none'}`}
                strokeWidth="2"
              />
            </button>
          )}
        </div>

        <div className="text-center w-full">
          <p className="font-mono text-xs text-gray-500 mb-2">
            #{formatNumber(pokemon.id)}
          </p>
          <h3 className="font-mono font-bold text-lg text-gray-800 mb-3 uppercase">
            {formatPokemonName(pokemon.name)}
          </h3>

          <div className="flex flex-wrap gap-2 justify-center">
            {pokemon.types.map((type) => (
              <Badge key={type} variant="type" type={type} className="rounded-full">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
