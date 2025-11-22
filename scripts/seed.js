const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../src/models/User')
const Hotel = require('../src/models/Hotel')

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Conectado ao MongoDB')

    // Limpar dados existentes
    await User.deleteMany({})
    await Hotel.deleteMany({})

    // Criar usuários de teste
    const users = await User.create([
      {
        name: 'João Silva',
        email: 'joao@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU5hO', // senha: 123456
        preferences: {
          groupSize: 2,
          leisureType: 'beach',
          acceptsPets: true,
          budget: { min: 150, max: 400 },
          amenities: ['Wi-Fi', 'Piscina'],
          locationPreferences: ['Praia'],
        },
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU5hO', // senha: 123456
        preferences: {
          groupSize: 4,
          leisureType: 'mountain',
          acceptsPets: false,
          budget: { min: 200, max: 600 },
          amenities: ['Wi-Fi', 'Lareira', 'Café da manhã'],
          locationPreferences: ['Montanha'],
        },
      },
    ])

    // Criar hotéis de teste
    const hotels = await Hotel.create([
      {
        ownerId: users[0]._id,
        name: 'Pousada do Sol',
        description: 'Pousada aconchegante na praia com vista para o mar',
        location: {
          city: 'Florianópolis',
          state: 'SC',
          country: 'Brasil',
        },
        images: ['/placeholder-hotel.jpg'],
        capacity: 4,
        pricePerNight: 250,
        amenities: ['Wi-Fi', 'Piscina', 'Café da manhã', 'Estacionamento'],
        leisureType: ['beach'],
        acceptsPets: true,
        contactInfo: {
          phone: '(48) 99999-9999',
          email: 'contato@pousadadosol.com',
          whatsapp: '(48) 99999-9999',
        },
        rating: 4.5,
        reviews: [],
      },
      {
        ownerId: users[0]._id,
        name: 'Hotel Montanha Verde',
        description: 'Hotel nas montanhas com ar puro e vista panorâmica',
        location: {
          city: 'Gramado',
          state: 'RS',
          country: 'Brasil',
        },
        images: ['/placeholder-hotel.jpg'],
        capacity: 6,
        pricePerNight: 180,
        amenities: ['Wi-Fi', 'Lareira', 'Café da manhã', 'Estacionamento'],
        leisureType: ['mountain'],
        acceptsPets: false,
        contactInfo: {
          phone: '(54) 99999-9999',
          email: 'contato@montanhaverde.com',
          whatsapp: '(54) 99999-9999',
        },
        rating: 4.2,
        reviews: [],
      },
      {
        ownerId: users[1]._id,
        name: 'Chalé da Serra',
        description: 'Chalé romântico nas montanhas para casais',
        location: {
          city: 'Campos do Jordão',
          state: 'SP',
          country: 'Brasil',
        },
        images: ['/placeholder-hotel.jpg'],
        capacity: 2,
        pricePerNight: 350,
        amenities: ['Wi-Fi', 'Lareira', 'Café da manhã', 'Spa'],
        leisureType: ['mountain', 'countryside'],
        acceptsPets: true,
        contactInfo: {
          phone: '(12) 99999-9999',
          email: 'contato@chaledaserra.com',
          whatsapp: '(12) 99999-9999',
        },
        rating: 4.8,
        reviews: [],
      },
      {
        ownerId: users[1]._id,
        name: 'Pousada Praia Azul',
        description: 'Pousada familiar na praia com área para crianças',
        location: {
          city: 'Ubatuba',
          state: 'SP',
          country: 'Brasil',
        },
        images: ['/placeholder-hotel.jpg'],
        capacity: 8,
        pricePerNight: 220,
        amenities: ['Wi-Fi', 'Piscina', 'Café da manhã', 'Estacionamento', 'Playground'],
        leisureType: ['beach', 'adventure'],
        acceptsPets: false,
        contactInfo: {
          phone: '(12) 88888-8888',
          email: 'contato@prai azul.com',
          whatsapp: '(12) 88888-8888',
        },
        rating: 4.3,
        reviews: [],
      },
    ])

    console.log('Dados de teste criados com sucesso!')
    console.log(`Criados ${users.length} usuários e ${hotels.length} hotéis`)

  } catch (error) {
    console.error('Erro ao criar dados de teste:', error)
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase()
