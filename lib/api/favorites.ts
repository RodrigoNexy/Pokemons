import { apiClient } from './client'
import { Favorite } from '@/lib/types/favorites'
import { API_ROUTES } from '@/lib/constants/routes'

export const favoritesApi = {
  getList: async (): Promise<Favorite[]> => {
    const response = await apiClient.get<Favorite[]>(API_ROUTES.FAVORITES.LIST)
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao buscar favoritos')
    }
    return response.data
  },

  add: async (pokemonId: number, pokemonName: string): Promise<void> => {
    const response = await apiClient.post(API_ROUTES.FAVORITES.ADD, {
      pokemonId,
      pokemonName,
    })
    if (!response.success) {
      throw new Error(response.error || 'Erro ao adicionar favorito')
    }
  },

  remove: async (pokemonId: number): Promise<void> => {
    const response = await apiClient.delete(API_ROUTES.FAVORITES.REMOVE(pokemonId))
    if (!response.success) {
      throw new Error(response.error || 'Erro ao remover favorito')
    }
  },

  check: async (pokemonId: number): Promise<boolean> => {
    const response = await apiClient.get<{ isFavorite: boolean }>(
      API_ROUTES.FAVORITES.CHECK(pokemonId)
    )
    if (!response.success || !response.data) {
      return false
    }
    return response.data.isFavorite
  },
}
