'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PokedexLayout } from '@/components/templates'
import { PokemonDetails, ProtectedRoute, LoadingScreen } from '@/components/organisms'
import { Button } from '@/components/atoms'
import { ROUTES } from '@/lib/constants/routes'
import { useRouter, useParams } from 'next/navigation'

export default function PokemonDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const pokemonId = typeof id === 'string' && !isNaN(Number(id)) ? Number(id) : undefined

    useEffect(() => {
        // Simular carregamento inicial
        const timer = setTimeout(() => {
            setIsInitialLoading(false)
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    if (isInitialLoading) {
        return <LoadingScreen message="Abrindo Pokédex..." pokemonId={pokemonId} />
    }

    return (
        <ProtectedRoute>
            <PokedexLayout>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-4"
                >
                    <Button variant="ghost" onClick={() => router.back()}>
                        ← Voltar
                    </Button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <PokemonDetails pokemonId={id} />
                </motion.div>
            </PokedexLayout>
        </ProtectedRoute>
    )
}
