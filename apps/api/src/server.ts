import cors from 'cors'
import express from 'express'

import { AuthController } from './controllers/auth.controller.js'
import { getDatabase, initializeDatabase, testDatabase } from './database/sqlite.js'
import { authenticateToken } from './middleware/auth.js'
import { UserModel } from './models/User.model.js'
import { AuthService } from './services/auth.service.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Analytics Dashboard API is running',
    timestamp: new Date().toISOString(),
  })
})

// Initialize and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Analytics Dashboard Server...')

    console.log('📁 Initializing database...')
    await initializeDatabase()

    console.log('🧪 Testing database...')
    await testDatabase()

    console.log('🔧 Creating auth dependencies...')
    const userModel = new UserModel(getDatabase())
    const authService = new AuthService(userModel)
    const authController = new AuthController(authService)
    console.log('✅ Auth dependencies created')

    console.log('🛣️ Setting up routes...')

    // Auth routes
    app.post('/api/auth/register', authController.register)
    app.post('/api/auth/login', authController.login)
    app.get('/api/auth/profile', authenticateToken, authController.getProfile)

    console.log('✅ Routes configured')

    app.use((error: any, req: any, res: any, next: any) => {
      console.error('❌ Global error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    })

    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
      })
    })

    app.listen(PORT, () => {
      console.log('✅ Server startup complete!')
      console.log(`🌐 Server running on http://localhost:${PORT}`)
      console.log(`🔍 Health check: http://localhost:${PORT}/health`)
      console.log(`🔐 Register: POST http://localhost:${PORT}/api/auth/register`)
      console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`)
      console.log('📊 Ready for Postman testing!')
    })
  } catch (error) {
    console.error('💥 Failed to start server:', error)
    console.error('💡 Check your database path and permissions')
    process.exit(1)
  }
}

startServer()

process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...')
  process.exit(0)
})
