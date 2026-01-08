import axios from 'axios'

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'

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

export interface PokemonService {
  getPokemonById(id: number): Promise<Pokemon>
  getPokemonByName(name: string): Promise<Pokemon>
  getPokemonList(page: number, pageSize: number, type?: string): Promise<PokemonListResponse>
  getAllTypes(): Promise<string[]>
}

export class PokemonServiceImpl implements PokemonService {
  private async fetchPokemonData(idOrName: number | string): Promise<any> {
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`)
    return response.data
  }

  private transformPokemonData(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
      height: data.height / 10, // Convert to meters
      weight: data.weight / 10, // Convert to kg
    }
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const data = await this.fetchPokemonData(id)
    return this.transformPokemonData(data)
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    const data = await this.fetchPokemonData(name.toLowerCase())
    return this.transformPokemonData(data)
  }

  async getPokemonList(
    page: number = 1,
    pageSize: number = 20,
    type?: string
  ): Promise<PokemonListResponse> {
    try {
      if (type) {
        return this.getPokemonListByType(type, page, pageSize)
      }

      const offset = (page - 1) * pageSize
      const response = await axios.get(
        `${POKEAPI_BASE_URL}/pokemon?limit=${pageSize}&offset=${offset}`
      )

      const pokemonList = await Promise.all(
        response.data.results.map(async (pokemon: any) => {
          const pokemonData = await this.fetchPokemonData(
            pokemon.url.split('/').slice(-2, -1)[0]
          )
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image:
              pokemonData.sprites.other['official-artwork'].front_default ||
              pokemonData.sprites.front_default,
            types: pokemonData.types.map((t: any) => t.type.name),
          }
        })
      )

      return {
        results: pokemonList,
        total: response.data.count,
        page,
        pageSize,
      }
    } catch (error) {
      throw new Error('Erro ao buscar lista de Pokémons')
    }
  }

  private async getPokemonListByType(
    type: string,
    page: number,
    pageSize: number
  ): Promise<PokemonListResponse> {
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}/type/${type}`)
      const allPokemons = response.data.pokemon

      const offset = (page - 1) * pageSize
      const paginatedPokemons = allPokemons.slice(offset, offset + pageSize)

      const pokemonList = await Promise.all(
        paginatedPokemons.map(async (item: any) => {
          const pokemonId = item.pokemon.url.split('/').slice(-2, -1)[0]
          const pokemonData = await this.fetchPokemonData(pokemonId)
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image:
              pokemonData.sprites.other['official-artwork'].front_default ||
              pokemonData.sprites.front_default,
            types: pokemonData.types.map((t: any) => t.type.name),
          }
        })
      )

      return {
        results: pokemonList,
        total: allPokemons.length,
        page,
        pageSize,
      }
    } catch (error) {
      throw new Error('Erro ao buscar Pokémons por tipo')
    }
  }

  async getAllTypes(): Promise<string[]> {
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}/type`)
      return response.data.results.map((type: any) => type.name)
    } catch (error) {
      throw new Error('Erro ao buscar tipos de Pokémon')
    }
  }
}
