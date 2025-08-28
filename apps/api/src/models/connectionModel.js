import db from '../config/database.js'

export const Connection = {
  async findAll() {
    return await db('connections')
      .select(
        'id',
        'name',
        'type',
        'host',
        'port',
        'database',
        'username',
        'max_connections',
        'connection_timeout',
        'enable_ssl',
        'is_active',
        'last_connected_at',
        'created_at',
        'updated_at'
      )
      .orderBy('name')
  },

  async findById(id) {
    const connection = await db('connections')
      .where({ id })
      .select(
        'id',
        'name',
        'type',
        'host',
        'port',
        'database',
        'username',
        'max_connections',
        'connection_timeout',
        'enable_ssl',
        'is_active',
        'options',
        'last_connected_at',
        'created_at',
        'updated_at'
      )
      .first()
    return connection
  },

  async findByIdWithPassword(id) {
    const connection = await db('connections').where({ id }).first()
    return connection
  },

  async findByName(name) {
    const connection = await db('connections')
      .where({ name })
      .select(
        'id',
        'name',
        'type',
        'host',
        'port',
        'database',
        'username',
        'max_connections',
        'connection_timeout',
        'enable_ssl',
        'is_active',
        'options',
        'last_connected_at'
      )
      .first()
    return connection
  },

  async create(connectionData) {
    // Store database passwords as plain text (they are for database connections, not user auth)
    const data = {
      ...connectionData,
      password: connectionData.password,
      options: connectionData.options ? JSON.stringify(connectionData.options) : null,
    }

    const [id] = await db('connections').insert(data)
    return await this.findById(id)
  },

  async update(id, connectionData) {
    const updateData = { ...connectionData }

    // Store database passwords as plain text (they are for database connections, not user auth)
    if (connectionData.password) {
      updateData.password = connectionData.password
    }

    if (connectionData.options) {
      updateData.options = JSON.stringify(connectionData.options)
    }

    updateData.updated_at = db.fn.now()

    await db('connections').where({ id }).update(updateData)
    return await this.findById(id)
  },

  async delete(id) {
    const deleted = await db('connections').where({ id }).del()
    return deleted > 0
  },

  async updateLastConnected(id) {
    await db('connections').where({ id }).update({ last_connected_at: db.fn.now() })
  },

  async getDecryptedPassword(id) {
    const connection = await db('connections').where({ id }).select('password').first()
    return connection ? connection.password : null
  },

  async testConnection(id) {
    const connection = await this.findByIdWithPassword(id)
    if (!connection) {
      throw new Error('Connection not found')
    }
    return connection
  },
}
