exports.up = function(knex, Promise) {
  return knex.schema.createTable('documents', table => {
    table.increments('id').primary()
    table
      .integer('studentID')
      .unsigned()
      .notNullable()
    table
      .foreign('studentID')
      .references('id')
      .inTable('students')
    table.integer('type').notNullable()
    table.string('URL').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('documents')
}
