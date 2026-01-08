import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/login/route'
import { AuthServiceImpl } from '@/lib/services/auth.service'
import { loginSchema } from '@/lib/utils/validation'

vi.mock('@/lib/services/auth.service')
vi.mock('@/lib/utils/validation', () => ({
  loginSchema: {
    parse: vi.fn(),
  },
}))

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve fazer login com sucesso', async () => {
    const mockBody = {
      email: 'test@example.com',
      password: 'password123',
    }

    const mockResult = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'mock-token',
    }

    vi.mocked(loginSchema.parse).mockReturnValue(mockBody)
    vi.mocked(AuthServiceImpl).mockImplementation(() => ({
      register: vi.fn(),
      login: vi.fn().mockResolvedValue(mockResult),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      success: true,
      data: mockResult,
    })
  })

  it('deve retornar erro 400 para dados inválidos (ZodError)', async () => {
    const mockError = {
      name: 'ZodError',
      errors: [{ path: ['email'], message: 'Email inválido' }],
    }

    vi.mocked(loginSchema.parse).mockImplementation(() => {
      throw mockError
    })

    const request = {
      json: vi.fn().mockResolvedValue({}),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Dados inválidos',
      details: mockError.errors,
    })
  })

  it('deve retornar erro 401 quando credenciais são inválidas', async () => {
    const mockBody = {
      email: 'test@example.com',
      password: 'wrongpassword',
    }

    vi.mocked(loginSchema.parse).mockReturnValue(mockBody)
    vi.mocked(AuthServiceImpl).mockImplementation(() => ({
      register: vi.fn(),
      login: vi.fn().mockRejectedValue(new Error('Email ou senha inválidos')),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({
      success: false,
      error: 'Email ou senha inválidos',
    })
  })

  it('deve retornar erro 401 genérico quando há erro desconhecido', async () => {
    const mockBody = {
      email: 'test@example.com',
      password: 'password123',
    }

    vi.mocked(loginSchema.parse).mockReturnValue(mockBody)
    vi.mocked(AuthServiceImpl).mockImplementation(() => ({
      register: vi.fn(),
      login: vi.fn().mockRejectedValue(new Error('Erro desconhecido')),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Erro desconhecido')
  })
})
