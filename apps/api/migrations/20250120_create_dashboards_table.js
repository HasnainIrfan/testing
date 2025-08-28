export const up = async (knex) => {
  return knex.schema.createTable('dashboards', (table) => {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.text('description')
    table.json('configuration').notNullable().defaultTo('{}')
    table.integer('connection_id').unsigned()
    table.foreign('connection_id').references('id').inTable('connections').onDelete('SET NULL')
    table.integer('created_by').unsigned()
    table.foreign('created_by').references('id').inTable('users').onDelete('SET NULL')
    table.boolean('is_public').defaultTo(false)
    table.boolean('is_active').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    // Add indexes for better performance
    table.index('name')
    table.index('connection_id')
    table.index('created_by')
    table.index('is_public')
    table.index('is_active')
  })
}

export const down = async (knex) => {
  return knex.schema.dropTableIfExists('dashboards')
}
