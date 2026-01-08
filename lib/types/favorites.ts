export interface Favorite {
  id: string
  pokemonId: number
  pokemonName: string
  createdAt: string
}

export interface FavoriteResponse {
  success: boolean
  data: Favorite[]
  error?: string
}
