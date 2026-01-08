'use client'

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Pokemon, PokemonListResponse } from '@/lib/types/pokemon'
import { pokemonApi } from '@/lib/api/pokemon'

export function usePokemonList(
  page: number = 1,
  pageSize: number = 20,
  type?: string
): UseQueryResult<PokemonListResponse, Error> {
  return useQuery({
    queryKey: ['pokemons', page, pageSize, type],
    queryFn: () => pokemonApi.getList(page, pageSize, type),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function usePokemon(id: number | string): UseQueryResult<Pokemon, Error> {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

export function usePokemonTypes(): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: ['pokemon-types'],
    queryFn: () => pokemonApi.getTypes(),
    staleTime: 1000 * 60 * 60, // 1 hora (tipos não mudam)
  })
}
