import db from '@/lib/db-memory'

export interface IMatch {
  id: number
  user_id: number
  hotel_id: number
  score: number
  status: 'pending' | 'contacted' | 'booked' | 'rejected'
  user_liked: boolean
  hotel_liked: boolean
  created_at: string
  updated_at: string
}

export class MatchModel {
  static async findByUser(userId: number): Promise<IMatch[]> {
    const matches = await db.getMatchesForUser(userId)
    return matches.map(match => ({
      id: match.id,
      user_id: match.user_id,
      hotel_id: match.hotel_id,
      score: match.score,
      status: match.status,
      user_liked: match.user_liked,
      hotel_liked: match.hotel_liked,
      created_at: match.created_at,
      updated_at: match.updated_at,
    }))
  }

  static async create(matchData: {
    user_id: number
    hotel_id: number
    score: number
  }): Promise<IMatch> {
    const match = await db.createMatch(matchData)
    return {
      id: match.id,
      user_id: match.user_id,
      hotel_id: match.hotel_id,
      score: match.score,
      status: match.status,
      user_liked: match.user_liked,
      hotel_liked: match.hotel_liked,
      created_at: match.created_at,
      updated_at: match.updated_at,
    }
  }

  static async findByUsers(userId: number, hotelId: number): Promise<IMatch | null> {
    // For memory DB, we need to search through all matches
    // This is not efficient but works for development
    const allMatches = await db.getMatchesForUser(userId)
    const match = allMatches.find(m => m.hotel_id === hotelId)
    if (match) {
      return {
        id: match.id,
        user_id: match.user_id,
        hotel_id: match.hotel_id,
        score: match.score,
        status: match.status,
        user_liked: match.user_liked,
        hotel_liked: match.hotel_liked,
        created_at: match.created_at,
        updated_at: match.updated_at,
      }
    }
    return null
  }

  static async update(id: number, updates: Partial<IMatch>): Promise<IMatch | null> {
    // For memory DB, we'll just return the match for now
    // In a real implementation, we'd need to add update method to memory DB
    const matches = await db.getMatchesForUser(0) // This is a hack, but matches are stored per user
    const match = matches.find(m => m.id === id)
    return match || null
  }
}
