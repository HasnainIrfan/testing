import { Router } from 'express'
import { body } from 'express-validator'

import { login, logout, refreshToken, verifyToken } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = Router()

const loginValidator = [
  body('username').isString().trim().notEmpty().withMessage('Username is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
]

const refreshTokenValidator = [
  body('refreshToken').isString().notEmpty().withMessage('Refresh token is required'),
]

router.post('/login', loginValidator, login)
router.post('/logout', logout)
router.post('/refresh', refreshTokenValidator, refreshToken)
router.get('/verify', authenticateToken, verifyToken)

export default router
