import { Router } from 'express'

import {
  createConnection,
  deleteConnection,
  executeQuery,
  getAllConnections,
  getConnection,
  getPool,
  testConnection,
  updateConnection,
} from '../controllers/connectionController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import {
  connectionIdValidator,
  createConnectionValidator,
  queryValidator,
  updateConnectionValidator,
} from '../validators/connectionValidators.js'

const router = Router()

router.get('/', authenticateToken, getAllConnections)
router.get('/:id', authenticateToken, connectionIdValidator, getConnection)
router.post('/', authenticateToken, createConnectionValidator, createConnection)
router.put('/:id', authenticateToken, updateConnectionValidator, updateConnection)
router.delete('/:id', authenticateToken, connectionIdValidator, deleteConnection)
router.post('/:id/test', authenticateToken, connectionIdValidator, testConnection)
router.post('/query', authenticateToken, queryValidator, executeQuery)
router.get('/pool/:id', authenticateToken, queryValidator, getPool)

export default router
