exports.up = function(knex, Promise) {
  return knex.schema.createTable('defenses', table => {
    table.increments('id').primary()
    table
      .integer('userId')
      .unsigned()
      .notNullable()
    table
      .foreign('userId')
      .references('id')
      .inTable('users')
    table
      .enum('course', ['cbcc', 'cbsi'])
      .notNullable()
      .defaultTo('cbcc')
    table.string('registrationNumbers').notNullable()
    table.string('students').notNullable()
    table.string('local').notNullable()
    table.date('date').nullable()
    table.date('time').nullable()
    table.string('title').notNullable()
    table.string('keywords').notNullable()
    table.text('summary').nullable()

    const people = [
      { person: 'advisor', mandatory: true },
      { person: 'coAdvisor', mandatory: false },
      { person: 'evaluator1', mandatory: true },
      { person: 'evaluator2', mandatory: true },
      { person: 'evaluator3', mandatory: false }
    ]
    for (const { person, mandatory } of people) {
      const nullability = mandatory ? 'notNullable' : 'nullable'

      table.string(`${person}Name`)[nullability]() // advisorName
      table // advisorTitle
        .enum(`${person}Title`, ['doctor', 'master', 'other'])
        [nullability]()
        .defaultTo('other')
      table // advisorType
        .enum(`${person}Type`, ['internal', 'external'])
        [nullability]()
        .defaultTo('internal')
    }
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('defenses')
}
