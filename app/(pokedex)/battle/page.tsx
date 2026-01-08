'use client'

import { useState } from 'react'
import { PokedexLayout } from '@/components/templates'
import { ProtectedRoute } from '@/components/organisms'
import { PokemonSelector } from '@/components/molecules'
import { BattleArena } from '@/components/organisms'
import { Pokemon } from '@/lib/types/pokemon'
import { motion } from 'framer-motion'

export default function BattlePage() {
    const [pokemon1, setPokemon1] = useState<Pokemon | null>(null)
    const [pokemon2, setPokemon2] = useState<Pokemon | null>(null)

    const handleReset = () => {
        setPokemon1(null)
        setPokemon2(null)
    }

    return (
        <ProtectedRoute>
            <PokedexLayout>
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="font-mono font-bold text-4xl text-gray-800 mb-2 uppercase drop-shadow-lg">
                            Arena de Batalha
                        </h1>
                        <p className="font-mono text-gray-700">
                            Selecione dois Pokémons para batalhar
                        </p>
                    </motion.div>

                    {!pokemon1 || !pokemon2 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <PokemonSelector
                                    label="Pokémon 1"
                                    onSelect={setPokemon1}
                                    selectedPokemon={pokemon1}
                                    disabled={false}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <PokemonSelector
                                    label="Pokémon 2"
                                    onSelect={setPokemon2}
                                    selectedPokemon={pokemon2}
                                    disabled={false}
                                />
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <BattleArena
                                pokemon1={pokemon1}
                                pokemon2={pokemon2}
                                onReset={handleReset}
                            />
                        </motion.div>
                    )}
                </div>
            </PokedexLayout>
        </ProtectedRoute>
    )
}
