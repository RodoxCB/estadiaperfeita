import { Types } from 'mongoose'
import User from '@/models/User'
import Hotel from '@/models/Hotel'
import Match from '@/models/Match'

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

export function calculateMatchScore(
  userPreferences: UserPreferences,
  hotel: any
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
  if (hotel.leisureType.includes(userPreferences.leisureType)) {
    score += 25
  }

  // Pets (15 pontos)
  if (userPreferences.acceptsPets === hotel.acceptsPets) {
    score += 15
  }

  // Orçamento (15 pontos)
  const hotelPrice = hotel.pricePerNight
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

export async function findBestMatches(userId: string, limit: number = 20) {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  // Buscar hotéis ativos
  const hotels = await Hotel.find({ isActive: true })

  // Calcular scores e filtrar
  const hotelsWithScores = hotels
    .map(hotel => ({
      hotel,
      score: calculateMatchScore(user.preferences, hotel.toObject()),
    }))
    .filter(item => item.score >= 30) // Mínimo 30% de match
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  // Verificar matches existentes
  const existingMatches = await Match.find({
    userId: new Types.ObjectId(userId),
    hotelId: { $in: hotelsWithScores.map(item => item.hotel._id) }
  })

  const existingMatchIds = new Set(
    existingMatches.map(match => match.hotelId.toString())
  )

  // Filtrar hotéis não matchados ainda
  const newMatches = hotelsWithScores.filter(
    item => !existingMatchIds.has(item.hotel._id.toString())
  )

  return newMatches
}

export async function createMatch(userId: string, hotelId: string) {
  const existingMatch = await Match.findOne({
    userId: new Types.ObjectId(userId),
    hotelId: new Types.ObjectId(hotelId)
  })

  if (existingMatch) {
    return existingMatch
  }

  const user = await User.findById(userId)
  const hotel = await Hotel.findById(hotelId)

  if (!user || !hotel) {
    throw new Error('Usuário ou hotel não encontrado')
  }

  const score = calculateMatchScore(user.preferences, hotel.toObject())

  const match = new Match({
    userId: new Types.ObjectId(userId),
    hotelId: new Types.ObjectId(hotelId),
    score,
    status: 'pending',
    userLiked: false,
    hotelLiked: false,
  })

  await match.save()
  return match
}

export async function updateMatchStatus(
  matchId: string,
  status: 'contacted' | 'booked' | 'rejected',
  userLiked?: boolean
) {
  const match = await Match.findById(matchId)
  if (!match) {
    throw new Error('Match não encontrado')
  }

  match.status = status
  if (userLiked !== undefined) {
    match.userLiked = userLiked
  }

  await match.save()
  return match
}
