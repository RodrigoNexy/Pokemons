import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FavoriteServiceImpl } from '@/lib/services/favorite.service'
import { FavoriteRepository } from '@/lib/repositories/favorite.repository'

describe('FavoriteServiceImpl', () => {
  let favoriteService: FavoriteServiceImpl
  let mockFavoriteRepository: FavoriteRepository

  const mockFavorite = {
    id: 'favorite-123',
    userId: 'user-123',
    pokemonId: 1,
    pokemonName: 'pikachu',
    createdAt: new Date(),
  }

  beforeEach(() => {
    mockFavoriteRepository = {
      findByUserAndPokemon: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findByUserId: vi.fn(),
      findById: vi.fn(),
    }
    favoriteService = new FavoriteServiceImpl(mockFavoriteRepository)
    vi.clearAllMocks()
  })

  describe('addFavorite', () => {
    it('deve adicionar favorito com sucesso', async () => {
      vi.mocked(mockFavoriteRepository.findByUserAndPokemon).mockResolvedValue(null)
      vi.mocked(mockFavoriteRepository.create).mockResolvedValue(mockFavorite)

      await favoriteService.addFavorite('user-123', 1, 'pikachu')

      expect(mockFavoriteRepository.findByUserAndPokemon).toHaveBeenCalledWith('user-123', 1)
      expect(mockFavoriteRepository.create).toHaveBeenCalledWith({
        userId: 'user-123',
        pokemonId: 1,
        pokemonName: 'pikachu',
      })
    })

    it('deve lançar erro quando Pokémon já está nos favoritos', async () => {
      vi.mocked(mockFavoriteRepository.findByUserAndPokemon).mockResolvedValue(mockFavorite)

      await expect(
        favoriteService.addFavorite('user-123', 1, 'pikachu')
      ).rejects.toThrow('Pokémon já está nos favoritos')
      expect(mockFavoriteRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('removeFavorite', () => {
    it('deve remover favorito com sucesso', async () => {
      vi.mocked(mockFavoriteRepository.findByUserAndPokemon).mockResolvedValue(mockFavorite)
      vi.mocked(mockFavoriteRepository.delete).mockResolvedValue()

      await favoriteService.removeFavorite('user-123', 1)

      expect(mockFavoriteRepository.findByUserAndPokemon).toHaveBeenCalledWith('user-123', 1)
      expect(mockFavoriteRepository.delete).toHaveBeenCalledWith('favorite-123')
    })

    it('deve lançar erro quando Pokémon não está nos favoritos', async () => {
      vi.mocked(mockFavoriteRepository.findByUserAndPokemon).mockResolvedValue(null)

      await expect(
        favoriteService.removeFavorite('user-123', 1)
      ).rejects.toThrow('Pokémon não está nos favoritos')
      expect(mockFavoriteRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('getUserFavorites', () => {
    it('deve retornar lista de favoritos do usuário', async () => {
      const favorites = [
        mockFavorite,
        { ...mockFavorite, id: 'favorite-456', pokemonId: 2, pokemonName: 'charizard' },
      ]
      vi.mocked(mockFavoriteRepository.findByUserId).mockResolvedValue(favorites as any)

      const result = await favoriteService.getUserFavorites('user-123')

      expect(mockFavoriteRepository.findByUserId).toHaveBeenCalledWith('user-123')
      expect(result).toEqual([
        {
          id: 'favorite-123',
          pokemonId: 1,
          pokemonName: 'pikachu',
        },
        {
          id: 'favorite-456',
          pokemonId: 2,
          pokemonName: 'charizard',
        },
      ])
    })

    it('deve retornar array vazio quando usuário não tem favoritos', async () => {
      vi.mocked(mockFavoriteRepository.findByUserId).mockResolvedValue([])

      const result = await favoriteService.getUserFavorites('user-123')

      expect(result).toEqual([])
    })
  })

  describe('isFavorite', () => {
    it('deve retornar true quando Pokémon está nos favoritos', async () => {
      vi.mocked(mockFavoriteRepository.findByUserAndPokemon).mockResolvedValue(mockFavorite)

      const result = await favoriteService.isFavorite('user-123', 1)

      expect(result).toBe(true)
      expect(mockFavoriteRepository.findByUserAndPokemon).toHaveBeenCalledWith('user-123', 1)
    })

    it('deve retornar false quando Pokémon não está nos favoritos', async () => {
      vi.mocked(mockFavoriteRepository.findByUserAndPokemon).mockResolvedValue(null)

      const result = await favoriteService.isFavorite('user-123', 1)

      expect(result).toBe(false)
    })
  })
})
