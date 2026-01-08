import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrismaUserRepository } from '@/lib/repositories/user.repository'
import { prisma } from '@/lib/prisma/client'
import { User } from '@prisma/client'

vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    repository = new PrismaUserRepository()
    vi.clearAllMocks()
  })

  describe('findByEmail', () => {
    it('deve encontrar usuário por email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await repository.findByEmail('test@example.com')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(result).toEqual(mockUser)
    })

    it('deve retornar null quando usuário não existe', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const result = await repository.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('deve criar novo usuário', async () => {
      const createData = {
        email: 'new@example.com',
        password: 'hashed-password',
        name: 'New User',
      }

      const newUser: User = {
        ...mockUser,
        ...createData,
        id: 'new-user-123',
      }

      vi.mocked(prisma.user.create).mockResolvedValue(newUser)

      const result = await repository.create(createData)

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: createData,
      })
      expect(result).toEqual(newUser)
    })

    it('deve criar usuário sem nome opcional', async () => {
      const createData = {
        email: 'new@example.com',
        password: 'hashed-password',
      }

      const newUser: User = {
        ...mockUser,
        ...createData,
        id: 'new-user-123',
        name: null,
      }

      vi.mocked(prisma.user.create).mockResolvedValue(newUser)

      const result = await repository.create(createData)

      expect(result.name).toBeNull()
    })
  })

  describe('findById', () => {
    it('deve encontrar usuário por id', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await repository.findById('user-123')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      })
      expect(result).toEqual(mockUser)
    })

    it('deve retornar null quando usuário não existe', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const result = await repository.findById('nonexistent-id')

      expect(result).toBeNull()
    })
  })
})
