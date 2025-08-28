import express from 'express'
import { body } from 'express-validator'

import {
  createDashboard,
  deleteDashboard,
  duplicateDashboard,
  getAllDashboards,
  getDashboardById,
  getDashboardStatistics,
  saveDashboardConfiguration,
  updateDashboard,
} from '../controllers/dashboardController.js'
import { authenticateToken as authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// Validation rules
const dashboardValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('configuration')
    .optional()
    .custom((value) => {
      if (value && typeof value !== 'object') {
        throw new Error('Configuration must be a valid JSON object')
      }
      return true
    }),
  body('connection_id')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) return true
      if (Number.isInteger(value) && value > 0) return true
      throw new Error('Connection ID must be null or a positive integer')
    }),
  body('is_public').optional().isBoolean().withMessage('is_public must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
]

const updateDashboardValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('configuration')
    .optional()
    .custom((value) => {
      if (value && typeof value !== 'object') {
        throw new Error('Configuration must be a valid JSON object')
      }
      return true
    }),
  body('connection_id')
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === undefined) return true
      if (Number.isInteger(value) && value > 0) return true
      throw new Error('Connection ID must be null or a positive integer')
    }),
  body('is_public').optional().isBoolean().withMessage('is_public must be a boolean'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
]

// All routes require authentication
router.use(authenticate)

// Dashboard routes
router.post('/', dashboardValidation, createDashboard)
router.get('/', getAllDashboards)
router.get('/statistics', getDashboardStatistics)
router.get('/:id', getDashboardById)
router.put('/:id', updateDashboardValidation, updateDashboard)
router.patch('/:id/configuration', saveDashboardConfiguration)
router.delete('/:id', deleteDashboard)
router.post('/:id/duplicate', duplicateDashboard)

export default router
