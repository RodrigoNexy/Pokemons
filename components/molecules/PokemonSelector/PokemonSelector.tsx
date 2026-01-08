'use client'

import { useState } from 'react'
import { Card } from '@/components/atoms'
import { Badge } from '@/components/atoms'
import { Image } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { Pokemon, PokemonListItem } from '@/lib/types/pokemon'
import { formatPokemonName, formatNumber } from '@/lib/utils/format'
import { Search } from 'lucide-react'

export interface PokemonSelectorProps {
    onSelect: (pokemon: Pokemon | null) => void
    selectedPokemon: Pokemon | null
    label: string
    disabled?: boolean
}

export function PokemonSelector({ onSelect, selectedPokemon, label, disabled = false }: PokemonSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [searchResults, setSearchResults] = useState<PokemonListItem[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        if (!searchTerm.trim()) return

        setIsSearching(true)
        try {
            const searchValue = searchTerm.trim().toLowerCase()
            const isNumeric = !isNaN(Number(searchValue))

            let response: Response
            if (isNumeric) {
                const pokemonId = parseInt(searchValue)
                if (pokemonId > 0 && pokemonId <= 1025) {
                    response = await fetch(`/api/pokemon/${pokemonId}`)
                } else {
                    setSearchResults([])
                    setIsSearching(false)
                    return
                }
            } else {
                response = await fetch(`/api/pokemon/${searchValue}`)
            }

            const data = await response.json()

            if (response.ok && data.success && data.data) {
                const pokemonListItem = {
                    id: data.data.id,
                    name: data.data.name,
                    image: data.data.image,
                    types: data.data.types,
                }
                setSearchResults([pokemonListItem])
            } else {
                setSearchResults([])
            }
        } catch (error) {
            console.error('Erro ao buscar Pokémon:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const handleSelectFromSearch = async (pokemonListItem: { id: number; name: string; image: string; types: string[] }) => {
        try {
            const response = await fetch(`/api/pokemon/${pokemonListItem.id}`)
            const data = await response.json()
            if (response.ok && data.success && data.data) {
                onSelect(data.data)
                setShowSearch(false)
                setSearchTerm('')
                setSearchResults([])
            } else {
                console.error('Erro ao carregar Pokémon:', data.error)
            }
        } catch (error) {
            console.error('Erro ao carregar Pokémon:', error)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <h3 className="font-mono font-bold text-xl text-gray-800 mb-2">{label}</h3>
                {selectedPokemon && (
                    <button
                        onClick={() => onSelect(null)}
                        disabled={disabled}
                        className="text-sm text-red-600 hover:text-red-700 font-mono"
                    >
                        Remover seleção
                    </button>
                )}
            </div>

            {selectedPokemon ? (
                <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200 shadow-sm">
                            <Image
                                src={selectedPokemon.image}
                                alt={formatPokemonName(selectedPokemon.name)}
                                width={128}
                                height={128}
                                className="object-contain"
                            />
                        </div>
                        <div className="text-center w-full">
                            <p className="font-mono text-xs text-gray-500 mb-2">
                                #{formatNumber(selectedPokemon.id)}
                            </p>
                            <h3 className="font-mono font-bold text-lg text-gray-800 mb-3 uppercase">
                                {formatPokemonName(selectedPokemon.name)}
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {selectedPokemon.types.map((type) => (
                                    <Badge key={type} variant="type" type={type} className="rounded-full">
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-100 p-2 rounded">
                                    <p className="font-mono text-gray-600">HP</p>
                                    <p className="font-mono font-bold text-gray-800">{selectedPokemon.stats.hp}</p>
                                </div>
                                <div className="bg-gray-100 p-2 rounded">
                                    <p className="font-mono text-gray-600">ATK</p>
                                    <p className="font-mono font-bold text-gray-800">{selectedPokemon.stats.attack}</p>
                                </div>
                                <div className="bg-gray-100 p-2 rounded">
                                    <p className="font-mono text-gray-600">DEF</p>
                                    <p className="font-mono font-bold text-gray-800">{selectedPokemon.stats.defense}</p>
                                </div>
                                <div className="bg-gray-100 p-2 rounded">
                                    <p className="font-mono text-gray-600">SPD</p>
                                    <p className="font-mono font-bold text-gray-800">{selectedPokemon.stats.speed}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="p-6 bg-gradient-to-br from-white to-gray-50 min-h-[300px] flex items-center justify-center">
                    <div className="w-full space-y-4">
                        {!showSearch ? (
                            <div className="text-center">
                                <p className="font-mono text-gray-600 mb-4">Nenhum Pokémon selecionado</p>
                                <Button
                                    onClick={() => setShowSearch(true)}
                                    disabled={disabled}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Buscar Pokémon
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            placeholder="Digite o nome ou ID do Pokémon..."
                                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-pokedex-red text-gray-800 placeholder:text-gray-400"
                                            disabled={disabled || isSearching}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleSearch}
                                        disabled={disabled || isSearching}
                                        variant="primary"
                                    >
                                        <Search className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowSearch(false)
                                            setSearchTerm('')
                                            setSearchResults([])
                                        }}
                                        disabled={disabled}
                                        variant="ghost"
                                    >
                                        Cancelar
                                    </Button>
                                </div>

                                {isSearching && (
                                    <div className="text-center py-4">
                                        <p className="font-mono text-gray-600">Buscando...</p>
                                    </div>
                                )}

                                {!isSearching && searchResults.length > 0 && (
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {searchResults.map((pokemon) => (
                                            <button
                                                key={pokemon.id}
                                                onClick={() => handleSelectFromSearch(pokemon)}
                                                disabled={disabled}
                                                className="w-full p-3 bg-white border-2 border-gray-300 rounded-lg hover:border-pokedex-red hover:shadow-md transition-all text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={pokemon.image}
                                                        alt={formatPokemonName(pokemon.name)}
                                                        width={48}
                                                        height={48}
                                                        className="object-contain"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-mono text-xs text-gray-500">#{formatNumber(pokemon.id)}</p>
                                                        <p className="font-mono font-bold text-gray-800 uppercase">
                                                            {formatPokemonName(pokemon.name)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {!isSearching && searchTerm && searchResults.length === 0 && (
                                    <div className="text-center py-4">
                                        <p className="font-mono text-gray-600">Nenhum Pokémon encontrado</p>
                                        <p className="font-mono text-xs text-gray-500 mt-2">
                                            Digite o nome completo ou o ID do Pokémon
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
