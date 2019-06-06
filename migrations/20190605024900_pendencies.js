exports.up = function(knex, Promise) {
  return knex.schema.createTable('pendencies', table => {
    table.increments('id').primary()
    table
      .integer('studentId')
      .unsigned()
      .notNullable()
    table
      .foreign('studentId')
      .references('id')
      .inTable('students')
    table
      .integer('subjectId')
      .unsigned()
      .notNullable()
    table
      .foreign('subjectId')
      .references('id')
      .inTable('subjects')
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pendencies')
}
