import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/favorites/check/[pokemonId]/route'
import { FavoriteServiceImpl } from '@/lib/services/favorite.service'
import { verifyAuth } from '@/lib/middleware/auth.middleware'

vi.mock('@/lib/services/favorite.service')
vi.mock('@/lib/middleware/auth.middleware')

describe('GET /api/favorites/check/[pokemonId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar true quando Pokémon está nos favoritos', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      isFavorite: vi.fn().mockResolvedValue(true),
    }) as any)

    const request = {} as NextRequest
    const params = { pokemonId: '1' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: { isFavorite: true },
    })
  })

  it('deve retornar false quando Pokémon não está nos favoritos', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      isFavorite: vi.fn().mockResolvedValue(false),
    }) as any)

    const request = {} as NextRequest
    const params = { pokemonId: '999' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: { isFavorite: false },
    })
  })

  it('deve retornar erro 400 quando pokemonId é inválido', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })

    const request = {} as NextRequest
    const params = { pokemonId: 'invalid' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'ID do Pokémon inválido',
    })
  })

  it('deve retornar erro 401 quando token é inválido', async () => {
    vi.mocked(verifyAuth).mockImplementation(() => {
      throw new Error('Token inválido ou expirado')
    })

    const request = {} as NextRequest
    const params = { pokemonId: '1' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
  })

  it('deve retornar erro 500 quando há erro no serviço', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      isFavorite: vi.fn().mockRejectedValue(new Error('Erro interno')),
    }) as any)

    const request = {} as NextRequest
    const params = { pokemonId: '1' }

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
  })
})
