import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UserModel } from '@/models/User-sqlite'
import { generateMatchesForUser } from '@/lib/matching-sqlite'

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

    // Gerar matches usando o sistema SQLite
    const matches = await generateMatchesForUser(parseInt(decoded.userId))

    return NextResponse.json({
      matches: matches.map(match => ({
        id: match.id,
        name: match.hotel.name,
        description: match.hotel.description,
        location: match.hotel.location,
        pricePerNight: match.hotel.price_per_night,
        capacity: match.hotel.capacity,
        acceptsPets: match.hotel.accepts_pets,
        amenities: match.hotel.amenities,
        matchScore: match.score,
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