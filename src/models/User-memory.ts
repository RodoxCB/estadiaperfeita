import db from '@/lib/db-memory'

export interface IUser {
  id: number
  name: string
  email: string
  password: string
  preferences: {
    groupSize: number
    leisureType: 'beach' | 'mountain' | 'city' | 'countryside' | 'adventure'
    acceptsPets: boolean
    budget: {
      min: number
      max: number
    }
    amenities: string[]
    locationPreferences: string[]
    specialRequirements?: string
  }
  created_at: string
  updated_at: string
}

export class UserModel {
  static async create(userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser> {
    const user = await db.createUser(userData)
    return user as IUser
  }

  static async findById(id: number): Promise<IUser | null> {
    return await db.findUserById(id) as IUser | null
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return await db.findUserByEmail(email) as IUser | null
  }

  static async findAll(): Promise<IUser[]> {
    // For memory DB, we'll just return an empty array for now
    // In a real implementation, we'd need to add this method to the memory DB
    return []
  }

  static async update(id: number, updates: Partial<Omit<IUser, 'id' | 'created_at' | 'updated_at'>>): Promise<IUser | null> {
    // Simple implementation - just return the user for now
    // In a real implementation, we'd need to add update method to memory DB
    return await this.findById(id)
  }
}
