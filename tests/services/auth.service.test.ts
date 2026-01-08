import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthServiceImpl } from '@/lib/services/auth.service'
import { UserRepository } from '@/lib/repositories/user.repository'
import { hashPassword, comparePassword } from '@/lib/utils/password'
import { generateToken } from '@/lib/utils/jwt'
import { RegisterInput, LoginInput } from '@/lib/utils/validation'

vi.mock('@/lib/utils/password')
vi.mock('@/lib/utils/jwt')

describe('AuthServiceImpl', () => {
  let authService: AuthServiceImpl
  let mockUserRepository: UserRepository

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
      findById: vi.fn(),
    }
    authService = new AuthServiceImpl(mockUserRepository)
    vi.clearAllMocks()
  })

  describe('register', () => {
    const registerData: RegisterInput = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    }

    it('deve registrar novo usuário com sucesso', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(hashPassword).mockResolvedValue('hashed-password')
      vi.mocked(mockUserRepository.create).mockResolvedValue(mockUser)
      vi.mocked(generateToken).mockReturnValue('mock-token')

      const result = await authService.register(registerData)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(registerData.email)
      expect(hashPassword).toHaveBeenCalledWith(registerData.password)
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerData.email,
        password: 'hashed-password',
        name: registerData.name,
      })
      expect(generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      })
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token: 'mock-token',
      })
    })

    it('deve lançar erro quando email já está em uso', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser)

      await expect(authService.register(registerData)).rejects.toThrow('Email já está em uso')
      expect(hashPassword).not.toHaveBeenCalled()
      expect(mockUserRepository.create).not.toHaveBeenCalled()
    })

    it('deve registrar usuário sem nome quando não fornecido', async () => {
      const registerDataWithoutName: RegisterInput = {
        email: 'test@example.com',
        password: 'password123',
      }

      const userWithoutName = { ...mockUser, name: null }

      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)
      vi.mocked(hashPassword).mockResolvedValue('hashed-password')
      vi.mocked(mockUserRepository.create).mockResolvedValue(userWithoutName)
      vi.mocked(generateToken).mockReturnValue('mock-token')

      const result = await authService.register(registerDataWithoutName)

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerDataWithoutName.email,
        password: 'hashed-password',
        name: undefined,
      })
      expect(result.user.name).toBeNull()
    })
  })

  describe('login', () => {
    const loginData: LoginInput = {
      email: 'test@example.com',
      password: 'password123',
    }

    it('deve fazer login com sucesso', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser)
      vi.mocked(comparePassword).mockResolvedValue(true)
      vi.mocked(generateToken).mockReturnValue('mock-token')

      const result = await authService.login(loginData)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email)
      expect(comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password)
      expect(generateToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      })
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        token: 'mock-token',
      })
    })

    it('deve lançar erro quando usuário não existe', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)

      await expect(authService.login(loginData)).rejects.toThrow('Email ou senha inválidos')
      expect(comparePassword).not.toHaveBeenCalled()
      expect(generateToken).not.toHaveBeenCalled()
    })

    it('deve lançar erro quando senha está incorreta', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(mockUser)
      vi.mocked(comparePassword).mockResolvedValue(false)

      await expect(authService.login(loginData)).rejects.toThrow('Email ou senha inválidos')
      expect(comparePassword).toHaveBeenCalledWith(loginData.password, mockUser.password)
      expect(generateToken).not.toHaveBeenCalled()
    })
  })
})
