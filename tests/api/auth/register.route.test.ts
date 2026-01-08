import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/register/route'
import { AuthServiceImpl } from '@/lib/services/auth.service'
import { registerSchema } from '@/lib/utils/validation'

vi.mock('@/lib/services/auth.service')
vi.mock('@/lib/utils/validation', () => ({
  registerSchema: {
    parse: vi.fn(),
  },
}))

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve registrar usuário com sucesso', async () => {
    const mockBody = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    }

    const mockResult = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'mock-token',
    }

    vi.mocked(registerSchema.parse).mockReturnValue(mockBody)
    vi.mocked(AuthServiceImpl).mockImplementation(() => ({
      register: vi.fn().mockResolvedValue(mockResult),
      login: vi.fn(),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
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

    vi.mocked(registerSchema.parse).mockImplementation(() => {
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

  it('deve retornar erro 400 quando email já está em uso', async () => {
    const mockBody = {
      email: 'existing@example.com',
      password: 'password123',
    }

    vi.mocked(registerSchema.parse).mockReturnValue(mockBody)
    vi.mocked(AuthServiceImpl).mockImplementation(() => ({
      register: vi.fn().mockRejectedValue(new Error('Email já está em uso')),
      login: vi.fn(),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({
      success: false,
      error: 'Email já está em uso',
    })
  })

  it('deve retornar erro 400 genérico quando há erro desconhecido', async () => {
    const mockBody = {
      email: 'test@example.com',
      password: 'password123',
    }

    vi.mocked(registerSchema.parse).mockReturnValue(mockBody)
    vi.mocked(AuthServiceImpl).mockImplementation(() => ({
      register: vi.fn().mockRejectedValue(new Error('Erro desconhecido')),
      login: vi.fn(),
    }) as any)

    const request = {
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Erro desconhecido')
  })
})
