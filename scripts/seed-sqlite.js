const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const bcrypt = require('bcryptjs')

async function getDb() {
  return await sqlite.open({
    filename: './data/estadia_perfeita.db',
    driver: sqlite3.Database,
  })
}

class UserModel {
  static async create(userData) {
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
    return { id: result.lastID, ...userData }
  }
}

class HotelModel {
  static async create(hotelData) {
    const db = await getDb()
    const result = await db.run(
      `INSERT INTO hotels (owner_id, name, description, location, images, capacity, price_per_night, amenities, leisure_type, accepts_pets, contact_info, rating, reviews, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hotelData.owner_id,
        hotelData.name,
        hotelData.description,
        JSON.stringify(hotelData.location),
        JSON.stringify(hotelData.images || []),
        hotelData.capacity,
        hotelData.price_per_night,
        JSON.stringify(hotelData.amenities || []),
        JSON.stringify(hotelData.leisure_type || []),
        hotelData.accepts_pets ? 1 : 0,
        JSON.stringify(hotelData.contact_info),
        hotelData.rating || 0,
        JSON.stringify(hotelData.reviews || []),
        hotelData.is_active ? 1 : 0
      ]
    )
    return { id: result.lastID, ...hotelData }
  }
}

async function seedDatabase() {
  try {
    console.log('Iniciando seed do banco SQLite...')

    const db = await getDb()

    // Criar tabelas se não existirem
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        images TEXT,
        capacity INTEGER NOT NULL,
        price_per_night REAL NOT NULL,
        amenities TEXT,
        leisure_type TEXT,
        accepts_pets BOOLEAN DEFAULT 0,
        contact_info TEXT NOT NULL,
        rating REAL DEFAULT 0,
        reviews TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        hotel_id INTEGER NOT NULL,
        score REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        user_liked BOOLEAN DEFAULT 0,
        hotel_liked BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, hotel_id)
      );
    `)

    // Criar usuários de teste
    const hashedPassword = await bcrypt.hash('123456', 12)

    const users = [
      {
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 2,
          leisureType: 'beach',
          acceptsPets: true,
          budget: { min: 150, max: 400 },
          amenities: ['Wi-Fi', 'Piscina'],
          locationPreferences: ['Praia'],
        }),
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 4,
          leisureType: 'mountain',
          acceptsPets: false,
          budget: { min: 200, max: 600 },
          amenities: ['Wi-Fi', 'Lareira', 'Café da manhã'],
          locationPreferences: ['Montanha'],
        }),
      },
    ]

    const createdUsers = []
    for (const userData of users) {
      const result = await db.run(
        'INSERT OR IGNORE INTO users (name, email, password, preferences) VALUES (?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, userData.preferences]
      )
      if (result.lastID) {
        createdUsers.push({ id: result.lastID, ...userData })
        console.log(`✅ Usuário criado: ${userData.name} (${userData.email})`)
      } else {
        // Buscar usuário existente
        const existing = await db.get('SELECT id FROM users WHERE email = ?', [userData.email])
        createdUsers.push({ id: existing.id, ...userData })
      }
    }

    // Criar hotéis de teste
    const hotels = [
      {
        owner_id: createdUsers[0].id,
        name: 'Pousada do Sol',
        description: 'Pousada aconchegante na praia com vista para o mar',
        location: JSON.stringify({
          city: 'Florianópolis',
          state: 'SC',
          country: 'Brasil',
        }),
        images: JSON.stringify(['/placeholder-hotel.jpg']),
        capacity: 4,
        price_per_night: 250,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Café da manhã', 'Estacionamento']),
        leisure_type: JSON.stringify(['beach']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(48) 99999-9999',
          email: 'contato@pousadadosol.com',
          whatsapp: '(48) 99999-9999',
        }),
        rating: 4.5,
        reviews: JSON.stringify([]),
        is_active: 1,
      },
      {
        owner_id: createdUsers[0].id,
        name: 'Hotel Montanha Verde',
        description: 'Hotel nas montanhas com ar puro e vista panorâmica',
        location: JSON.stringify({
          city: 'Gramado',
          state: 'RS',
          country: 'Brasil',
        }),
        images: JSON.stringify(['/placeholder-hotel.jpg']),
        capacity: 6,
        price_per_night: 180,
        amenities: JSON.stringify(['Wi-Fi', 'Lareira', 'Café da manhã', 'Estacionamento']),
        leisure_type: JSON.stringify(['mountain']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(54) 99999-9999',
          email: 'contato@montanhaverde.com',
          whatsapp: '(54) 99999-9999',
        }),
        rating: 4.2,
        reviews: JSON.stringify([]),
        is_active: 1,
      },
      {
        owner_id: createdUsers[1].id,
        name: 'Chalé da Serra',
        description: 'Chalé romântico nas montanhas para casais',
        location: JSON.stringify({
          city: 'Campos do Jordão',
          state: 'SP',
          country: 'Brasil',
        }),
        images: JSON.stringify(['/placeholder-hotel.jpg']),
        capacity: 2,
        price_per_night: 350,
        amenities: JSON.stringify(['Wi-Fi', 'Lareira', 'Café da manhã', 'Spa']),
        leisure_type: JSON.stringify(['mountain', 'countryside']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(12) 99999-9999',
          email: 'contato@chaledaserra.com',
          whatsapp: '(12) 99999-9999',
        }),
        rating: 4.8,
        reviews: JSON.stringify([]),
        is_active: 1,
      },
      {
        owner_id: createdUsers[1].id,
        name: 'Pousada Praia Azul',
        description: 'Pousada familiar na praia com área para crianças',
        location: JSON.stringify({
          city: 'Ubatuba',
          state: 'SP',
          country: 'Brasil',
        }),
        images: JSON.stringify(['/placeholder-hotel.jpg']),
        capacity: 8,
        price_per_night: 220,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Café da manhã', 'Estacionamento', 'Playground']),
        leisure_type: JSON.stringify(['beach', 'adventure']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(12) 88888-8888',
          email: 'contato@praiaazul.com',
          whatsapp: '(12) 88888-8888',
        }),
        rating: 4.3,
        reviews: JSON.stringify([]),
        is_active: 1,
      },
    ]

    for (const hotelData of hotels) {
      const result = await db.run(
        `INSERT OR IGNORE INTO hotels
         (owner_id, name, description, location, images, capacity, price_per_night, amenities, leisure_type, accepts_pets, contact_info, rating, reviews, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hotelData.owner_id,
          hotelData.name,
          hotelData.description,
          hotelData.location,
          hotelData.images,
          hotelData.capacity,
          hotelData.price_per_night,
          hotelData.amenities,
          hotelData.leisure_type,
          hotelData.accepts_pets,
          hotelData.contact_info,
          hotelData.rating,
          hotelData.reviews,
          hotelData.is_active
        ]
      )
      if (result.lastID) {
        console.log(`✅ Hotel criado: ${hotelData.name}`)
      }
    }

    await db.close()

    console.log('\n🎉 Seed concluído com sucesso!')
    console.log('📊 Dados de teste criados')
    console.log('\n🔐 Credenciais para testar:')
    console.log('📧 joao@example.com | 🔑 123456')
    console.log('📧 maria@example.com | 🔑 123456')

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error)
  }
}

seedDatabase().finally(() => {
  process.exit(0)
})
