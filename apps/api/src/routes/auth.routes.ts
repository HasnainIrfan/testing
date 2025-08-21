// routes/auth.routes.ts - FACTORY PATTERN
import express from 'express'

import { AuthController } from '../controllers/auth.controller.js'
import { getDatabase } from '../database/sqlite.js'
import { UserModel } from '../models/User.model.js'
import { AuthService } from '../services/auth.service.js'

export const createAuthRoutes = (): express.Router => {
  const router = express.Router()
  const userModel = new UserModel(getDatabase())
  const authService = new AuthService(userModel)
  const authController = new AuthController(authService)

  router.post('/register', authController.register)
  router.post('/login', authController.login)
  // router.get('/profile', authMiddleware, authController.getProfile);

  return router
}
