import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { DELETE } from '@/app/api/favorites/[pokemonId]/route'
import { FavoriteServiceImpl } from '@/lib/services/favorite.service'
import { verifyAuth } from '@/lib/middleware/auth.middleware'

vi.mock('@/lib/services/favorite.service')
vi.mock('@/lib/middleware/auth.middleware')

describe('DELETE /api/favorites/[pokemonId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve remover favorito com sucesso', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      removeFavorite: vi.fn().mockResolvedValue(undefined),
    }) as any)

    const request = {} as NextRequest
    const params = { pokemonId: '1' }

    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      message: 'Pokémon removido dos favoritos',
    })
  })

  it('deve retornar erro 400 quando pokemonId é inválido', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })

    const request = {} as NextRequest
    const params = { pokemonId: 'invalid' }

    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'ID do Pokémon inválido',
    })
  })

  it('deve retornar erro 400 quando Pokémon não está nos favoritos', async () => {
    vi.mocked(verifyAuth).mockReturnValue({ userId: 'user-123', email: 'test@example.com' })
    vi.mocked(FavoriteServiceImpl).mockImplementation(() => ({
      removeFavorite: vi.fn().mockRejectedValue(new Error('Pokémon não está nos favoritos')),
    }) as any)

    const request = {} as NextRequest
    const params = { pokemonId: '999' }

    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Pokémon não está nos favoritos',
    })
  })

  it('deve retornar erro 401 quando token é inválido', async () => {
    vi.mocked(verifyAuth).mockImplementation(() => {
      throw new Error('Token inválido ou expirado')
    })

    const request = {} as NextRequest
    const params = { pokemonId: '1' }

    const response = await DELETE(request, { params })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
  })
})
