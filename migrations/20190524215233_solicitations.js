exports.up = function(knex, Promise) {
  return knex.schema.createTable('solicitations', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('registrationNumber').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('solicitations')
}
