import dotenv from 'dotenv'

import { hashPassword } from '../utils/passwordUtils.js'

dotenv.config()

export const seed = async (knex) => {
  const existingUsers = await knex('users').select('*')

  if (existingUsers.length === 0) {
    const defaultUsername = process.env.DEFAULT_USER || 'admin'
    const defaultPassword = process.env.DEFAULT_PASSWORD || 'admin123'
    const hashedPassword = await hashPassword(defaultPassword)

    await knex('users').insert({
      username: defaultUsername,
      email: `${defaultUsername}@example.com`,
      password: hashedPassword,
    })

    console.log(`Default user created: ${defaultUsername}`)
  } else {
    console.log('Users table already has data, skipping default user creation')
  }
}
