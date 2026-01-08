import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/utils/jwt'

export interface AuthRequest extends NextRequest {
  userId?: string
  userEmail?: string
}

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

export function verifyAuth(request: NextRequest): { userId: string; email: string } {
  const token = getAuthToken(request)

  if (!token) {
    throw new Error('Token não fornecido')
  }

  try {
    const payload = verifyToken(token)
    return payload
  } catch (error) {
    throw new Error('Token inválido ou expirado')
  }
}
