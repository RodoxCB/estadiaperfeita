import { getDb } from '@/lib/db-sqlite'

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
  static async create(matchData: Omit<IMatch, 'id' | 'created_at' | 'updated_at'>): Promise<IMatch> {
    const db = await getDb()

    try {
      const result = await db.run(
        `INSERT OR IGNORE INTO matches (user_id, hotel_id, score, status, user_liked, hotel_liked)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          matchData.user_id,
          matchData.hotel_id,
          matchData.score,
          matchData.status || 'pending',
          matchData.user_liked ? 1 : 0,
          matchData.hotel_liked ? 1 : 0
        ]
      )

      if (result.lastID) {
        const match = await this.findById(result.lastID)
        return match!
      } else {
        // Match já existe, retorna o existente
        const existing = await this.findByUsers(matchData.user_id, matchData.hotel_id)
        return existing!
      }
    } catch (error) {
      // Tentar encontrar match existente se houver violação de unicidade
      const existing = await this.findByUsers(matchData.user_id, matchData.hotel_id)
      if (existing) return existing

      throw error
    }
  }

  static async findById(id: number): Promise<IMatch | null> {
    const db = await getDb()

    const row = await db.get(
      'SELECT * FROM matches WHERE id = ?',
      [id]
    )

    if (!row) return null

    return {
      ...row,
      user_liked: row.user_liked === 1,
      hotel_liked: row.hotel_liked === 1
    } as IMatch
  }

  static async findByUsers(userId: number, hotelId: number): Promise<IMatch | null> {
    const db = await getDb()

    const row = await db.get(
      'SELECT * FROM matches WHERE user_id = ? AND hotel_id = ?',
      [userId, hotelId]
    )

    if (!row) return null

    return {
      ...row,
      user_liked: row.user_liked === 1,
      hotel_liked: row.hotel_liked === 1
    } as IMatch
  }

  static async findByUser(userId: number): Promise<IMatch[]> {
    const db = await getDb()

    const rows = await db.all(
      'SELECT * FROM matches WHERE user_id = ? ORDER BY score DESC',
      [userId]
    )

    return rows.map(row => ({
      ...row,
      user_liked: row.user_liked === 1,
      hotel_liked: row.hotel_liked === 1
    })) as IMatch[]
  }

  static async update(id: number, updates: Partial<Omit<IMatch, 'id' | 'created_at' | 'updated_at'>>): Promise<IMatch | null> {
    const db = await getDb()

    const updateFields: string[] = []
    const values: any[] = []

    if (updates.score !== undefined) {
      updateFields.push('score = ?')
      values.push(updates.score)
    }
    if (updates.status) {
      updateFields.push('status = ?')
      values.push(updates.status)
    }
    if (updates.user_liked !== undefined) {
      updateFields.push('user_liked = ?')
      values.push(updates.user_liked ? 1 : 0)
    }
    if (updates.hotel_liked !== undefined) {
      updateFields.push('hotel_liked = ?')
      values.push(updates.hotel_liked ? 1 : 0)
    }

    if (updateFields.length === 0) return null

    updateFields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    await db.run(
      `UPDATE matches SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    )

    return this.findById(id)
  }
}
