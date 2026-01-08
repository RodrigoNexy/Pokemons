import { apiClient } from './client'
import { Pokemon, PokemonListResponse } from '@/lib/types/pokemon'
import { API_ROUTES } from '@/lib/constants/routes'

export const pokemonApi = {
  getList: async (
    page: number = 1,
    pageSize: number = 20,
    type?: string
  ): Promise<PokemonListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })
    if (type) {
      params.append('type', type)
    }

    const response = await apiClient.get<PokemonListResponse>(
      `${API_ROUTES.POKEMON.LIST}?${params.toString()}`
    )
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao buscar Pokémons')
    }
    return response.data
  },

  getById: async (id: number | string): Promise<Pokemon> => {
    const response = await apiClient.get<Pokemon>(
      API_ROUTES.POKEMON.DETAIL(id)
    )
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Pokémon não encontrado')
    }
    return response.data
  },

  getTypes: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>(API_ROUTES.POKEMON.TYPES)
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao buscar tipos')
    }
    return response.data
  },
}
