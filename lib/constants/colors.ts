export const COLORS = {
  GAMEBOY: {
    BG: '#8b956d',
    SCREEN: '#9bbc0f',
    DARK: '#0f380f',
    LIGHT: '#306230',
  },
  POKEDEX: {
    RED: '#dc2626',
    BLUE: '#2563eb',
    YELLOW: '#fbbf24',
  },
  TYPE: {
    NORMAL: '#A8A878',
    FIRE: '#F08030',
    WATER: '#6890F0',
    ELECTRIC: '#F8D030',
    GRASS: '#78C850',
    ICE: '#98D8D8',
    FIGHTING: '#C03028',
    POISON: '#A040A0',
    GROUND: '#E0C068',
    FLYING: '#A890F0',
    PSYCHIC: '#F85888',
    BUG: '#A8B820',
    ROCK: '#B8A038',
    GHOST: '#705898',
    DRAGON: '#7038F8',
    DARK: '#705848',
    STEEL: '#B8B8D0',
    FAIRY: '#EE99AC',
  },
} as const

export const getTypeColor = (type: string): string => {
  const upperType = type.toUpperCase() as keyof typeof COLORS.TYPE
  return COLORS.TYPE[upperType] || COLORS.TYPE.NORMAL
}
