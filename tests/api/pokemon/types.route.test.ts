import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/pokemon/types/route'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'

vi.mock('@/lib/services/pokemon.service')

describe('GET /api/pokemon/types', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar lista de tipos de Pokémon', async () => {
    const mockTypes = ['normal', 'fighting', 'flying', 'electric', 'water']

    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getAllTypes: vi.fn().mockResolvedValue(mockTypes),
    }) as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: mockTypes,
    })
  })

  it('deve retornar erro 500 quando há falha no serviço', async () => {
    vi.mocked(PokemonServiceImpl).mockImplementation(() => ({
      getAllTypes: vi.fn().mockRejectedValue(new Error('Erro ao buscar tipos')),
    }) as any)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({
      success: false,
      error: 'Erro ao buscar tipos',
    })
  })
})
