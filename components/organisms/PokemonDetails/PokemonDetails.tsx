'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { usePokemon } from '@/lib/hooks/usePokemon'
import { Image } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { Card } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { LoadingSpinner } from '@/components/molecules'
import { FavoriteButton } from '@/components/molecules'
import { formatPokemonName, formatNumber, formatWeight, formatHeight } from '@/lib/utils/format'
import { getTypeColor } from '@/lib/constants/colors'
import axios from 'axios'

interface MoveData {
    name: string
    accuracy: number | null
    power: number | null
    pp: number | null
    type: string
    level: number
}

interface EvolutionData {
    id: number
    name: string
    image: string
}

export interface PokemonDetailsProps {
    pokemonId: number | string
}

export function PokemonDetails({ pokemonId }: PokemonDetailsProps) {
    const { data: pokemon, isLoading, error } = usePokemon(pokemonId)
    const [isShiny, setIsShiny] = useState(false)
    const [description, setDescription] = useState<string>('')
    const [evolutions, setEvolutions] = useState<EvolutionData[]>([])
    const [moves, setMoves] = useState<MoveData[]>([])
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
    const [currentMove, setCurrentMove] = useState<MoveData | null>(null)

    useEffect(() => {
        if (pokemon) {
            fetchSpeciesData(pokemon.id)
            fetchMoves(pokemon.id)
        }
    }, [pokemon])

    useEffect(() => {
        if (moves.length > 0 && currentMoveIndex < moves.length) {
            fetchMoveDetails(moves[currentMoveIndex])
        }
    }, [currentMoveIndex, moves])

    const fetchSpeciesData = async (id: number) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            const speciesData = response.data

            // Get description
            const descriptions = speciesData.flavor_text_entries
                .filter((e: any) => e.language.name === 'en' || e.language.name === 'pt')
                .map((e: any) => e.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' '))

            setDescription(descriptions[0] || 'No description available.')

            // Get evolution chain
            const evoChainResponse = await axios.get(speciesData.evolution_chain.url)
            const chain = evoChainResponse.data.chain

            const evolutionsList: EvolutionData[] = []

            const extractEvolutions = async (chainLink: any) => {
                const speciesName = chainLink.species.name
                const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesName}/`)
                const pokemonData = pokemonResponse.data

                evolutionsList.push({
                    id: pokemonData.id,
                    name: speciesName,
                    image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
                })

                if (chainLink.evolves_to && chainLink.evolves_to.length > 0) {
                    await extractEvolutions(chainLink.evolves_to[0])
                }
            }

            await extractEvolutions(chain)
            setEvolutions(evolutionsList)
        } catch (error) {
            console.error('Error fetching species data:', error)
        }
    }

    const fetchMoves = async (id: number) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
            const movesData = response.data.moves.slice(0, 20)

            const movesList: MoveData[] = movesData.map((move: any) => {
                let level = 0

                if (move.version_group_details && move.version_group_details.length > 0) {
                    const levelUpMove = move.version_group_details.find(
                        (detail: any) => detail.level_learned_at && detail.level_learned_at > 0
                    )

                    if (levelUpMove) {
                        level = levelUpMove.level_learned_at
                    }
                }

                return {
                    name: move.move.name,
                    url: move.move.url,
                    level: level,
                }
            })

            movesList.sort((a, b) => {
                if (a.level === 0 && b.level > 0) return 1
                if (a.level > 0 && b.level === 0) return -1
                return b.level - a.level
            })

            setMoves(movesList)
        } catch (error) {
            console.error('Error fetching moves:', error)
        }
    }

    const fetchMoveDetails = async (move: any) => {
        try {
            const response = await axios.get(move.url)
            const moveData = response.data

            setCurrentMove({
                name: moveData.name,
                accuracy: moveData.accuracy,
                power: moveData.power,
                pp: moveData.pp,
                type: moveData.type.name,
                level: move.level,
            })
        } catch (error) {
            console.error('Error fetching move details:', error)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" message="Carregando dados do Pokémon" />
            </div>
        )
    }

    if (error || !pokemon) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="font-mono text-lg text-gray-800">
                    {error?.message || 'Pokémon não encontrado'}
                </p>
            </div>
        )
    }

    const spriteUrl = isShiny
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemon.id}.png`
        : pokemon.image

    const stats = [
        { name: 'HP', value: pokemon.stats.hp, color: getTypeColor('normal') },
        { name: 'Attack', value: pokemon.stats.attack, color: getTypeColor('fighting') },
        { name: 'Defense', value: pokemon.stats.defense, color: getTypeColor('rock') },
        { name: 'Sp. Atk', value: pokemon.stats.specialAttack, color: getTypeColor('psychic') },
        { name: 'Sp. Def', value: pokemon.stats.specialDefense, color: getTypeColor('steel') },
        { name: 'Speed', value: pokemon.stats.speed, color: getTypeColor('electric') },
    ]

    const primaryTypeColor = pokemon.types[0] ? getTypeColor(pokemon.types[0]) : '#A8A878'

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    }

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -10 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.6,
            },
        },
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-6xl mx-auto space-y-6"
        >
            <motion.div
                variants={cardVariants}
                className="bg-white border-2 border-gray-300 rounded-xl shadow-md p-8 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${primaryTypeColor}20 0%, ${primaryTypeColor}08 50%, white 100%)`
                }}
            >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                    <div className="flex flex-col items-center">
                        <motion.div
                            variants={imageVariants}
                            className="relative w-72 h-72 mb-4 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-xl border-2 border-gray-200"
                        >
                            <img
                                src={spriteUrl}
                                alt={formatPokemonName(pokemon.name)}
                                className="object-contain w-full h-full"
                                onError={() => {
                                    if (isShiny) setIsShiny(false)
                                }}
                            />
                        </motion.div>

                        <Button
                            variant={isShiny ? 'secondary' : 'ghost'}
                            onClick={() => setIsShiny(!isShiny)}
                            className="mb-2 rounded-full flex items-center gap-2"
                        >
                            {isShiny ? (
                                <>
                                    <Star className="w-4 h-4 fill-current" />
                                    Shiny Ativo
                                </>
                            ) : (
                                <>
                                    <Star className="w-4 h-4" />
                                    Ver Shiny
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <p className="font-mono text-sm text-gray-500 mb-2">
                            #{formatNumber(pokemon.id)}
                        </p>
                        <h1 className="font-mono font-bold text-5xl text-gray-800 mb-4 uppercase tracking-wide">
                            {formatPokemonName(pokemon.name)}
                        </h1>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                            {pokemon.types.map((type) => (
                                <Badge key={type} variant="type" type={type} className="text-lg px-4 py-2 rounded-full">
                                    {type}
                                </Badge>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
                                <p className="font-mono text-sm text-gray-600 mb-1">Altura</p>
                                <p className="font-mono font-bold text-xl text-gray-800">{formatHeight(pokemon.height)}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
                                <p className="font-mono text-sm text-gray-600 mb-1">Peso</p>
                                <p className="font-mono font-bold text-xl text-gray-800">{formatWeight(pokemon.weight)}</p>
                            </div>
                        </div>

                        <FavoriteButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
                    </div>
                </div>
            </motion.div>

            {description && (
                <motion.div variants={cardVariants}>
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-gray-200">
                        <h2 className="font-mono font-bold text-xl mb-3 text-gray-800 uppercase">Descrição</h2>
                        <p className="font-mono text-base text-gray-700 leading-relaxed">{description}</p>
                    </Card>
                </motion.div>
            )}

            <motion.div variants={cardVariants}>
                <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-gray-200">
                    <h2 className="font-mono font-bold text-xl mb-4 text-gray-800 uppercase">Estatísticas</h2>
                    <div className="space-y-4">
                        {stats.map((stat) => {
                            const percentage = (stat.value / 255) * 100
                            return (
                                <div key={stat.name} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono font-bold text-sm text-gray-700">{stat.name}</span>
                                        <span className="font-mono text-sm font-bold text-gray-800">{stat.value}</span>
                                    </div>
                                    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden border border-gray-300 shadow-inner">
                                        <div
                                            className="h-full transition-all duration-500 rounded-full shadow-sm"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: stat.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </motion.div>

            {currentMove && (
                <motion.div variants={cardVariants}>
                    <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h2 className="font-mono font-bold text-2xl text-gray-800 uppercase">Movimentos</h2>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1))}
                                    disabled={currentMoveIndex === 0}
                                    className="rounded-full"
                                >
                                    ← Anterior
                                </Button>
                                <span className="font-mono font-bold text-base bg-white px-4 py-2 rounded-full border-2 border-gray-300 shadow-sm">
                                    {currentMoveIndex + 1} / {moves.length}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentMoveIndex(Math.min(moves.length - 1, currentMoveIndex + 1))}
                                    disabled={currentMoveIndex >= moves.length - 1}
                                    className="rounded-full"
                                >
                                    Próximo →
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-lg">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-mono font-bold text-2xl text-gray-800 capitalize border-b-2 border-gray-300 pb-2">
                                        {formatPokemonName(currentMove.name)}
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
                                            <span className="font-mono font-bold text-base text-gray-700">Acurácia:</span>
                                            <span className="font-mono font-bold text-xl text-gray-800">{currentMove.accuracy || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-gray-200">
                                            <span className="font-mono font-bold text-base text-gray-700">Poder:</span>
                                            <span className="font-mono font-bold text-xl text-gray-800">{currentMove.power || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-gray-200">
                                            <span className="font-mono font-bold text-base text-gray-700">PP:</span>
                                            <span className="font-mono font-bold text-xl text-gray-800">{currentMove.pp || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 flex flex-col justify-center">
                                    <div>
                                        <p className="font-mono text-sm text-gray-600 mb-2">Tipo:</p>
                                        <Badge variant="type" type={currentMove.type} className="text-xl px-6 py-3 block text-center rounded-full">
                                            {currentMove.type}
                                        </Badge>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-4 rounded-xl border-2 border-yellow-300 shadow-sm">
                                        <p className="font-mono text-sm text-gray-700 mb-1">Aprende em:</p>
                                        <p className="font-mono font-bold text-2xl text-gray-800">
                                            {currentMove.level > 0 ? `Nível ${currentMove.level}` : 'TM/HM'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {evolutions.length > 0 && (
                <motion.div variants={cardVariants}>
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-gray-200">
                        <h2 className="font-mono font-bold text-2xl mb-6 text-gray-800 uppercase">Linha Evolutiva</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {evolutions.map((evo, index) => (
                                <Card
                                    key={evo.id}
                                    hover
                                    className="p-6 text-center cursor-pointer transition-all hover:scale-105 bg-white border-gray-200"
                                    onClick={() => window.location.href = `/pokemon/${evo.id}`}
                                >
                                    <div className="font-mono font-bold text-lg text-gray-600 mb-3 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full inline-block shadow-sm">
                                        {index === 0 ? 'I' : index === 1 ? 'II' : 'III'}
                                    </div>
                                    <div className="w-40 h-40 mx-auto mb-4 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-4 border-2 border-gray-200 shadow-lg">
                                        <img
                                            src={evo.image}
                                            alt={formatPokemonName(evo.name)}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <p className="font-mono font-bold text-xl text-gray-800 capitalize">
                                        {formatPokemonName(evo.name)}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}

            <motion.div variants={cardVariants}>
                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-gray-200">
                    <h2 className="font-mono font-bold text-xl mb-4 text-gray-800 uppercase">Habilidades</h2>
                    <div className="flex flex-wrap gap-3">
                        {pokemon.abilities.map((ability) => (
                            <Badge key={ability} variant="default" className="rounded-full px-4 py-2">
                                {formatPokemonName(ability)}
                            </Badge>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}
