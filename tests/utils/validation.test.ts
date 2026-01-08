import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '@/lib/utils/validation'

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('deve validar dados de registro válidos', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const result = registerSchema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('deve validar dados sem nome opcional', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = registerSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = registerSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('deve rejeitar senha muito curta', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345', // menos de 6 caracteres
      }

      const result = registerSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Senha deve ter no mínimo 6 caracteres')
      }
    })

    it('deve rejeitar dados faltando campos obrigatórios', () => {
      const invalidData = {
        email: 'test@example.com',
      }

      const result = registerSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('deve validar dados de login válidos', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = loginSchema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('deve rejeitar email inválido', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = loginSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido')
      }
    })

    it('deve rejeitar senha vazia', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }

      const result = loginSchema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Senha é obrigatória')
      }
    })

    it('deve aceitar senha com apenas 1 caractere', () => {
      const validData = {
        email: 'test@example.com',
        password: '1',
      }

      const result = loginSchema.safeParse(validData)

      expect(result.success).toBe(true)
    })
  })
})
