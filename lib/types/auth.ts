export interface User {
  id: string
  email: string
  name: string | null
}

export interface AuthResponse {
  user: User
  token: string
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
}

export interface LoginInput {
  email: string
  password: string
}
