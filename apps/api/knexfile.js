import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbFile = process.env.DB_PATH || path.join(__dirname, 'data', 'database.sqlite')
export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: dbFile,
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'seeds'),
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_PATH || path.join(__dirname, 'data', 'database.sqlite'),
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'seeds'),
    },
    useNullAsDefault: true,
  },
}
