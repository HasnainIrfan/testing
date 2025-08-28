export const up = async (knex) => {
  await knex.schema.createTable('dashboards', (table) => {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.text('description')
    table.text('configuration') // JSON string for dashboard configuration
    table.integer('connection_id').unsigned().nullable()
    table.foreign('connection_id').references('id').inTable('connections').onDelete('SET NULL')
    table.integer('created_by').unsigned().notNullable()
    table.foreign('created_by').references('id').inTable('users').onDelete('CASCADE')
    table.boolean('is_public').defaultTo(false)
    table.boolean('is_active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    // Indexes
    table.index('created_by')
    table.index('connection_id')
    table.index('is_active')
    table.index('is_public')
  })
}

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('dashboards')
}
