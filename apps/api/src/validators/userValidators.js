import { body, param } from 'express-validator'

export const createUserValidator = [
  body('username')
    .isString()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),

  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

export const userIdValidator = [param('id').isInt({ min: 1 }).withMessage('Invalid user ID')]
