import sql from 'mssql'
import mysql from 'mysql2/promise'
import pg from 'pg'

import { Connection } from '../models/connectionModel.js'

class ConnectionManager {
  constructor() {
    this.pools = new Map()
    this.configs = new Map()
  }

  async createPool(connectionId) {
    const connection = await Connection.findByIdWithPassword(connectionId)
    console.log('Creating pool for connection:', connection)
    if (!connection) {
      throw new Error('Connection not found')
    }

    const poolKey = `${connection.type}_${connectionId}`

    if (this.pools.has(poolKey)) {
      return this.pools.get(poolKey)
    }

    let pool
    let config

    switch (connection.type) {
      case 'mssql':
        config = {
          server: connection.host,
          port: connection.port,
          database: connection.database,
          user: connection.username,
          password: connection.password,
          pool: {
            max: connection.max_connections || 10,
            min: 0,
            idleTimeoutMillis: 30000,
          },
          options: {
            encrypt: connection.enable_ssl || false,
            trustServerCertificate: true,
            connectTimeout: connection.connection_timeout || 30000,
            requestTimeout: connection.connection_timeout || 30000,
          },
        }
        //  config = {
        //   server: "LAPTOP-R76F47NP\\SQLEXPRESS",
        //   database: "ISL REV 07_SQL_DATABASE",
        //   user: "myapp_login", // or "myapp_login"
        //   password: "StrongPass123!", // or StrongPass123!
        //   options: {
        //     encrypt: false,
        //     trustServerCertificate: true
        //   }
        // };
        if (connection.options) {
          const options = JSON.parse(connection.options)
          config.options = { ...config.options, ...options }
        }
        console.log('MSSQL Config:', config)

        pool = await new sql.ConnectionPool(config).connect()
        pool.on('error', (err) => {
          console.error('SQL Server pool error:', err)
          this.handlePoolError(poolKey, err)
        })
        break

      case 'postgres':
        config = {
          host: connection.host,
          port: connection.port,
          database: connection.database,
          user: connection.username,
          password: connection.password,
          max: connection.max_connections || 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: connection.connection_timeout || 30000,
          ssl: connection.enable_ssl ? { rejectUnauthorized: false } : false,
        }

        if (connection.options) {
          const options = JSON.parse(connection.options)
          config = { ...config, ...options }
        }

        pool = new pg.Pool(config)
        pool.on('error', (err, client) => {
          console.error('PostgreSQL pool error:', err)
          this.handlePoolError(poolKey, err)
        })
        break

      case 'mysql':
        config = {
          host: connection.host,
          port: connection.port,
          database: connection.database,
          user: connection.username,
          password: connection.password,
          waitForConnections: true,
          connectionLimit: connection.max_connections || 10,
          queueLimit: 0,
          connectTimeout: connection.connection_timeout || 30000,
          ssl: connection.enable_ssl ? { rejectUnauthorized: false } : undefined,
        }

        if (connection.options) {
          const options = JSON.parse(connection.options)
          config = { ...config, ...options }
        }

        pool = await mysql.createPool(config)
        break

      default:
        throw new Error(`Unsupported database type: ${connection.type}`)
    }

    this.pools.set(poolKey, pool)
    this.configs.set(poolKey, { connectionId, type: connection.type, config })

    await Connection.updateLastConnected(connectionId)

    return pool
  }

  async getPool(connectionId) {
    const connection = await Connection.findById(connectionId)
    if (!connection) {
      throw new Error('Connection not found')
    }

    const poolKey = `${connection.type}_${connectionId}`

    if (this.pools.has(poolKey)) {
      const pool = this.pools.get(poolKey)

      if (await this.isPoolHealthy(pool, connection.type)) {
        return pool
      } else {
        await this.closePool(connectionId)
      }
    }

    return await this.createPool(connectionId)
  }

  async isPoolHealthy(pool, type) {
    try {
      switch (type) {
        case 'mssql':
          const mssqlResult = await pool.request().query('SELECT 1 as test')
          return mssqlResult.recordset.length > 0

        case 'postgres':
          const pgResult = await pool.query('SELECT 1 as test')
          return pgResult.rows.length > 0

        case 'mysql':
          const [mysqlRows] = await pool.query('SELECT 1 as test')
          return mysqlRows.length > 0

        default:
          return false
      }
    } catch (error) {
      console.error('Pool health check failed:', error)
      return false
    }
  }

  async executeQuery(connectionId, query, parameters = []) {
    const connection = await Connection.findById(connectionId)
    if (!connection) {
      throw new Error('Connection not found')
    }

    if (!connection.is_active) {
      throw new Error('Connection is not active')
    }

    const pool = await this.getPool(connectionId)
    let result

    try {
      switch (connection.type) {
        case 'mssql':
          const mssqlRequest = pool.request()
          parameters.forEach((param, index) => {
            mssqlRequest.input(`p${index + 1}`, param)
          })

          // Replace PostgreSQL-style $1, $2 or @p1, @p2 with @p1, @p2 for SQL Server
          let mssqlQuery = query
          if (parameters.length > 0) {
            // Replace $1, $2, etc. with @p1, @p2, etc.
            mssqlQuery = query.replace(/\$(\d+)/g, (match, num) => `@p${num}`)
            // Also support @p1, @p2 directly
            mssqlQuery = mssqlQuery.replace(/@p(\d+)/g, '@p$1')
          }

          result = await mssqlRequest.query(mssqlQuery)
          return {
            rows: result.recordset || [],
            rowCount: result.rowsAffected ? result.rowsAffected[0] : 0,
            fields:
              result.recordset && result.recordset.length > 0
                ? Object.keys(result.recordset[0])
                : [],
          }

        case 'postgres':
          const pgResult = await pool.query(query, parameters)
          return {
            rows: pgResult.rows,
            rowCount: pgResult.rowCount,
            fields: pgResult.fields ? pgResult.fields.map((f) => f.name) : [],
          }

        case 'mysql':
          const [mysqlRows, mysqlFields] = await pool.query(query, parameters)
          return {
            rows: Array.isArray(mysqlRows) ? mysqlRows : [],
            rowCount:
              mysqlRows.affectedRows !== undefined
                ? mysqlRows.affectedRows
                : Array.isArray(mysqlRows)
                  ? mysqlRows.length
                  : 0,
            fields: mysqlFields ? mysqlFields.map((f) => f.name) : [],
          }

        default:
          throw new Error(`Unsupported database type: ${connection.type}`)
      }
    } catch (error) {
      console.error('Query execution error:', error)

      if (this.isConnectionError(error)) {
        await this.handleConnectionError(connectionId)
      }

      throw error
    }
  }

  isConnectionError(error) {
    const connectionErrorPatterns = [
      /connection/i,
      /timeout/i,
      /ECONNREFUSED/,
      /EHOSTUNREACH/,
      /ETIMEDOUT/,
      /ENOTFOUND/,
    ]

    return connectionErrorPatterns.some((pattern) =>
      pattern.test(error.message || error.toString())
    )
  }

  async handleConnectionError(connectionId) {
    const connection = await Connection.findById(connectionId)
    const poolKey = `${connection.type}_${connectionId}`

    if (this.pools.has(poolKey)) {
      await this.closePool(connectionId)
    }

    console.log(`Attempting to reconnect to ${connection.name}...`)

    try {
      await this.createPool(connectionId)
      console.log(`Successfully reconnected to ${connection.name}`)
    } catch (error) {
      console.error(`Failed to reconnect to ${connection.name}:`, error)
      throw error
    }
  }

  handlePoolError(poolKey, error) {
    console.error(`Pool ${poolKey} error:`, error)
    const config = this.configs.get(poolKey)
    if (config) {
      setTimeout(() => {
        this.handleConnectionError(config.connectionId).catch(console.error)
      }, 5000)
    }
  }

  async testConnection(connectionId) {
    let connection
    try {
      console.log('Testing connection for ID:', connectionId)
      const pool = await this.createPool(connectionId)
      console.log('Pool created for testing:', pool ? 'Success' : 'Failed')
      connection = await Connection.findById(connectionId)

      let testQuery
      switch (connection.type) {
        case 'mssql':
          testQuery = 'SELECT @@VERSION as version'
          break
        case 'postgres':
          testQuery = 'SELECT version()'
          break
        case 'mysql':
          testQuery = 'SELECT VERSION() as version'
          break
        default:
          throw new Error(`Unsupported database type: ${connection.type}`)
      }

      const result = await this.executeQuery(connectionId, testQuery)
      return {
        success: true,
        status: 'connected',
        name: connection.name,
        message: 'Connection successful',
        version: result.rows[0],
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        name: connection ? connection.name : 'Unknown',
        message: 'Connection failed',
        error: error.message,
      }
    }
  }

  async closePool(connectionId) {
    const connection = await Connection.findById(connectionId)
    if (!connection) return

    const poolKey = `${connection.type}_${connectionId}`

    if (this.pools.has(poolKey)) {
      const pool = this.pools.get(poolKey)

      try {
        switch (connection.type) {
          case 'mssql':
            await pool.close()
            break
          case 'postgres':
            await pool.end()
            break
          case 'mysql':
            await pool.end()
            break
        }
      } catch (error) {
        console.error(`Error closing pool for ${poolKey}:`, error)
      }

      this.pools.delete(poolKey)
      this.configs.delete(poolKey)
    }
  }

  async closeAllPools() {
    const closePromises = []

    for (const [poolKey, pool] of this.pools) {
      const config = this.configs.get(poolKey)
      if (config) {
        closePromises.push(this.closePool(config.connectionId))
      }
    }

    await Promise.all(closePromises)
  }
}

export const connectionManager = new ConnectionManager()
