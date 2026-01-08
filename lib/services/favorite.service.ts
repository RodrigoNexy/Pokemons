import {
  FavoriteRepository,
  PrismaFavoriteRepository,
} from '@/lib/repositories/favorite.repository'

export interface FavoriteService {
  addFavorite(userId: string, pokemonId: number, pokemonName: string): Promise<void>
  removeFavorite(userId: string, pokemonId: number): Promise<void>
  getUserFavorites(userId: string): Promise<Array<{ id: string; pokemonId: number; pokemonName: string }>>
  isFavorite(userId: string, pokemonId: number): Promise<boolean>
}

export class FavoriteServiceImpl implements FavoriteService {
  constructor(
    private favoriteRepository: FavoriteRepository = new PrismaFavoriteRepository()
  ) {}

  async addFavorite(userId: string, pokemonId: number, pokemonName: string) {
    const existing = await this.favoriteRepository.findByUserAndPokemon(
      userId,
      pokemonId
    )

    if (existing) {
      throw new Error('Pokémon já está nos favoritos')
    }

    await this.favoriteRepository.create({
      userId,
      pokemonId,
      pokemonName,
    })
  }

  async removeFavorite(userId: string, pokemonId: number) {
    const favorite = await this.favoriteRepository.findByUserAndPokemon(
      userId,
      pokemonId
    )

    if (!favorite) {
      throw new Error('Pokémon não está nos favoritos')
    }

    await this.favoriteRepository.delete(favorite.id)
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.favoriteRepository.findByUserId(userId)
    
    return favorites.map((fav) => ({
      id: fav.id,
      pokemonId: fav.pokemonId,
      pokemonName: fav.pokemonName,
    }))
  }

  async isFavorite(userId: string, pokemonId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findByUserAndPokemon(
      userId,
      pokemonId
    )
    return !!favorite
  }
}
