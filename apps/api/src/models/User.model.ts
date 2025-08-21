import sqlite3 from 'sqlite3'

type Database = sqlite3.Database
export interface UserRow {
  id: number
  email: string
  password_hash: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
}

export class UserModel {
  constructor(private db: Database) {}

  async create(userData: {
    email: string
    passwordHash: string
    firstName: string
    lastName: string
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `

      this.db.run(
        query,
        [userData.email, userData.passwordHash, userData.firstName, userData.lastName],
        function (err) {
          if (err) reject(err)
          else resolve(this.lastID)
        }
      )
    })
  }

  async findByEmail(email: string): Promise<UserRow | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, email, password_hash, first_name, last_name, created_at, updated_at
        FROM users WHERE email = ?
      `

      this.db.get(query, [email], (err, row: UserRow) => {
        if (err) reject(err)
        else resolve(row || null)
      })
    })
  }

  async findById(id: number): Promise<UserRow | null> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, email, password_hash, first_name, last_name, created_at, updated_at
        FROM users WHERE id = ?
      `

      this.db.get(query, [id], (err, row: UserRow) => {
        if (err) reject(err)
        else resolve(row || null)
      })
    })
  }

  async getAll(limit: number = 50): Promise<UserRow[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT id, email, first_name, last_name, created_at, updated_at
        FROM users 
        ORDER BY created_at DESC 
        LIMIT ?
      `

      this.db.all(query, [limit], (err, rows: UserRow[]) => {
        if (err) reject(err)
        else resolve(rows || [])
      })
    })
  }

  async count(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM users', [], (err, row: any) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })
  }
}
