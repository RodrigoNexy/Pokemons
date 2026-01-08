export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatPokemonName = (name: string | undefined | null): string => {
  if (!name) return ''
  return name
    .split('-')
    .map((word) => capitalize(word))
    .join(' ')
}

export const formatNumber = (num: number): string => {
  return num.toString().padStart(3, '0')
}

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)} kg`
}

export const formatHeight = (height: number): string => {
  return `${height.toFixed(2)} m`
}
