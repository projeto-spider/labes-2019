exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('username').notNullable()
    table
      .string('fullName')
      .notNullable()
      .defaultTo('')
    table.string('email').notNullable()
    table.string('passwordDigest').notNullable()
    table
      .enum('role', ['teacher', 'admin'])
      .notNullable()
      .defaultTo('admin')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
