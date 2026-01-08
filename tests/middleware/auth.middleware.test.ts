import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { getAuthToken, verifyAuth } from '@/lib/middleware/auth.middleware'
import { verifyToken } from '@/lib/utils/jwt'

vi.mock('@/lib/utils/jwt', () => ({
  verifyToken: vi.fn(),
}))

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAuthToken', () => {
    it('deve extrair token do header Authorization com Bearer', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue('Bearer mock-token-123'),
        },
      } as unknown as NextRequest

      const result = getAuthToken(request)

      expect(request.headers.get).toHaveBeenCalledWith('authorization')
      expect(result).toBe('mock-token-123')
    })

    it('deve retornar null quando header não existe', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest

      const result = getAuthToken(request)

      expect(result).toBeNull()
    })

    it('deve retornar null quando header não começa com Bearer', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue('Invalid token-123'),
        },
      } as unknown as NextRequest

      const result = getAuthToken(request)

      expect(result).toBeNull()
    })
  })

  describe('verifyAuth', () => {
    it('deve verificar e retornar payload do token válido', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue('Bearer valid-token'),
        },
      } as unknown as NextRequest

      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
      }

      vi.mocked(verifyToken).mockReturnValue(mockPayload)

      const result = verifyAuth(request)

      expect(verifyToken).toHaveBeenCalledWith('valid-token')
      expect(result).toEqual(mockPayload)
    })

    it('deve lançar erro quando token não é fornecido', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest

      expect(() => verifyAuth(request)).toThrow('Token não fornecido')
      expect(verifyToken).not.toHaveBeenCalled()
    })

    it('deve lançar erro quando token é inválido', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue('Bearer invalid-token'),
        },
      } as unknown as NextRequest

      vi.mocked(verifyToken).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      expect(() => verifyAuth(request)).toThrow('Token inválido ou expirado')
    })

    it('deve lançar erro quando token está expirado', () => {
      const request = {
        headers: {
          get: vi.fn().mockReturnValue('Bearer expired-token'),
        },
      } as unknown as NextRequest

      vi.mocked(verifyToken).mockImplementation(() => {
        throw new Error('Token expired')
      })

      expect(() => verifyAuth(request)).toThrow('Token inválido ou expirado')
    })
  })
})
