import { Router } from 'express'

import { createUser, deleteUser, getAllUsers, getUser } from '../controllers/userController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { createUserValidator, userIdValidator } from '../validators/userValidators.js'

const router = Router()

router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, userIdValidator, getUser)
router.post('/', authenticateToken, createUserValidator, createUser)
router.delete('/:id', authenticateToken, userIdValidator, deleteUser)

export default router
