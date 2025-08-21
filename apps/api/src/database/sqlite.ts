import fs from 'fs'
import path from 'path'
import sqlite3 from 'sqlite3'

import { config } from '../config/app.config.js'

let db: sqlite3.Database

export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(config.dbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log(`📁 Created data directory: ${dataDir}`)
    }

    // Connect to database
    db = new sqlite3.Database(config.dbPath, (err) => {
      if (err) {
        console.error('❌ Error opening database:', err)
        reject(err)
        return
      }

      console.log(`✅ Connected to SQLite database: ${config.dbPath}`)
      createTables()
        .then(() => {
          console.log('✅ Database tables created successfully')
          resolve()
        })
        .catch(reject)
    })
  })
}

const createTables = async (): Promise<void> => {
  // For now, let's just create the users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `

  return new Promise((resolve, reject) => {
    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('❌ Error creating users table:', err)
        reject(err)
      } else {
        console.log('✅ Users table ready')
        resolve()
      }
    })
  })
}

export const getDatabase = (): sqlite3.Database => {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

// Test function to verify database works
export const testDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
      if (err) {
        reject(err)
      } else if (row) {
        console.log('🧪 Database test passed - users table exists')
        resolve()
      } else {
        reject(new Error('Users table not found'))
      }
    })
  })
}

export const getAllTables = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export const getTableSchema = async (tableName: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = `PRAGMA table_info(${tableName})`

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export const getTableData = async (tableName: string, limit: number = 10): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} LIMIT ?`

    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export const getTableCount = async (tableName: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM ${tableName}`

    db.get(query, [], (err, row: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(row.count)
      }
    })
  })
}
