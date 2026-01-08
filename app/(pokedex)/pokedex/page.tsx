'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PokedexLayout } from '@/components/templates'
import { SearchBar, TypeFilter } from '@/components/molecules'
import { PokemonList, ProtectedRoute, LoadingScreen } from '@/components/organisms'
import { Card } from '@/components/atoms'

export default function PokedexPage() {
  const [page, setPage] = useState(1)
  const [selectedType, setSelectedType] = useState<string | undefined>()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const handleTypeChange = (type: string | undefined) => {
    setSelectedType(type)
    setPage(1) // Reset para primeira página ao mudar tipo
  }

  if (isInitialLoading) {
    return <LoadingScreen message="Inicializando Pokédex..." />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <ProtectedRoute>
      <PokedexLayout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="font-mono font-bold text-4xl text-gray-800 mb-2 uppercase drop-shadow-lg">
              Pokédex
            </h1>
            <p className="font-mono text-gray-700">
              Explore todos os Pokémons disponíveis
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 space-y-4 bg-gradient-to-br from-white to-gray-50 border-gray-200">
              <SearchBar />
              
              <div>
                <h2 className="font-mono font-bold text-lg mb-3 text-gray-800 uppercase">
                  Filtrar por Tipo
                </h2>
                <TypeFilter selectedType={selectedType} onTypeSelect={handleTypeChange} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <PokemonList
              page={page}
              pageSize={20}
              type={selectedType}
              onPageChange={setPage}
            />
          </motion.div>
        </motion.div>
      </PokedexLayout>
    </ProtectedRoute>
  )
}
