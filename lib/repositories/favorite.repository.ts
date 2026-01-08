import { prisma } from '@/lib/prisma/client'
import { Favorite } from '@prisma/client'

export interface CreateFavoriteData {
  userId: string
  pokemonId: number
  pokemonName: string
}

export interface FavoriteRepository {
  findByUserAndPokemon(userId: string, pokemonId: number): Promise<Favorite | null>
  create(data: CreateFavoriteData): Promise<Favorite>
  delete(id: string): Promise<void>
  findByUserId(userId: string): Promise<Favorite[]>
  findById(id: string): Promise<Favorite | null>
}

export class PrismaFavoriteRepository implements FavoriteRepository {
  async findByUserAndPokemon(
    userId: string,
    pokemonId: number
  ): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: {
        userId_pokemonId: {
          userId,
          pokemonId,
        },
      },
    })
  }

  async create(data: CreateFavoriteData): Promise<Favorite> {
    return prisma.favorite.create({
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.favorite.delete({
      where: { id },
    })
  }

  async findByUserId(userId: string): Promise<Favorite[]> {
    return prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: { id },
    })
  }
}
