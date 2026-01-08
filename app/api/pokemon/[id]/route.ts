import { NextRequest, NextResponse } from 'next/server'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const pokemonId = parseInt(id)

    if (isNaN(pokemonId)) {
      // Try to search by name
      const pokemonService = new PokemonServiceImpl()
      const pokemon = await pokemonService.getPokemonByName(id)

      return NextResponse.json(
        {
          success: true,
          data: pokemon,
        },
        { status: 200 }
      )
    }

    const pokemonService = new PokemonServiceImpl()
    const pokemon = await pokemonService.getPokemonById(pokemonId)

    return NextResponse.json(
      {
        success: true,
        data: pokemon,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Pokémon não encontrado',
      },
      { status: 404 }
    )
  }
}
