'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { ROUTES } from '@/lib/constants/routes'

export default function Home() {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                router.push(ROUTES.POKEDEX)
            } else {
                router.push(ROUTES.LOGIN)
            }
        }
    }, [isAuthenticated, loading, router])

    return (
        <main className="min-h-screen flex items-center justify-center bg-pokedex-red">
            <div className="text-center">
                <h1 className="font-mono font-bold text-4xl text-white mb-4">
                    📱 Pokédex Interativa
                </h1>
                <p className="font-mono text-white">Carregando...</p>
            </div>
        </main>
    )
}
