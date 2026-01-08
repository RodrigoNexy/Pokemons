import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hashPassword, comparePassword } from '@/lib/utils/password'
import bcrypt from 'bcryptjs'

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

describe('Password Utils', () => {
  const plainPassword = 'password123'
  const hashedPassword = '$2a$10$hashed.password.string'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('deve fazer hash da senha com bcrypt', async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never)

      const result = await hashPassword(plainPassword)

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10)
      expect(result).toBe(hashedPassword)
    })

    it('deve usar 10 rounds de salt', async () => {
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never)

      await hashPassword(plainPassword)

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10)
    })
  })

  describe('comparePassword', () => {
    it('deve retornar true quando a senha corresponde', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const result = await comparePassword(plainPassword, hashedPassword)

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword)
      expect(result).toBe(true)
    })

    it('deve retornar false quando a senha não corresponde', async () => {
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      const result = await comparePassword('wrongpassword', hashedPassword)

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', hashedPassword)
      expect(result).toBe(false)
    })
  })
})
