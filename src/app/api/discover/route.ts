import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UserModel } from '@/models/User-memory'
import { MatchModel } from '@/models/Match-memory'
import { generateMatchesForUser } from '@/lib/matching-memory'

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

    // Buscar matches já avaliados pelo usuário
    const existingMatches = await MatchModel.findByUser(parseInt(decoded.userId))
    const evaluatedHotelIds = new Set(existingMatches.map(match => match.hotel_id))

    // Gerar recomendações excluindo hotéis já avaliados
    const allMatches = await generateMatchesForUser(parseInt(decoded.userId))
    const newRecommendations = allMatches
      .filter(match => !evaluatedHotelIds.has(parseInt(match.id)))
      .slice(0, 10) // Limitar para melhor performance
      .map(match => ({
        id: match.id,
        name: match.hotel.name,
        description: match.hotel.description,
        location: match.hotel.location,
        pricePerNight: match.hotel.price_per_night,
        images: match.hotel.images,
        matchScore: match.score,
        amenities: match.hotel.amenities,
        capacity: match.hotel.capacity,
        acceptsPets: match.hotel.accepts_pets
      }))

    return NextResponse.json({
      hotels: newRecommendations
    })
  } catch (error: any) {
    console.error('Erro ao buscar hotéis para descoberta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

