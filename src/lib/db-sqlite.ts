import sqlite3 from 'sqlite3'
import * as sqlite from 'sqlite'

let db: sqlite.Database | null = null

export async function getDb(): Promise<sqlite.Database> {
  if (!db) {
    db = await sqlite.open({
      filename: './data/estadia_perfeita.db',
      driver: sqlite3.Database,
    })

    // Criar tabelas se não existirem
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        preferences TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL, -- JSON string
        images TEXT, -- JSON string
        capacity INTEGER NOT NULL,
        price_per_night REAL NOT NULL,
        amenities TEXT, -- JSON string
        leisure_type TEXT, -- JSON string
        accepts_pets BOOLEAN DEFAULT 0,
        contact_info TEXT NOT NULL, -- JSON string
        rating REAL DEFAULT 0,
        reviews TEXT, -- JSON string
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
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
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (hotel_id) REFERENCES hotels (id),
        UNIQUE(user_id, hotel_id)
      );
    `)
  }

  return db
}

export async function closeDb(): Promise<void> {
  if (db) {
    await db.close()
    db = null
  }
}
