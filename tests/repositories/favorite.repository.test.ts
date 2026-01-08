import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaFavoriteRepository } from '@/lib/repositories/favorite.repository'
import { prisma } from '@/lib/prisma/client'
import { Favorite } from '@prisma/client'

vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    favorite: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe('PrismaFavoriteRepository', () => {
  let repository: PrismaFavoriteRepository

  const mockFavorite: Favorite = {
    id: 'favorite-123',
    userId: 'user-123',
    pokemonId: 1,
    pokemonName: 'pikachu',
    createdAt: new Date(),
  }

  beforeEach(() => {
    repository = new PrismaFavoriteRepository()
    vi.clearAllMocks()
  })

  describe('findByUserAndPokemon', () => {
    it('deve encontrar favorito por usuário e pokémon', async () => {
      vi.mocked(prisma.favorite.findUnique).mockResolvedValue(mockFavorite)

      const result = await repository.findByUserAndPokemon('user-123', 1)

      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: {
          userId_pokemonId: {
            userId: 'user-123',
            pokemonId: 1,
          },
        },
      })
      expect(result).toEqual(mockFavorite)
    })

    it('deve retornar null quando favorito não existe', async () => {
      vi.mocked(prisma.favorite.findUnique).mockResolvedValue(null)

      const result = await repository.findByUserAndPokemon('user-123', 999)

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('deve criar novo favorito', async () => {
      const createData = {
        userId: 'user-123',
        pokemonId: 1,
        pokemonName: 'pikachu',
      }

      vi.mocked(prisma.favorite.create).mockResolvedValue(mockFavorite)

      const result = await repository.create(createData)

      expect(prisma.favorite.create).toHaveBeenCalledWith({
        data: createData,
      })
      expect(result).toEqual(mockFavorite)
    })
  })

  describe('delete', () => {
    it('deve deletar favorito por id', async () => {
      vi.mocked(prisma.favorite.delete).mockResolvedValue(mockFavorite)

      await repository.delete('favorite-123')

      expect(prisma.favorite.delete).toHaveBeenCalledWith({
        where: { id: 'favorite-123' },
      })
    })
  })

  describe('findByUserId', () => {
    it('deve encontrar todos os favoritos do usuário ordenados por data', async () => {
      const favorites = [mockFavorite, { ...mockFavorite, id: 'favorite-456', pokemonId: 2 }]
      vi.mocked(prisma.favorite.findMany).mockResolvedValue(favorites)

      const result = await repository.findByUserId('user-123')

      expect(prisma.favorite.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual(favorites)
    })

    it('deve retornar array vazio quando usuário não tem favoritos', async () => {
      vi.mocked(prisma.favorite.findMany).mockResolvedValue([])

      const result = await repository.findByUserId('user-123')

      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('deve encontrar favorito por id', async () => {
      vi.mocked(prisma.favorite.findUnique).mockResolvedValue(mockFavorite)

      const result = await repository.findById('favorite-123')

      expect(prisma.favorite.findUnique).toHaveBeenCalledWith({
        where: { id: 'favorite-123' },
      })
      expect(result).toEqual(mockFavorite)
    })

    it('deve retornar null quando favorito não existe', async () => {
      vi.mocked(prisma.favorite.findUnique).mockResolvedValue(null)

      const result = await repository.findById('nonexistent-id')

      expect(result).toBeNull()
    })
  })
})
