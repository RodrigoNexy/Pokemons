'use client'

import { Badge } from '@/components/atoms'
import { usePokemonTypes } from '@/lib/hooks/usePokemon'
import { capitalize } from '@/lib/utils/format'
import { getTypeColor } from '@/lib/constants/colors'

export interface TypeFilterProps {
  selectedType?: string
  onTypeSelect: (type: string | undefined) => void
}

export function TypeFilter({ selectedType, onTypeSelect }: TypeFilterProps) {
  const { data: types, isLoading } = usePokemonTypes()

  if (isLoading) {
    return <div className="flex flex-wrap gap-2">Carregando tipos...</div>
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTypeSelect(undefined)}
        className={`px-4 py-2 font-mono font-bold text-sm uppercase rounded-full transition-all duration-200 ${
          !selectedType
            ? 'bg-pokedex-red text-white shadow-md hover:shadow-lg hover:bg-pokedex-red-dark'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
        }`}
      >
        Todos
      </button>
      
      {types?.map((type) => {
        const typeColor = selectedType === type ? undefined : getTypeColor(type)
        return (
          <button
            key={type}
            onClick={() => onTypeSelect(type)}
            className={`px-4 py-2 font-mono font-bold text-sm uppercase rounded-full transition-all duration-200 ${
              selectedType === type
                ? 'bg-pokedex-red text-white shadow-md hover:shadow-lg hover:bg-pokedex-red-dark'
                : 'text-white shadow-sm hover:shadow-md border-2 border-transparent hover:border-white/30'
            }`}
            style={!selectedType || selectedType !== type ? { backgroundColor: typeColor } : undefined}
          >
            {capitalize(type)}
          </button>
        )
      })}
    </div>
  )
}
