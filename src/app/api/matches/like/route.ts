import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UserModel } from '@/models/User-memory'
import { MatchModel } from '@/models/Match-memory'
import { generateMatchesForUser } from '@/lib/matching-memory'

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

    // Verificar se usuário existe
    const user = await UserModel.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Calcular score do match
    const matches = await generateMatchesForUser(userId)
    const hotelMatch = matches.find(m => m.id === hotelId.toString())

    if (!hotelMatch) {
      return NextResponse.json(
        { error: 'Hotel não encontrado ou não compatível' },
        { status: 404 }
      )
    }

    // Buscar match existente
    let match = await MatchModel.findByUsers(userId, parseInt(hotelId))

    if (!match) {
      // Criar novo match com like do usuário
      match = await MatchModel.create({
        user_id: userId,
        hotel_id: parseInt(hotelId),
        score: hotelMatch.score,
        status: 'pending',
        user_liked: true,
        hotel_liked: false // Por enquanto, hotéis não dão like automaticamente
      })
    } else {
      // Atualizar match existente com like do usuário
      match = await MatchModel.update(match.id, {
        user_liked: true,
        status: match.hotel_liked ? 'matched' : 'pending'
      })
    }

    // Verificar se houve match mútuo
    const isMatch = match.hotel_liked && match.user_liked

    if (isMatch) {
      // Atualizar status para matched
      await MatchModel.update(match.id, { status: 'matched' })
    }

    return NextResponse.json({
      success: true,
      match: isMatch,
      message: isMatch ? 'Match encontrado! 🎉' : 'Like registrado'
    })

  } catch (error: any) {
    console.error('Erro ao registrar like:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

