export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  POKEDEX: '/pokedex',
  POKEMON_DETAIL: (id: number | string) => `/pokemon/${id}`,
  FAVORITES: '/favorites',
  BATTLE: '/battle',
} as const

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
  POKEMON: {
    LIST: '/api/pokemon',
    DETAIL: (id: number | string) => `/api/pokemon/${id}`,
    TYPES: '/api/pokemon/types',
  },
  FAVORITES: {
    LIST: '/api/favorites',
    ADD: '/api/favorites',
    REMOVE: (pokemonId: number) => `/api/favorites/${pokemonId}`,
    CHECK: (pokemonId: number) => `/api/favorites/check/${pokemonId}`,
  },
} as const
