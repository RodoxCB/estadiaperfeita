import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User-memory'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar novo usuário
    const hashedPassword = await hashPassword(password)

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      preferences: {
        groupSize: 1,
        leisureType: 'beach',
        acceptsPets: false,
        budget: { min: 100, max: 500 },
        amenities: [],
        locationPreferences: [],
      },
    })

    return NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    })
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}