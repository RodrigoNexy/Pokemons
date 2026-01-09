'use client'

import { Image } from '@/components/atoms'

export interface LoadingScreenProps {
  message?: string
  pokemonId?: number
}

export function LoadingScreen({ message = 'Carregando...', pokemonId }: LoadingScreenProps) {
  // Pokéball animada
  const pokeballImage = pokemonId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'

  return (
    <div className="min-h-screen bg-[#dddfde] flex items-center justify-center p-4">
      <div className="bg-white border-2 border-gray-300 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-gray-300 rounded-xl p-6 mb-6 shadow-inner">
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="relative mb-6">
              <div className="animate-bounce">
                <Image
                  src={pokeballImage}
                  alt="Loading"
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>

            <div className="text-center">
              <p className="font-mono font-bold text-gray-800 text-lg mb-3 uppercase">
                {message}
              </p>
              <div className="flex gap-2 justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-3 h-3 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-3 h-3 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pokedex-red to-pokedex-red-dark px-4 py-3 rounded-lg border-2 border-pokedex-red-dark">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full border-2 border-white/50 animate-pulse shadow-sm"></div>
            <span className="font-mono text-xs text-white uppercase">Conectando à PokéAPI...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
