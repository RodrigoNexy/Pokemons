'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/templates'
import { Card } from '@/components/atoms'
import { Input } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { useAuth } from '@/lib/hooks/useAuth'
import { ROUTES } from '@/lib/constants/routes'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      router.push(ROUTES.POKEDEX)
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="p-8">
        <h1 className="font-mono font-bold text-3xl text-center mb-6 text-black uppercase">
          Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-mono text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Entrar
          </Button>
        </form>

        <p className="mt-4 text-center font-mono text-sm text-black">
          Não tem conta?{' '}
          <a href={ROUTES.REGISTER} className="text-pokedex-blue hover:underline">
            Cadastre-se
          </a>
        </p>
      </Card>
    </AuthLayout>
  )
}
