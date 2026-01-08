'use client'

import { PokemonCard } from '@/components/molecules'
import { LoadingSpinner } from '@/components/molecules'
import { usePokemonList } from '@/lib/hooks/usePokemon'
import { Button } from '@/components/atoms'

export interface PokemonListProps {
  page?: number
  pageSize?: number
  type?: string
  onPageChange?: (page: number) => void
}

export function PokemonList({ page = 1, pageSize = 20, type, onPageChange }: PokemonListProps) {
  const { data, isLoading, error } = usePokemonList(page, pageSize, type)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" message="Buscando Pokémons" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-mono text-lg text-red-600">Erro ao carregar Pokémons: {error.message}</p>
      </div>
    )
  }

  if (!data || data.results.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-mono text-lg">Nenhum Pokémon encontrado</p>
      </div>
    )
  }

  const totalPages = Math.ceil(data.total / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {data.results.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {onPageChange && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
          >
            ← Anterior
          </Button>

          <span className="font-mono font-bold text-gray-800">
            Página {page} de {totalPages}
          </span>

          <Button
            variant="secondary"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            Próxima →
          </Button>
        </div>
      )}
    </div>
  )
}
