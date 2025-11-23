interface UserPreferences {
  groupSize: number
  leisureType: string
  acceptsPets: boolean
  budget: {
    min: number
    max: number
  }
  amenities: string[]
  locationPreferences: string[]
  specialRequirements?: string
}

interface Hotel {
  id: number
  owner_id: number
  name: string
  description: string
  location: {
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  images: string[]
  capacity: number
  price_per_night: number
  amenities: string[]
  leisure_type: string[]
  accepts_pets: boolean
  contact_info: {
    phone: string
    email: string
    whatsapp?: string
  }
  rating: number
  reviews: any[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export function calculateMatchScore(
  userPreferences: UserPreferences,
  hotel: Hotel
): number {
  let score = 0
  let maxScore = 100

  // Capacidade (30 pontos)
  if (hotel.capacity >= userPreferences.groupSize) {
    score += 30
  } else if (hotel.capacity >= userPreferences.groupSize * 0.8) {
    score += 20
  }

  // Tipo de lazer (25 pontos)
  if (hotel.leisure_type.includes(userPreferences.leisureType)) {
    score += 25
  }

  // Pets (15 pontos)
  if (userPreferences.acceptsPets === hotel.accepts_pets) {
    score += 15
  }

  // Orçamento (15 pontos)
  const hotelPrice = hotel.price_per_night
  if (hotelPrice >= userPreferences.budget.min &&
      hotelPrice <= userPreferences.budget.max) {
    score += 15
  } else if (hotelPrice <= userPreferences.budget.max * 1.2) {
    score += 10
  }

  // Comodidades (10 pontos)
  const matchingAmenities = userPreferences.amenities.filter(
    (amenity: string) => hotel.amenities.includes(amenity)
  )
  const amenityScore = userPreferences.amenities.length > 0
    ? (matchingAmenities.length / userPreferences.amenities.length) * 10
    : 5
  score += amenityScore

  // Localização (5 pontos)
  if (userPreferences.locationPreferences.some((pref: string) =>
    hotel.location.city.toLowerCase().includes(pref.toLowerCase()) ||
    hotel.location.state.toLowerCase().includes(pref.toLowerCase())
  )) {
    score += 5
  }

  return Math.round(Math.min(score, maxScore))
}

export interface MatchResult {
  id: string
  hotel: Hotel
  score: number
}

export async function generateMatchesForUser(userId: number): Promise<MatchResult[]> {
  try {
    const sqlite3 = require('sqlite3')
    const sqlite = require('sqlite')

    const db = await sqlite.open({
      filename: './data/estadia_perfeita.db',
      driver: sqlite3.Database,
    })

    // Buscar usuário
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId])
    if (!user) {
      await db.close()
      return []
    }

    const userPreferences = JSON.parse(user.preferences)

    // Buscar hotéis ativos
    const hotels = await db.all('SELECT * FROM hotels WHERE is_active = 1')

    const matches: MatchResult[] = []

    for (const hotelRow of hotels) {
      const hotel: Hotel = {
        id: hotelRow.id,
        owner_id: hotelRow.owner_id,
        name: hotelRow.name,
        description: hotelRow.description,
        location: JSON.parse(hotelRow.location),
        images: JSON.parse(hotelRow.images || '[]'),
        capacity: hotelRow.capacity,
        price_per_night: hotelRow.price_per_night,
        amenities: JSON.parse(hotelRow.amenities || '[]'),
        leisure_type: JSON.parse(hotelRow.leisure_type || '[]'),
        accepts_pets: hotelRow.accepts_pets === 1,
        contact_info: JSON.parse(hotelRow.contact_info),
        rating: hotelRow.rating,
        reviews: JSON.parse(hotelRow.reviews || '[]'),
        is_active: hotelRow.is_active === 1,
        created_at: hotelRow.created_at,
        updated_at: hotelRow.updated_at,
      }

      const score = calculateMatchScore(userPreferences, hotel)

      // Apenas incluir matches com score maior que 30
      if (score >= 30) {
        matches.push({
          id: hotel.id.toString(),
          hotel,
          score,
        })
      }
    }

    // Ordenar por score decrescente
    matches.sort((a, b) => b.score - a.score)

    await db.close()
    return matches

  } catch (error) {
    console.error('Erro ao gerar matches:', error)
    return []
  }
}
