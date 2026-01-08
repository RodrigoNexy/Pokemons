import { NextRequest, NextResponse } from 'next/server'
import { FavoriteServiceImpl } from '@/lib/services/favorite.service'
import { verifyAuth } from '@/lib/middleware/auth.middleware'

export async function GET(request: NextRequest) {
  try {
    const { userId } = verifyAuth(request)

    const favoriteService = new FavoriteServiceImpl()
    const favorites = await favoriteService.getUserFavorites(userId)

    return NextResponse.json(
      {
        success: true,
        data: favorites,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao buscar favoritos',
      },
      { status: error.message.includes('Token') ? 401 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = verifyAuth(request)
    const body = await request.json()
    const { pokemonId, pokemonName } = body

    if (!pokemonId || !pokemonName) {
      return NextResponse.json(
        {
          success: false,
          error: 'pokemonId e pokemonName são obrigatórios',
        },
        { status: 400 }
      )
    }

    const favoriteService = new FavoriteServiceImpl()
    await favoriteService.addFavorite(userId, pokemonId, pokemonName)

    return NextResponse.json(
      {
        success: true,
        message: 'Pokémon adicionado aos favoritos',
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao adicionar favorito',
      },
      { status: error.message.includes('Token') ? 401 : 400 }
    )
  }
}
