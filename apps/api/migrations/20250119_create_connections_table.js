export const up = async (knex) => {
  return knex.schema.createTable('connections', (table) => {
    table.increments('id').primary()
    table.string('name', 100).notNullable().unique()
    table.enum('type', ['mssql', 'postgres', 'mysql', 'oracle']).notNullable()
    table.string('host', 255).notNullable()
    table.integer('port').notNullable()
    table.string('database', 100).notNullable()
    table.string('username', 100).notNullable()
    table.string('password', 255).notNullable()
    table.json('options').nullable()
    table.integer('max_connections').defaultTo(10)
    table.integer('connection_timeout').defaultTo(30000)
    table.boolean('enable_ssl').defaultTo(false)
    table.boolean('is_active').defaultTo(true)
    table.timestamp('last_connected_at').nullable()
    table.timestamps(true, true)

    table.index('name')
    table.index('type')
    table.index('is_active')
  })
}

export const down = async (knex) => {
  return knex.schema.dropTableIfExists('connections')
}
