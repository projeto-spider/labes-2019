exports.up = function(knex, Promise) {
  return knex.schema.createTable('documents', table => {
    table.increments('id').primary()
    table
      .integer('studentId')
      .unsigned()
      .notNullable()
    table
      .foreign('studentId')
      .references('id')
      .inTable('students')
    table.integer('type').notNullable()
    table.string('url').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('documents')
}
