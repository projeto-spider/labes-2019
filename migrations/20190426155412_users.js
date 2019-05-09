exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('username').notNullable()
    table.string('email').notNullable()
    table.string('passwordDigest').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
