import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UserModel } from '@/models/User-sqlite'
import { HotelModel } from '@/models/Hotel-sqlite'
import { MatchModel } from '@/models/Match-sqlite'
import { calculateMatchScore } from '@/lib/matching-sqlite'

export async function GET(request: NextRequest) {
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

    const user = await UserModel.findById(parseInt(decoded.userId))
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    // Buscar hotéis ativos
    const hotels = await HotelModel.findAll()

    // Calcular scores e filtrar
    const hotelsWithScores = hotels
      .map(hotel => ({
        hotel,
        score: calculateMatchScore(user.preferences, hotel),
      }))
      .filter(item => item.score >= 30) // Mínimo 30% de match
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    return NextResponse.json({
      matches: hotelsWithScores.map(item => ({
        id: item.hotel.id.toString(),
        ...item.hotel,
        matchScore: item.score,
      })),
    })
  } catch (error: any) {
    console.error('Erro ao buscar matches:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}