const { UserModel } = require('./src/models/User-sqlite')
const { verifyPassword } = require('./src/lib/auth')

async function testLogin() {
  console.log('🔍 Testando login...')

  try {
    // Buscar usuário
    const user = await UserModel.findByEmail('joao@example.com')
    if (!user) {
      console.log('❌ Usuário não encontrado')
      return
    }

    console.log('✅ Usuário encontrado:', user.name)

    // Testar senha
    const isValid = await verifyPassword('123456', user.password)
    if (isValid) {
      console.log('✅ Senha correta!')
    } else {
      console.log('❌ Senha incorreta')
      console.log('Hash armazenado:', user.password)
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testLogin()
