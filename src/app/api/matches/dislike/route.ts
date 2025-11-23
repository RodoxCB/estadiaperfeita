import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { MatchModel } from '@/models/Match-memory'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autenticação necessário' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const { hotelId } = await request.json()
    const userId = parseInt(decoded.userId)

    if (!hotelId) {
      return NextResponse.json(
        { error: 'ID do hotel é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar match existente
    let match = await MatchModel.findByUsers(userId, parseInt(hotelId))

    if (!match) {
      // Criar match rejeitado
      match = await MatchModel.create({
        user_id: userId,
        hotel_id: parseInt(hotelId),
        score: 0, // Score baixo para dislikes
        status: 'rejected',
        user_liked: false,
        hotel_liked: false
      })
    } else {
      // Atualizar para rejeitado
      match = await MatchModel.update(match.id, {
        user_liked: false,
        status: 'rejected'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Dislike registrado'
    })

  } catch (error: any) {
    console.error('Erro ao registrar dislike:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

