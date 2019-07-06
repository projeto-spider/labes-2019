exports.up = function(knex, Promise) {
  return knex.schema.createTable('settings', table => {
    table.increments('id').primary()
    table.string('key').notNullable()
    table.string('value').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('settings')
}
