import { getDb } from '@/lib/db-sqlite'

export interface IHotel {
  id: number
  owner_id: number
  name: string
  description: string
  location: {
    city: string
    state: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  images: string[]
  capacity: number
  price_per_night: number
  amenities: string[]
  leisure_type: string[]
  accepts_pets: boolean
  contact_info: {
    phone: string
    email: string
    whatsapp?: string
  }
  rating: number
  reviews: any[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export class HotelModel {
  static async create(hotelData: Omit<IHotel, 'id' | 'created_at' | 'updated_at'>): Promise<IHotel> {
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

    const hotel = await this.findById(result.lastID!)
    return hotel
  }

  static async findById(id: number): Promise<IHotel | null> {
    const db = await getDb()

    const row = await db.get(
      'SELECT * FROM hotels WHERE id = ?',
      [id]
    )

    if (!row) return null

    return {
      ...row,
      location: JSON.parse(row.location),
      images: JSON.parse(row.images),
      amenities: JSON.parse(row.amenities),
      leisure_type: JSON.parse(row.leisure_type),
      contact_info: JSON.parse(row.contact_info),
      reviews: JSON.parse(row.reviews),
      accepts_pets: row.accepts_pets === 1,
      is_active: row.is_active === 1
    } as IHotel
  }

  static async findAll(): Promise<IHotel[]> {
    const db = await getDb()

    const rows = await db.all('SELECT * FROM hotels WHERE is_active = 1')

    return rows.map(row => ({
      ...row,
      location: JSON.parse(row.location),
      images: JSON.parse(row.images),
      amenities: JSON.parse(row.amenities),
      leisure_type: JSON.parse(row.leisure_type),
      contact_info: JSON.parse(row.contact_info),
      reviews: JSON.parse(row.reviews),
      accepts_pets: row.accepts_pets === 1,
      is_active: row.is_active === 1
    })) as IHotel[]
  }

  static async findByOwner(ownerId: number): Promise<IHotel[]> {
    const db = await getDb()

    const rows = await db.all(
      'SELECT * FROM hotels WHERE owner_id = ? AND is_active = 1',
      [ownerId]
    )

    return rows.map(row => ({
      ...row,
      location: JSON.parse(row.location),
      images: JSON.parse(row.images),
      amenities: JSON.parse(row.amenities),
      leisure_type: JSON.parse(row.leisure_type),
      contact_info: JSON.parse(row.contact_info),
      reviews: JSON.parse(row.reviews),
      accepts_pets: row.accepts_pets === 1,
      is_active: row.is_active === 1
    })) as IHotel[]
  }
}
