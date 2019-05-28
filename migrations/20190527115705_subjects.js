exports.up = function(knex, Promise) {
  return knex.schema.createTable('subjects', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table
      .string('code')
      .notNullable()
      .unique()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('subjects')
}
