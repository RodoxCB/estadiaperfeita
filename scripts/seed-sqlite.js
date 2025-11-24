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

    // Criar usuários de teste com perfis diversificados
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
          specialRequirements: 'Vista para o mar',
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
          specialRequirements: 'Ambiente familiar',
        }),
      },
      {
        name: 'Carlos Ferreira',
        email: 'carlos@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 6,
          leisureType: 'family',
          acceptsPets: true,
          budget: { min: 300, max: 800 },
          amenities: ['Wi-Fi', 'Piscina', 'Playground', 'Restaurante'],
          locationPreferences: ['Praia', 'Resort'],
          specialRequirements: 'Estrutura completa para crianças',
        }),
      },
      {
        name: 'Ana Paula Costa',
        email: 'ana@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 2,
          leisureType: 'romantic',
          acceptsPets: false,
          budget: { min: 400, max: 1000 },
          amenities: ['Wi-Fi', 'Spa', 'Vista panorâmica', 'Serviço de quarto'],
          locationPreferences: ['Montanha', 'Campos do Jordão'],
          specialRequirements: 'Ambiente romântico e luxuoso',
        }),
      },
      {
        name: 'Roberto Lima',
        email: 'roberto@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 1,
          leisureType: 'business',
          acceptsPets: false,
          budget: { min: 200, max: 500 },
          amenities: ['Wi-Fi', 'Academia', 'Estacionamento'],
          locationPreferences: ['São Paulo', 'Rio de Janeiro'],
          specialRequirements: 'Próximo ao centro de convenções',
        }),
      },
      {
        name: 'Juliana Mendes',
        email: 'juliana@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 8,
          leisureType: 'adventure',
          acceptsPets: true,
          budget: { min: 100, max: 350 },
          amenities: ['Wi-Fi', 'Cozinha equipada', 'Estacionamento'],
          locationPreferences: ['Natureza', 'Pantanal', 'Amazônia'],
          specialRequirements: 'Experiências de ecoturismo',
        }),
      },
      {
        name: 'Fernando Alves',
        email: 'fernando@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 3,
          leisureType: 'youth',
          acceptsPets: false,
          budget: { min: 80, max: 200 },
          amenities: ['Wi-Fi', 'Bar', 'Área comum'],
          locationPreferences: ['Praia', 'Balneário Camboriú', 'Porto de Galinhas'],
          specialRequirements: 'Ambiente jovem e animado',
        }),
      },
      {
        name: 'Carla Rodrigues',
        email: 'carla@example.com',
        password: hashedPassword,
        preferences: JSON.stringify({
          groupSize: 2,
          leisureType: 'cultural',
          acceptsPets: true,
          budget: { min: 250, max: 600 },
          amenities: ['Wi-Fi', 'Café da manhã', 'Vista para o mar'],
          locationPreferences: ['Paraty', 'Salvador', 'Ouro Preto'],
          specialRequirements: 'Experiências culturais e artísticas',
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

    // Criar hotéis de teste - coleção diversificada
    const hotels = [
      // PRAIAS - NORDESTE
      {
        owner_id: createdUsers[0].id,
        name: 'Resort Porto Seguro Praia',
        description: 'Resort all-inclusive de luxo na Praia de Taperapuã, com estrutura completa para famílias e casais. Oferece praia privativa, 3 piscinas, restaurantes temáticos e atividades recreativas diárias.',
        location: JSON.stringify({
          city: 'Porto Seguro',
          state: 'BA',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
        ]),
        capacity: 6,
        price_per_night: 450,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Restaurante', 'Spa', 'Academia', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto', 'Lavanderia']),
        leisure_type: JSON.stringify(['beach', 'adventure', 'family']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(73) 3288-0000',
          email: 'reservas@resortportoseguro.com',
          whatsapp: '(73) 99999-0000',
        }),
        rating: 4.8,
        reviews: JSON.stringify([
          { user: 'Ana Silva', rating: 5, comment: 'Estrutura incrível, atendimento excelente!' },
          { user: 'Carlos Santos', rating: 5, comment: 'Perfeito para férias em família' }
        ]),
        is_active: 1,
      },
      {
        owner_id: createdUsers[1].id,
        name: 'Pousada do Forte',
        description: 'Pousada histórica localizada ao lado do Forte de São Marcelo, com vista para o mar e arquitetura colonial. Ambiente romântico e aconchegante para casais.',
        location: JSON.stringify({
          city: 'Salvador',
          state: 'BA',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop'
        ]),
        capacity: 2,
        price_per_night: 280,
        amenities: JSON.stringify(['Wi-Fi', 'Café da manhã', 'Ar-condicionado', 'Vista para o mar', 'Estacionamento']),
        leisure_type: JSON.stringify(['beach', 'historical', 'romantic']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(71) 3322-0000',
          email: 'contato@pousadaforte.com',
          whatsapp: '(71) 99999-1111',
        }),
        rating: 4.6,
        reviews: JSON.stringify([
          { user: 'Mariana Costa', rating: 5, comment: 'Localização perfeita, muito charmoso!' }
        ]),
        is_active: 1,
      },

      // PRAIAS - SUDESTE
      {
        owner_id: createdUsers[0].id,
        name: 'Hotel Copacabana Palace',
        description: 'Ícone da hotelaria brasileira localizado na praia mais famosa do Rio. Luxo, sofisticação e vista incomparável para o mar. Experiência única com spa, restaurantes premiados e localização privilegiada.',
        location: JSON.stringify({
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
        ]),
        capacity: 4,
        price_per_night: 1200,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Restaurante', 'Bar', 'Spa', 'Academia', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto', 'Concierge', 'Vista para o mar']),
        leisure_type: JSON.stringify(['beach', 'luxury', 'urban']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(21) 2548-7070',
          email: 'reservas@copacabanapalace.com',
          whatsapp: '(21) 99999-2222',
        }),
        rating: 4.9,
        reviews: JSON.stringify([
          { user: 'Roberto Lima', rating: 5, comment: 'Experiência de luxo incomparável!' },
          { user: 'Fernanda Alves', rating: 5, comment: 'Serviço impecável, localização perfeita' }
        ]),
        is_active: 1,
      },
      {
        owner_id: createdUsers[1].id,
        name: 'Pousada da Praia - Ubatuba',
        description: 'Pousada familiar com vista direta para a praia, ideal para famílias com crianças. Ambiente acolhedor, café da manhã colonial e fácil acesso à praia.',
        location: JSON.stringify({
          city: 'Ubatuba',
          state: 'SP',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 8,
        price_per_night: 320,
        amenities: JSON.stringify(['Wi-Fi', 'Café da manhã', 'Piscina', 'Estacionamento', 'Ar-condicionado', 'Playground', 'Vista para o mar']),
        leisure_type: JSON.stringify(['beach', 'family', 'nature']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(12) 3833-0000',
          email: 'contato@pousadapraiauba.com',
          whatsapp: '(12) 99999-3333',
        }),
        rating: 4.4,
        reviews: JSON.stringify([
          { user: 'Paulo Mendes', rating: 4, comment: 'Ótimo para férias com a família' }
        ]),
        is_active: 1,
      },

      // MONTANHAS - SERRA GAÚCHA
      {
        owner_id: createdUsers[0].id,
        name: 'Hotel Laghetto Stilo Borges',
        description: 'Hotel boutique nas montanhas de Gramado, com arquitetura inspirada na Europa Central. Ambiente romântico com lareiras, vista para o vale e gastronomia premiada.',
        location: JSON.stringify({
          city: 'Gramado',
          state: 'RS',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop'
        ]),
        capacity: 2,
        price_per_night: 650,
        amenities: JSON.stringify(['Wi-Fi', 'Lareira', 'Restaurante', 'Spa', 'Academia', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto']),
        leisure_type: JSON.stringify(['mountain', 'romantic', 'gastronomic']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(54) 3295-7700',
          email: 'reservas@laghettostilo.com',
          whatsapp: '(54) 99999-4444',
        }),
        rating: 4.9,
        reviews: JSON.stringify([
          { user: 'Cristina Borges', rating: 5, comment: 'Romance perfeito nas montanhas!' },
          { user: 'Luiz Fernando', rating: 5, comment: 'Gastronomia excepcional' }
        ]),
        is_active: 1,
      },
      {
        owner_id: createdUsers[1].id,
        name: 'Chalé Recanto das Araucárias',
        description: 'Chalé acolhedor na Serra Gaúcha, rodeado por araucárias e com vista para o vale. Ideal para casais que buscam paz e conexão com a natureza.',
        location: JSON.stringify({
          city: 'Canela',
          state: 'RS',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 4,
        price_per_night: 280,
        amenities: JSON.stringify(['Wi-Fi', 'Lareira', 'Cozinha equipada', 'Varanda', 'Estacionamento', 'Ar-condicionado']),
        leisure_type: JSON.stringify(['mountain', 'nature', 'countryside']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(54) 3282-0000',
          email: 'contato@recantoaraucarias.com',
          whatsapp: '(54) 99999-5555',
        }),
        rating: 4.5,
        reviews: JSON.stringify([
          { user: 'Marina Souza', rating: 5, comment: 'Paraíso nas montanhas!' }
        ]),
        is_active: 1,
      },

      // CAMPOS DO JORDÃO
      {
        owner_id: createdUsers[0].id,
        name: 'Hotel Toriba',
        description: 'Hotel tradicional de Campos do Jordão, com arquitetura suiça e vista panorâmica das montanhas. Ambiente sofisticado com jardins, spa e gastronomia internacional.',
        location: JSON.stringify({
          city: 'Campos do Jordão',
          state: 'SP',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=600&fit=crop'
        ]),
        capacity: 3,
        price_per_night: 580,
        amenities: JSON.stringify(['Wi-Fi', 'Restaurante', 'Spa', 'Academia', 'Jardim', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto']),
        leisure_type: JSON.stringify(['mountain', 'luxury', 'relaxing']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(12) 3668-2000',
          email: 'reservas@hoteltoriba.com',
          whatsapp: '(12) 99999-6666',
        }),
        rating: 4.7,
        reviews: JSON.stringify([
          { user: 'André Carvalho', rating: 5, comment: 'Luxo e sofisticação nas montanhas' }
        ]),
        is_active: 1,
      },

      // CENTRO-OESTE - PANTANAL
      {
        owner_id: createdUsers[1].id,
        name: 'Pousada Araras Eco Lodge',
        description: 'Pousada sustentável no Pantanal, especializada em ecoturismo e observação da fauna. Chalés rústicos com vista para o rio, guias especializados e experiências únicas.',
        location: JSON.stringify({
          city: 'Poconé',
          state: 'MT',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 6,
        price_per_night: 380,
        amenities: JSON.stringify(['Wi-Fi', 'Restaurante', 'Guias turísticos', 'Observação de animais', 'Canoagem', 'Estacionamento', 'Ar-condicionado']),
        leisure_type: JSON.stringify(['nature', 'adventure', 'wildlife', 'ecotourism']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(65) 3354-0000',
          email: 'contato@araraslodge.com',
          whatsapp: '(65) 99999-7777',
        }),
        rating: 4.6,
        reviews: JSON.stringify([
          { user: 'José Pereira', rating: 5, comment: 'Experiência única com a natureza!' },
          { user: 'Sofia Martins', rating: 4, comment: 'Incrível observação de animais' }
        ]),
        is_active: 1,
      },

      // AMAZÔNIA
      {
        owner_id: createdUsers[0].id,
        name: 'Hotel Tropical Manaus',
        description: 'Hotel moderno no coração de Manaus, com vista para o Rio Negro. Mistura o conforto urbano com a proximidade da floresta amazônica.',
        location: JSON.stringify({
          city: 'Manaus',
          state: 'AM',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 4,
        price_per_night: 350,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Restaurante', 'Bar', 'Academia', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto']),
        leisure_type: JSON.stringify(['urban', 'nature', 'adventure', 'amazon']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(92) 2123-0000',
          email: 'reservas@tropicalmanaus.com',
          whatsapp: '(92) 99999-8888',
        }),
        rating: 4.3,
        reviews: JSON.stringify([
          { user: 'Ricardo Silva', rating: 4, comment: 'Bom hotel para conhecer Manaus' }
        ]),
        is_active: 1,
      },

      // CHALÉS E POUSADAS RURAIS
      {
        owner_id: createdUsers[1].id,
        name: 'Chalé Vale Verde',
        description: 'Chalé encantador no interior de Minas Gerais, rodeado por montanhas e cafezais. Ambiente rústico e acolhedor, perfeito para descanso e reconexão com a natureza.',
        location: JSON.stringify({
          city: 'Tiradentes',
          state: 'MG',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 5,
        price_per_night: 220,
        amenities: JSON.stringify(['Wi-Fi', 'Lareira', 'Cozinha equipada', 'Varanda', 'Estacionamento', 'Ar-condicionado']),
        leisure_type: JSON.stringify(['countryside', 'nature', 'relaxing']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(32) 3355-0000',
          email: 'contato@chalevaleverde.com',
          whatsapp: '(32) 99999-9999',
        }),
        rating: 4.4,
        reviews: JSON.stringify([
          { user: 'Beatriz Lima', rating: 5, comment: 'Paraíso rural, muito aconchegante!' }
        ]),
        is_active: 1,
      },

      // HOTEL URBANO - SÃO PAULO
      {
        owner_id: createdUsers[0].id,
        name: 'Hotel Unique São Paulo',
        description: 'Hotel boutique no coração de São Paulo, com design contemporâneo e localização privilegiada. Rooftop com piscina, restaurantes e vista panorâmica da cidade.',
        location: JSON.stringify({
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
        ]),
        capacity: 2,
        price_per_night: 750,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Restaurante', 'Bar', 'Spa', 'Academia', 'Rooftop', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto']),
        leisure_type: JSON.stringify(['urban', 'luxury', 'business']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(11) 3059-0000',
          email: 'reservas@hotelunique.com',
          whatsapp: '(11) 99999-1010',
        }),
        rating: 4.8,
        reviews: JSON.stringify([
          { user: 'Gabriela Costa', rating: 5, comment: 'Design incrível, localização perfeita!' },
          { user: 'Marcelo Santos', rating: 4, comment: 'Excelente para negócios e lazer' }
        ]),
        is_active: 1,
      },

      // POUSADA CHARMOSA - ILHA GRANDE
      {
        owner_id: createdUsers[1].id,
        name: 'Pousada da Ilha',
        description: 'Pousada encantadora em Ilha Grande, com quartos temáticos e vista para a baía. Ambiente boêmio e descontraído, ideal para jovens e casais aventureiros.',
        location: JSON.stringify({
          city: 'Ilha Grande',
          state: 'RJ',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 3,
        price_per_night: 180,
        amenities: JSON.stringify(['Wi-Fi', 'Café da manhã', 'Bar', 'Vista para o mar', 'Estacionamento']),
        leisure_type: JSON.stringify(['beach', 'adventure', 'youth', 'bohemian']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(24) 3361-0000',
          email: 'contato@pousadailha.com',
          whatsapp: '(24) 99999-1111',
        }),
        rating: 4.2,
        reviews: JSON.stringify([
          { user: 'Thiago Oliveira', rating: 4, comment: 'Ambiente super descontraído!' }
        ]),
        is_active: 1,
      },

      // RESORT FAMILIAR - BALNEÁRIO CAMBORIÚ
      {
        owner_id: createdUsers[0].id,
        name: 'Resort Camboriú Paradise',
        description: 'Resort familiar em Balneário Camboriú com parque aquático, shows infantis e estrutura completa. Ideal para famílias com crianças de todas as idades.',
        location: JSON.stringify({
          city: 'Balneário Camboriú',
          state: 'SC',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
        ]),
        capacity: 10,
        price_per_night: 420,
        amenities: JSON.stringify(['Wi-Fi', 'Piscina', 'Parque aquático', 'Restaurante', 'Shows infantis', 'Academia', 'Estacionamento', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto', 'Playground']),
        leisure_type: JSON.stringify(['beach', 'family', 'entertainment']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(47) 3367-0000',
          email: 'reservas@camboriuparadise.com',
          whatsapp: '(47) 99999-1212',
        }),
        rating: 4.5,
        reviews: JSON.stringify([
          { user: 'Ana Paula', rating: 5, comment: 'Perfeito para férias com as crianças!' },
          { user: 'Roberto Costa', rating: 4, comment: 'Muita diversão para toda a família' }
        ]),
        is_active: 1,
      },

      // CHALÉ ROMÂNTICO - SERRA DA CANASTRA
      {
        owner_id: createdUsers[1].id,
        name: 'Chalé Lua Cheia',
        description: 'Chalé romântico na Serra da Canastra, com vista para o céu estrelado e banheira de imersão. Ambiente perfeito para casais em busca de romance e paz.',
        location: JSON.stringify({
          city: 'São Roque de Minas',
          state: 'MG',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 2,
        price_per_night: 320,
        amenities: JSON.stringify(['Wi-Fi', 'Lareira', 'Banheira', 'Vista panorâmica', 'Cozinha equipada', 'Varanda', 'Ar-condicionado']),
        leisure_type: JSON.stringify(['mountain', 'romantic', 'nature', 'relaxing']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(37) 3231-0000',
          email: 'contato@chaleluacheia.com',
          whatsapp: '(37) 99999-1313',
        }),
        rating: 4.7,
        reviews: JSON.stringify([
          { user: 'Camila Rodrigues', rating: 5, comment: 'Romance perfeito, lugar mágico!' }
        ]),
        is_active: 1,
      },

      // HOSTEL JOVEM - PORTO DE GALINHAS
      {
        owner_id: createdUsers[0].id,
        name: 'Hostel Maré Cheia',
        description: 'Hostel descolado em Porto de Galinhas, com vibe jovem e descontraída. Quartos compartilhados e privativos, bar na cobertura e eventos noturnos.',
        location: JSON.stringify({
          city: 'Porto de Galinhas',
          state: 'PE',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 12,
        price_per_night: 85,
        amenities: JSON.stringify(['Wi-Fi', 'Café da manhã', 'Bar', 'Área comum', 'Cozinha compartilhada', 'Estacionamento', 'Eventos']),
        leisure_type: JSON.stringify(['beach', 'youth', 'party', 'budget']),
        accepts_pets: 0,
        contact_info: JSON.stringify({
          phone: '(81) 3551-0000',
          email: 'contato@marecheiahostel.com',
          whatsapp: '(81) 99999-1414',
        }),
        rating: 4.1,
        reviews: JSON.stringify([
          { user: 'Lucas Pereira', rating: 4, comment: 'Ótimo para jovens, muita diversão!' },
          { user: 'Amanda Silva', rating: 4, comment: 'Ambiente super animado' }
        ]),
        is_active: 1,
      },

      // POUSADA DE CHARME - PARATY
      {
        owner_id: createdUsers[1].id,
        name: 'Pousada Arte & Mar',
        description: 'Pousada boutique em Paraty com decoração artística e vista para o mar. Ambiente sofisticado e cultural, com galerias de arte e gastronomia diferenciada.',
        location: JSON.stringify({
          city: 'Paraty',
          state: 'RJ',
          country: 'Brasil',
        }),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?w=800&h=600&fit=crop'
        ]),
        capacity: 3,
        price_per_night: 480,
        amenities: JSON.stringify(['Wi-Fi', 'Café da manhã', 'Restaurante', 'Vista para o mar', 'Ar-condicionado', 'TV a cabo', 'Serviço de quarto']),
        leisure_type: JSON.stringify(['beach', 'cultural', 'gastronomic', 'luxury']),
        accepts_pets: 1,
        contact_info: JSON.stringify({
          phone: '(24) 3371-0000',
          email: 'reservas@arteemar.com',
          whatsapp: '(24) 99999-1515',
        }),
        rating: 4.6,
        reviews: JSON.stringify([
          { user: 'Renata Martins', rating: 5, comment: 'Arte e sofisticação em Paraty!' }
        ]),
        is_active: 1,
      }
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
