exports.up = function(knex, Promise) {
  return knex.schema.createTable('solicitations', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table
      .string('email')
      .notNullable()
      .unique()
    table.string('registrationNumber').nullable()
    table.enum('type', ['freshman', 'concluding']).defaultTo('freshman')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('solicitations')
}