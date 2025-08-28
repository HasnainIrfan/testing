import { validationResult } from 'express-validator'
import sql from 'mssql'

import { Connection } from '../models/connectionModel.js'
import { connectionManager } from '../services/connectionManager.js'

export const getAllConnections = async (req, res, next) => {
  try {
    const connections = await Connection.findAll()
    res.json(connections)
  } catch (error) {
    next(error)
  }
}

export const getConnection = async (req, res, next) => {
  try {
    const { id } = req.params
    const connection = await Connection.findById(id)

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    res.json(connection)
  } catch (error) {
    next(error)
  }
}

export const createConnection = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const existingConnection = await Connection.findByName(req.body.name)
    if (existingConnection) {
      return res.status(409).json({ error: 'Connection name already exists' })
    }

    const newConnection = await Connection.create(req.body)

    res.status(201).json({
      message: 'Connection created successfully',
      connection: newConnection,
    })
  } catch (error) {
    next(error)
  }
}

export const updateConnection = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params

    const existingConnection = await Connection.findById(id)
    if (!existingConnection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    if (req.body.name && req.body.name !== existingConnection.name) {
      const nameExists = await Connection.findByName(req.body.name)
      if (nameExists) {
        return res.status(409).json({ error: 'Connection name already exists' })
      }
    }

    await connectionManager.closePool(id)

    const updatedConnection = await Connection.update(id, req.body)

    res.json({
      message: 'Connection updated successfully',
      connection: updatedConnection,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteConnection = async (req, res, next) => {
  try {
    const { id } = req.params

    const connection = await Connection.findById(id)
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    await connectionManager.closePool(id)

    const deleted = await Connection.delete(id)
    if (deleted) {
      res.json({ message: 'Connection deleted successfully' })
    } else {
      res.status(500).json({ error: 'Failed to delete connection' })
    }
  } catch (error) {
    next(error)
  }
}

export async function getPool() {
  try {
    console.log('Getting connection pool...')
    const config = {
      server: 'localhost', // same as you tested
      port: 1433,
      database: 'ISL REV 07_SQL_DATABASE', // your DB
      user: 'app_login', // SQL login you created
      password: 'StrongPass123!',
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: false, // must be false for local SQL
        trustServerCertificate: true, // trust local dev server cert
      },
    }
    console.log('Connecting to SQL Server...')
    const pool = await sql.connect(config)
    console.log('✅ Connected to SQL Server', pool)
    return pool
  } catch (err) {
    console.error('❌ Database connection failed:', err)
    throw err
  }
}

export const testConnection = async (req, res, next) => {
  try {
    const { id } = req.params

    const connection = await Connection.findById(id)
    console.log(connection)
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    const result = await connectionManager.testConnection(id)

    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    next(error)
  }
}

export const executeQuery = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { connectionId, query, parameters } = req.body

    const connection = await Connection.findById(connectionId)
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' })
    }

    const startTime = Date.now()
    const result = await connectionManager.executeQuery(connectionId, query, parameters || [])
    const executionTime = Date.now() - startTime

    res.json({
      success: true,
      connection: {
        id: connection.id,
        name: connection.name,
        type: connection.type,
      },
      result: {
        rows: result.rows,
        rowCount: result.rowCount,
        fields: result.fields,
        executionTime: `${executionTime}ms`,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
    })
  }
}
