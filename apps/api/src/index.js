import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'

import db from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import connectionRoutes from './routes/connectionRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Rate limiting configuration with environment variable support
const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX) || 50, // Default: 50 attempts
  message: 'Too many login attempts, please try again later',
})

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_API_MAX) || 1000, // Default: 1000 requests
  message: 'Too many requests, please try again later',
})

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.use('/api/auth/login', loginLimiter)
app.use('/api', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/connections', connectionRoutes)
app.use('/api/dashboards', dashboardRoutes)

app.use(errorHandler)

const initializeDatabase = async () => {
  try {
    console.log('Database migrations satrting...')
    await db.migrate.latest()
    console.log('Database migrations completed')

    await db.seed.run()
    console.log('Database seeded with default user')
  } catch (error) {
    console.error('Database initialization error:', error)
    process.exit(1)
  }
}

const startServer = async () => {
  await initializeDatabase()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
