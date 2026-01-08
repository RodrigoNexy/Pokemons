'use client'

import { useFavorites } from '@/lib/hooks/useFavorites'
import { PokemonCard, LoadingSpinner } from '@/components/molecules'
import { usePokemon } from '@/lib/hooks/usePokemon'
import { PokemonListItem } from '@/lib/types/pokemon'

export function FavoritesList() {
    const { data: favorites, isLoading, error } = useFavorites()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" message="Carregando favoritos" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="font-mono text-lg text-red-600">
                    Erro ao carregar favoritos: {error.message}
                </p>
            </div>
        )
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="font-mono text-lg">Você ainda não tem favoritos</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((favorite) => (
                <FavoriteCard key={favorite.id} pokemonId={favorite.pokemonId} />
            ))}
        </div>
    )
}

function FavoriteCard({ pokemonId }: { pokemonId: number }) {
    const { data: pokemon, isLoading } = usePokemon(pokemonId)

    if (isLoading || !pokemon) {
        return (
            <div className="p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-300 rounded-xl shadow-md">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-40 h-40 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm animate-pulse">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="text-center w-full">
                        <div className="h-4 w-16 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                        <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-3 animate-pulse"></div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const pokemonListItem: PokemonListItem = {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
    }

    return <PokemonCard pokemon={pokemonListItem} />
}
