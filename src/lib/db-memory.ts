// Simple in-memory database for development
// Replace with actual database implementation when needed

interface User {
  id: number
  name: string
  email: string
  password: string
  preferences?: string
  created_at?: string
  updated_at?: string
}

interface Hotel {
  id: number
  owner_id: number
  name: string
  description: string
  location: string
  capacity: number
  price_per_night: number
  amenities: string
  leisure_type: string
  accepts_pets: boolean
  contact_info: string
  is_active: boolean
}

class MemoryDatabase {
  private users: Map<number, User> = new Map()
  private hotels: Map<number, Hotel> = new Map()
  private matches: Map<string, any> = new Map()
  private nextUserId = 1
  private nextHotelId = 1
  private nextMatchId = 1

  // User methods
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.nextUserId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.set(user.id, user)
    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async findUserById(id: number): Promise<User | null> {
    return this.users.get(id) || null
  }

  // Hotel methods
  async createHotel(hotelData: Omit<Hotel, 'id'>): Promise<Hotel> {
    const hotel: Hotel = {
      ...hotelData,
      id: this.nextHotelId++,
    }
    this.hotels.set(hotel.id, hotel)
    return hotel
  }

  async getAllHotels(): Promise<Hotel[]> {
    return Array.from(this.hotels.values()).filter(h => h.is_active)
  }

  async findHotelById(id: number): Promise<Hotel | null> {
    return this.hotels.get(id) || null
  }

  // Match methods
  async createMatch(matchData: { user_id: number; hotel_id: number; score: number }): Promise<any> {
    const match = {
      id: this.nextMatchId++,
      ...matchData,
      status: 'pending',
      user_liked: false,
      hotel_liked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.matches.set(`${match.user_id}-${match.hotel_id}`, match)
    return match
  }

  async getMatchesForUser(userId: number): Promise<any[]> {
    const userMatches = []
    for (const match of this.matches.values()) {
      if (match.user_id === userId) {
        const hotel = this.hotels.get(match.hotel_id)
        if (hotel) {
          userMatches.push({
            id: match.id,
            hotel: {
              id: hotel.id,
              name: hotel.name,
              description: hotel.description,
              location: JSON.parse(hotel.location),
              pricePerNight: hotel.price_per_night,
              capacity: hotel.capacity,
              acceptsPets: hotel.accepts_pets,
              amenities: JSON.parse(hotel.amenities),
              matchScore: match.score,
            },
            score: match.score,
            status: match.status,
          })
        }
      }
    }
    return userMatches
  }
}

// Singleton instance
const db = new MemoryDatabase()

export default db
