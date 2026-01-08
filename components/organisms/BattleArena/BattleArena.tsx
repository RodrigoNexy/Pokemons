'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/atoms'
import { Image } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { Pokemon } from '@/lib/types/pokemon'
import { formatPokemonName, formatNumber } from '@/lib/utils/format'
import { getTypeColor } from '@/lib/constants/colors'
import { Sword, Shield, Zap } from 'lucide-react'

export interface BattleArenaProps {
    pokemon1: Pokemon
    pokemon2: Pokemon
    onReset: () => void
}

interface BattleLog {
    turn: number
    attacker: string
    defender: string
    damage: number
    message: string
}

interface TypeEffectiveness {
    [attackType: string]: {
        [defenseType: string]: number
    }
}

async function fetchTypeEffectiveness(typeName: string): Promise<{ [defenseType: string]: number }> {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName.toLowerCase()}`)
        const data = await response.json()

        const effectiveness: { [defenseType: string]: number } = {}

        // Double damage to (2x)
        data.damage_relations.double_damage_to?.forEach((type: any) => {
            effectiveness[type.name] = 2
        })

        // Half damage to (0.5x)
        data.damage_relations.half_damage_to?.forEach((type: any) => {
            effectiveness[type.name] = 0.5
        })

        // No damage to (0x)
        data.damage_relations.no_damage_to?.forEach((type: any) => {
            effectiveness[type.name] = 0
        })

        return effectiveness
    } catch (error) {
        console.error(`Erro ao buscar efetividade do tipo ${typeName}:`, error)
        return {}
    }
}

async function buildTypeEffectivenessMap(types: string[]): Promise<TypeEffectiveness> {
    const typeMap: TypeEffectiveness = {}

    await Promise.all(
        types.map(async (type) => {
            typeMap[type] = await fetchTypeEffectiveness(type)
        })
    )

    return typeMap
}

function getTypeEffectiveness(
    attackType: string,
    defenseTypes: string[],
    typeEffectivenessMap: TypeEffectiveness
): number {
    let effectiveness = 1
    const attackTypeEffectiveness = typeEffectivenessMap[attackType] || {}

    for (const defenseType of defenseTypes) {
        const multiplier = attackTypeEffectiveness[defenseType] || 1
        effectiveness *= multiplier
    }

    return effectiveness
}

function calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    typeEffectivenessMap: TypeEffectiveness
): number {
    const baseAttack = attacker.stats.attack
    const baseDefense = defender.stats.defense
    const attackerType = attacker.types[0] || 'normal'
    const effectiveness = getTypeEffectiveness(attackerType, defender.types, typeEffectivenessMap)

    const baseDamage = (baseAttack * 2) / baseDefense
    const finalDamage = Math.max(1, Math.floor(baseDamage * effectiveness * (0.8 + Math.random() * 0.4)))

    return finalDamage
}

export function BattleArena({ pokemon1, pokemon2, onReset }: BattleArenaProps) {
    if (!pokemon1 || !pokemon2 || !pokemon1.name || !pokemon2.name) {
        return (
            <div className="text-center py-12">
                <p className="font-mono text-lg text-gray-800">
                    Erro: Dados dos Pokémons incompletos
                </p>
            </div>
        )
    }

    const [typeEffectivenessMap, setTypeEffectivenessMap] = useState<TypeEffectiveness>({})
    const [isLoadingTypes, setIsLoadingTypes] = useState(true)

    const [battleState, setBattleState] = useState<{
        hp1: number
        hp2: number
        turn: number
        winner: Pokemon | null
        logs: BattleLog[]
    }>({
        hp1: pokemon1.stats?.hp || 100,
        hp2: pokemon2.stats?.hp || 100,
        turn: 0,
        winner: null,
        logs: [],
    })

    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const loadTypeEffectiveness = async () => {
            setIsLoadingTypes(true)
            try {
                const allTypes = [...new Set([...pokemon1.types, ...pokemon2.types])]
                const map = await buildTypeEffectivenessMap(allTypes)
                setTypeEffectivenessMap(map)
            } catch (error) {
                console.error('Erro ao carregar efetividade de tipos:', error)
            } finally {
                setIsLoadingTypes(false)
            }
        }

        loadTypeEffectiveness()
    }, [pokemon1.types, pokemon2.types])

    const handleAttack = (attacker: Pokemon, defender: Pokemon, isFirstAttack: boolean = false) => {
        if (isAnimating || battleState.winner || isLoadingTypes) return

        setIsAnimating(true)

        setBattleState((prev) => {
            if (prev.winner) return prev

            const attackerHp = attacker === pokemon1 ? prev.hp1 : prev.hp2
            const defenderHp = attacker === pokemon1 ? prev.hp2 : prev.hp1

            const damage = calculateDamage(attacker, defender, typeEffectivenessMap)
            const newDefenderHp = Math.max(0, defenderHp - damage)
            const attackerType = attacker.types[0] || 'normal'
            const effectiveness = getTypeEffectiveness(attackerType, defender.types, typeEffectivenessMap)

            let message = `${formatPokemonName(attacker.name)} atacou ${formatPokemonName(defender.name)} causando ${damage} de dano!`
            if (effectiveness > 1) {
                message += ' É super efetivo!'
            } else if (effectiveness < 1) {
                message += ' Não é muito efetivo...'
            }

            const currentTurn = isFirstAttack ? prev.turn + 1 : prev.turn
            let winner: Pokemon | null = null
            let newHp1 = prev.hp1
            let newHp2 = prev.hp2

            if (attacker === pokemon1) {
                newHp2 = newDefenderHp
                if (newHp2 <= 0) {
                    winner = pokemon1
                }
            } else {
                newHp1 = newDefenderHp
                if (newHp1 <= 0) {
                    winner = pokemon2
                }
            }

            const newState = {
                hp1: newHp1,
                hp2: newHp2,
                turn: currentTurn,
                winner,
                logs: [
                    ...prev.logs,
                    {
                        turn: currentTurn,
                        attacker: attacker.name,
                        defender: defender.name,
                        damage,
                        message,
                    },
                ],
            }

            setTimeout(() => {
                setIsAnimating(false)
                if (!winner && newHp1 > 0 && newHp2 > 0 && isFirstAttack) {
                    const nextAttacker = attacker === pokemon1 ? pokemon2 : pokemon1
                    const nextDefender = attacker === pokemon1 ? pokemon1 : pokemon2
                    setTimeout(() => {
                        handleAttack(nextAttacker, nextDefender, false)
                    }, 500)
                }
            }, 1000)

            return newState
        })
    }

    const handleTurn = () => {
        if (battleState.winner || isAnimating) return

        const pokemon1Speed = pokemon1.stats.speed
        const pokemon2Speed = pokemon2.stats.speed

        if (pokemon1Speed >= pokemon2Speed) {
            handleAttack(pokemon1, pokemon2, true)
        } else {
            handleAttack(pokemon2, pokemon1, true)
        }
    }

    const hp1Percentage = (battleState.hp1 / pokemon1.stats.hp) * 100
    const hp2Percentage = (battleState.hp2 / pokemon2.stats.hp) * 100

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-48 h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm">
                                <Image
                                    src={pokemon1.image}
                                    alt={formatPokemonName(pokemon1.name)}
                                    width={192}
                                    height={192}
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-center w-full">
                                <p className="font-mono text-xs text-gray-500 mb-2">
                                    #{formatNumber(pokemon1.id)}
                                </p>
                                <h3 className="font-mono font-bold text-xl text-gray-800 mb-2 uppercase">
                                    {formatPokemonName(pokemon1.name)}
                                </h3>
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                    {pokemon1.types.map((type) => (
                                        <Badge key={type} variant="type" type={type} className="rounded-full">
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                                    <div
                                        className="bg-red-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                                        style={{ width: `${hp1Percentage}%` }}
                                    >
                                        <span className="font-mono font-bold text-white text-xs">
                                            {battleState.hp1} / {pokemon1.stats.hp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-48 h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm">
                                <Image
                                    src={pokemon2.image}
                                    alt={formatPokemonName(pokemon2.name)}
                                    width={192}
                                    height={192}
                                    className="object-contain"
                                />
                            </div>
                            <div className="text-center w-full">
                                <p className="font-mono text-xs text-gray-500 mb-2">
                                    #{formatNumber(pokemon2.id)}
                                </p>
                                <h3 className="font-mono font-bold text-xl text-gray-800 mb-2 uppercase">
                                    {formatPokemonName(pokemon2.name)}
                                </h3>
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                    {pokemon2.types.map((type) => (
                                        <Badge key={type} variant="type" type={type} className="rounded-full">
                                            {type}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                                    <div
                                        className="bg-red-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                                        style={{ width: `${hp2Percentage}%` }}
                                    >
                                        <span className="font-mono font-bold text-white text-xs">
                                            {battleState.hp2} / {pokemon2.stats.hp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className="flex justify-center gap-4">
                {isLoadingTypes && (
                    <div className="text-center py-4">
                        <p className="font-mono text-gray-600">Carregando informações de tipos...</p>
                    </div>
                )}
                {!battleState.winner && !isLoadingTypes && (
                    <Button
                        onClick={handleTurn}
                        disabled={isAnimating}
                        variant="primary"
                        size="lg"
                        className="flex items-center gap-2"
                    >
                        <Sword className="w-5 h-5" />
                        Iniciar Turno
                    </Button>
                )}
                <Button
                    onClick={onReset}
                    variant="ghost"
                    size="lg"
                >
                    Nova Batalha
                </Button>
            </div>

            <AnimatePresence>
                {battleState.winner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center"
                    >
                        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400">
                            <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h2 className="font-mono font-bold text-3xl text-gray-800 mb-2">
                                {formatPokemonName(battleState.winner.name)} VENCEU!
                            </h2>
                            <p className="font-mono text-gray-700">
                                Parabéns! {formatPokemonName(battleState.winner.name)} é o vencedor da batalha!
                            </p>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {battleState.logs.length > 0 && (
                <Card className="p-6 bg-gradient-to-br from-white to-gray-50 max-h-64 overflow-y-auto">
                    <h3 className="font-mono font-bold text-lg text-gray-800 mb-4">Histórico da Batalha</h3>
                    <div className="space-y-2">
                        {battleState.logs.map((log, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-gray-100 rounded-lg"
                            >
                                <p className="font-mono text-sm text-gray-700">
                                    <span className="font-bold">Turno {log.turn}:</span> {log.message}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
}
