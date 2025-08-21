import { Router } from 'express'

import { authRoutes } from './auth.routes.js'

const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Analytics Dashboard API is running',
    timestamp: new Date().toISOString(),
  })
})
router.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    version: '1.0.0',
  })
})

// Mount all route modules
router.use('/auth', authRoutes) // /api/auth/*

export { router as apiRoutes }
