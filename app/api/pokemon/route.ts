import { NextRequest, NextResponse } from 'next/server'
import { PokemonServiceImpl } from '@/lib/services/pokemon.service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const type = searchParams.get('type') || undefined

    const pokemonService = new PokemonServiceImpl()
    const result = await pokemonService.getPokemonList(page, pageSize, type)

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar Pokémons',
      },
      { status: 500 }
    )
  }
}
