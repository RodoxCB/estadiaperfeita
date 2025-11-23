// Simple in-memory database for development with file persistence
// Replace with actual database implementation when needed

import fs from 'fs'
import path from 'path'

interface User {
  id: number
  name: string
  email: string
  password: string
  preferences?: any // Can be object or JSON string
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

interface DatabaseState {
  users: User[]
  hotels: Hotel[]
  matches: any[]
  nextUserId: number
  nextHotelId: number
  nextMatchId: number
}

class MemoryDatabase {
  private users: Map<number, User> = new Map()
  private hotels: Map<number, Hotel> = new Map()
  private matches: Map<string, any> = new Map()
  private nextUserId = 1
  private nextHotelId = 1
  private nextMatchId = 1
  private dataFile = path.join(process.cwd(), 'data', 'memory-db.json')

  constructor() {
    this.loadData()
  }

  private saveData() {
    try {
      const data: DatabaseState = {
        users: Array.from(this.users.values()),
        hotels: Array.from(this.hotels.values()),
        matches: Array.from(this.matches.values()),
        nextUserId: this.nextUserId,
        nextHotelId: this.nextHotelId,
        nextMatchId: this.nextMatchId,
      }
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2))
    } catch (error) {
      console.warn('Failed to save database:', error)
    }
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data: DatabaseState = JSON.parse(fs.readFileSync(this.dataFile, 'utf-8'))
        this.users = new Map(data.users.map(user => [user.id, user]))
        this.hotels = new Map(data.hotels.map(hotel => [hotel.id, hotel]))
        this.matches = new Map(data.matches.map(match => [match.id || `${match.user_id}-${match.hotel_id}`, match]))
        this.nextUserId = data.nextUserId
        this.nextHotelId = data.nextHotelId
        this.nextMatchId = data.nextMatchId
      }
    } catch (error) {
      console.warn('Failed to load database:', error)
    }
  }

  // User methods
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      ...userData,
      preferences: typeof userData.preferences === 'object'
        ? JSON.stringify(userData.preferences)
        : userData.preferences,
      id: this.nextUserId++,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.users.set(user.id, user)
    this.saveData()
    return user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return {
          ...user,
          preferences: typeof user.preferences === 'string'
            ? JSON.parse(user.preferences)
            : user.preferences
        }
      }
    }
    return null
  }

  async findUserById(id: number): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null

    return {
      ...user,
      preferences: typeof user.preferences === 'string'
        ? JSON.parse(user.preferences)
        : user.preferences
    }
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
    this.saveData()
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
