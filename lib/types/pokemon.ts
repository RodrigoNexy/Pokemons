export interface Pokemon {
  id: number
  name: string
  image: string
  types: string[]
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
  height: number
  weight: number
}

export interface PokemonListItem {
  id: number
  name: string
  image: string
  types: string[]
}

export interface PokemonListResponse {
  results: PokemonListItem[]
  total: number
  page: number
  pageSize: number
}

export interface PokemonEvolution {
  id: number
  name: string
  image: string
  level?: number
  condition?: string
}
