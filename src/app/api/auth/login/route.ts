import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User-memory'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await UserModel.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }

    const token = generateToken(user.id.toString())

    return NextResponse.json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
      token,
    })
  } catch (error: any) {
    console.error('Erro ao fazer login:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 401 }
    )
  }
}