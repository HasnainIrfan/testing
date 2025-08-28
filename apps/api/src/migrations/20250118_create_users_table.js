export const up = async (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('username', 50).notNullable().unique()
    table.string('email', 255).notNullable().unique()
    table.string('password', 255).notNullable()
    table.timestamps(true, true)
  })
}

export const down = async (knex) => {
  return knex.schema.dropTableIfExists('users')
}
