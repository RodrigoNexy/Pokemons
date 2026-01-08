import { NextRequest, NextResponse } from 'next/server'
import { AuthServiceImpl } from '@/lib/services/auth.service'
import { registerSchema } from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const authService = new AuthServiceImpl()
    const result = await authService.register(validatedData)

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao registrar usuário',
      },
      { status: 400 }
    )
  }
}
