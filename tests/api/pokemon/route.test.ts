import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/pokemon/route'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'

vi.mock('@/lib/services/pokemon.service')

describe('GET /api/pokemon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar lista de Pokémons com parâmetros padrão', async () => {
    const mockResult = {
      results: [
        { id: 1, name: 'pikachu', image: 'url', types: ['electric'] },
      ],
      total: 1000,
      page: 1,
      pageSize: 20,
    }

    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getPokemonList: vi.fn().mockResolvedValue(mockResult),
    }) as any)

    const url = new URL('http://localhost:3000/api/pokemon')
    const request = {
      nextUrl: { searchParams: url.searchParams },
    } as unknown as NextRequest

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: mockResult,
    })
  })

  it('deve retornar lista de Pokémons com paginação customizada', async () => {
    const mockResult = {
      results: [],
      total: 1000,
      page: 2,
      pageSize: 10,
    }

    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getPokemonList: vi.fn().mockResolvedValue(mockResult),
    }) as any)

    const url = new URL('http://localhost:3000/api/pokemon?page=2&pageSize=10')
    const request = {
      nextUrl: { searchParams: url.searchParams },
    } as unknown as NextRequest

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.page).toBe(2)
    expect(data.data.pageSize).toBe(10)
  })

  it('deve retornar lista de Pokémons filtrada por tipo', async () => {
    const mockResult = {
      results: [],
      total: 50,
      page: 1,
      pageSize: 20,
    }

    const mockService = {
      getPokemonList: vi.fn().mockResolvedValue(mockResult),
    }
    vi.mocked(PokemonServiceImpl).mockImplementation(() => mockService as any)

    const url = new URL('http://localhost:3000/api/pokemon?type=electric')
    const request = {
      nextUrl: { searchParams: url.searchParams },
    } as unknown as NextRequest

    const response = await GET(request)

    expect(mockService.getPokemonList).toHaveBeenCalledWith(1, 20, 'electric')
    expect(response.status).toBe(200)
  })

  it('deve retornar erro 500 quando há falha no serviço', async () => {
    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getPokemonList: vi.fn().mockRejectedValue(new Error('Erro ao buscar Pokémons')),
    }) as any)

    const url = new URL('http://localhost:3000/api/pokemon')
    const request = {
      nextUrl: { searchParams: url.searchParams },
    } as unknown as NextRequest

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      success: false,
      error: 'Erro ao buscar Pokémons',
    })
  })
})
