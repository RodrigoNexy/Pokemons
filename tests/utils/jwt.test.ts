import { describe, it, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}))

describe('JWT Utils', () => {
  let generateToken: any
  let verifyToken: any

  const mockPayload = {
    userId: 'user-123',
    email: 'test@example.com',
  }

  const mockToken = 'mock.jwt.token'

  beforeEach(async () => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret-key'
    vi.resetModules()
    const jwtModule = await import('@/lib/utils/jwt')
    generateToken = jwtModule.generateToken
    verifyToken = jwtModule.verifyToken
  })

  describe('generateToken', () => {
    it('deve gerar um token JWT válido', () => {
      vi.mocked(jwt.sign).mockReturnValue(mockToken as any)

      const result = generateToken(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'test-secret-key',
        { expiresIn: '7d' }
      )
      expect(result).toBe(mockToken)
    })

    it('deve usar fallback secret quando JWT_SECRET não está definido', async () => {
      delete process.env.JWT_SECRET
      vi.resetModules()
      const jwtModule = await import('@/lib/utils/jwt')
      const generateTokenFallback = jwtModule.generateToken
      vi.mocked(jwt.sign).mockReturnValue(mockToken as any)

      generateTokenFallback(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'fallback-secret-key',
        { expiresIn: '7d' }
      )
    })
  })

  describe('verifyToken', () => {
    it('deve verificar e retornar o payload do token válido', () => {
      vi.mocked(jwt.verify).mockReturnValue(mockPayload as any)

      const result = verifyToken(mockToken)

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'test-secret-key')
      expect(result).toEqual(mockPayload)
    })

    it('deve lançar erro quando o token é inválido', () => {
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      expect(() => verifyToken(mockToken)).toThrow('Invalid or expired token')
    })

    it('deve lançar erro quando o token está expirado', () => {
      vi.mocked(jwt.verify).mockImplementation(() => {
        const error = new Error('Token expired') as any
        error.name = 'TokenExpiredError'
        throw error
      })

      expect(() => verifyToken(mockToken)).toThrow('Invalid or expired token')
    })
  })
})
