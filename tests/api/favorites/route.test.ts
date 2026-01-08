import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/favorites/route'
import { FavoriteServiceImpl } from '@/lib/services/favorite.service'
import { verifyAuth } from '@/lib/middleware/auth.middleware'

vi.mock('@/lib/services/favorite.service')
vi.mock('@/lib/middleware/auth.middleware')

describe('GET /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar lista de favoritos do usuário', async () => {
    const mockFavorites = [
      { id: 'fav-1', pokemonId: 1, pokemonName: 'pikachu' },
      { id: 'fav-2', pokemonId: 2, pokemonName: 'charizard' },
    ]

    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      getUserFavorites: vi.fn().mockResolvedValue(mockFavorites),
    }) as any)

    const request = {} as NextRequest
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: mockFavorites,
    })
  })

  it('deve retornar erro 401 quando token é inválido', async () => {
    vi.mocked(verifyAuth).mockImplementation(() => {
      throw new Error('Token inválido ou expirado')
    })

    const request = {} as NextRequest
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
  })
})

describe('POST /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve adicionar favorito com sucesso', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      addFavorite: vi.fn().mockResolvedValue(undefined),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue({
        pokemonId: 1,
        pokemonName: 'pikachu',
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data).toEqual({
      success: true,
      message: 'Pokémon adicionado aos favoritos',
    })
  })

  it('deve retornar erro 400 quando pokemonId ou pokemonName não são fornecidos', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })

    const request = {
      json: vi.fn().mockResolvedValue({
        pokemonId: 1,
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'pokemonId e pokemonName são obrigatórios',
    })
  })

  it('deve retornar erro 400 quando Pokémon já está nos favoritos', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      addFavorite: vi.fn().mockRejectedValue(new Error('Pokémon já está nos favoritos')),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue({
        pokemonId: 1,
        pokemonName: 'pikachu',
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Pokémon já está nos favoritos',
    })
  })

  it('deve retornar erro 401 quando token é inválido', async () => {
    vi.mocked(verifyAuth).mockImplementation(() => {
      throw new Error('Token inválido ou expirado')
    })

    const request = {
      json: vi.fn().mockResolvedValue({
        pokemonId: 1,
        pokemonName: 'pikachu',
      }),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
  })
})
