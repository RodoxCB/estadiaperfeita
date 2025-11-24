import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '@/models/User-sqlite'

const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret-change-in-production'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

// Função mantida para compatibilidade, mas não usada nas APIs atuais
