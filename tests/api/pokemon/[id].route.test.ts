import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/pokemon/[id]/route'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'

vi.mock('@/lib/services/pokemon.service')

describe('GET /api/pokemon/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar Pokémon por ID numérico', async () => {
    const mockPokemon = {
      id: 1,
      name: 'pikachu',
      image: 'url',
      types: ['electric'],
      abilities: [],
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
    }

    const mockService = {
      getPokemonById: vi.fn().mockResolvedValue(mockPokemon),
      getPokemonByName: vi.fn(),
    }
    vi.mocked(PokemonServiceImpl).mockImplementation(() => mockService as any)

    const request = {} as NextRequest
    const params = { id: '1' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(mockService.getPokemonById).toHaveBeenCalledWith(1)
    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: mockPokemon,
    })
  })

  it('deve buscar Pokémon por nome quando ID não é numérico', async () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      image: 'url',
      types: ['electric'],
      abilities: [],
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
    }

    const mockService = {
      getPokemonById: vi.fn(),
      getPokemonByName: vi.fn().mockResolvedValue(mockPokemon),
    }
    vi.mocked(PokemonServiceImpl).mockImplementation(() => mockService as any)

    const request = {} as NextRequest
    const params = { id: 'pikachu' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(mockService.getPokemonByName).toHaveBeenCalledWith('pikachu')
    expect(mockService.getPokemonById).not.toHaveBeenCalled()
    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: mockPokemon,
    })
  })

  it('deve retornar erro 404 quando Pokémon não é encontrado', async () => {
    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getPokemonById: vi.fn().mockRejectedValue(new Error('Pokémon não encontrado')),
      getPokemonByName: vi.fn(),
    }) as any)

    const request = {} as NextRequest
    const params = { id: '99999' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data).toEqual({
      success: false,
      error: 'Pokémon não encontrado',
    })
  })

  it('deve retornar erro 404 genérico quando há erro desconhecido', async () => {
    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getPokemonById: vi.fn().mockRejectedValue(new Error('Erro desconhecido')),
      getPokemonByName: vi.fn(),
    }) as any)

    const request = {} as NextRequest
    const params = { id: '1' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Erro desconhecido')
  })
})
