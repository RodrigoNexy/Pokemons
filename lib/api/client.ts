import axios, { AxiosInstance, AxiosError } from 'axios'
import { ApiResponse, ApiError } from '@/lib/types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        }
        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const data = error.response.data as { error?: string; message?: string }
      return {
        message: data.error || data.message || 'Erro na requisição',
        status: error.response.status,
        details: data,
      }
    }

    if (error.request) {
      return {
        message: 'Erro de conexão. Verifique sua internet.',
      }
    }

    return {
      message: error.message || 'Erro desconhecido',
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const apiClient = new ApiClient()
