import { getDb } from '@/lib/db-sqlite'

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
    const db = await getDb()

    const result = await db.run(
      `INSERT INTO users (name, email, password, preferences)
       VALUES (?, ?, ?, ?)`,
      [
        userData.name,
        userData.email,
        userData.password,
        JSON.stringify(userData.preferences)
      ]
    )

    const user = await this.findById(result.lastID!)
    return user
  }

  static async findById(id: number): Promise<IUser | null> {
    const db = await getDb()

    const row = await db.get(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )

    if (!row) return null

    return {
      ...row,
      preferences: JSON.parse(row.preferences)
    } as IUser
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const db = await getDb()

    const row = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (!row) return null

    return {
      ...row,
      preferences: JSON.parse(row.preferences)
    } as IUser
  }

  static async findAll(): Promise<IUser[]> {
    const db = await getDb()

    const rows = await db.all('SELECT * FROM users')

    return rows.map(row => ({
      ...row,
      preferences: JSON.parse(row.preferences)
    })) as IUser[]
  }

  static async update(id: number, updates: Partial<Omit<IUser, 'id' | 'created_at' | 'updated_at'>>): Promise<IUser | null> {
    const db = await getDb()

    const updateFields: string[] = []
    const values: any[] = []

    if (updates.name) {
      updateFields.push('name = ?')
      values.push(updates.name)
    }
    if (updates.email) {
      updateFields.push('email = ?')
      values.push(updates.email)
    }
    if (updates.password) {
      updateFields.push('password = ?')
      values.push(updates.password)
    }
    if (updates.preferences) {
      updateFields.push('preferences = ?')
      values.push(JSON.stringify(updates.preferences))
    }

    if (updateFields.length === 0) return null

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    await db.run(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    )

    return this.findById(id)
  }
}
