import { NextRequest, NextResponse } from 'next/server'
import { FavoriteServiceImpl } from '@/lib/services/favorite.service'
import { verifyAuth } from '@/lib/middleware/auth.middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { pokemonId: string } }
) {
  try {
    const { userId } = verifyAuth(request)
    const pokemonId = parseInt(params.pokemonId)

    if (isNaN(pokemonId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID do Pokémon inválido',
        },
        { status: 400 }
      )
    }

    const favoriteService = new FavoriteServiceImpl()
    const isFavorite = await favoriteService.isFavorite(userId, pokemonId)

    return NextResponse.json(
      {
        success: true,
        data: { isFavorite },
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao verificar favorito',
      },
      { status: error.message.includes('Token') ? 401 : 500 }
    )
  }
}
