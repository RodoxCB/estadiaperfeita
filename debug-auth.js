// Debug script for authentication
import { UserModel } from './src/models/User-memory.js';
import { hashPassword, verifyPassword } from './src/lib/auth.js';

async function debug() {
  console.log('🔍 Debug de autenticação...\n');

  try {
    // Test 1: Register user
    console.log('1. Registrando usuário...');
    const hashedPassword = await hashPassword('test123');
    console.log('   Senha hashed:', hashedPassword.substring(0, 20) + '...');

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
    console.log('✅ Usuário criado:', { id: user.id, name: user.name, email: user.email });

    // Test 2: Find user by email
    console.log('\n2. Buscando usuário por email...');
    const foundUser = await UserModel.findByEmail('test@example.com');
    if (foundUser) {
      console.log('✅ Usuário encontrado:', { id: foundUser.id, name: foundUser.name, email: foundUser.email });
      console.log('   Preferences type:', typeof foundUser.preferences);

      // Test 3: Verify password
      console.log('\n3. Verificando senha...');
      const isValid = await verifyPassword('test123', foundUser.password);
      console.log('   Senha válida:', isValid);

    } else {
      console.log('❌ Usuário não encontrado!');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

debug();
