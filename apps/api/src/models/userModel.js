import db from '../config/database.js'

export const User = {
  async findAll() {
    return await db('users').select('id', 'username', 'email', 'created_at', 'updated_at')
  },

  async findById(id) {
    const user = await db('users')
      .where({ id })
      .select('id', 'username', 'email', 'created_at', 'updated_at')
      .first()
    return user
  },

  async findByUsername(username) {
    const user = await db('users').where({ username }).first()
    return user
  },

  async findByEmail(email) {
    const user = await db('users').where({ email }).first()
    return user
  },

  async create(userData) {
    const [id] = await db('users').insert(userData)
    return await this.findById(id)
  },

  async delete(id) {
    const deleted = await db('users').where({ id }).del()
    return deleted > 0
  },
}
