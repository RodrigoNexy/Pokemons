export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

export interface ApiError {
  message: string
  status?: number
  details?: any
}
