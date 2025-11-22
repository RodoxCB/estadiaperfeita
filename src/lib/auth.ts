import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '@/models/User-sqlite'

const JWT_SECRET = process.env.JWT_SECRET!

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

export async function authenticateUser(email: string, password: string) {
  const user = await UserModel.findByEmail(email)
  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw new Error('Senha incorreta')
  }

  const token = generateToken(user.id.toString())

  return {
    user: {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    },
    token,
  }
}
