import { UserRepository, PrismaUserRepository } from '@/lib/repositories/user.repository'
import { hashPassword, comparePassword } from '@/lib/utils/password'
import { generateToken } from '@/lib/utils/jwt'
import { RegisterInput, LoginInput } from '@/lib/utils/validation'

export interface AuthService {
  register(data: RegisterInput): Promise<{ user: { id: string; email: string; name: string | null }; token: string }>
  login(data: LoginInput): Promise<{ user: { id: string; email: string; name: string | null }; token: string }>
}

export class AuthServiceImpl implements AuthService {
  constructor(private userRepository: UserRepository = new PrismaUserRepository()) {}

  async register(data: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(data.email)
    
    if (existingUser) {
      throw new Error('Email já está em uso')
    }

    const hashedPassword = await hashPassword(data.password)
    
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    })

    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email)
    
    if (!user) {
      throw new Error('Email ou senha inválidos')
    }

    const isPasswordValid = await comparePassword(data.password, user.password)
    
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos')
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  }
}
