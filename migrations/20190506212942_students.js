exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table
      .string('registrationNumber')
      .notNullable()
      .unique()
    table.float('crg').nullable()
    table.string('course').notNullable()
    table.string('email').nullable()
    table
      .boolean('isFit')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('isConcluding')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('isActive')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('isForming')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('isGraduating')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('academicHighlight')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('cancelled')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('prescribed')
      .notNullable()
      .defaultTo(false)
    table
      .enum('mailingList', [
        'none',
        'active',
        'graduating',
        'concluding',
        'forming'
      ])
      .defaultTo('none')
    table.string('comments', 1400)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('students')
}
