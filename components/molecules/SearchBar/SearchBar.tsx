'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/atoms'
import { Button } from '@/components/atoms'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'

export interface SearchBarProps {
    placeholder?: string
    initialValue?: string
}

export function SearchBar({ placeholder = 'Buscar por nome ou ID...', initialValue = '' }: SearchBarProps) {
    const [search, setSearch] = useState(initialValue)
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedSearch = search.trim()

        if (!trimmedSearch) return

        setIsSearching(true)

        // Simular delay de busca
        await new Promise(resolve => setTimeout(resolve, 500))

        // Verificar se é um número (ID) ou string (nome)
        const isId = /^\d+$/.test(trimmedSearch)

        if (isId) {
            router.push(ROUTES.POKEMON_DETAIL(trimmedSearch))
        } else {
            router.push(ROUTES.POKEMON_DETAIL(trimmedSearch.toLowerCase()))
        }

        setIsSearching(false)
    }

    return (
        <form onSubmit={handleSubmit} className="w-full flex gap-3">
            <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="flex-1"
            />
            <Button type="submit" variant="primary" isLoading={isSearching} className="rounded-full">
                Buscar
            </Button>
        </form>
    )
}
