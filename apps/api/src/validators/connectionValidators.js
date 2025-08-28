import { body, param } from 'express-validator'

export const createConnectionValidator = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Connection name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9_\-\s]+$/)
    .withMessage(
      'Connection name can only contain letters, numbers, underscores, hyphens, and spaces'
    ),

  body('type')
    .isIn(['mssql', 'postgres', 'mysql'])
    .withMessage('Database type must be mssql, postgres, or mysql'),

  body('host').isString().trim().notEmpty().withMessage('Host is required'),

  body('port').isInt({ min: 1, max: 65535 }).withMessage('Port must be a valid port number'),

  body('database').isString().trim().notEmpty().withMessage('Database name is required'),

  body('username').isString().trim().notEmpty().withMessage('Username is required'),

  body('password').isString().notEmpty().withMessage('Password is required'),

  body('max_connections')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max connections must be between 1 and 100'),

  body('connection_timeout')
    .optional()
    .isInt({ min: 1000, max: 120000 })
    .withMessage('Connection timeout must be between 1000ms and 120000ms'),

  body('enable_ssl').optional().isBoolean().withMessage('Enable SSL must be a boolean'),

  body('options').optional().isObject().withMessage('Options must be a valid JSON object'),
]

export const updateConnectionValidator = [
  param('id').isInt({ min: 1 }).withMessage('Invalid connection ID'),

  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Connection name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9_\-\s]+$/)
    .withMessage(
      'Connection name can only contain letters, numbers, underscores, hyphens, and spaces'
    ),

  body('type')
    .optional()
    .isIn(['mssql', 'postgres', 'mysql'])
    .withMessage('Database type must be mssql, postgres, or mysql'),

  body('host').optional().isString().trim().notEmpty().withMessage('Host cannot be empty'),

  body('port')
    .optional()
    .isInt({ min: 1, max: 65535 })
    .withMessage('Port must be a valid port number'),

  body('database')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Database name cannot be empty'),

  body('username').optional().isString().trim().notEmpty().withMessage('Username cannot be empty'),

  body('password').optional().isString().notEmpty().withMessage('Password cannot be empty'),

  body('max_connections')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max connections must be between 1 and 100'),

  body('connection_timeout')
    .optional()
    .isInt({ min: 1000, max: 120000 })
    .withMessage('Connection timeout must be between 1000ms and 120000ms'),

  body('enable_ssl').optional().isBoolean().withMessage('Enable SSL must be a boolean'),

  body('is_active').optional().isBoolean().withMessage('Is active must be a boolean'),

  body('options').optional().isObject().withMessage('Options must be a valid JSON object'),
]

export const connectionIdValidator = [
  param('id').isInt({ min: 1 }).withMessage('Invalid connection ID'),
]

export const queryValidator = [
  body('connectionId').isInt({ min: 1 }).withMessage('Invalid connection ID'),

  body('query').isString().trim().notEmpty().withMessage('Query is required'),

  body('parameters').optional().isArray().withMessage('Parameters must be an array'),
]
