import { NextResponse } from 'next/server'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'

export async function GET() {
  try {
    const pokemonService = new PokemonServiceImpl()
    const types = await pokemonService.getAllTypes()

    return NextResponse.json(
      {
        success: true,
        data: types,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar tipos',
      },
      { status: 500 }
    )
  }
}
