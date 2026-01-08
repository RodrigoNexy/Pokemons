'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Smartphone } from 'lucide-react'
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
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="font-mono font-bold text-4xl text-white mb-4 flex items-center justify-center gap-3"
                >
                    <Smartphone className="w-10 h-10" />
                    Pokédex Interativa
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="font-mono text-white"
                >
                    Carregando...
                </motion.p>
            </motion.div>
        </main>
    )
}
