'use client'

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Favorite } from '@/lib/types/favorites'
import { favoritesApi } from '@/lib/api/favorites'

export function useFavorites(): UseQueryResult<Favorite[], Error> {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getList(),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  })
}

export function useFavoriteCheck(pokemonId: number): UseQueryResult<boolean, Error> {
  return useQuery({
    queryKey: ['favorite-check', pokemonId],
    queryFn: () => favoritesApi.check(pokemonId),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token') && !!pokemonId,
  })
}

export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pokemonId, pokemonName }: { pokemonId: number; pokemonName: string }) =>
      favoritesApi.add(pokemonId, pokemonName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-check'] })
    },
  })
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pokemonId: number) => favoritesApi.remove(pokemonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['favorite-check'] })
    },
  })
}
