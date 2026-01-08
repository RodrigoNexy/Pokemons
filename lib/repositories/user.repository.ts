import { prisma } from '@/lib/prisma/client'
import { User } from '@prisma/client'

export interface CreateUserData {
  email: string
  password: string
  name?: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
  findById(id: string): Promise<User | null>
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data,
    })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }
}
