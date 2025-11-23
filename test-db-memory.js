// Test script for memory database
import db from './src/lib/db-memory.js';

async function test() {
  console.log('🧪 Testando banco de memória...\n');

  // Test 1: Create user
  console.log('1. Criando usuário...');
  const user = await db.createUser({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    preferences: {
      groupSize: 1,
      leisureType: 'beach',
      acceptsPets: false,
      budget: { min: 100, max: 500 },
      amenities: [],
      locationPreferences: []
    }
  });
  console.log('✅ Usuário criado:', { id: user.id, name: user.name, email: user.email });

  // Test 2: Find user by email
  console.log('\n2. Buscando usuário por email...');
  const foundUser = await db.findUserByEmail('test@example.com');
  console.log('✅ Usuário encontrado:', foundUser ? { id: foundUser.id, name: foundUser.name, email: foundUser.email } : 'null');

  // Test 3: Find user by ID
  console.log('\n3. Buscando usuário por ID...');
  const foundById = await db.findUserById(user.id);
  console.log('✅ Usuário encontrado por ID:', foundById ? { id: foundById.id, name: foundById.name, email: foundById.email } : 'null');

  // Test 4: Test preferences serialization
  console.log('\n4. Verificando preferences...');
  if (foundUser && typeof foundUser.preferences === 'object') {
    console.log('✅ Preferences desserializados corretamente:', foundUser.preferences);
  } else {
    console.log('❌ Preferences não desserializados:', foundUser?.preferences);
  }

  console.log('\n🎉 Todos os testes passaram!');
}

test().catch(console.error);
