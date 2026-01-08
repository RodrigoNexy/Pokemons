import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'
import axios from 'axios'

vi.mock('axios')

describe('PokemonServiceImpl', () => {
  let pokemonService: PokemonServiceImpl

  const mockPokemonData = {
    id: 1,
    name: 'pikachu',
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-official.png',
        },
      },
    },
    types: [
      { type: { name: 'electric' } },
    ],
    abilities: [
      { ability: { name: 'static' } },
    ],
    stats: [
      { base_stat: 35 },
      { base_stat: 55 },
      { base_stat: 40 },
      { base_stat: 50 },
      { base_stat: 50 },
      { base_stat: 90 },
    ],
    height: 4,
    weight: 60,
  }

  beforeEach(() => {
    pokemonService = new PokemonServiceImpl()
    vi.clearAllMocks()
  })

  describe('getPokemonById', () => {
    it('deve buscar Pokémon por ID e transformar dados', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPokemonData })

      const result = await pokemonService.getPokemonById(1)

      expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1')
      expect(result).toEqual({
        id: 1,
        name: 'pikachu',
        image: 'https://example.com/pikachu-official.png',
        types: ['electric'],
        abilities: ['static'],
        stats: {
          hp: 35,
          attack: 55,
          defense: 40,
          specialAttack: 50,
          specialDefense: 50,
          speed: 90,
        },
        height: 0.4,
        weight: 6.0,
      })
    })

    it('deve usar front_default quando official-artwork não está disponível', async () => {
      const dataWithoutOfficial = {
        ...mockPokemonData,
        sprites: {
          front_default: 'https://example.com/pikachu.png',
          other: {
            'official-artwork': {},
          },
        },
      }
      vi.mocked(axios.get).mockResolvedValue({ data: dataWithoutOfficial })

      const result = await pokemonService.getPokemonById(1)

      expect(result.image).toBe('https://example.com/pikachu.png')
    })
  })

  describe('getPokemonByName', () => {
    it('deve buscar Pokémon por nome em lowercase', async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockPokemonData })

      await pokemonService.getPokemonByName('Pikachu')

      expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
    })
  })

  describe('getPokemonList', () => {
    it('deve buscar lista de Pokémons com paginação', async () => {
      const mockListResponse = {
        data: {
          count: 1000,
          results: [
            { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { url: 'https://pokeapi.co/api/v2/pokemon/2/' },
          ],
        },
      }

      vi.mocked(axios.get)
        .mockResolvedValueOnce(mockListResponse)
        .mockResolvedValueOnce({ data: mockPokemonData })
        .mockResolvedValueOnce({ data: { ...mockPokemonData, id: 2, name: 'ivysaur' } })

      const result = await pokemonService.getPokemonList(1, 2)

      expect(axios.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=2&offset=0'
      )
      expect(result).toEqual({
        results: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            image: expect.any(String),
            types: expect.any(Array),
          }),
        ]),
        total: 1000,
        page: 1,
        pageSize: 2,
      })
    })

    it('deve buscar lista de Pokémons por tipo', async () => {
      const mockTypeResponse = {
        data: {
          pokemon: [
            { pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/1/' } },
            { pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/2/' } },
          ],
        },
      }

      vi.mocked(axios.get)
        .mockResolvedValueOnce(mockTypeResponse)
        .mockResolvedValueOnce({ data: mockPokemonData })
        .mockResolvedValueOnce({ data: { ...mockPokemonData, id: 2 } })

      const result = await pokemonService.getPokemonList(1, 2, 'electric')

      expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/electric')
      expect(result.total).toBe(2)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(2)
    })

    it('deve lançar erro quando há falha na requisição', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'))

      await expect(pokemonService.getPokemonList(1, 20)).rejects.toThrow(
        'Erro ao buscar lista de Pokémons'
      )
    })
  })

  describe('getAllTypes', () => {
    it('deve buscar todos os tipos de Pokémon', async () => {
      const mockTypesResponse = {
        data: {
          results: [
            { name: 'normal' },
            { name: 'fighting' },
            { name: 'flying' },
          ],
        },
      }

      vi.mocked(axios.get).mockResolvedValue(mockTypesResponse)

      const result = await pokemonService.getAllTypes()

      expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type')
      expect(result).toEqual(['normal', 'fighting', 'flying'])
    })

    it('deve lançar erro quando há falha na requisição', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'))

      await expect(pokemonService.getAllTypes()).rejects.toThrow(
        'Erro ao buscar tipos de Pokémon'
      )
    })
  })
})
