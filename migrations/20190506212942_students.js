const mailingList = ['none', 'active', 'concluding']

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
    table.enum('mailingList', mailingList).defaultTo('none')
    table.enum('mailingListToAdd', mailingList).defaultTo('none')
    table.enum('mailingListToRemove', mailingList).defaultTo('none')
    table.date('entryDate').nullable()
    table.string('advisor').nullable()
    table.date('defenseDate').nullable()
    table.string('term').nullable()
    table
      .boolean('recordSigned')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('termPaper')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('cd')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('isUndergraduate')
      .notNullable()
      .defaultTo(false)
    table
      .string('period')
      .nullable()
      .defaultTo(null)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('students')
}
