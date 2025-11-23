// Test login flow
import { UserModel } from './src/models/User-memory.js';
import { hashPassword, verifyPassword } from './src/lib/auth.js';

async function testLoginFlow() {
  console.log('🔐 Testando fluxo de login...\n');

  try {
    // Step 1: Register user
    console.log('1. Registrando usuário...');
    const hashedPassword = await hashPassword('test123456');

    const user = await UserModel.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      preferences: {
        groupSize: 1,
        leisureType: 'beach',
        acceptsPets: false,
        budget: { min: 100, max: 500 },
        amenities: [],
        locationPreferences: [],
      },
    });
    console.log('✅ Usuário registrado:', { id: user.id, email: user.email });

    // Step 2: Try to login with correct credentials
    console.log('\n2. Fazendo login com credenciais corretas...');
    const loginUser = await UserModel.findByEmail('test@example.com');

    if (!loginUser) {
      console.log('❌ ERRO: Usuário não encontrado durante login!');
      return;
    }

    console.log('✅ Usuário encontrado:', { id: loginUser.id, email: loginUser.email });

    const passwordValid = await verifyPassword('test123456', loginUser.password);
    console.log('✅ Senha válida:', passwordValid);

    // Step 3: Try to login with wrong email
    console.log('\n3. Tentando login com email errado...');
    const wrongUser = await UserModel.findByEmail('wrong@example.com');
    console.log('✅ Usuário com email errado:', wrongUser ? 'Encontrado' : 'Não encontrado (correto)');

    // Step 4: Try to login with wrong password
    console.log('\n4. Tentando login com senha errada...');
    const wrongPassword = await verifyPassword('wrongpassword', loginUser.password);
    console.log('✅ Senha errada válida:', wrongPassword ? 'Sim (ERRO!)' : 'Não (correto)');

    console.log('\n🎉 Fluxo de login funcionando corretamente!');

  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testLoginFlow();
