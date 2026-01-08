import { apiClient } from './client'
import { RegisterInput, LoginInput, AuthResponse } from '@/lib/types/auth'
import { API_ROUTES } from '@/lib/constants/routes'

export const authApi = {
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      data
    )
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao registrar')
    }
    return response.data
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.LOGIN,
      data
    )
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erro ao fazer login')
    }
    return response.data
  },
}
