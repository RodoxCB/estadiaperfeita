import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { MatchModel } from '@/models/Match-sqlite'
import { HotelModel } from '@/models/Hotel-sqlite'

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

    const userId = parseInt(decoded.userId)

    // Buscar matches ativos (status = 'matched')
    const matches = await MatchModel.findByUser(userId)
    const activeMatches = matches.filter(match => match.status === 'matched')

    if (activeMatches.length === 0) {
      return NextResponse.json({ matches: [] })
    }

    // Buscar dados completos dos hotéis
    const hotelIds = activeMatches.map(match => match.hotel_id)
    const hotels = await Promise.all(
      hotelIds.map(hotelId => HotelModel.findById(hotelId))
    )

    // Combinar dados
    const matchesWithHotels = activeMatches.map(match => {
      const hotel = hotels.find(h => h && h.id === match.hotel_id)
      return {
        id: match.id,
        hotel: hotel ? {
          name: hotel.name,
          description: hotel.description,
          location: hotel.location,
          contact_info: hotel.contact_info,
          images: hotel.images,
          price_per_night: hotel.price_per_night
        } : null,
        score: match.score,
        created_at: match.created_at
      }
    }).filter(match => match.hotel !== null)

    return NextResponse.json({
      matches: matchesWithHotels
    })

  } catch (error: any) {
    console.error('Erro ao buscar matches ativos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

