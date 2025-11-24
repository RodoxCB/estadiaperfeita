import db from './db-memory'

export interface MatchResult {
  id: string
  hotel: {
    id: number
    name: string
    description: string
    location: {
      city: string
      state: string
    }
    pricePerNight: number
    capacity: number
    acceptsPets: boolean
    amenities: string[]
    matchScore: number
  }
}

export async function generateMatchesForUser(userId: number): Promise<MatchResult[]> {
  try {
    // Get all hotels
    const hotels = await db.getAllHotels()

    if (hotels.length === 0) {
      // Create some sample hotels if none exist
      await createSampleHotels()
      const newHotels = await db.getAllHotels()
      return generateMatchesFromHotels(userId, newHotels)
    }

    return generateMatchesFromHotels(userId, hotels)
  } catch (error) {
    console.error('Error generating matches:', error)
    return []
  }
}

async function createSampleHotels() {
  const sampleHotels = [
    {
      owner_id: 1,
      name: "Pousada Praia Azul",
      description: "Linda pousada à beira-mar com vista para o oceano",
      location: JSON.stringify({ city: "Florianópolis", state: "SC" }),
      capacity: 4,
      price_per_night: 250,
      amenities: JSON.stringify(["WiFi", "Piscina", "Café da manhã", "Ar condicionado"]),
      leisure_type: JSON.stringify(["beach"]),
      accepts_pets: true,
      contact_info: JSON.stringify({ phone: "+55 48 99999-9999", email: "contato@praiaazul.com" }),
      is_active: true,
    },
    {
      owner_id: 1,
      name: "Chalé das Montanhas",
      description: "Confortável chalé nas montanhas com lareira",
      location: JSON.stringify({ city: "Gramado", state: "RS" }),
      capacity: 6,
      price_per_night: 180,
      amenities: JSON.stringify(["WiFi", "Lareira", "Café da manhã", "Ar condicionado"]),
      leisure_type: JSON.stringify(["mountain"]),
      accepts_pets: false,
      contact_info: JSON.stringify({ phone: "+55 54 88888-8888", email: "contato@chale.com" }),
      is_active: true,
    },
    {
      owner_id: 1,
      name: "Loft Urbano",
      description: "Moderno loft no centro da cidade",
      location: JSON.stringify({ city: "São Paulo", state: "SP" }),
      capacity: 2,
      price_per_night: 120,
      amenities: JSON.stringify(["WiFi", "Ar condicionado", "Máquina de café"]),
      leisure_type: JSON.stringify(["city"]),
      accepts_pets: false,
      contact_info: JSON.stringify({ phone: "+55 11 77777-7777", email: "contato@lofturbano.com" }),
      is_active: true,
    },
  ]

  for (const hotel of sampleHotels) {
    await db.createHotel(hotel)
  }
}

function generateMatchesFromHotels(userId: number, hotels: any[]): MatchResult[] {
  return hotels.map((hotel, index) => {
    // Generate a random score between 70-100
    const score = 70 + Math.floor(Math.random() * 31)

    return {
      id: `${userId}-${hotel.id}`,
      hotel: {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        location: JSON.parse(hotel.location),
        pricePerNight: hotel.price_per_night,
        capacity: hotel.capacity,
        acceptsPets: hotel.accepts_pets,
        amenities: JSON.parse(hotel.amenities),
        matchScore: score,
      },
    }
  }).sort((a, b) => b.hotel.matchScore - a.hotel.matchScore)
}
